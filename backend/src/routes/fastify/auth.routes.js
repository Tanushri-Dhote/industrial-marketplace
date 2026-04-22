const controller = require("../../controllers/fastifyAuth.controller");
const userController = require("../../controllers/fastifyUser.controller");
const { authHook } = require("../../middlewares/fastifyHooks");

async function authRoutes(fastify, options) {
	// Authentication routes
	fastify.post("/register", controller.register);
	fastify.post("/login", controller.login);
	fastify.post("/verify-login", controller.verifyLogin);
	fastify.post("/forgot-password", controller.forgotPassword);
	fastify.post("/reset-password", controller.resetPassword);
	fastify.post("/forgot-username", controller.forgotUsername);

	// Profile routes (Protected)
	fastify.get("/me", { preHandler: [authHook] }, controller.getMyProfile);
	fastify.put("/update-profile", { preHandler: [authHook] }, userController.updateProfile);
	fastify.put("/update-business", { preHandler: [authHook] }, userController.updateBusiness);
	fastify.put("/change-password", { preHandler: [authHook] }, userController.changePassword);
}

module.exports = authRoutes;
