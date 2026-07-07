const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

async function check() {
	await connectDB();
	const brand = await Brand.findOne({ slug: "land-rover" });
	if (!brand) {
		console.log("Land Rover brand not found");
		process.exit(0);
	}

	const specs = await ModelEngineSpec.find({ brandSlug: brand.slug });
	console.log(`Found ${specs.length} specs for Land Rover in database:`);
	specs.forEach(s => {
		console.log(`- Slug: "${s.modelSlug}", Name: "${s.modelName}"`);
		console.log(`  isActive: ${s.isActive}`);
		console.log(`  CostTable rows: ${s.costTable ? s.costTable.length : 0}`);
		if (s.costTable) {
			s.costTable.forEach(row => {
				console.log(`    Row: Size="${row.engineSize}", Fuel="${row.fuel}", Code="${row.engineCode}"`);
			});
		}
	});

	process.exit(0);
}
check();
