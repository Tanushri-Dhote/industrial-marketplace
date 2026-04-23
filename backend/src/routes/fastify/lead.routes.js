const controller = require("../../controllers/fastifyLead.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function leadRoutes(fastify, options) {
	// Public route to capture leads from external website forms
	// No authHook here. Only body validation. (You could add api key validation here later)
	fastify.post("/capture", {
		handler: controller.createLead,
	});

	// Protected routes
	fastify.get("/", {
		preHandler: [authHook, tenantHook, permissionHook("leads", "read")],
		handler: controller.getLeads,
	});

	fastify.get("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("leads", "read")],
		handler: controller.getLead,
	});

	fastify.post("/", {
		preHandler: [authHook, tenantHook, permissionHook("leads", "create")],
		handler: controller.createLead,
	});

	fastify.put("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("leads", "update")],
		handler: controller.updateLead,
	});

	fastify.delete("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("leads", "delete")],
		handler: controller.deleteLead,
	});
}

module.exports = leadRoutes;
