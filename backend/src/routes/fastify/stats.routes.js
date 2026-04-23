const controller = require("../../controllers/fastifyStats.controller");
const { authHook, tenantHook } = require("../../middlewares/fastifyHooks");

async function statsRoutes(fastify, options) {
	// Protected route for dashboard stats
	fastify.get("/", {
		preHandler: [authHook, tenantHook],
		handler: controller.getStats,
	});
}

module.exports = statsRoutes;
