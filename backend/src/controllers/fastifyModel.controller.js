const Model = require("../models/Model");
const Brand = require("../models/Brand");

exports.getModelsByBrand = async (request, reply) => {
  try {
    const { brandId } = request.params;

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return reply.send({
        success: true,
        data: []
      });
    }

    const models = await Model.find({
      brandId: brand._id
    }).sort({ name: 1 });

    return reply.send({
      success: true,
      data: models
    });

  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: error.message
    });
  }
};