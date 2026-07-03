/**
 * Standalone MongoDB update script to rename engine codes.
 * Replaces the prefixes starting with "SPEC-PET-" and "SPEC-DSL-" with "RSE-", keeping the trailing number.
 * 
 * To run this script:
 * 1. Install mongodb driver if not already present: npm install mongodb
 * 2. Execute the script: node backend/scripts/update_engine_codes.js
 */

const { MongoClient } = require("mongodb");

// VPS MongoDB connection URI
const MONGO_URI = "mongodb://mongo:iwoeikbfpaaprhxu@engine4you-database-4h4nby:27017/all-engine-4-you?authSource=admin&directConnection=true";

// Regex to match prefixes like SPEC-PET- or SPEC-DSL-
const TARGET_REGEX = /^SPEC-(PET|DSL)-/i;

async function run() {
  console.log("Connecting to MongoDB database...");
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected successfully!");
    const db = client.db();

    // --- DIAGNOSTICS ---
    console.log("\n--- Database Diagnostics ---");
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log("Collections found in DB:", collectionNames);

    for (const name of ["products", "modelenginespecs", "quotes"]) {
      if (collectionNames.includes(name)) {
        const count = await db.collection(name).countDocuments({});
        console.log(`- Collection '${name}' has ${count} total documents`);
        
        // Print sample engine codes to inspect formatting
        if (name === "modelenginespecs") {
          const sample = await db.collection(name).findOne({ "costTable.0": { $exists: true } });
          if (sample && sample.costTable) {
            console.log(`  Sample costTable item from '${name}':`, JSON.stringify(sample.costTable[0], null, 2));
          }
        } else {
          const sample = await db.collection(name).findOne({ engineCode: { $exists: true } });
          if (sample) {
            console.log(`  Sample engineCode from '${name}':`, sample.engineCode);
          }
        }
      } else {
        console.log(`- Collection '${name}' does NOT exist in this database!`);
      }
    }
    console.log("----------------------------\n");

    // --- MIGRATIONS ---

    // 1. Update engineCode in products collection
    console.log("Checking products collection for engineCode updates...");
    const productsColl = db.collection("products");
    const productsCursor = productsColl.find({ engineCode: TARGET_REGEX });
    let productUpdateCount = 0;

    while (await productsCursor.hasNext()) {
      const doc = await productsCursor.next();
      if (doc.engineCode) {
        const newCode = doc.engineCode.replace(TARGET_REGEX, "RSE-");
        await productsColl.updateOne(
          { _id: doc._id },
          { $set: { engineCode: newCode } }
        );
        productUpdateCount++;
        console.log(`Updated product [${doc._id}]: ${doc.engineCode} -> ${newCode}`);
      }
    }
    console.log(`Finished: ${productUpdateCount} products updated.`);

    // 2. Update compatibility.code in products collection
    console.log("\nChecking products compatibility array for code updates...");
    const productsCompatCursor = productsColl.find({ "compatibility.code": TARGET_REGEX });
    let productCompatUpdateCount = 0;

    while (await productsCompatCursor.hasNext()) {
      const doc = await productsCompatCursor.next();
      let updated = false;
      const updatedCompatibility = doc.compatibility.map(item => {
        if (item.code && TARGET_REGEX.test(item.code)) {
          const newCode = item.code.replace(TARGET_REGEX, "RSE-");
          updated = true;
          return { ...item, code: newCode };
        }
        return item;
      });

      if (updated) {
        await productsColl.updateOne(
          { _id: doc._id },
          { $set: { compatibility: updatedCompatibility } }
        );
        productCompatUpdateCount++;
        console.log(`Updated product compatibility [${doc._id}]`);
      }
    }
    console.log(`Finished: ${productCompatUpdateCount} product compatibilities updated.`);

    // 3. Update engineCode in modelenginespecs collection (nested inside costTable array)
    console.log("\nChecking modelenginespecs collection for engineCode updates...");
    const specsColl = db.collection("modelenginespecs");
    const specsCursor = specsColl.find({ "costTable.engineCode": TARGET_REGEX });
    let specUpdateCount = 0;

    while (await specsCursor.hasNext()) {
      const doc = await specsCursor.next();
      let updated = false;
      const updatedCostTable = doc.costTable.map(item => {
        if (item.engineCode && TARGET_REGEX.test(item.engineCode)) {
          const newCode = item.engineCode.replace(TARGET_REGEX, "RSE-");
          updated = true;
          return { ...item, engineCode: newCode };
        }
        return item;
      });

      if (updated) {
        await specsColl.updateOne(
          { _id: doc._id },
          { $set: { costTable: updatedCostTable } }
        );
        specUpdateCount++;
        console.log(`Updated modelspec [${doc.brandSlug} - ${doc.modelSlug}]`);
      }
    }
    console.log(`Finished: ${specUpdateCount} modelspecs updated.`);

    // 4. Update engineCode in quotes collection
    console.log("\nChecking quotes collection for engineCode updates...");
    const quotesColl = db.collection("quotes");
    const quotesCursor = quotesColl.find({ engineCode: TARGET_REGEX });
    let quoteUpdateCount = 0;

    while (await quotesCursor.hasNext()) {
      const doc = await quotesCursor.next();
      if (doc.engineCode) {
        const newCode = doc.engineCode.replace(TARGET_REGEX, "RSE-");
        await quotesColl.updateOne(
          { _id: doc._id },
          { $set: { engineCode: newCode } }
        );
        quoteUpdateCount++;
        console.log(`Updated quote [${doc._id}]: ${doc.engineCode} -> ${newCode}`);
      }
    }
    console.log(`Finished: ${quoteUpdateCount} quotes updated.`);

  } catch (err) {
    console.error("An error occurred during execution:", err);
  } finally {
    await client.close();
    console.log("\nDatabase connection closed.");
  }
}

run();
