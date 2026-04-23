const controller = require("../../controllers/fastifyBrand.controller");

async function brandRoutes(fastify) {
	fastify.get("/", controller.getBrands);
	fastify.get("/:slug", controller.getBrandBySlug);
}

module.exports = brandRoutes;
