const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
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
		const specs = await ModelEngineSpec.find({});
		console.log(`Fetched ${specs.length} total model specifications.`);

		let updatedCount = 0;
		let deletedDuplicateCount = 0;

		for (const spec of specs) {
			const brandSlug = spec.brandSlug.toLowerCase();
			const currentModelSlug = spec.modelSlug.toLowerCase();
			
			// Compute the clean slug based on model name
			const cleanModelSlug = spec.modelName.trim().replace(/\s+/g, "-").toLowerCase();

			if (currentModelSlug === cleanModelSlug) {
				// Already correct
				continue;
			}

			console.log(`Fixing spec for [${spec.brandName} ${spec.modelName}]: "${currentModelSlug}" -> "${cleanModelSlug}"`);

			// Check if cleanModelSlug already exists in DB
			const duplicate = await ModelEngineSpec.findOne({
				brandSlug: brandSlug,
				modelSlug: cleanModelSlug
			});

			if (duplicate) {
				console.log(`Duplicate found for clean slug: "${cleanModelSlug}". Handling unique constraint...`);
				
				const currentCount = spec.costTable?.length || 0;
				const dupCount = duplicate.costTable?.length || 0;

				if (currentCount >= dupCount) {
					console.log(`Current doc has more/equal rows (${currentCount} >= ${dupCount}). Deleting duplicate and renaming current...`);
					await ModelEngineSpec.deleteOne({ _id: duplicate._id });
					
					await ModelEngineSpec.updateOne({ _id: spec._id }, { $set: { modelSlug: cleanModelSlug } });
					updatedCount++;
				} else {
					console.log(`Duplicate doc has more rows (${dupCount} > ${currentCount}). Deleting current redundant doc...`);
					await ModelEngineSpec.deleteOne({ _id: spec._id });
					deletedDuplicateCount++;
				}
			} else {
				// No duplicate, safe to update directly
				await ModelEngineSpec.updateOne({ _id: spec._id }, { $set: { modelSlug: cleanModelSlug } });
				updatedCount++;
			}
		}

		console.log("\nMigration Summary:");
		console.log(`- Updated ${updatedCount} specs to use clean slugs`);
		console.log(`- Deleted ${deletedDuplicateCount} redundant duplicate specs`);
		console.log("All done!");
	} catch (err) {
		console.error("Error running migration:", err);
	} finally {
		await mongoose.disconnect();
		console.log("Database disconnected.");
	}
}

run();
