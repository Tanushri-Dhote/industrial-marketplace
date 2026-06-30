const Product = require("../models/Product");

// ================= GET PRODUCTS =================
exports.getProducts = async (request, reply) => {
	try {
		const filter = {};
		const { make, model, limit } = request.query || {};

		if (make) {
			filter.make = make;
		}

		if (model) {
			filter.model = model;
		}

		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		let query = Product.find(filter).populate("category").sort({ price: 1, createdAt: -1 });

		if (limit) {
			query = query.limit(Number(limit));
		}

		const products = await query;
		return { success: true, data: products };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

// ================= GET PRODUCT BY ID =================
exports.getProductById = async (request, reply) => {
	try {
		const { id } = request.params;
		const mongoose = require("mongoose");
		const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
		const product = await Product.findOne(query).populate("category");
		if (!product) return reply.status(404).send({ message: "Product not found" });
		return product;
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

const slugify = (text) => {
	const base = text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
	return `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// ================= CREATE PRODUCT =================
exports.createProduct = async (request, reply) => {
	try {
		const payload = { ...request.body };
		if (!payload.slug && payload.name) {
			payload.slug = slugify(payload.name);
		}
		const product = await Product.create({
			...payload,
			website_id: request.tenantId,
			createdBy: request.user.id,
		});
		reply.status(201).send({ message: "Product created", data: product });
	} catch (error) {
		console.error("ERROR: Failed to create product. Reason:", error);
		reply.status(500).send({ message: error.message });
	}
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (request, reply) => {
	try {
		const { id } = request.params;
		const payload = { ...request.body };
		if (!payload.slug && payload.name) {
			payload.slug = slugify(payload.name);
		}
		const product = await Product.findOneAndUpdate(
			{ _id: id, website_id: request.tenantId },
			payload,
			{ new: true },
		);
		if (!product) return reply.status(404).send({ message: "Product not found" });
		return product;
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (request, reply) => {
	try {
		const { id } = request.params;
		const product = await Product.findOneAndDelete({ _id: id, website_id: request.tenantId });
		if (!product) return reply.status(404).send({ message: "Product not found" });
		return { message: "Product deleted" };
	} catch (error) {
		reply.status(500).send({ message: error.message });
	}
};

// ================= CREATE PRODUCTS BULK =================
exports.createProductsBulk = async (request, reply) => {
	try {
		const products = request.body.products;
		if (!Array.isArray(products)) {
			return reply.status(400).send({ message: "Invalid payload: products must be an array" });
		}

		const productsToInsert = products.map((p) => ({
			...p,
			slug: p.slug || slugify(p.name),
			website_id: request.tenantId,
			createdBy: request.user.id,
		}));

		const result = await Product.insertMany(productsToInsert);
		return { success: true, message: `Successfully imported ${result.length} products`, count: result.length };
	} catch (error) {
		console.error("ERROR: Failed to create products in bulk. Reason:", error);
		reply.status(500).send({ message: error.message });
	}
};
