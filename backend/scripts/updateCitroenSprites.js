const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

const mappings = [
	{ name: "Berlingo", cls: "bg-berlingo" },
	{ name: "C-Crosser", cls: "bg-c-crosser" },
	{ name: "C2", cls: "bg-c2" },
	{ name: "C3", cls: "bg-c3" },
	{ name: "C4", cls: "bg-c4" },
	{ name: "C5", cls: "bg-c5" },
	{ name: "Ds3", cls: "bg-ds3" },
	{ name: "Ds4", cls: "bg-ds4" },
	{ name: "Ds5", cls: "bg-ds5" },
	{ name: "Jumper", cls: "bg-jumper" },
	{ name: "Jumpy", cls: "bg-jumpy" },
	{ name: "Nemo", cls: "bg-nemo" },
	{ name: "Relay", cls: "bg-relay" },
	{ name: "Spacetourer", cls: "bg-spacetourer" },
	{ name: "Xsara", cls: "bg-xsara" }
];

async function run() {
	try {
		await connectDB();
		console.log("Connected to MongoDB.");

		// Find Citroen brand
		const brand = await Brand.findOne({ slug: "citroen" });
		if (!brand) {
			console.error("❌ Citroen brand not found in database.");
			process.exit(1);
		}

		// Load bg.css content using fallback paths
		const possiblePaths = [
			path.join(__dirname, "../../bg.css"),
			path.join(__dirname, "../bg.css"),
			path.join(process.cwd(), "bg.css"),
			path.join(process.cwd(), "backend/bg.css"),
			"/app/bg.css",
			"/app/backend/bg.css"
		];

		let cssContent = "";
		let loadedPath = "";
		for (const p of possiblePaths) {
			if (fs.existsSync(p)) {
				cssContent = fs.readFileSync(p, "utf8");
				loadedPath = p;
				break;
			}
		}

		if (!cssContent) {
			throw new Error(`Could not find bg.css. Checked paths:\n${possiblePaths.join("\n")}`);
		}
		console.log(`Loaded bg.css successfully from: ${loadedPath}`);

		let updatedCount = 0;

		for (const map of mappings) {
			// Find position in CSS
			const regex = new RegExp(`\\.${map.cls}\\s*\\{[^}]*background-position:\\s*([^;\\r\\n]+);`, "i");
			const match = cssContent.match(regex);
			
			if (!match) {
				console.log(`❌ Could not find coordinates for class "${map.cls}" in bg.css`);
				continue;
			}

			const posStr = match[1].trim();
			const parts = posStr.split(/\s+/);
			if (parts.length < 2) {
				console.log(`❌ Invalid background-position format for "${map.cls}": ${posStr}`);
				continue;
			}

			const x = parseInt(parts[0].replace("px", "").trim(), 10);
			const y = parseInt(parts[1].replace("px", "").trim(), 10);

			// Find model in database (case insensitive match)
			const dbModel = await Model.findOne({
				brandId: brand._id,
				name: new RegExp(`^${map.name}$`, "i")
			});

			if (dbModel) {
				dbModel.spriteClass = map.cls;
				dbModel.spriteSheetUrl = "/images/car_sprites.png";
				dbModel.spritePosition = { x, y };
				dbModel.spriteSize = { width: 135, height: 76 };
				dbModel.imageUrl = null; // Clear image to force sprite rendering
				await dbModel.save();
				updatedCount++;
				console.log(`✅ Updated "${dbModel.name}" (${brand.name}) -> Class: "${map.cls}", Pos: X=${x}, Y=${y}`);
			} else {
				console.log(`⚠️ Model "${map.name}" not found in database for Citroen.`);
			}
		}

		console.log(`Completed. Updated coordinates for ${updatedCount} Citroen models.`);
		process.exit(0);
	} catch (error) {
		console.error("Failed to update sprite coordinates:", error);
		process.exit(1);
	}
}

run();
