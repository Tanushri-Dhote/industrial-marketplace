const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

async function check() {
	await connectDB();
	const specs = await ModelEngineSpec.find({ brandSlug: "ford" });
	console.log(`Distinct modelSlugs for brand 'ford' in specs:`);
	const slugs = [...new Set(specs.map(s => s.modelSlug))];
	slugs.sort().forEach(slug => {
		console.log(`- Slug: "${slug}"`);
	});
	process.exit(0);
}
check();
