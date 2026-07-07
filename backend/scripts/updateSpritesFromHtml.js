const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

async function run() {
	try {
		await connectDB();
		console.log("Connected to MongoDB.");

		// Read input.html
		const htmlPath = path.join(__dirname, "../input.html");
		if (!fs.existsSync(htmlPath)) {
			console.error(`❌ input.html not found! Please create 'input.html' in the backend folder and paste your HTML there.`);
			process.exit(1);
		}

		const htmlContent = fs.readFileSync(htmlPath, "utf8");

		// 1. Try to extract Brand Name from HTML: e.g. "Most Popular Audi Engines" or "Most Popular Citroen Engines"
		let brandName = "";
		const brandMatch = htmlContent.match(/Most Popular\s+(?:<span>)?([a-zA-Z0-9\s-]+?)(?:<\/span>)?\s+Engines/i);
		if (brandMatch) {
			brandName = brandMatch[1].trim();
			console.log(`🔍 Detected Brand Name from HTML: "${brandName}"`);
		}

		// Allow overriding via command line argument (e.g. node scripts/updateSpritesFromHtml.js alfa-romeo)
		const argBrand = process.argv[2];
		let brandQuery = {};
		if (argBrand) {
			brandQuery = { slug: argBrand.toLowerCase() };
			console.log(`Using Brand from command argument: "${argBrand}"`);
		} else if (brandName) {
			brandQuery = { name: new RegExp(`^${brandName}$`, "i") };
		} else {
			console.error("❌ Could not detect brand name from HTML. Please pass it as an argument: node scripts/updateSpritesFromHtml.js [brand-slug]");
			process.exit(1);
		}

		const brand = await Brand.findOne(brandQuery);
		if (!brand) {
			console.error(`❌ Brand not found in database for query: ${JSON.stringify(brandQuery)}`);
			const allBrands = await Brand.find({ isActive: true }).select("name slug");
			console.log("Available brands in database:");
			allBrands.forEach(b => console.log(`  - ${b.slug} (${b.name})`));
			process.exit(1);
		}
		console.log(`✅ Matched brand in database: "${brand.name}" (Slug: "${brand.slug}")`);

		// 2. Extract mappings of CSS Class to Model Name
		// Matches: bg-(class) followed by some tags, then BrandName ModelName Engines
		const cleanBrandName = brand.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		const blockRegex = new RegExp(`bg-([a-zA-Z0-9-]+)[\\s\\S]*?>\\s*(?:${cleanBrandName})\\s+([A-Za-z0-9\\s-]+?)\\s+Engines`, "gi");

		const mappings = [];
		const seenClasses = new Set();
		let match;
		while ((match = blockRegex.exec(htmlContent)) !== null) {
			const cls = `bg-${match[1].trim()}`;
			const modelName = match[2].trim().replace(/\s+/g, " ");
			if (!seenClasses.has(cls)) {
				seenClasses.add(cls);
				mappings.push({ name: modelName, cls });
			}
		}

		if (mappings.length === 0) {
			console.error("❌ No model mappings found in the HTML. Please make sure the HTML contains the grid with make-cars-sprite spans.");
			process.exit(1);
		}

		console.log(`Found ${mappings.length} model mappings in HTML.`);

		// 3. Load bg.css content
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
			const cssMatch = cssContent.match(regex);
			
			if (!cssMatch) {
				console.log(`❌ Could not find coordinates for class "${map.cls}" in bg.css`);
				continue;
			}

			const posStr = cssMatch[1].trim();
			const parts = posStr.split(/\s+/);
			if (parts.length < 2) {
				console.log(`❌ Invalid background-position format for "${map.cls}": ${posStr}`);
				continue;
			}

			const x = parseInt(parts[0].replace("px", "").trim(), 10);
			const y = parseInt(parts[1].replace("px", "").trim(), 10);

			// Find model in database
			const dbModel = await Model.findOne({
				brandId: brand._id,
				name: new RegExp(`^${map.name}$`, "i")
			});

			if (dbModel) {
				dbModel.spriteClass = map.cls;
				dbModel.spriteSheetUrl = "/images/car_sprites.png";
				dbModel.spritePosition = { x, y };
				dbModel.spriteSize = { width: 135, height: 76 };
				dbModel.imageUrl = null; // Clear to force sprite rendering
				await dbModel.save();
				updatedCount++;
				console.log(`✅ Updated "${dbModel.name}" -> Class: "${map.cls}", Pos: X=${x}, Y=${y}`);
			} else {
				console.log(`⚠️ Model "${map.name}" not found in database.`);
			}
		}

		console.log(`Completed. Successfully updated ${updatedCount} models.`);
		process.exit(0);
	} catch (error) {
		console.error("Failed to run master sprite mapping script:", error);
		process.exit(1);
	}
}

run();
