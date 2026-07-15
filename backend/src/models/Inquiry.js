const mongoose = require("mongoose");
const inquirySchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    uppercase: true,
    trim: true,
  },

  brand: String,
  model: String,
  year: String,
  engineType: String,
  category: String,

  engineOptions: [String],
  fittingOptions: [String],

  postcode: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(v);
      },
      message: props => `${props.value} is not a valid UK postcode!`
    }
  },

  notes: String,

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },

  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (!v) return true;
        const cleaned = v.replace(/\s+/g, "");
        return /^(?:(?:\+44|0)[12378]\d{8,9})$/.test(cleaned);
      },
      message: props => `${props.value} is not a valid UK phone number!`
    }
  }

}, { timestamps: true });
module.exports = mongoose.model("Inquiry", inquirySchema);