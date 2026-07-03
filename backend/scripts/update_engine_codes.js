/**
 * Standalone MongoDB update script to rename engine codes.
 * Replaces the prefix "SPEC-PET-" with "RSE-" in all relevant collections, keeping the trailing number.
 * 
 * To run this script:
 * 1. Install mongodb driver if not already present: npm install mongodb
 * 2. Execute the script: node update_engine_codes.js
 */

const { MongoClient } = require("mongodb");

// VPS MongoDB connection URI
const MONGO_URI = "mongodb://mongo:iwoeikbfpaaprhxu@engine4you-database-4h4nby:27017/all-engine-4-you?authSource=admin&directConnection=true";

async function run() {
  console.log("Connecting to MongoDB database...");
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected successfully!");
    const db = client.db();

    // 1. Update engineCode in products collection
    console.log("\nChecking products collection for engineCode updates...");
    const productsColl = db.collection("products");
    const productsCursor = productsColl.find({ engineCode: /^SPEC-PET-/i });
    let productUpdateCount = 0;

    while (await productsCursor.hasNext()) {
      const doc = await productsCursor.next();
      if (doc.engineCode) {
        const newCode = doc.engineCode.replace(/^SPEC-PET-/i, "RSE-");
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
    const productsCompatCursor = productsColl.find({ "compatibility.code": /^SPEC-PET-/i });
    let productCompatUpdateCount = 0;

    while (await productsCompatCursor.hasNext()) {
      const doc = await productsCompatCursor.next();
      let updated = false;
      const updatedCompatibility = doc.compatibility.map(item => {
        if (item.code && /^SPEC-PET-/i.test(item.code)) {
          const newCode = item.code.replace(/^SPEC-PET-/i, "RSE-");
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
    const specsCursor = specsColl.find({ "costTable.engineCode": /^SPEC-PET-/i });
    let specUpdateCount = 0;

    while (await specsCursor.hasNext()) {
      const doc = await specsCursor.next();
      let updated = false;
      const updatedCostTable = doc.costTable.map(item => {
        if (item.engineCode && /^SPEC-PET-/i.test(item.engineCode)) {
          const newCode = item.engineCode.replace(/^SPEC-PET-/i, "RSE-");
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
    const quotesCursor = quotesColl.find({ engineCode: /^SPEC-PET-/i });
    let quoteUpdateCount = 0;

    while (await quotesCursor.hasNext()) {
      const doc = await quotesCursor.next();
      if (doc.engineCode) {
        const newCode = doc.engineCode.replace(/^SPEC-PET-/i, "RSE-");
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
