const mongoose = require("mongoose");

const featuredCarSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		trim: { type: String, default: "" },
		imageUrl: { type: String, required: true },
	},
	{ _id: false },
);

const brandSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true, trim: true },
		slug: { type: String, required: true, unique: true, lowercase: true },
		productMake: { type: String, required: true, index: true },
		logoUrl: { type: String, required: true },
		spriteClass: { type: String, default: "" },
		spriteSheetUrl: { type: String, default: "" },
		spritePosition: {
			x: { type: Number, default: 0 },
			y: { type: Number, default: 0 },
		},
		spriteSize: {
			width: { type: Number, default: 105 },
			height: { type: Number, default: 105 },
		},
		heroImage: { type: String, default: "" },
		description: { type: String, default: "" },
		featuredCars: [featuredCarSchema],
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Brand", brandSchema);
