const controller = require("../../controllers/fastifyRegistrationController");

async function registrationRoutes(fastify, options) {

    // ================= COLLECT REG =================
    fastify.post("/collect-registation",
        controller.collectRegistration
    );

    // ================= GET ALL =================
    fastify.get(
        "/registrations",
        controller.getRegistrations
    );
}

module.exports = registrationRoutes;