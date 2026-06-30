const controller = require("../../controllers/fastifyBrand.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function brandRoutes(fastify) {
	// Admin routes (more specific, registered first)
	fastify.get("/admin/all", {
		preHandler: [authHook, tenantHook, permissionHook("brands", "read")],
		handler: controller.getAllBrands,
	});
	fastify.post("/admin/create", {
		preHandler: [authHook, tenantHook, permissionHook("brands", "create")],
		handler: controller.createBrand,
	});
	fastify.put("/admin/:id", {
		preHandler: [authHook, tenantHook, permissionHook("brands", "update")],
		handler: controller.updateBrand,
	});
	fastify.delete("/admin/:id", {
		preHandler: [authHook, tenantHook, permissionHook("brands", "delete")],
		handler: controller.deleteBrand,
	});

	// Public routes
	fastify.get("/", controller.getBrands);
	fastify.get("/:slug", controller.getBrandBySlug);
}

module.exports = brandRoutes;
