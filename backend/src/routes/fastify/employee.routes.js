const controller = require("../../controllers/fastifyEmployee.controller");
const { authHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function employeeRoutes(fastify, options) {
	// Protected routes
	fastify.get("/", {
		preHandler: [authHook],
		handler: controller.getEmployees
	});

	fastify.put("/:id", {
		preHandler: [authHook],
		handler: controller.updateEmployee
	});

	fastify.delete("/:id", {
		preHandler: [authHook],
		handler: controller.deleteEmployee
	});

	fastify.patch("/:id/status", {
		preHandler: [authHook],
		handler: controller.toggleStatus
	});
}

module.exports = employeeRoutes;
