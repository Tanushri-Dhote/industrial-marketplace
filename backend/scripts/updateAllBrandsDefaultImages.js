const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

async function updateAll() {
	try {
		await connectDB();
		console.log("🔌 Connected to database.");

		// Find all brands in the database
		const brands = await Brand.find({});
		console.log(`Found ${brands.length} brands in the database.`);

		let totalUpdated = 0;

		for (const brand of brands) {
			const defaultImagePath = `/brands/${brand.name}.png`;
			console.log(`Processing brand: "${brand.name}" (ID: ${brand._id})...`);

			// Update all models of this brand where spritePosition is a fallback/default
			const result = await Model.updateMany(
				{
					brandId: brand._id,
					$or: [
						{ "spritePosition.x": -945, "spritePosition.y": -1672 },
						{ "spritePosition.x": -945, "spritePosition.y": -836 },
						{ "spritePosition.x": 0, "spritePosition.y": 0 }
					]
				},
				{
					$set: {
						imageUrl: defaultImagePath,
						spriteSheetUrl: "",
						spritePosition: { x: 0, y: 0 }
					}
				}
			);

			console.log(`  └─ Updated ${result.modifiedCount} models (matched: ${result.matchedCount}) to use default image "${defaultImagePath}"`);
			totalUpdated += result.modifiedCount;
		}

		console.log(`\n✅ Finished update. Total models updated across all brands: ${totalUpdated}`);
		process.exit(0);
	} catch (error) {
		console.error("❌ Master update failed:", error);
		process.exit(1);
	}
}

updateAll();
