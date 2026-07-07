const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

// Grouping/normalization helper to find main model name
const getMainModelName = (name) => {
	const nameUpper = name.toUpperCase();
	
	if (nameUpper.startsWith("A-CLASS") || nameUpper === "A CLASS") return "A-Class";
	if (nameUpper.startsWith("B-CLASS") || nameUpper === "B CLASS") return "B-Class";
	if (nameUpper.startsWith("C-CLASS") || nameUpper === "C CLASS") return "C-Class";
	if (nameUpper.startsWith("E-CLASS") || nameUpper === "E CLASS") return "E-Class";
	if (nameUpper.startsWith("S-CLASS") || nameUpper === "S CLASS") return "S-Class";
	if (nameUpper.startsWith("G-CLASS") || nameUpper === "G CLASS") return "G-Class";
	if (nameUpper.startsWith("X-CLASS") || nameUpper === "X CLASS") return "X-Class";
	if (nameUpper.startsWith("GL-CLASS") || nameUpper === "GL CLASS") return "GL-Class";
	if (nameUpper.startsWith("GLA-CLASS") || nameUpper === "GLA CLASS") return "GLA-Class";
	if (nameUpper.startsWith("GLB-CLASS") || nameUpper === "GLB CLASS") return "GLB-Class";
	if (nameUpper.startsWith("GLC-CLASS") || nameUpper === "GLC CLASS") return "GLC-Class";
	if (nameUpper.startsWith("GLE-CLASS") || nameUpper === "GLE CLASS") return "GLE";
	if (nameUpper.startsWith("GLS-CLASS") || nameUpper === "GLS CLASS") return "GLS";
	
	const matchAlphaNumeric = name.match(/^([a-zA-Z]+[0-9]+)\b/i);
	if (matchAlphaNumeric) {
		return matchAlphaNumeric[1].toUpperCase();
	}

	const matchSeries = name.match(/^(\d+\s+Series)\b/i);
	if (matchSeries) {
		return matchSeries[1];
	}

	const matchHyphenated = name.match(/^([a-zA-Z]+-[a-zA-Z0-9]+)\b/i);
	if (matchHyphenated) {
		return matchHyphenated[1];
	}

	if (nameUpper.startsWith("RANGE ROVER")) {
		return "Range Rover";
	}

	const words = name.trim().split(/\s+/);
	if (words.length > 1) {
		return words[0];
	}

	return name;
};

async function run() {
	try {
		await connectDB();
		console.log("Connected to MongoDB.");

		// Load bg.css content
		const cssPath = path.join(__dirname, "../../bg.css");
		const cssContent = fs.readFileSync(cssPath, "utf8");
		console.log("Loaded bg.css successfully.");

		const models = await Model.find({});
		console.log(`Found ${models.length} models in the database to update.`);

		let updatedCount = 0;
		let notFoundCount = 0;

		for (const model of models) {
			const brand = await Brand.findById(model.brandId);
			if (!brand) continue;

			// Try to find the exact class coordinates
			// Normalization formats to check:
			// 1. Direct lowercase slugified name: "bg-a1", "bg-berlingo", "bg-c-crosser"
			// 2. Base model name: "bg-c3" instead of "c3-picasso"
			const namesToTry = [
				model.name,
				getMainModelName(model.name)
			];

			let coordinates = null;
			let matchedClass = "";

			for (const name of namesToTry) {
				const clsName = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9+-]+/g, "");
				const regex = new RegExp(`\\.bg-${clsName}\\s*\\{[^}]*background-position:\\s*([^;\\r\\n]+);`, "i");
				const match = cssContent.match(regex);

				if (match) {
					const pos = match[1].trim();
					const parts = pos.split(/\s+/);
					if (parts.length >= 2) {
						const x = parseInt(parts[0].replace("px", "").trim(), 10);
						const y = parseInt(parts[1].replace("px", "").trim(), 10);
						coordinates = { x, y };
						matchedClass = `bg-${clsName}`;
						break;
					}
				}
			}

			if (coordinates) {
				model.spriteClass = matchedClass;
				model.spriteSheetUrl = "/images/car_sprites.png";
				model.spritePosition = coordinates;
				model.spriteSize = { width: 135, height: 76 };
				await model.save();
				
				updatedCount++;
				console.log(`Updated "${model.name}" (${brand.name}) -> Class: "${matchedClass}", Pos: X=${coordinates.x}, Y=${coordinates.y}`);
			} else {
				notFoundCount++;
				console.log(`❌ No background-position found in bg.css for "${model.name}" (${brand.name}).`);
			}
		}

		console.log(`Completed. Updated coordinates for ${updatedCount} models. No coordinates found for ${notFoundCount} models.`);
		process.exit(0);
	} catch (error) {
		console.error("Failed to update sprite coordinates:", error);
		process.exit(1);
	}
}

run();
