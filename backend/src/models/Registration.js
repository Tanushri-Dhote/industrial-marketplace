const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
    {
        registration_number: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },

        website_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Website",
        },

        // ❌ REMOVE THESE
        // createdBy
        // status
    },
    { timestamps: true } // keep this if you want createdAt/updatedAt
);

module.exports = mongoose.model("Registration", registrationSchema);