const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Model = require("../src/models/Model");

async function run() {
	try {
		await connectDB();
		console.log("Connected to MongoDB.");

		const result = await Model.updateMany({}, { $set: { showInSelector: true } });
		console.log(`Successfully reset showInSelector to true for ${result.modifiedCount} models.`);
		
		process.exit(0);
	} catch (error) {
		console.error("Failed to reset models showInSelector field:", error);
		process.exit(1);
	}
}

run();
