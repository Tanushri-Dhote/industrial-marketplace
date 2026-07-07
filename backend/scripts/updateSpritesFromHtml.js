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

		// Load bg.css content
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

		// Allow overriding via command line argument (e.g. node scripts/updateSpritesFromHtml.js alfa-romeo)
		const argBrand = process.argv[2];

		let brandsToProcess = [];

		if (argBrand) {
			// Option 1: Explicit brand slug specified
			const brand = await Brand.findOne({ slug: argBrand.toLowerCase() });
			if (!brand) {
				console.error(`❌ Brand not found in database for slug: "${argBrand}"`);
				process.exit(1);
			}
			brandsToProcess.push({
				brand,
				htmlSection: htmlContent
			});
		} else {
			// Option 2: Automatic multi-brand detection from HTML headers
			const brandRegex = /Most Popular\s+(?:<span>)?([a-zA-Z0-9\s-]+?)(?:<\/span>)?\s+Engines/gi;
			const brandsFound = [];
			let match;
			while ((match = brandRegex.exec(htmlContent)) !== null) {
				brandsFound.push({
					name: match[1].trim(),
					index: match.index
				});
			}

			if (brandsFound.length === 0) {
				console.error("❌ Could not detect any brand name from HTML headers. Please specify brand as argument: node scripts/updateSpritesFromHtml.js [brand-slug]");
				process.exit(1);
			}

			console.log(`🔍 Detected ${brandsFound.length} brands in HTML: ${brandsFound.map(b => b.name).join(", ")}`);

			for (let i = 0; i < brandsFound.length; i++) {
				const bInfo = brandsFound[i];
				const start = bInfo.index;
				const end = (i + 1 < brandsFound.length) ? brandsFound[i+1].index : htmlContent.length;
				const htmlSection = htmlContent.substring(start, end);

				const brand = await Brand.findOne({
					name: new RegExp(`^${bInfo.name}$`, "i")
				});

				if (!brand) {
					console.log(`⚠️ Brand "${bInfo.name}" detected in HTML but not found in database. Skipping.`);
					continue;
				}

				brandsToProcess.push({
					brand,
					htmlSection
				});
			}
		}

		if (brandsToProcess.length === 0) {
			console.error("❌ No matching brands to process.");
			process.exit(1);
		}

		let totalUpdated = 0;

		for (const item of brandsToProcess) {
			const { brand, htmlSection } = item;
			console.log(`\n------------------------------------------------------------`);
			console.log(`PROCESSING BRAND: "${brand.name}" (Slug: "${brand.slug}")`);
			console.log(`------------------------------------------------------------`);

			const cleanBrandName = brand.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			const blockRegex = new RegExp(`bg-([a-zA-Z0-9-]+)[\\s\\S]*?>\\s*(?:${cleanBrandName})\\s+([A-Za-z0-9\\s-]+?)\\s+Engines`, "gi");

			const mappings = [];
			const seenClasses = new Set();
			let match;
			while ((match = blockRegex.exec(htmlSection)) !== null) {
				const cls = `bg-${match[1].trim()}`;
				const modelName = match[2].trim().replace(/\s+/g, " ");
				if (!seenClasses.has(cls)) {
					seenClasses.add(cls);
					mappings.push({ name: modelName, cls });
				}
			}

			if (mappings.length === 0) {
				console.log(`⚠️ No model mappings found in the HTML section for "${brand.name}".`);
				continue;
			}

			console.log(`Found ${mappings.length} model mappings for "${brand.name}".`);

			let updatedCount = 0;

			for (const map of mappings) {
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

				const dbModel = await Model.findOne({
					brandId: brand._id,
					name: new RegExp(`^${map.name}$`, "i")
				});

				if (dbModel) {
					dbModel.spriteClass = map.cls;
					dbModel.spriteSheetUrl = "/images/car_sprites.png";
					dbModel.spritePosition = { x, y };
					dbModel.spriteSize = { width: 135, height: 76 };
					dbModel.imageUrl = null;
					await dbModel.save();
					updatedCount++;
					console.log(`✅ Updated "${dbModel.name}" -> Class: "${map.cls}", Pos: X=${x}, Y=${y}`);
				} else {
					console.log(`⚠️ Model "${map.name}" not found in database.`);
				}
			}

			console.log(`Done processing "${brand.name}". Updated ${updatedCount} models.`);
			totalUpdated += updatedCount;
		}

		console.log(`\n============================================================`);
		console.log(`Master Execution Complete. Total updated models across all brands: ${totalUpdated}`);
		console.log(`============================================================`);
		process.exit(0);
	} catch (error) {
		console.error("Failed to run master sprite mapping script:", error);
		process.exit(1);
	}
}

run();
