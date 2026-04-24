const Inquiry = require("../models/Inquiry");

const validateVRM = async (req, reply) => {
  try {
    let {
      vrm,
      category,
      engineOptions,
      fittingOptions,
      postcode,
      notes,
      name,
      email,
      phone,
    } = req.body;

    // Step 1: Check VRM
    if (!vrm) {
      return reply.status(400).send({
        success: false,
        message: "VRM is required",
      });
    }

    vrm = vrm.replace(/\s+/g, "").toUpperCase();

    const ukVrmRegex =
      /^[A-Z]{2}[0-9]{2}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}$/;

    if (!ukVrmRegex.test(vrm)) {
      return reply.status(400).send({
        success: false,
        message: "Invalid UK registration number",
      });
    }

    // Step 2: If FULL FORM exists → save
    if (name && email && phone) {
      const inquiry = await Inquiry.create({
        registrationNumber: vrm,
        category,
        engineOptions,
        fittingOptions,
        postcode,
        notes,
        name,
        email,
        phone,
      });

      return reply.send({
        success: true,
        message: "Inquiry saved",
        data: inquiry,
      });
    }

    // Step 3: Only validation (no save)
    return reply.send({
      success: true,
      message: "VRM validated",
      data: {
        vrm,
        category,
      },
    });

  } catch (error) {
    console.error("ERROR:", error);

    return reply.status(500).send({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  validateVRM,
};