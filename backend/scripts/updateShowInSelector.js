const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");
const Product = require("../src/models/Product");

// Load bg.css for sprite coordinate lookup
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

if (cssContent) {
	console.log(`Successfully loaded bg.css for coordinate lookup from: ${loadedPath}`);
} else {
	console.log("Warning: bg.css not found. Tried paths:\n" + possiblePaths.join("\n") + "\nNew models will default to spritePosition 0,0.");
}

function getSpriteCoords(modelName) {
	if (!cssContent) return { x: 0, y: 0 };
	const cls = modelName.toLowerCase().replace(/\s+/g, "-");
	const regex = new RegExp(`\\.bg-${cls}\\s*\\{[^}]*background-position:\\s*([^;\\r\\n]+);`, "i");
	const match = cssContent.match(regex);
	if (match) {
		const pos = match[1].trim();
		const parts = pos.split(/\s+/);
		if (parts.length >= 2) {
			const x = parseInt(parts[0].replace("px", "").trim(), 10);
			const y = parseInt(parts[1].replace("px", "").trim(), 10);
			return { x, y };
		}
	}
	return { x: 0, y: 0 };
}

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

		// Read input.html to load expected main models dynamically
		const htmlPath = path.join(__dirname, "../input.html");
		let mainModelsByBrand = {};
		if (fs.existsSync(htmlPath)) {
			console.log(`Found input.html. Extracting expected main models...`);
			const htmlContent = fs.readFileSync(htmlPath, "utf8");
			const brandRegex = /Most Popular\s+(?:<span>)?([a-zA-Z0-9\s-]+?)(?:<\/span>)?\s+Engines/gi;
			let match;
			const brandsFound = [];
			while ((match = brandRegex.exec(htmlContent)) !== null) {
				brandsFound.push({
					name: match[1].trim(),
					index: match.index
				});
			}

			for (let i = 0; i < brandsFound.length; i++) {
				const bInfo = brandsFound[i];
				const start = bInfo.index;
				const end = (i + 1 < brandsFound.length) ? brandsFound[i+1].index : htmlContent.length;
				const htmlSection = htmlContent.substring(start, end);

				let brandSlug = bInfo.name.toLowerCase().replace(/\s+/g, "-");
				if (brandSlug === "vw") brandSlug = "volkswagen";
				
				// Matches class="bg-..." followed by brand name + model name + Engines
				const brandPattern = brandSlug === "volkswagen" ? "(?:Volkswagen|VW)" : bInfo.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				const blockRegex = new RegExp(`bg-([a-zA-Z0-9-]+)[\\s\\S]*?>\\s*(?:${brandPattern})\\s+([A-Za-z0-9\\s-+]+?)\\s+Engines`, "gi");
				const modelNames = [];
				const seen = new Set();
				let mapMatch;
				while ((mapMatch = blockRegex.exec(htmlSection)) !== null) {
					const modelName = mapMatch[2].trim().replace(/\s+/g, " ");
					const lower = modelName.toLowerCase();
					if (!seen.has(lower)) {
						seen.add(lower);
						modelNames.push(modelName);
					}
				}
				mainModelsByBrand[brandSlug] = modelNames;
				console.log(`  - "${bInfo.name}" expects models: ${modelNames.join(", ")}`);
			}
		}

		// Cleanup incorrect parent models from database (previous script runs)
		const fordBrand = await Brand.findOne({ slug: "ford" });
		if (fordBrand) {
			const toDelete = ["B", "C", "Grand", "Street"];
			const deleteRes = await Model.deleteMany({
				brandId: fordBrand._id,
				name: { $in: toDelete }
			});
			if (deleteRes.deletedCount > 0) {
				console.log(`🧹 Cleaned up ${deleteRes.deletedCount} incorrect parent models ("B", "C", "Grand", "Street") from previous script run.`);
			}
		}

		const brands = await Brand.find({ isActive: true });
		console.log(`Checking models across ${brands.length} active brands.`);

		let hiddenCount = 0;
		let visibleCount = 0;
		let createdCount = 0;

		for (const brand of brands) {
			const models = await Model.find({ brandId: brand._id });
			
			const brandSlug = brand.slug;
			const mainModels = mainModelsByBrand[brandSlug] || [];
			// Sort by length descending to match more specific parents first (e.g. "Transit Connect" before "Transit")
			mainModels.sort((a, b) => b.length - a.length);

			// Map models by their main name prefix case-insensitively using mainModels list
			const grouped = {};
			models.forEach(m => {
				let matchedParent = null;
				const normName = m.name.toLowerCase().replace(/[\s-]+/g, "");

				// Try to find if m.name matches or starts with any of the expected main models
				for (const mainName of mainModels) {
					const normMain = mainName.toLowerCase().replace(/[\s-]+/g, "");
					
					// Exact match or starts with parent name (e.g. "Transit Connect Cargo" matches "Transit Connect")
					if (normName === normMain || normName.startsWith(normMain)) {
						matchedParent = mainName;
						break;
					}
				}

				// Fallback to old alphanumeric helper if no main model matched
				const mainName = matchedParent || getMainModelName(m.name);
				
				let displayMainName = mainName;
				if (displayMainName === displayMainName.toLowerCase()) {
					displayMainName = displayMainName.charAt(0).toUpperCase() + displayMainName.slice(1);
				}
				if (/^c\d+$/i.test(displayMainName)) {
					displayMainName = "C" + displayMainName.substring(1);
				}

				const key = displayMainName.toLowerCase();
				if (!grouped[key]) {
					grouped[key] = {
						mainName: displayMainName,
						list: []
					};
				}
				grouped[key].list.push(m);
			});

			for (const key of Object.keys(grouped)) {
				const { mainName, list } = grouped[key];
				
				// 1. Check if the parent model (exact match) exists
				let parentModel = list.find(m => m.name.toLowerCase() === mainName.toLowerCase());

				if (!parentModel) {
					// Synthesize parent model!
					const slug = `${brand.slug}-${mainName.toLowerCase().replace(/\s+/g, "-")}`;
					const coords = getSpriteCoords(mainName);
					
					parentModel = new Model({
						brandId: brand._id,
						name: mainName,
						slug,
						spriteClass: `bg-${mainName.toLowerCase().replace(/\s+/g, "-")}`,
						spriteSheetUrl: "/images/car_sprites.png",
						spritePosition: coords,
						spriteSize: { width: 135, height: 76 },
						showInSelector: true,
						isActive: true
					});
					
					await parentModel.save();
					createdCount++;
					console.log(`[NEW] Created missing main model "${mainName}" for brand "${brand.name}".`);
				}

				// 2. Process all models in this group
				// The parent model should show in selector (unless specs are default/empty)
				// Any other models in the group are submodels and should be hidden from selector.
				for (const m of list) {
					let showInSelector = false;

					if (m._id.toString() === parentModel._id.toString()) {
						// This is the parent model, determine if it should show
						showInSelector = true;

						let groupHasSpecs = false;
						let groupHasRealSpecs = false;
						let totalProducts = 0;

						for (const sub of list) {
							// 1. Check specs for this submodel
							const specModelSlug = sub.name.replace(/\s+/g, "-").toLowerCase();
							const spec = await ModelEngineSpec.findOne({
								brandSlug: brand.slug,
								modelSlug: specModelSlug
							});

							if (spec) {
								groupHasSpecs = true;
								const hasCostTable = spec.costTable && spec.costTable.length > 0;
								if (hasCostTable) {
									const allCodesAreRse = spec.costTable.every(item => {
										const code = (item.engineCode || "").toUpperCase().trim();
										return code.startsWith("RSE") || code === "DEFAULT" || code === "";
									});
									if (!allCodesAreRse) {
										groupHasRealSpecs = true;
									}
								}
							}

							// 2. Count products for this submodel
							const productCount = await Product.countDocuments({
								make: new RegExp(`^${brand.name}$`, "i"),
								model: new RegExp(`^${sub.name}$`, "i")
							});
							totalProducts += productCount;
						}

						if (groupHasSpecs) {
							// If we found specs for any submodel, but NONE of them have real engine codes,
							// hide it ONLY if it also has no products.
							if (!groupHasRealSpecs && totalProducts === 0) {
								showInSelector = false;
								console.log(`Main model "${m.name}" (${brand.name}) only has default RSE specs and no products. Hiding.`);
							}
						} else {
							// No specs found for any submodel in the group, check if there are any products
							if (totalProducts === 0) {
								showInSelector = false;
								console.log(`Main model "${m.name}" (${brand.name}) has no specs and no products. Hiding.`);
							}
						}
					} else {
						// This is a submodel, always hide it from the selector
						showInSelector = false;
					}

					m.showInSelector = showInSelector;
					await m.save();

					if (showInSelector) {
						visibleCount++;
					} else {
						hiddenCount++;
					}
				}
			}
		}

		console.log(`Processed all brands. Created ${createdCount} missing main models. Selector visibility: ${visibleCount} visible, ${hiddenCount} hidden.`);
		process.exit(0);
	} catch (error) {
		console.error("Failed to update models showInSelector field:", error);
		process.exit(1);
	}
}

run();
