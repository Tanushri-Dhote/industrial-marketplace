const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
{
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  slug: {
    type: String,
    required: true,
    trim: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Model", modelSchema);