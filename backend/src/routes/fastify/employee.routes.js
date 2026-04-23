const controller = require("../../controllers/fastifyEmployee.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function employeeRoutes(fastify, options) {
	// Protected routes
	fastify.get("/", {
		preHandler: [authHook, tenantHook, permissionHook("employees", "read")],
		handler: controller.getEmployees,
	});

	fastify.post("/", {
		preHandler: [authHook, tenantHook, permissionHook("employees", "create")],
		handler: controller.createEmployee,
	});

	fastify.put("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("employees", "update")],
		handler: controller.updateEmployee,
	});

	fastify.delete("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("employees", "delete")],
		handler: controller.deleteEmployee,
	});

	fastify.patch("/:id/status", {
		preHandler: [authHook, tenantHook, permissionHook("employees", "update")],
		handler: controller.toggleStatus,
	});
}

module.exports = employeeRoutes;
