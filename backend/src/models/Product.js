const mongoose = require("mongoose");

const compatibilitySchema = new mongoose.Schema(
	{
		make: String,
		model: String,
		chassis: String,
		variant: String,
		type: String,
		year: String,
		engine: String,
		code: String,
	},
	{ _id: false },
);

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			unique: true,
		},
		description: {
			type: String,
		},
		supplierNotes: {
			type: String,
		},
		price: {
			type: Number,
		},
		currency: {
			type: String,
			default: "GBP",
		},
		condition: {
			type: String,
		},
		make: {
			type: String,
			index: true,
		},
		model: {
			type: String,
			index: true,
		},
		year: {
			type: Number,
			index: true,
		},
		engineType: {
			type: String,
		},
		mileage: {
			type: String,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		images: [
			{
				type: String,
			},
		],
		seller: {
			name: String,
			rating: String,
			icon: String,
		},
		shipping: {
			location: String,
			delivery: String,
			returns: String,
		},
		pricingBreakdown: {
			item: Number,
			delivery: Number,
			vatRate: { type: Number, default: 0.2 },
		},
		specifications: {
			type: Map,
			of: String,
		},
		compatibility: [compatibilitySchema],
		isFeatured: {
			type: Boolean,
			default: false,
		},
		isSold: {
			type: Boolean,
			default: false,
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

module.exports = mongoose.model("Product", productSchema);
