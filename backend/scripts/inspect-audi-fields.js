const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

async function check() {
	await connectDB();
	const brand = await Brand.findOne({ slug: "audi" });
	if (!brand) {
		console.log("Audi brand not found");
		process.exit(0);
	}
	const models = await Model.find({ brandId: brand._id });
	console.log(`Audi models with year/type info:`);
	models.slice(0, 15).forEach(m => {
		console.log(`- Name: "${m.name}", Slug: "${m.slug}", Year: "${m.year}", Type: "${m.type}"`);
	});
	process.exit(0);
}
check();
