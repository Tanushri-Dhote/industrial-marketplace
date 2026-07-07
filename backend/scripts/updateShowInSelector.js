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

		const brands = await Brand.find({ isActive: true });
		console.log(`Checking models across ${brands.length} active brands.`);

		let hiddenCount = 0;
		let visibleCount = 0;
		let createdCount = 0;

		for (const brand of brands) {
			const models = await Model.find({ brandId: brand._id });
			
			// Map models by their main name prefix
			const grouped = {};
			models.forEach(m => {
				const mainName = getMainModelName(m.name);
				if (!grouped[mainName]) grouped[mainName] = [];
				grouped[mainName].push(m);
			});

			for (const mainName of Object.keys(grouped)) {
				const list = grouped[mainName];
				
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

						// Check if specs are default RSE specs
						const specModelSlug = m.name.replace(/\s+/g, "-").toLowerCase();
						const spec = await ModelEngineSpec.findOne({
							brandSlug: brand.slug,
							modelSlug: specModelSlug
						});

						if (spec) {
							const hasCostTable = spec.costTable && spec.costTable.length > 0;
							if (hasCostTable) {
								const allCodesAreRse = spec.costTable.every(item => {
									const code = (item.engineCode || "").toUpperCase().trim();
									return code.startsWith("RSE") || code === "DEFAULT" || code === "";
								});

								if (allCodesAreRse) {
									showInSelector = false;
									console.log(`Main model "${m.name}" (${brand.name}) only has default RSE engine codes. Hiding.`);
								}
							} else {
								showInSelector = false;
								console.log(`Main model "${m.name}" (${brand.name}) has empty specs. Hiding.`);
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
