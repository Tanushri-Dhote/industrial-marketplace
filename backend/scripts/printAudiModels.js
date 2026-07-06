const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

async function check() {
	try {
		await connectDB();
		console.log("Connected to database.");

		const brand = await Brand.findOne({ slug: "audi" });
		if (!brand) {
			console.log("❌ Audi brand not found.");
			process.exit(1);
		}
		console.log(`Found Brand: ${brand.name} (ID: ${brand._id})`);

		const totalModelsCount = await Model.countDocuments({ brandId: brand._id });
		console.log(`Total Audi models in database: ${totalModelsCount}`);

		// Get a sample of Audi models
		const sampleModels = await Model.find({ brandId: brand._id }).limit(10);
		console.log("Sample Audi models:");
		sampleModels.forEach(m => {
			console.log(`- Name: "${m.name}", Slug: "${m.slug}", spritePosition: ${JSON.stringify(m.spritePosition)}, imageUrl: "${m.imageUrl}", spriteSheetUrl: "${m.spriteSheetUrl}"`);
		});

		// Count models with specific spritePosition fields
		const withPosition = await Model.countDocuments({
			brandId: brand._id,
			spritePosition: { $exists: true }
		});
		console.log(`Models with spritePosition object defined: ${withPosition}`);

		process.exit(0);
	} catch (error) {
		console.error("Diagnosis failed:", error);
		process.exit(1);
	}
}

check();
