const controller = require("../../controllers/fastifyPartType.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

async function partTypeRoutes(fastify, options) {
  // CREATE
  fastify.post("/", {
    preHandler: [authHook, tenantHook, permissionHook("part-types", "create")],
    handler: controller.createPartType,
  });

  // GET ALL
  fastify.get("/", controller.getPartTypes);

  // GET SINGLE
  fastify.get("/:id", controller.getPartTypeById);

  // UPDATE
  fastify.put("/:id", {
    preHandler: [authHook, tenantHook, permissionHook("part-types", "update")],
    handler: controller.updatePartType,
  });

  // DELETE
  fastify.delete("/:id", {
    preHandler: [authHook, tenantHook, permissionHook("part-types", "delete")],
    handler: controller.deletePartType,
  });
}

module.exports = partTypeRoutes;