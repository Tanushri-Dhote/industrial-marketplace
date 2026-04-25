const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
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
      validate: {
        validator: function(v) {
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
      validate: {
        validator: function(v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          // Allow spaces and +44 prefix
          const cleaned = v.replace(/\s+/g, "");
          return /^(?:(?:\+44\s?|0)7\d{3}\s?\d{6}|(?:\+44\s?|0)1\d{2}\s?\d{7}|(?:\+44\s?|0)2\d{1}\s?\d{8})$/.test(cleaned);
        },
        message: props => `${props.value} is not a valid UK phone number!`
      }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema);