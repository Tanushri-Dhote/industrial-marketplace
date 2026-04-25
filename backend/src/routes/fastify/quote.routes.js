const controller = require("../../controllers/fastifyQuote.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function quoteRoutes(fastify) {
	fastify.get("/", {
		preHandler: [authHook, tenantHook, permissionHook("quotes", "read")],
		handler: controller.getQuotes,
	});

	fastify.get("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("quotes", "read")],
		handler: controller.getQuote,
	});

	fastify.post("/", {
		preHandler: [authHook, tenantHook, permissionHook("quotes", "create")],
		handler: controller.createQuote,
	});

	fastify.put("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("quotes", "update")],
		handler: controller.updateQuote,
	});

	fastify.delete("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("quotes", "delete")],
		handler: controller.deleteQuote,
	});
}

module.exports = quoteRoutes;
