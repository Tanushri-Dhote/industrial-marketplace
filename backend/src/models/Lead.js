const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
	{
		// Basic details
		customer_name: {
			type: String,
			required: true,
			trim: true,
		},
		customer_email: {
			type: String,
			lowercase: true,
			trim: true,
			validate: {
				validator: function (v) {
					return /^\S+@\S+\.\S+$/.test(v);
				},
				message: (props) => `${props.value} is not a valid email!`,
			},
		},
		customer_phone: {
			type: String,
			trim: true,
			validate: {
				validator: function (v) {
					const cleaned = v.replace(/\s+/g, "");
					return /^(?:(?:\+44\s?|0)7\d{3}\s?\d{6}|(?:\+44\s?|0)1\d{2}\s?\d{7}|(?:\+44\s?|0)2\d{1}\s?\d{8})$/.test(
						cleaned,
					);
				},
				message: (props) => `${props.value} is not a valid UK phone number!`,
			},
		},

		// Inquiry specifics
		registration_number: {
			type: String,
			trim: true,
		},
		product_interest: {
			type: String, // E.g., make, model, or part name
		},
		message: {
			type: String,
		},

		// Workflow/Pipeline status
		status: {
			type: String,
			enum: ["New", "Contacted", "Quoted", "Won", "Lost", "Dead"],
			default: "New",
		},

		// Multi-tenant and Ownership
		website_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Website",
			required: true,
		},
		assigned_to: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		}, // e.g. the sales_manager handling this

		// Analytics
		value: {
			type: Number,
			default: 0,
		}, // Optional: Expected deal value
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Lead", leadSchema);
