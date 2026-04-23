const controller = require("../../controllers/fastifyPartType.controller");

async function partTypeRoutes(fastify, options) {
  // CREATE
  fastify.post("/", controller.createPartType);

  // GET ALL
  fastify.get("/", controller.getPartTypes);

  // GET SINGLE
  fastify.get("/:id", controller.getPartTypeById);

  // UPDATE
  fastify.put("/:id", controller.updatePartType);

  // DELETE
  fastify.delete("/:id", controller.deletePartType);
}

module.exports = partTypeRoutes;