const mongoose = require("mongoose");

const contactSubmissionSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		subject: {
			type: String,
			required: true,
			trim: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["New", "Reviewed", "Replied", "Closed"],
			default: "New",
		},
		website_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Website",
			required: true,
		},
		sourcePath: {
			type: String,
			default: "/contact",
		},
		ipAddress: {
			type: String,
			default: "",
		},
		userAgent: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("ContactSubmission", contactSubmissionSchema);
