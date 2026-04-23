const Brand = require("../models/Brand");

exports.getBrands = async (request, reply) => {
	try {
		const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();
		return reply.code(200).send({ success: true, data: brands });
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
