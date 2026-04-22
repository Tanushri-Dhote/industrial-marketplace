const Registration = require("../models/Registration");

// ================= COLLECT REGISTRATION =================
exports.collectRegistration = async (request, reply) => {
    try {
        const { registration_number } = request.body;

        // validation
        if (!registration_number) {
            return reply.status(400).send({
                message: "Registration number is required",
            });
        }

        const formattedReg = registration_number.toUpperCase().trim();

        const isValid = /^[A-Z0-9]{5,8}$/.test(formattedReg);
        if (!isValid) {
            return reply.status(400).send({
                message: "Invalid registration number",
            });
        }

        // optional: prevent duplicate
        const exists = await Registration.findOne({
            registration_number: formattedReg,
            website_id: request.tenantId,
        });

        if (exists) {
            return reply.send({
                message: "Registration already submitted",
                data: exists,
            });
        }

        const newRegistration = await Registration.create({
            registration_number: formattedReg,
            website_id: request.tenantId,
            createdBy: request.user?.id || null,
        });

        return reply.status(201).send({
            message: "Registration collected successfully",
            data: newRegistration,
        });
    } catch (error) {
        reply.status(500).send({
            message: error.message,
        });
    }
};

// ================= GET REGISTRATIONS =================
exports.getRegistrations = async (request, reply) => {
    try {
        const filter = {};

        if (request.tenantId) {
            filter.website_id = request.tenantId;
        }

        const data = await Registration.find(filter).sort({ createdAt: -1 });

        return data;
    } catch (error) {
        reply.status(500).send({
            message: error.message,
        });
    }
};