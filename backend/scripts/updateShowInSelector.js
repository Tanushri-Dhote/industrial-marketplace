const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");
const ModelEngineSpec = require("../src/models/ModelEngineSpec");
const Product = require("../src/models/Product");

async function run() {
	try {
		await connectDB();
		console.log("Connected to MongoDB.");

		const models = await Model.find({});
		console.log(`Found ${models.length} models to check.`);

		let hiddenCount = 0;
		let visibleCount = 0;

		for (const model of models) {
			const brand = await Brand.findById(model.brandId);
			if (!brand) continue;

			// Generate the spec slug (same slugification as ModelEnginePage or controller)
			const specModelSlug = model.name.replace(/\s+/g, "-").toLowerCase();
			const spec = await ModelEngineSpec.findOne({
				brandSlug: brand.slug,
				modelSlug: specModelSlug
			});

			let showInSelector = true;

			if (spec) {
				const hasCostTable = spec.costTable && spec.costTable.length > 0;
				if (hasCostTable) {
					// Check if all engine codes in the cost table are default "RSE" codes
					const allCodesAreRse = spec.costTable.every(item => {
						const code = (item.engineCode || "").toUpperCase().trim();
						return code.startsWith("RSE") || code === "DEFAULT" || code === "";
					});

					if (allCodesAreRse) {
						showInSelector = false;
						console.log(`Model "${model.name}" (${brand.name}) only has default RSE engine codes. Setting showInSelector = false`);
					}
				} else {
					showInSelector = false;
					console.log(`Model "${model.name}" (${brand.name}) has empty specs. Setting showInSelector = false`);
				}
			} else {
				// No specs found, check if there are any products for this model
				const productCount = await Product.countDocuments({
					make: new RegExp(`^${brand.name}$`, "i"),
					model: new RegExp(`^${model.name}$`, "i")
				});

				if (productCount === 0) {
					showInSelector = false;
					console.log(`Model "${model.name}" (${brand.name}) has no specs and no products. Setting showInSelector = false`);
				}
			}

			model.showInSelector = showInSelector;
			await model.save();

			if (showInSelector) {
				visibleCount++;
			} else {
				hiddenCount++;
			}
		}

		console.log(`Processed all models. showInSelector set to true for ${visibleCount} models, and false for ${hiddenCount} models.`);
		process.exit(0);
	} catch (error) {
		console.error("Failed to update models showInSelector field:", error);
		process.exit(1);
	}
}

run();
