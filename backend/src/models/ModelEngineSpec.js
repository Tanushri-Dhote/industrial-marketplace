const mongoose = require("mongoose");

const costTableSchema = new mongoose.Schema({
	model: { type: String, required: true, trim: true },
	engineSize: { type: String, required: true, trim: true },
	fuel: { type: String, required: true, trim: true },
	engineCode: { type: String, required: true, trim: true },
	years: { type: String, required: true, trim: true },
	price: { type: String, default: "", trim: true }
});

const modelEngineSpecSchema = new mongoose.Schema(
	{
		brandSlug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		modelSlug: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		brandName: {
			type: String,
			required: true,
			trim: true,
		},
		modelName: {
			type: String,
			required: true,
			trim: true,
		},
		popularDiesel: {
			type: [String],
			default: [],
		},
		popularPetrol: {
			type: [String],
			default: [],
		},
		costTable: {
			type: [costTableSchema],
			default: [],
		},
		isActive: {
			type: Boolean,
			default: true,
		}
	},
	{
		timestamps: true,
	}
);

// Compound index to ensure unique combination of brand and model
modelEngineSpecSchema.index({ brandSlug: 1, modelSlug: 1 }, { unique: true });

module.exports = mongoose.model("ModelEngineSpec", modelEngineSpecSchema);
