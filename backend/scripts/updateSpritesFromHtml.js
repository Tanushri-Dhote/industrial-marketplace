const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

// Grouping helper
const getMainModelName = (name) => {
	const nameUpper = name.toUpperCase();
	
	// Mercedes-Benz special classes
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
	
	// General alphanumeric starts: C1-C6, A1-A8, Q2-Q8, S1-S5, CX-3 etc.
	const matchAlphaNumeric = name.match(/^([a-zA-Z]+[0-9]+)\b/i);
	if (matchAlphaNumeric) {
		return matchAlphaNumeric[1].toUpperCase();
	}

	// Series models: "1 Series", "3 Series"
	const matchSeries = name.match(/^(\d+\s+Series)\b/i);
	if (matchSeries) {
		return matchSeries[1];
	}

	// Hyphenated starts: C-Crosser, X-Type, S-Type, F-Pace, E-Pace
	const matchHyphenated = name.match(/^([a-zA-Z]+-[a-zA-Z0-9]+)\b/i);
	if (matchHyphenated) {
		return matchHyphenated[1];
	}

	// Range Rover: "Range Rover Sport" -> "Range Rover"
	if (nameUpper.startsWith("RANGE ROVER")) {
		return "Range Rover";
	}

	// Fallback to first word if it has spaces
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

				// Find model in database
				let dbModel = await Model.findOne({
					brandId: brand._id,
					name: new RegExp(`^${map.name}$`, "i")
				});

				// Fallback: If not found by full name, check if we can update the parent model directly
				const mainName = getMainModelName(map.name);
				let parentModel = null;
				if (mainName.toLowerCase() !== map.name.toLowerCase()) {
					parentModel = await Model.findOne({
						brandId: brand._id,
						name: new RegExp(`^${mainName}$`, "i")
					});
				}

				if (dbModel) {
					dbModel.spriteClass = map.cls;
					dbModel.spriteSheetUrl = "/images/car_sprites.png";
					dbModel.spritePosition = { x, y };
					dbModel.spriteSize = { width: 135, height: 76 };
					dbModel.imageUrl = null;
					await dbModel.save();
					updatedCount++;
					console.log(`✅ Updated "${dbModel.name}" -> Class: "${map.cls}", Pos: X=${x}, Y=${y}`);
				}

				// If parent model exists, also update parent model so the parent card shows the sprite!
				if (parentModel) {
					parentModel.spriteClass = map.cls;
					parentModel.spriteSheetUrl = "/images/car_sprites.png";
					parentModel.spritePosition = { x, y };
					parentModel.spriteSize = { width: 135, height: 76 };
					parentModel.imageUrl = null;
					await parentModel.save();
					if (!dbModel) {
						updatedCount++;
						console.log(`✅ Updated parent "${parentModel.name}" (fallback for "${map.name}") -> Class: "${map.cls}", Pos: X=${x}, Y=${y}`);
					} else {
						console.log(`   └─ Also updated parent model "${parentModel.name}" with same sprite.`);
					}
				}

				if (!dbModel && !parentModel) {
					console.log(`⚠️ Model "${map.name}" (and parent "${mainName}") not found in database.`);
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
