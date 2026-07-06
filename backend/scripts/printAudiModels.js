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

		const models = await Model.find({ brandId: brand._id }).sort({ name: 1 });
		console.log(`Found ${models.length} Audi models. Listing all:`);
		
		models.forEach((m, idx) => {
			console.log(`${idx + 1}. Name: "${m.name}", Slug: "${m.slug}", spritePosition: ${JSON.stringify(m.spritePosition)}`);
		});

		process.exit(0);
	} catch (error) {
		console.error("Diagnosis failed:", error);
		process.exit(1);
	}
}

check();
