const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

async function check() {
	await connectDB();
	const specs = await ModelEngineSpec.find({ brandSlug: "audi" }).distinct("modelSlug");
	console.log(`Audi distinct modelSlugs in specs:`);
	specs.sort().forEach(slug => console.log(`- ${slug}`));
	process.exit(0);
}
check();
