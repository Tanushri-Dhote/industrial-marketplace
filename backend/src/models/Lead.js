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
		},
		customer_phone: {
			type: String,
			trim: true,
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
