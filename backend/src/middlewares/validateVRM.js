module.exports = async function validateVRM(request, reply) {
  try {
    let { vrm } = request.body;
    if (!vrm) {
      return reply.status(400).send({
        success: false,
        message: "VRM is required",
      });
    }
    vrm = vrm.replace(/\s+/g, "").toUpperCase();
    const standardRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/;
    const customRegex = /^[A-Z0-9]{2,7}$/;

    if (!standardRegex.test(vrm) && !customRegex.test(vrm)) {
      return reply.status(400).send({
        success: false,
        message: "Invalid UK VRM format",
      });
    }

    request.vrm = vrm;

  } catch (error) {
    return reply.status(500).send({
      message: error.message,
    });
  }
};