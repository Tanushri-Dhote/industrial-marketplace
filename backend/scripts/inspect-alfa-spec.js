const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

async function check() {
	await connectDB();
	const brand = await Brand.findOne({ slug: /alfa/i });
	console.log("Alfa Brand:", brand);
	if (brand) {
		const model = await Model.findOne({ brandId: brand._id, name: /145/ });
		console.log("Alfa 145 Model in Model collection:", model);
		
		const specs = await ModelEngineSpec.find({ brandSlug: brand.slug, modelSlug: model ? model.slug : "145" });
		console.log("Specs matching brand/modelSlug:", specs.length);
		if (specs.length > 0) {
			console.log("Spec costTable first row:", specs[0].costTable?.[0]);
		}
	}
	process.exit(0);
}
check();
