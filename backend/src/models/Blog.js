const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String, // Can store HTML or Markdown
      required: true,
    },
    excerpt: {
      type: String,
    },
    author: {
      type: String,
      default: "Admin",
    },
    category: {
      type: String,
      default: "General",
    },
    image: {
      type: String, // Hero image URL
    },
    date: {
      type: String, // String for display flexibility, or Date
    },
    isPublished: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("Blog", blogSchema);
