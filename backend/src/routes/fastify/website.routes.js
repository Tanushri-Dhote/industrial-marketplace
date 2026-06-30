const controller = require("../../controllers/fastifyWebsite.controller");
const { authHook } = require("../../middlewares/fastifyHooks");

const superAdminHook = async (request, reply) => {
	if (request.user?.role !== "super_admin") {
		return reply.status(403).send({ message: "Only Super Admins can perform this action" });
	}
};

async function websiteRoutes(fastify, options) {
  // Public — used by register page to show site name badge
  fastify.get("/:id/public", { handler: controller.getWebsite });

  // Protected routes
  fastify.get("/", { preHandler: [authHook], handler: controller.getWebsites });
  fastify.get("/:id", { preHandler: [authHook], handler: controller.getWebsite });
  fastify.post("/", { preHandler: [authHook, superAdminHook], handler: controller.createWebsite });
  fastify.put("/:id", { preHandler: [authHook, superAdminHook], handler: controller.updateWebsite });
  fastify.delete("/:id", { preHandler: [authHook, superAdminHook], handler: controller.deleteWebsite });
  fastify.get("/:id/users", { preHandler: [authHook], handler: controller.getWebsiteUsers });
}

module.exports = websiteRoutes;
