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

		imageUrl: {
			type: String,
			default: null,
		},

		year: {
			type: String,
			default: "",
		},

		type: {
			type: String,
			default: "",
		},

		spriteClass: {
			type: String,
			default: "",
		},

		spriteSheetUrl: {
			type: String,
			default: "",
		},

		isActive: {
			type: Boolean,
			default: true,
		},
		showInSelector: {
			type: Boolean,
			default: true,
		},
		// Sprite positioning for car_sprites.png
		spritePosition: {
			x: {
				type: Number,
				default: 0,
			},
			y: {
				type: Number,
				default: 0,
			},
		},

		spriteSize: {
			width: {
				type: Number,
				default: 135,
			},
			height: {
				type: Number,
				default: 76,
			},
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Model", modelSchema);
