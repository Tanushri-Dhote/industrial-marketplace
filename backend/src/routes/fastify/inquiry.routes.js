const inquiryController = require("../../controllers/fastifyInquiry.controller");

module.exports = async function (fastify, opts) {
  fastify.post("/validate-vrm", inquiryController.validateVRM);
};