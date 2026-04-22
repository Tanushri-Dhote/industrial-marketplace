const controller = require("../../controllers/fastifyProduct.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function productRoutes(fastify, options) {
	// GET ALL (Public)
	fastify.get("/", controller.getProducts);

	// GET SINGLE (Public)
	fastify.get("/:id", controller.getProductById);

	// CREATE (Protected)
	fastify.post("/", {
		preHandler: [authHook, tenantHook, permissionHook("products", "create")],
		handler: controller.createProduct
	});

	// UPDATE (Protected)
	fastify.put("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("products", "update")],
		handler: controller.updateProduct
	});

	// DELETE (Protected)
	fastify.delete("/:id", {
		preHandler: [authHook, tenantHook, permissionHook("products", "delete")],
		handler: controller.deleteProduct
	});
}

module.exports = productRoutes;
