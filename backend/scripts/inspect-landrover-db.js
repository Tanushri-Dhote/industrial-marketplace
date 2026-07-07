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
	const brand = await Brand.findOne({ slug: "land-rover" });
	if (!brand) {
		console.log("Land Rover brand not found");
		process.exit(0);
	}
	console.log(`Matched Brand: "${brand.name}" (ID: ${brand._id})`);

	const models = await Model.find({ brandId: brand._id });
	console.log(`\nFound ${models.length} models in database for Land Rover:`);
	for (const m of models) {
		// Count products
		const pCount = await Product.countDocuments({
			make: new RegExp(`^${brand.name}$`, "i"),
			model: new RegExp(`^${m.name}$`, "i")
		});

		// Check specs
		const spec = await ModelEngineSpec.findOne({
			brandSlug: brand.slug,
			modelSlug: m.name.replace(/\s+/g, "-").toLowerCase()
		});

		console.log(`- Name: "${m.name}", Slug: "${m.slug}", showInSelector: ${m.showInSelector}, isActive: ${m.isActive}, productCount: ${pCount}, hasSpec: ${!!spec}`);
	}

	process.exit(0);
}
check();
