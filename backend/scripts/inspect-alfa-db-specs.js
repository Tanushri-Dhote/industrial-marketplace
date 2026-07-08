const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

async function check() {
	await connectDB();
	const specs = await ModelEngineSpec.find({ brandSlug: "alfa-romeo" });
	console.log(`Distinct modelSlugs for brand 'alfa-romeo':`);
	const slugs = [...new Set(specs.map(s => s.modelSlug))];
	slugs.sort().forEach(slug => {
		const count = specs.filter(s => s.modelSlug === slug).length;
		console.log(`- Slug: "${slug}", count: ${count}`);
	});
	process.exit(0);
}
check();
