/**
 * Database Migration Script
 *
 * This script migrates all collections, documents, and indexes from the source MongoDB database
 * (defined in backend/.env under MONGO_URI) to a target MongoDB database.
 *
 * Usage:
 *   node scripts/migrate-db.js [target_uri]
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const dns = require("node:dns/promises");
const { MongoClient } = require("mongoose").mongo;

// Set DNS server to 1.1.1.1 to avoid local DNS lookup issues, matching project DB configuration
try {
  dns.setServers(["1.1.1.1"]);
} catch (e) {}

// Default target URI if not provided as argument
const DEFAULT_TARGET_URI = "mongodb://mongo:iwoeikbfpaaprhxu@engine4you-database-4h4nby:27017/?authSource=admin&directConnection=true";

function getDbName(uri) {
  try {
    const protocol = uri.startsWith('mongodb+srv://') ? 'mongodb+srv://' : 'mongodb://';
    const tempUrl = new URL(uri.replace(protocol, 'http://'));
    const pathname = tempUrl.pathname.slice(1);
    const dbName = pathname.split('?')[0].split('/')[0];
    return dbName || null;
  } catch (e) {
    return null;
  }
}

function formatTargetUri(targetUri, dbName) {
  try {
    const isSrv = targetUri.startsWith('mongodb+srv://');
    const protocol = isSrv ? 'mongodb+srv://' : 'mongodb://';
    const tempUrl = new URL(targetUri.replace(protocol, 'http://'));
    
    // Only set the database name in path if it's empty or just '/'
    if (tempUrl.pathname === '/' || !tempUrl.pathname) {
      tempUrl.pathname = '/' + dbName;
    }
    
    return tempUrl.toString().replace('http://', protocol);
  } catch (e) {
    // Fallback if URL parsing fails: append dbName before the query string if exists
    if (!targetUri.includes('/' + dbName)) {
      const queryIdx = targetUri.indexOf('?');
      if (queryIdx !== -1) {
        return targetUri.slice(0, queryIdx) + (targetUri[queryIdx - 1] === '/' ? '' : '/') + dbName + targetUri.slice(queryIdx);
      } else {
        return targetUri + (targetUri.endsWith('/') ? '' : '/') + dbName;
      }
    }
    return targetUri;
  }
}

async function migrate() {
  const sourceUri = process.env.MONGO_URI;
  if (!sourceUri) {
    console.error("❌ Error: MONGO_URI environment variable not found in backend/.env");
    process.exit(1);
  }

  // Get target URI from CLI argument or default
  const targetArg = process.argv[2] || DEFAULT_TARGET_URI;
  
  // Extract database name from source URI
  const sourceDbName = getDbName(sourceUri) || "all-engine-4-you";
  
  // Format target URI to include the database name if not already specified
  const targetUri = formatTargetUri(targetArg, sourceDbName);

  console.log("ℹ️ Starting Database Migration...");
  console.log(`🔌 Source database: ${sourceUri.replace(/:([^@]+)@/, ':****@')}`);
  console.log(`🔌 Target database: ${targetUri.replace(/:([^@]+)@/, ':****@')}`);
  console.log(`🗄️  Database Name: ${sourceDbName}`);
  console.log("--------------------------------------------------");

  const clientOptions = {
    compressors: ["zlib"],
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  };
  const sourceClient = new MongoClient(sourceUri, clientOptions);
  const targetClient = new MongoClient(targetUri, clientOptions);

  try {
    console.log("Connecting to source database...");
    await sourceClient.connect();
    console.log("✅ Connected to source database.");

    console.log("Connecting to target database...");
    await targetClient.connect();
    console.log("✅ Connected to target database.");

    const sourceDb = sourceClient.db(sourceDbName);
    const targetDb = targetClient.db(sourceDbName);

    // List all collections in source database
    const collections = await sourceDb.listCollections().toArray();
    const activeCollections = collections.filter(c => !c.name.startsWith('system.'));

    console.log(`\n📦 Found ${activeCollections.length} collections to migrate.`);

    for (const colInfo of activeCollections) {
      const colName = colInfo.name;
      console.log(`\n➡️ Migrating collection: "${colName}"`);

      // 1. Drop existing target collection to prevent unique index conflicts and duplicate keys
      console.log(`  - Dropping existing collection "${colName}" on target (if it exists)...`);
      await targetDb.collection(colName).drop().catch(() => {
        // Ignore error if collection didn't exist
      });

      // 2. Fetch and recreate indexes
      console.log(`  - Reading indexes from source collection...`);
      const indexes = await sourceDb.collection(colName).listIndexes().toArray();
      
      // Ensure target collection exists so indexes can be built
      await targetDb.createCollection(colName).catch(() => {});

      for (const idx of indexes) {
        if (idx.name === '_id_') continue;
        const { key, name, ...options } = idx;
        console.log(`  - Recreating index: ${JSON.stringify(key)}`);
        await targetDb.collection(colName).createIndex(key, { name, ...options });
      }

      // 3. Copy documents using _id keyset pagination (O(1) per page, no skip scans)
      const count = await sourceDb.collection(colName).countDocuments();
      if (count === 0) {
        console.log(`  - Collection "${colName}" is empty. Skipped copying documents.`);
        continue;
      }

      console.log(`  - Copying ${count} documents...`);
      let insertedCount = 0;
      const startTime = Date.now();

      const CHUNK_SIZE = 50;
      const MAX_RETRIES = 5;

      // Helper: fetch with retry + exponential backoff
      async function fetchWithRetry(query, chunkNum) {
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            const fetchStart = Date.now();
            console.log(`    - [DEBUG] Fetching chunk ${chunkNum} (attempt ${attempt}/${MAX_RETRIES})...`);
            const docs = await sourceDb.collection(colName)
              .find(query)
              .sort({ _id: 1 })
              .limit(CHUNK_SIZE)
              .maxTimeMS(20000)
              .toArray();
            console.log(`      * Fetched ${docs.length} documents in ${Date.now() - fetchStart}ms.`);
            return docs;
          } catch (err) {
            const wait = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // 1s, 2s, 4s, 8s, 10s
            console.error(`      ⚠️  Fetch attempt ${attempt} failed: ${err.message}. Retrying in ${wait}ms...`);
            if (attempt === MAX_RETRIES) throw err;
            await new Promise(r => setTimeout(r, wait));
          }
        }
      }

      let lastId = null;
      let chunkNum = 1;

      while (true) {
        const query = lastId ? { _id: { $gt: lastId } } : {};
        const docs = await fetchWithRetry(query, chunkNum);

        if (!docs || docs.length === 0) {
          console.log(`    - [DEBUG] No more documents. Finished.`);
          break;
        }

        console.log(`    - [DEBUG] Writing chunk ${chunkNum} (size: ${docs.length}) to target...`);
        const writeStart = Date.now();
        try {
          const res = await targetDb.collection(colName).insertMany(docs, { ordered: false });
          insertedCount += res.insertedCount;
          console.log(`      * Chunk ${chunkNum} written in ${Date.now() - writeStart}ms. Total: ${insertedCount}/${count}`);
        } catch (insertErr) {
          console.error(`      ❌ Chunk ${chunkNum} write failed: ${insertErr.message}`);
          if (insertErr.result && insertErr.result.nInserted) {
            insertedCount += insertErr.result.nInserted;
          }
          throw insertErr;
        }

        lastId = docs[docs.length - 1]._id;
        chunkNum++;

        if (docs.length < CHUNK_SIZE) break; // last page
      }

      console.log(`✅ Collection "${colName}" migrated successfully (${insertedCount} documents, ${indexes.length} indexes, took ${Date.now() - startTime}ms).`);
    }

    console.log("\n--------------------------------------------------");
    console.log("🎉 Database Migration Completed Successfully!");
  } catch (err) {
    console.error("\n❌ Migration failed with error:", err);
  } finally {
    await sourceClient.close();
    await targetClient.close();
    console.log("🔌 Connections closed.");
  }
}

migrate();
