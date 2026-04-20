const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    images: [
      {
        type: String, // store image URL
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isSold: {
      type: Boolean,
      default: false,
    },

    // 🔥 MULTI-TENANT
    website_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Website",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);