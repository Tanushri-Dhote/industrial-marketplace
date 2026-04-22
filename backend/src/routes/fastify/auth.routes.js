const controller = require("../../controllers/fastifyAuth.controller");

async function authRoutes(fastify, options) {
	fastify.post("/register", controller.register);
	fastify.post("/login", controller.login);
	fastify.post("/verify-login", controller.verifyLogin);
	fastify.post("/forgot-password", controller.forgotPassword);
	fastify.post("/reset-password", controller.resetPassword);
}

module.exports = authRoutes;
