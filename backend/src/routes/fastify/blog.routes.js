const controller = require("../../controllers/fastifyBlog.controller");

const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function blogRoutes(fastify, options) {
	// GET ALL (Public for site, but filtered in controller)
	fastify.get("/", controller.getBlogs);

	// GET SINGLE
	fastify.get("/:slug", controller.getBlogBySlug);

	// CREATE
	fastify.post("/", {
		preHandler: [authHook, tenantHook, permissionHook("blogs", "create")],
		handler: controller.createBlog
	});

	// UPDATE
	fastify.put("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("blogs", "update")],
		handler: controller.updateBlog
	});

	// DELETE
	fastify.delete("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("blogs", "delete")],
		handler: controller.deleteBlog
	});
}

module.exports = blogRoutes;
