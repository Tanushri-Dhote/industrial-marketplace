const Brand = require("../models/Brand");
const Product = require("../models/Product");

let cachedBrands = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minute cache TTL

// Public endpoints
exports.getBrands = async (request, reply) => {
	try {
		const { all } = request.query || {};
		if (all === "true" || all === true) {
			const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();
			return reply.code(200).send({ success: true, data: brands });
		}

		const now = Date.now();
		if (cachedBrands && (now - cacheTimestamp < CACHE_TTL)) {
			return reply.code(200).send({ success: true, data: cachedBrands });
		}

		const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();

		// Find all models and group their names by brandId
		const Model = require("../models/Model");
		const models = await Model.find({ isActive: { $ne: false } }).lean();
		const brandModelsMap = {};
		models.forEach((model) => {
			const bId = String(model.brandId);
			if (!brandModelsMap[bId]) {
				brandModelsMap[bId] = [];
			}
			brandModelsMap[bId].push((model.name || "").toLowerCase());
			brandModelsMap[bId].push((model.slug || "").toLowerCase());
		});

		// Find distinct products grouped by make and model
		const distinctProductPairs = await Product.aggregate([
			{ $group: { _id: { make: "$make", model: "$model" } } },
		]);

		const filteredBrands = brands.filter((brand) => {
			const pm = (brand.productMake || "").toLowerCase();
			const bn = (brand.name || "").toLowerCase();
			const bId = String(brand._id);

			// Find if there is any product matching this brand's make AND matching at least one of its models
			const allowedModels = brandModelsMap[bId] || [];

			return distinctProductPairs.some((pair) => {
				const pairMake = (pair._id.make || "").toLowerCase();
				const pairModel = (pair._id.model || "").toLowerCase();

				const makeMatches = pairMake === pm || pairMake === bn;
				const modelMatches = allowedModels.includes(pairModel);

				return makeMatches && modelMatches;
			});
		});

		cachedBrands = filteredBrands;
		cacheTimestamp = now;

		return reply.code(200).send({ success: true, data: filteredBrands });
	} catch (error) {
		return reply.code(500).send({ message: error.message });
	}
};

exports.getBrandBySlug = async (request, reply) => {
	try {
		const { slug } = request.params;
		const brand = await Brand.findOne({ slug, isActive: true }).lean();

		if (!brand) {
			return reply.code(404).send({ message: "Brand not found" });
		}

		return reply.code(200).send({ success: true, data: brand });
	} catch (error) {
		return reply.code(500).send({ message: error.message });
	}
};

// Admin endpoints
exports.getAllBrands = async (request, reply) => {
	try {
		const brands = await Brand.find().sort({ name: 1 }).lean();
		return reply.code(200).send({ success: true, data: brands });
	} catch (error) {
		return reply.code(500).send({ success: false, message: error.message });
	}
};

exports.createBrand = async (request, reply) => {
	try {
		const {
			name,
			slug,
			productMake,
			logoUrl,
			heroImage,
			description,
			spriteClass,
			spriteSheetUrl,
			spritePosition,
			spriteSize,
		} = request.body;

		if (!name || !slug || !productMake || !logoUrl) {
			return reply.code(400).send({
				success: false,
				message: "Missing required fields: name, slug, productMake, logoUrl",
			});
		}

		// Check if slug already exists
		const existingBrand = await Brand.findOne({ slug });
		if (existingBrand) {
			return reply.code(400).send({
				success: false,
				message: "Slug already exists",
			});
		}

		const brand = new Brand({
			name,
			slug: slug.toLowerCase(),
			productMake,
			logoUrl,
			spriteClass: spriteClass || "",
			spriteSheetUrl: spriteSheetUrl || "",
			spritePosition: {
				x: Number(spritePosition?.x || 0),
				y: Number(spritePosition?.y || 0),
			},
			spriteSize: {
				width: Number(spriteSize?.width || 105),
				height: Number(spriteSize?.height || 105),
			},
			heroImage: heroImage || "",
			description: description || "",
			isActive: true,
		});

		await brand.save();
		return reply.code(201).send({ success: true, data: brand });
	} catch (error) {
		return reply.code(500).send({ success: false, message: error.message });
	}
};

exports.updateBrand = async (request, reply) => {
	try {
		const { id } = request.params;
		const updates = request.body;

		const brand = await Brand.findByIdAndUpdate(id, updates, { new: true });

		if (!brand) {
			return reply.code(404).send({ success: false, message: "Brand not found" });
		}

		return reply.code(200).send({ success: true, data: brand });
	} catch (error) {
		return reply.code(500).send({ success: false, message: error.message });
	}
};

exports.deleteBrand = async (request, reply) => {
	try {
		const { id } = request.params;

		const brand = await Brand.findByIdAndDelete(id);

		if (!brand) {
			return reply.code(404).send({ success: false, message: "Brand not found" });
		}

		return reply.code(200).send({ success: true, message: "Brand deleted successfully" });
	} catch (error) {
		return reply.code(500).send({ success: false, message: error.message });
	}
};
