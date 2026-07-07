const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

async function check() {
	await connectDB();
	const brand = await Brand.findOne({ slug: "fiat" });
	if (!brand) {
		console.log("Fiat brand not found");
		process.exit(0);
	}
	const models = await Model.find({ brandId: brand._id });
	console.log(`Found ${models.length} Fiat models in Model collection:`);
	models.forEach(m => {
		console.log(`- "${m.name}" (Slug: "${m.slug}"), showInSelector: ${m.showInSelector}, isActive: ${m.isActive}`);
	});

	const specs = await ModelEngineSpec.find({ brandSlug: "fiat" });
	console.log(`\nFound ${specs.length} specifications for Fiat:`);
	specs.forEach(s => {
		console.log(`- ModelSlug: "${s.modelSlug}", ModelName: "${s.modelName}", costTable rows: ${s.costTable ? s.costTable.length : 0}`);
		if (s.costTable) {
			s.costTable.forEach(row => {
				console.log(`  Row: "${row.engineSize || ''}" / "${row.fuel || ''}" / "${row.engineCode || ''}"`);
			});
		}
	});

	process.exit(0);
}
check();
