const modelController = require("../../controllers/fastifyModel.controller");

async function routes(fastify, options) {
  fastify.get("/:brandId", modelController.getModelsByBrand);
}


module.exports = routes;