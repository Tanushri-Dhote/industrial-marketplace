const Model = require("../models/Model");
const Brand = require("../models/Brand");
const Product = require("../models/Product");

// Public endpoint
exports.getModelsByBrand = async (request, reply) => {
	try {
		const { brandId } = request.params;

		const brand = await Brand.findById(brandId);

		if (!brand) {
			return reply.send({
				success: true,
				data: [],
			});
		}

		const models = await Model.find({
			brandId: brand._id,
		}).sort({ name: 1 }).lean();

		const { all } = request.query || {};
		if (all === "true" || all === true) {
			return reply.send({
				success: true,
				data: models,
			});
		}

		// Find distinct model names for this brand's make
		const distinctModels = await Product.distinct("model", {
			make: { $in: [brand.productMake, brand.name] }
		});
		const distinctModelsLower = distinctModels.map((m) => (m || "").toLowerCase());

		const filteredModels = models.filter((m) => {
			const mn = (m.name || "").toLowerCase();
			const ms = (m.slug || "").toLowerCase();
			return distinctModelsLower.includes(mn) || distinctModelsLower.includes(ms);
		});

		return reply.send({
			success: true,
			data: filteredModels,
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
		const models = await Model.find().populate("brandId", "name slug").sort({ name: 1 });

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
