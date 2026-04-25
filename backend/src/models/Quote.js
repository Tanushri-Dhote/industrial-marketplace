const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
	{
		refNumber: {
			type: String,
			required: true,
			trim: true,
		},
		customer: {
			name: { type: String, required: true, trim: true },
			phone: { type: String, trim: true },
			postcode: { type: String, trim: true },
		},
		vehicle: {
			vrm: { type: String, trim: true, uppercase: true },
			vehicleDesc: { type: String, trim: true },
			engineCode: { type: String, trim: true, uppercase: true },
		},
		pricing: {
			engine: { type: Number, default: 0 },
			exchange: { type: Number, default: 0 },
			delivery: { type: Number, default: 0 },
			recovery: { type: Number, default: 0 },
			fitting: { type: Number, default: 0 },
			vat: { type: Number, default: 0 },
			subtotal: { type: Number, default: 0 },
			total: { type: Number, default: 0 },
			autoVAT: { type: Boolean, default: false },
			recoveryTBC: { type: Boolean, default: false },
		},
		warranty: { type: String, trim: true },
		condition: { type: String, trim: true },
		mileage: { type: String, trim: true },
		notes: { type: String, trim: true },
		status: {
			type: String,
			enum: ["Pending", "Sent", "Approved", "Rejected"],
			default: "Sent",
		},
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
	{ timestamps: true },
);

module.exports = mongoose.model("Quote", quoteSchema);
