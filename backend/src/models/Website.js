const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema(
  {
    // ================= IDENTITY =================
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },

    // ================= OWNERSHIP =================
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Website", websiteSchema);