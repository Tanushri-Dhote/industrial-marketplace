const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");
const Product = require("../src/models/Product");

async function check() {
	await connectDB();
	const brand = await Brand.findOne({ name: /Mercedes-Benz/i });
	if (!brand) {
		console.log("Mercedes-Benz brand not found");
		process.exit(0);
	}
	console.log(`Matched Brand: "${brand.name}" (ID: ${brand._id})`);

	const models = await Model.find({ brandId: brand._id });
	console.log(`\nFound ${models.length} models in database for Mercedes-Benz:`);
	
	// Let's print models where showInSelector is true
	const visible = models.filter(m => m.showInSelector);
	console.log(`\nVisible models (${visible.length}):`);
	visible.forEach(m => {
		console.log(`- Name: "${m.name}", Slug: "${m.slug}"`);
	});

	// Let's print some models that are hidden but might have products or specs
	const hidden = models.filter(m => !m.showInSelector);
	console.log(`\nHidden models sample (${hidden.length} total):`);
	hidden.slice(0, 30).forEach(m => {
		console.log(`- Name: "${m.name}", Slug: "${m.slug}"`);
	});

	process.exit(0);
}
check();
