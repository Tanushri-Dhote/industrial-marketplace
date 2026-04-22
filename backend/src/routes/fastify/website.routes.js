const controller = require("../../controllers/fastifyWebsite.controller");
const { authHook } = require("../../middlewares/fastifyHooks");

async function websiteRoutes(fastify, options) {
  // Public — used by register page to show site name badge
  fastify.get("/:id/public", { handler: controller.getWebsite });

  // Protected routes (SuperAdmin)
  fastify.get("/", { preHandler: [authHook], handler: controller.getWebsites });
  fastify.get("/:id", { preHandler: [authHook], handler: controller.getWebsite });
  fastify.post("/", { preHandler: [authHook], handler: controller.createWebsite });
  fastify.put("/:id", { preHandler: [authHook], handler: controller.updateWebsite });
  fastify.delete("/:id", { preHandler: [authHook], handler: controller.deleteWebsite });
  fastify.get("/:id/users", { preHandler: [authHook], handler: controller.getWebsiteUsers });
}

module.exports = websiteRoutes;
