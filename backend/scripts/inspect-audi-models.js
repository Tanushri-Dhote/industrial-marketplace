const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

async function check() {
	try {
		await connectDB();
		const brand = await Brand.findOne({ slug: "audi" });
		if (!brand) {
			console.log("❌ Audi brand not found in database.");
			process.exit(0);
		}
		console.log(`Matched Brand: "${brand.name}" (ID: ${brand._id})`);

		const models = await Model.find({ brandId: brand._id }).sort({ name: 1 });
		console.log(`\nFound ${models.length} Audi models in database:`);
		models.forEach((m, idx) => {
			console.log(`${idx + 1}. Name: "${m.name}", Slug: "${m.slug}", showInSelector: ${m.showInSelector}, isActive: ${m.isActive}`);
		});

		process.exit(0);
	} catch (error) {
		console.error("Failed to fetch Audi models:", error);
		process.exit(1);
	}
}
check();
