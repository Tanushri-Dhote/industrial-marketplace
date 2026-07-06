const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

async function update() {
	try {
		await connectDB();
		console.log("🔌 Connected to database.");

		const brand = await Brand.findOne({ slug: "audi" });
		if (!brand) {
			console.error("❌ Brand 'audi' not found in database.");
			process.exit(1);
		}
		console.log(`🏷️ Found Brand: ${brand.name} (ID: ${brand._id})`);

		// Update all Audi models where spritePosition is { x: -945, y: -1672 } or { x: 0, y: 0 }
		const result = await Model.updateMany(
			{
				brandId: brand._id,
				$or: [
					{ "spritePosition.x": -945, "spritePosition.y": -1672 },
					{ "spritePosition.x": 0, "spritePosition.y": 0 }
				]
			},
			{
				$set: {
					imageUrl: "/brands/Audi.png",
					spriteSheetUrl: "",
					spritePosition: { x: 0, y: 0 }
				}
			}
		);

		console.log(`✅ Successfully updated ${result.modifiedCount} Audi models (matched: ${result.matchedCount}) to use default brand image.`);
		process.exit(0);
	} catch (error) {
		console.error("❌ Update failed:", error);
		process.exit(1);
	}
}

update();
