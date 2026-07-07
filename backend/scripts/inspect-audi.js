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
	console.log(`Checking Audi models (${models.length}):`);
	models.forEach(m => {
		console.log(`Model: "${m.name}", showInSelector: ${m.showInSelector}, isActive: ${m.isActive}`);
	});
	process.exit(0);
}
check();
