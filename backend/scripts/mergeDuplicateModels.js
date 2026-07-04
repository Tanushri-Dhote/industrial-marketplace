const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");

async function run() {
	const mongoUri = process.env.MONGO_URI;
	if (!mongoUri) {
		console.error("MONGO_URI not found in environment variables");
		process.exit(1);
	}

	console.log("Connecting to MongoDB...");
	await mongoose.connect(mongoUri);
	console.log("Connected successfully!");

	try {
		const brands = await Brand.find({ isActive: true });
		console.log(`Processing duplicates for ${brands.length} active brands...`);

		let totalDeletedModels = 0;
		let totalMergedSpecs = 0;

		for (const brand of brands) {
			const models = await Model.find({ brandId: brand._id });
			if (models.length === 0) continue;

			// Group models by normalized alphanumeric name (lowercase, alphanumeric characters only)
			const groups = {};
			for (const model of models) {
				const normalized = model.name.toLowerCase().replace(/[^a-z0-9]/g, "");
				if (!groups[normalized]) {
					groups[normalized] = [];
				}
				groups[normalized].push(model);
			}

			for (const normalizedName of Object.keys(groups)) {
				const group = groups[normalizedName];
				if (group.length <= 1) continue;

				console.log(`\nFound duplicate models for brand [${brand.name}] (normalized: "${normalizedName}"):`);
				group.forEach(m => console.log(`  - Name: "${m.name}", Slug: "${m.slug}", ID: ${m._id}`));

				// Select canonical model: prefer the one with the shorter slug (usually without the brand prefix, e.g. "c-max" vs "ford-c-max")
				group.sort((a, b) => {
					// 1. Shorter slug length
					if (a.slug.length !== b.slug.length) {
						return a.slug.length - b.slug.length;
					}
					// 2. Fallback: prefer the one that has an image
					if (a.imageUrl && !b.imageUrl) return -1;
					if (!a.imageUrl && b.imageUrl) return 1;
					return 0;
				});

				const canonicalModel = group[0];
				const redundantModels = group.slice(1);

				console.log(`=> Keeping canonical: "${canonicalModel.name}" (Slug: "${canonicalModel.slug}")`);

				// Clean slug for frontend query mapping
				const cleanModelSlug = canonicalModel.name.trim().replace(/\s+/g, "-").toLowerCase();

				// Clean up redundant models
				for (const redundant of redundantModels) {
					console.log(`=> Deleting redundant model: "${redundant.name}" (Slug: "${redundant.slug}")`);
					await Model.deleteOne({ _id: redundant._id });
					totalDeletedModels++;

					// Also find any spec in ModelEngineSpec associated with this redundant model's slug
					const redundantSpec = await ModelEngineSpec.findOne({
						brandSlug: brand.slug.toLowerCase(),
						modelSlug: redundant.slug.toLowerCase()
					});

					if (redundantSpec) {
						// Look for the canonical spec
						const canonicalSpec = await ModelEngineSpec.findOne({
							brandSlug: brand.slug.toLowerCase(),
							modelSlug: cleanModelSlug
						});

						if (canonicalSpec) {
							const canonicalCount = canonicalSpec.costTable?.length || 0;
							const redundantCount = redundantSpec.costTable?.length || 0;

							// Check if the canonical spec has dummy RSE data or fewer rows
							const isCanonicalDummy = canonicalSpec.costTable?.some(row => row.engineCode?.startsWith("RSE-"));

							if (redundantCount > canonicalCount || isCanonicalDummy) {
								console.log(`   Merging specs: Keeping redundant spec rows (${redundantCount} rows) and overwriting canonical...`);
								await ModelEngineSpec.deleteOne({ _id: canonicalSpec._id });
								
								redundantSpec.modelSlug = cleanModelSlug;
								await ModelEngineSpec.updateOne({ _id: redundantSpec._id }, { $set: { modelSlug: cleanModelSlug } });
								totalMergedSpecs++;
							} else {
								console.log(`   Merging specs: Canonical spec has better data (${canonicalCount} rows). Deleting redundant spec...`);
								await ModelEngineSpec.deleteOne({ _id: redundantSpec._id });
							}
						} else {
							// No canonical spec exists, rename redundant spec slug to the clean canonical slug
							console.log(`   Merging specs: Renaming redundant spec slug "${redundantSpec.modelSlug}" -> "${cleanModelSlug}"`);
							await ModelEngineSpec.updateOne({ _id: redundantSpec._id }, { $set: { modelSlug: cleanModelSlug } });
							totalMergedSpecs++;
						}
					}
				}

				// Also make sure the canonical model's spec itself is updated to the clean slug if it wasn't already
				const canonicalSpec = await ModelEngineSpec.findOne({
					brandSlug: brand.slug.toLowerCase(),
					modelSlug: canonicalModel.slug.toLowerCase()
				});

				if (canonicalSpec && canonicalModel.slug.toLowerCase() !== cleanModelSlug) {
					// Check if there is already a clean one
					const existingClean = await ModelEngineSpec.findOne({
						brandSlug: brand.slug.toLowerCase(),
						modelSlug: cleanModelSlug
					});

					if (!existingClean) {
						console.log(`=> Renaming canonical spec slug from "${canonicalSpec.modelSlug}" to clean slug "${cleanModelSlug}"`);
						await ModelEngineSpec.updateOne({ _id: canonicalSpec._id }, { $set: { modelSlug: cleanModelSlug } });
						totalMergedSpecs++;
					}
				}
			}
		}

		console.log("\n--- Cleanup and Alignment Summary ---");
		console.log(`- Total redundant duplicate models deleted: ${totalDeletedModels}`);
		console.log(`- Total specifications merged/re-aligned: ${totalMergedSpecs}`);
		console.log("Database clean-up finished successfully!");
	} catch (err) {
		console.error("Error during database merge cleanup:", err);
	} finally {
		await mongoose.disconnect();
		console.log("Database disconnected.");
	}
}

run();
