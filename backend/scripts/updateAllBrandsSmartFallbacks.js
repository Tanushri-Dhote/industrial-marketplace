const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

async function runSmartFallback() {
	try {
		await connectDB();
		console.log("🔌 Connected to database.");

		const brands = await Brand.find({});
		console.log(`Found ${brands.length} brands in the database.\n`);

		let totalUpdatedWithSprites = 0;
		let totalUpdatedWithLogos = 0;

		for (const brand of brands) {
			console.log(`----------------------------------------------`);
			console.log(`Processing Brand: "${brand.name}"`);

			// 1. Find all models for this brand
			const models = await Model.find({ brandId: brand._id });
			
			// 2. Find a representative model that has a valid (non-placeholder) sprite position
			const repModel = models.find(m => {
				const isSpriteSet = m.spriteSheetUrl && m.spriteSheetUrl.includes("car_sprites.png");
				const isPlaceholder = 
					(m.spritePosition?.x === 0 && m.spritePosition?.y === 0) ||
					(m.spritePosition?.x === -945 && m.spritePosition?.y === -1672) ||
					(m.spritePosition?.x === -945 && m.spritePosition?.y === -836);
				return isSpriteSet && !isPlaceholder;
			});

			if (repModel) {
				console.log(`✅ Found representative car sprite from model: "${repModel.name}" (Position: ${JSON.stringify(repModel.spritePosition)})`);

				// Update all placeholder models to use this representative model's sprite position
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
							spriteSheetUrl: repModel.spriteSheetUrl,
							spritePosition: repModel.spritePosition,
							spriteSize: repModel.spriteSize || { width: 135, height: 76 },
							spriteClass: repModel.spriteClass,
							imageUrl: null // Clear image URL since we are using a valid sprite position
						}
					}
				);

				console.log(`   └─ Updated ${result.modifiedCount} models to use this brand's default car sprite.`);
				totalUpdatedWithSprites += result.modifiedCount;

			} else {
				// No representative model found with a valid sprite - fallback to brand logo
				const defaultImagePath = `/brands/${brand.name}.png`;
				console.log(`⚠️  No valid car sprite found for this brand. Falling back to logo path: "${defaultImagePath}"`);

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

				console.log(`   └─ Updated ${result.modifiedCount} models to use brand logo fallback.`);
				totalUpdatedWithLogos += result.modifiedCount;
			}
		}

		console.log(`\n==============================================`);
		console.log(`✅ Smart Fallback Update Complete!`);
		console.log(`- Models updated to use brand-specific car sprites: ${totalUpdatedWithSprites}`);
		console.log(`- Models updated to use brand logo paths:           ${totalUpdatedWithLogos}`);
		console.log(`==============================================`);

		process.exit(0);
	} catch (error) {
		console.error("❌ Smart fallback update failed:", error);
		process.exit(1);
	}
}

runSmartFallback();
