const filterController = require("../../controllers/fastifyFilterController");

async function routes(fastify, options) {
  fastify.get("/types/:year", filterController.getTypesByYear);
  fastify.get("/filters/part-types", filterController.getPartTypes);
}

module.exports = routes;