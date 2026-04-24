const yearController = require("../../controllers/fastifyYear.controller");

module.exports = async function (fastify) {
  fastify.get("/years/:modelId", yearController.getYearsByModel);
};