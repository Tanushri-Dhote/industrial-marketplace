const inquiryController = require("../../controllers/fastifyInquiry.controller");
const { authHook, tenantHook, permissionHook } = require("../../middlewares/fastifyHooks");

module.exports = async function (fastify, opts) {
  // Public route (maintained at original path)
  fastify.post("/validate-vrm", inquiryController.validateVRM);
  fastify.post("/lookup-vrm", inquiryController.lookupVRM);

  // Admin routes
  fastify.get("/inquiries", {
    preHandler: [authHook, tenantHook, permissionHook("inquiries", "read")],
    handler: inquiryController.getInquiries,
  });

  fastify.delete("/inquiries/:id", {
    preHandler: [authHook, tenantHook, permissionHook("inquiries", "delete")],
    handler: inquiryController.deleteInquiry,
  });
};