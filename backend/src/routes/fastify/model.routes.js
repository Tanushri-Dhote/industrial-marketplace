const modelController = require("../../controllers/fastifyModel.controller");

async function routes(fastify, options) {
	// Admin routes (more specific, registered first)
	fastify.get("/admin/all", modelController.getAllModels);
	fastify.post("/admin/create", modelController.createModel);
	fastify.put("/admin/:id", modelController.updateModel);
	fastify.delete("/admin/:id", modelController.deleteModel);

	// Public route
	fastify.get("/:brandId", modelController.getModelsByBrand);
}

module.exports = routes;
