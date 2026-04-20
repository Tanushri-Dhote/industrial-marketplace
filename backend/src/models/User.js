const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ================= BUSINESS INFO =================
    business_name: {
      type: String,
      trim: true,
      required: function () {
        return this.role !== "super_admin";
      },
    },

    phone1: {
      type: String,
      required: function () {
        return this.role !== "super_admin";
      },
    },

    phone2: {
      type: String,
    },

    warranty: {
      type: String,
      enum: ["3 months", "6 months", "12 months", "1 year"],
      required: function () {
        return this.role !== "super_admin";
      },
    },

    vat_number: {
      type: String,
    },

    // ================= SYSTEM =================
    role: {
      type: String,
      enum: ["super_admin", "admin", "sales_manager", "viewer"],
      default: "viewer",
    },

    website_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Website",
      required: function () {
        return this.role !== "super_admin";
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ================= AUTH =================
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    loginVerifyToken: String,
    loginVerifyExpires: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);