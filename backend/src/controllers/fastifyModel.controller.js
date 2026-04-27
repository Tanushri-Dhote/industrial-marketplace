const Model = require("../models/Model");
const Brand = require("../models/Brand");

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
		}).sort({ name: 1 });

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
		const { brandId, name, slug, imageUrl, spriteClass, spriteSheetUrl, spritePosition, spriteSize } =
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
