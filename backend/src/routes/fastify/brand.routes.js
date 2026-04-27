const controller = require("../../controllers/fastifyBrand.controller");

async function brandRoutes(fastify) {
	// Admin routes (more specific, registered first)
	fastify.get("/admin/all", controller.getAllBrands);
	fastify.post("/admin/create", controller.createBrand);
	fastify.put("/admin/:id", controller.updateBrand);
	fastify.delete("/admin/:id", controller.deleteBrand);

	// Public routes
	fastify.get("/", controller.getBrands);
	fastify.get("/:slug", controller.getBrandBySlug);
}

module.exports = brandRoutes;
