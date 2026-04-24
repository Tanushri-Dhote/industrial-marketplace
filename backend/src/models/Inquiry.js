const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    category: String,

    engineOptions: [String],
    fittingOptions: [String],

    postcode: String,
    notes: String,

    name: String,
    email: String,
    phone: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);