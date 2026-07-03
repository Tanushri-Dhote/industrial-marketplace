/**
 * Standalone MongoDB script to populate missing model engine specs.
 * For any active model in the database that lacks a document in 'modelenginespecs',
 * it seeds a default specification entry using the new "RSE-" codes.
 * 
 * To run this script:
 * 1. Install mongodb driver if not already present: npm install mongodb
 * 2. Execute the script: node backend/scripts/seed_missing_specs.js
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

    // 1. Fetch all brands
    const brands = await db.collection("brands").find({ isActive: { $ne: false } }).toArray();
    const brandMap = new Map();
    brands.forEach(b => {
      brandMap.set(b._id.toString(), { name: b.name, slug: b.slug });
    });
    console.log(`Fetched ${brands.length} active brands.`);

    // 2. Fetch all models
    const models = await db.collection("models").find({ isActive: { $ne: false } }).toArray();
    console.log(`Fetched ${models.length} active models.`);

    const specsColl = db.collection("modelenginespecs");
    let seededCount = 0;
    let skippedCount = 0;

    for (const model of models) {
      if (!model.brandId) {
        console.log(`Skipped model '${model.name}': missing brandId`);
        continue;
      }

      const brandInfo = brandMap.get(model.brandId.toString());
      if (!brandInfo) {
        console.log(`Skipped model '${model.name}': brand not found or inactive`);
        continue;
      }

      const brandSlug = brandInfo.slug.toLowerCase();
      // Generate standard modelSlug based on model name
      const modelSlug = model.name.replace(/\s+/g, "-").toLowerCase();

      // Check if it already has specs in the database
      const existing = await specsColl.findOne({
        brandSlug: brandSlug,
        modelSlug: modelSlug
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      // Generate default costTable with RSE- codes
      const costTable = [
        {
          model: `${brandInfo.name} ${model.name} 2.0L Petrol`,
          engineSize: "2.0 litre",
          fuel: "Petrol",
          engineCode: "RSE-01",
          years: "2010 - 2020",
          price: "£1450 - £3500"
        },
        {
          model: `${brandInfo.name} ${model.name} 2.0L Diesel`,
          engineSize: "2.0 litre",
          fuel: "Diesel",
          engineCode: "RSE-02",
          years: "2012 - 2020",
          price: "£1600 - £3800"
        },
        {
          model: `${brandInfo.name} ${model.name} 1.6L Petrol`,
          engineSize: "1.6 litre",
          fuel: "Petrol",
          engineCode: "RSE-03",
          years: "2008 - 2018",
          price: "£1100 - £2800"
        }
      ];

      const newSpec = {
        brandSlug,
        modelSlug,
        brandName: brandInfo.name,
        modelName: model.name,
        popularDiesel: ["2.0 TDI"],
        popularPetrol: ["2.0 TFSI"],
        costTable,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await specsColl.insertOne(newSpec);
      seededCount++;
      console.log(`Seeded default specs for [${brandInfo.name} ${model.name}]`);
    }

    console.log(`\nMigration completed:`);
    console.log(`- ${seededCount} model engine specs seeded`);
    console.log(`- ${skippedCount} models already had specs and were skipped`);

  } catch (err) {
    console.error("An error occurred during execution:", err);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

run();
