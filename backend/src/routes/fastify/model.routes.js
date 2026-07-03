const modelController = require("../../controllers/fastifyModel.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function routes(fastify, options) {
	// Admin routes (more specific, registered first)
	fastify.get("/admin/all", {
		preHandler: [authHook, tenantHook, permissionHook("models", "read")],
		handler: modelController.getAllModels,
	});
	fastify.post("/admin/create", {
		preHandler: [authHook, tenantHook, permissionHook("models", "create")],
		handler: modelController.createModel,
	});
	fastify.put("/admin/:id", {
		preHandler: [authHook, tenantHook, permissionHook("models", "update")],
		handler: modelController.updateModel,
	});
	fastify.delete("/admin/:id", {
		preHandler: [authHook, tenantHook, permissionHook("models", "delete")],
		handler: modelController.deleteModel,
	});

	// Admin specs CSV upload
	fastify.post("/admin/specs/upload-csv", {
		preHandler: [authHook, tenantHook, permissionHook("models", "create")],
		handler: modelController.uploadModelEngineSpecCSV,
	});

	// Public specs lookup route
	fastify.get("/specs/:brandSlug/:modelSlug", modelController.getModelEngineSpecData);

	// Public route
	fastify.get("/:brandId", modelController.getModelsByBrand);
}

module.exports = routes;
