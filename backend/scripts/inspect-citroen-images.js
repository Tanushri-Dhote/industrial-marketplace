const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

async function check() {
	await connectDB();
	const brand = await Brand.findOne({ slug: "citroen" });
	if (!brand) {
		console.log("Citroen brand not found");
		process.exit(0);
	}
	const models = await Model.find({ brandId: brand._id });
	console.log(`Found ${models.length} Citroen models:`);
	models.forEach(m => {
		console.log(`Name: "${m.name}", imageUrl: "${m.imageUrl}", spriteSheetUrl: "${m.spriteSheetUrl}", spriteClass: "${m.spriteClass}", pos: ${JSON.stringify(m.spritePosition)}`);
	});
	process.exit(0);
}
check();
