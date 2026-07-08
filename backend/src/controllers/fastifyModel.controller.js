const Model = require("../models/Model");
const Brand = require("../models/Brand");
const Product = require("../models/Product");
const ModelEngineSpec = require("../models/ModelEngineSpec");

const modelsCache = {};
const modelsCacheTimestamps = {};
const MODELS_CACHE_TTL = 60 * 1000; // 1 minute cache TTL

// Public endpoint
exports.getModelsByBrand = async (request, reply) => {
	try {
		const { brandId } = request.params;
		const { all } = request.query || {};

		if (all === "true" || all === true) {
			const brand = await Brand.findById(brandId);
			if (!brand) {
				return reply.send({
					success: true,
					data: [],
				});
			}
			const models = await Model.find({
				brandId: brand._id,
				isActive: { $ne: false },
				isPlaceholder: { $ne: true },
			})
			.select("name slug brandId showInSelector year type")
			.sort({ name: 1 })
			.lean();
			return reply.send({
				success: true,
				data: models,
			});
		}

		const now = Date.now();
		const cacheKey = String(brandId);
		if (modelsCache[cacheKey] && (now - modelsCacheTimestamps[cacheKey] < MODELS_CACHE_TTL)) {
			return reply.send({
				success: true,
				data: modelsCache[cacheKey],
			});
		}

		const brand = await Brand.findById(brandId);
		if (!brand) {
			return reply.send({
				success: true,
				data: [],
			});
		}

		const models = await Model.find({
			brandId: brand._id,
			isActive: { $ne: false },
			showInSelector: { $ne: false },
		})
		.select("name slug brandId showInSelector year type spriteClass spriteSheetUrl spritePosition spriteSize")
		.sort({ name: 1 })
		.lean();

		// Save to cache
		modelsCache[cacheKey] = models;
		modelsCacheTimestamps[cacheKey] = now;

		return reply.send({
			success: true,
			data: models,
		});
	} catch (error) {
		return reply.code(500).send({
			success: false,
			message: error.message,
		});
	}
};

// Admin endpoints
exports.getAllModels = async (request, reply) => {
	try {
		const { skip = 0, limit = 20, search = "" } = request.query || {};

		const parsedSkip = parseInt(skip) || 0;
		const parsedLimit = parseInt(limit) || 20;

		const query = {};
		if (search) {
			query.$or = [
				{ name: new RegExp(search, "i") },
				{ slug: new RegExp(search, "i") }
			];
			const matchingBrands = await Brand.find({ name: new RegExp(search, "i") }).select("_id");
			if (matchingBrands.length > 0) {
				const brandIds = matchingBrands.map(b => b._id);
				query.$or.push({ brandId: { $in: brandIds } });
			}
		}

		const total = await Model.countDocuments(query);
		const models = await Model.find(query)
			.populate("brandId", "name slug")
			.sort({ name: 1 })
			.skip(parsedSkip)
			.limit(parsedLimit)
			.lean();

		return reply.send({
			success: true,
			data: models,
			total,
			skip: parsedSkip,
			limit: parsedLimit
		});
	} catch (error) {
		return reply.code(500).send({
			success: false,
			message: error.message,
		});
	}
};

exports.createModel = async (request, reply) => {
	try {
		const { brandId, name, slug, imageUrl, spriteClass, spriteSheetUrl, spritePosition, spriteSize, year, type } =
			request.body;

		if (!brandId || !name || !slug) {
			return reply.code(400).send({
				success: false,
				message: "Missing required fields: brandId, name, slug",
			});
		}

		// Verify brand exists
		const brand = await Brand.findById(brandId);
		if (!brand) {
			return reply.code(404).send({
				success: false,
				message: "Brand not found",
			});
		}

		const model = new Model({
			brandId,
			name,
			slug: slug.toLowerCase(),
			imageUrl: imageUrl || null,
			year: year || "",
			type: type || "",
			spriteClass: spriteClass || "",
			spriteSheetUrl: spriteSheetUrl || "",
			spritePosition: {
				x: Number(spritePosition?.x || 0),
				y: Number(spritePosition?.y || 0),
			},
			spriteSize: {
				width: Number(spriteSize?.width || 135),
				height: Number(spriteSize?.height || 76),
			},
			isActive: true,
		});

		await model.save();
		await model.populate("brandId", "name slug");

		return reply.code(201).send({
			success: true,
			data: model,
		});
	} catch (error) {
		return reply.code(500).send({
			success: false,
			message: error.message,
		});
	}
};

exports.updateModel = async (request, reply) => {
	try {
		const { id } = request.params;
		const updates = request.body;

		const model = await Model.findByIdAndUpdate(id, updates, { new: true }).populate(
			"brandId",
			"name slug",
		);

		if (!model) {
			return reply.code(404).send({
				success: false,
				message: "Model not found",
			});
		}

		return reply.send({
			success: true,
			data: model,
		});
	} catch (error) {
		return reply.code(500).send({
			success: false,
			message: error.message,
		});
	}
};

exports.deleteModel = async (request, reply) => {
	try {
		const { id } = request.params;

		const model = await Model.findByIdAndDelete(id);

		if (!model) {
			return reply.code(404).send({
				success: false,
				message: "Model not found",
			});
		}

		return reply.send({
			success: true,
			message: "Model deleted successfully",
		});
	} catch (error) {
		return reply.code(500).send({
			success: false,
			message: error.message,
		});
	}
};

// Public Engine Specs Endpoint
exports.getModelEngineSpecData = async (request, reply) => {
	try {
		const { brandSlug, modelSlug } = request.params;
		const spec = await ModelEngineSpec.findOne({
			brandSlug: brandSlug.toLowerCase(),
			modelSlug: modelSlug.toLowerCase(),
			isActive: true
		}).lean();

		if (!spec) {
			return reply.code(404).send({
				success: false,
				message: "Engine specifications not found for this brand and model"
			});
		}

		return reply.send({
			success: true,
			data: spec
		});
	} catch (error) {
		return reply.code(500).send({
			success: false,
			message: error.message
		});
	}
};

// Admin CSV Bulk Upload
exports.uploadModelEngineSpecCSV = async (request, reply) => {
	try {
		const fileData = await request.file();
		if (!fileData) {
			return reply.code(400).send({
				success: false,
				message: "No file uploaded",
			});
		}

		const buffer = await fileData.toBuffer();
		const csvText = buffer.toString("utf8");

		const lines = csvText.split(/\r?\n/);
		if (lines.length < 2) {
			return reply.code(400).send({
				success: false,
				message: "CSV is empty or invalid",
			});
		}

		const parseCSVLine = (line) => {
			const result = [];
			let current = "";
			let inQuotes = false;
			for (let i = 0; i < line.length; i++) {
				const char = line[i];
				if (char === '"' || char === "'") {
					inQuotes = !inQuotes;
				} else if (char === "," && !inQuotes) {
					result.push(current);
					current = "";
				} else {
					current += char;
				}
			}
			result.push(current);
			return result.map((val) => val.replace(/^["']|["']$/g, "").trim());
		};

		const headers = parseCSVLine(lines[0]);
		const rows = [];

		for (let i = 1; i < lines.length; i++) {
			const line = lines[i].trim();
			if (!line) continue;
			const values = parseCSVLine(line);
			const row = {};
			headers.forEach((header, idx) => {
				row[header] = values[idx] || "";
			});
			rows.push(row);
		}

		const groups = {};
		const allBrands = await Brand.find({ isActive: true }).lean();

		const getVal = (row, possibleKeys) => {
			for (const key of Object.keys(row)) {
				const cleanKey = key.trim().toLowerCase();
				if (possibleKeys.some(pk => cleanKey.startsWith(pk.toLowerCase()) || pk.toLowerCase().startsWith(cleanKey))) {
					return row[key];
				}
			}
			return "";
		};

		for (const row of rows) {
			const modelCell = (getVal(row, ["models", "model"]) || "").trim();
			const engineSizeCell = (getVal(row, ["engine siz", "engine size"]) || "").trim();
			const fuelCell = (getVal(row, ["fuel"]) || "").trim();
			const engineCodeCell = (getVal(row, ["engine co", "engine code"]) || "").trim();
			const yearsCell = (getVal(row, ["years", "year"]) || "").trim();
			const priceCell = (getVal(row, ["price", "quote", "average price"]) || "").trim();

			if (!modelCell) continue;

			// Match brand
			let foundBrand = null;
			for (const brand of allBrands) {
				const namesToCheck = [brand.name, brand.productMake].filter(Boolean);
				if (brand.slug === "mercedes-benz") namesToCheck.push("mercedes");
				if (brand.slug === "volkswagen") namesToCheck.push("vw");
				
				for (const name of namesToCheck) {
					const regex = new RegExp(`^${name}\\b`, "i");
					if (regex.test(modelCell)) {
						foundBrand = brand;
						break;
					}
				}
				if (foundBrand) break;
			}

			if (!foundBrand) {
				return reply.code(400).send({
					success: false,
					message: `Could not identify brand from row model: "${modelCell}". Please make sure the brand is registered first.`
				});
			}

			// Match model
			const brandModels = await Model.find({ brandId: foundBrand._id }).lean();
			brandModels.sort((a, b) => b.name.length - a.name.length);

			const escapedBrandName = foundBrand.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			const cellWithoutBrand = modelCell.replace(new RegExp(`^${escapedBrandName}\\b`, "i"), "").trim();

			let foundModel = null;
			for (const m of brandModels) {
				let escapedName = m.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, (match) => {
					if (match === '-' || match === ' ') return match;
					return '\\' + match;
				});
				escapedName = escapedName.replace(/[\s-]+/g, "[\\s-]*");
				const regex = new RegExp(`^${escapedName}\\b`, "i");

				if (regex.test(cellWithoutBrand)) {
					foundModel = m;
					break;
				}
			}

			if (!foundModel) {
				// Clean model name extraction (e.g. "Cx-3 2.0 Skyactiv-G" -> "Cx-3")
				const words = cellWithoutBrand.trim().split(/\s+/);
				let newModelName = words[0] || "";
				if (words[0] && words[0].match(/^\d+$/) && words[1] && words[1].toLowerCase() === "series") {
					newModelName = `${words[0]} Series`;
				} else if (words[0] && words[0].toLowerCase() === "range" && words[1] && words[1].toLowerCase() === "rover") {
					if (words[2] && words[2].toLowerCase() === "sport") {
						newModelName = "Range Rover Sport";
					} else {
						newModelName = "Range Rover";
					}
				}

				if (!newModelName) {
					return reply.code(400).send({
						success: false,
						message: `Could not identify car model from row model: "${modelCell}" under brand ${foundBrand.name}.`
					});
				}

				// Find or create in DB (so next iterations find it too)
				let dbModel = await Model.findOne({ brandId: foundBrand._id, name: new RegExp(`^${newModelName}$`, "i") });
				if (!dbModel) {
					const newSlug = `${foundBrand.slug}-${newModelName.toLowerCase().replace(/\s+/g, "-")}`;
					dbModel = await Model.create({
						brandId: foundBrand._id,
						name: newModelName,
						slug: newSlug,
						isActive: true
					});
				}
				foundModel = dbModel;
			}

			const modelKey = foundModel.slug;
			if (!groups[modelKey]) {
				groups[modelKey] = {
					brandSlug: foundBrand.slug,
					brandName: foundBrand.name,
					modelName: foundModel.name,
					modelSlug: foundModel.name.trim().replace(/\s+/g, "-").toLowerCase(),
					costTable: []
				};
			}

			if (modelCell && engineSizeCell) {
				groups[modelKey].costTable.push({
					model: modelCell,
					engineSize: engineSizeCell,
					fuel: fuelCell,
					engineCode: engineCodeCell,
					years: yearsCell,
					price: priceCell
				});
			}
		}

		let count = 0;
		for (const modelKey of Object.keys(groups)) {
			const group = groups[modelKey];

			// Dynamically extract popular submodels from cost table rows
			const dieselSet = new Set();
			const petrolSet = new Set();

			const escapedBrand = group.brandName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			const escapedModel = group.modelName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

			for (const item of group.costTable) {
				const fuelLower = (item.fuel || "").toLowerCase();
				let subModel = item.model
					.replace(new RegExp(escapedBrand, "gi"), "")
					.replace(new RegExp(escapedModel, "gi"), "")
					.trim();

				if (subModel) {
					subModel = subModel.toUpperCase();
					if (fuelLower.includes("diesel")) {
						dieselSet.add(subModel);
					} else {
						petrolSet.add(subModel);
					}
				}
			}

			const popularDiesel = Array.from(dieselSet);
			const popularPetrol = Array.from(petrolSet);

			await ModelEngineSpec.findOneAndUpdate(
				{ brandSlug: group.brandSlug, modelSlug: group.modelSlug },
				{
					brandName: group.brandName,
					modelName: group.modelName,
					popularDiesel,
					popularPetrol,
					costTable: group.costTable,
					isActive: true
				},
				{ upsert: true, new: true }
			);
			count++;
		}

		return reply.send({
			success: true,
			message: `Successfully processed ${rows.length} rows and imported/updated ${count} engine specs landing pages.`,
			importedCount: count
		});
	} catch (error) {
		return reply.code(500).send({
			success: false,
			message: error.message
		});
	}
};
