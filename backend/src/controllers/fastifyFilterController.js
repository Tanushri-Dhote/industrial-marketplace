const PartType = require("../models/PartType");

// ======================
// GET PART TYPES
// ======================
exports.getPartTypes = async (request, reply) => {
  try {
    const data = await PartType.find({ isActive: true }).sort({ name: 1 });

    return {
      success: true,
      data,
    };
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET TYPES BY YEAR
// ======================
exports.getTypesByYear = async (request, reply) => {
  try {
    const { year } = request.params;

    const data = [
      { id: 1, name: "Manual" },
      { id: 2, name: "Automatic" },
      { id: 3, name: "Semi Automatic" },
      { id: 4, name: "CVT" },
    ];

    return {
      success: true,
      selectedYear: year,
      data,
    };
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: error.message,
    });
  }
};