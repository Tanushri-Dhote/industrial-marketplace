const controller = require("../../controllers/fastifyAdmin.controller");
const fastifyHooks = require("../../middlewares/fastifyHooks");

async function adminRoutes(fastify, options) {
	fastify.addHook("preHandler", fastifyHooks.authHook);

	// Only Super Admins can reset passwords
	fastify.post("/admin/reset-password", controller.resetPasswordAdmin);

	// Invite system
	fastify.post("/admin/invite-staff", controller.inviteStaff);
}

module.exports = adminRoutes;
