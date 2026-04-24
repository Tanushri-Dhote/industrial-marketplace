exports.getYearsByModel = async (request, reply) => {
  try {
    const { modelId } = request.params;

    const years = [
      { id: 1, name: "2024" },
      { id: 2, name: "2023" },
      { id: 3, name: "2022" },
      { id: 4, name: "2021" },
      { id: 5, name: "2020" },
      { id: 6, name: "2019" },
      { id: 7, name: "2018" }
    ];

    return reply.send({
      success: true,
      data: years
    });

  } catch (error) {
    return reply.code(500).send({
      success: false,
      message: error.message
    });
  }
};