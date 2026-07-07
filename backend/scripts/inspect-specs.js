const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

async function check() {
	await connectDB();
	const specs = await ModelEngineSpec.find({ brandSlug: "alfa-romeo" });
	console.log(`Found ${specs.length} specs for Alfa Romeo:`);
	specs.forEach(s => {
		console.log(`ModelName: "${s.modelName}", ModelSlug: "${s.modelSlug}", costTable rows: ${s.costTable ? s.costTable.length : 0}`);
	});
	process.exit(0);
}
check();
