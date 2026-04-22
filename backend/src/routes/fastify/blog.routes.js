const controller = require("../../controllers/fastifyBlog.controller");

async function blogRoutes(fastify, options) {
	// GET ALL (Public)
	fastify.get("/", controller.getBlogs);

	// GET SINGLE (Public)
	fastify.get("/:slug", controller.getBlogBySlug);
}

module.exports = blogRoutes;
