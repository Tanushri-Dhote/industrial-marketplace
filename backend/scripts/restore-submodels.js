const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

function slugToModelName(slug, brandSlug) {
	let s = slug.toLowerCase();
	// Remove brand prefix if it exists
	if (s.startsWith(brandSlug + "-")) {
		s = s.substring(brandSlug.length + 1);
	}

	const overrides = {
		"a6-sportbacl": "A6 Sportbacl",
		"tt-tt": "TT Tt",
		"tt-tt-roaster": "TT Tt Roadster",
		"r8-spyder": "R8 Spyder",
		"q3-sportback": "Q3 Sportback",
		"a7-sportback": "A7 Sportback",
	};

	if (overrides[s]) return overrides[s];

	return s
		.split("-")
		.map(word => {
			if (!word) return "";
			if (/^[a-z]\d+$/i.test(word) || /^[a-z]{2,3}\d+$/i.test(word)) {
				return word.toUpperCase();
			}
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

async function run() {
	try {
		await connectDB();
		console.log("Connected to MongoDB.");

		const brands = await Brand.find({ isActive: true });
		console.log(`Processing submodels across ${brands.length} active brands...`);

		let totalCreated = 0;

		for (const brand of brands) {
			const specSlugs = await ModelEngineSpec.find({ brandSlug: brand.slug }).distinct("modelSlug");
			if (specSlugs.length === 0) continue;

			console.log(`\nChecking specs for Brand: "${brand.name}" (${specSlugs.length} distinct spec slugs)...`);

			for (const specSlug of specSlugs) {
				const expectedName = slugToModelName(specSlug, brand.slug);
				const expectedSlug = specSlug.toLowerCase();

				// Check if this model already exists by name or slug
				const existing = await Model.findOne({
					brandId: brand._id,
					$or: [
						{ slug: expectedSlug },
						{ name: new RegExp(`^${expectedName}$`, "i") }
					]
				});

				if (existing) {
					// Ensure existing model is active and correct
					continue;
				}

				// If not found, restore/create the submodel!
				const newModel = new Model({
					brandId: brand._id,
					name: expectedName,
					slug: expectedSlug,
					showInSelector: false,
					isActive: true,
					totalProducts: 0 // Will be updated by products count sync if needed
				});

				await newModel.save();
				console.log(`  ➕ Restored missing submodel: "${expectedName}" (Slug: "${expectedSlug}")`);
				totalCreated++;
			}
		}

		console.log(`\n🎉 Completed submodel restoration! Total submodels created: ${totalCreated}`);
		process.exit(0);
	} catch (error) {
		console.error("❌ Failed to restore submodels:", error);
		process.exit(1);
	}
}

run();
