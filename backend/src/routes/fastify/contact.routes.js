const controller = require("../../controllers/fastifyContact.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function contactRoutes(fastify, options) {
	fastify.post("/submit", {
		handler: controller.submitContact,
	});

	fastify.get("/", {
		preHandler: [authHook, tenantHook, permissionHook("contacts", "read")],
		handler: controller.getContacts,
	});

	fastify.get("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("contacts", "read")],
		handler: controller.getContact,
	});

	fastify.patch("/:id/status", {
		preHandler: [authHook, tenantHook, permissionHook("contacts", "update")],
		handler: controller.updateContact,
	});

	fastify.delete("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("contacts", "delete")],
		handler: controller.deleteContact,
	});
}

module.exports = contactRoutes;
