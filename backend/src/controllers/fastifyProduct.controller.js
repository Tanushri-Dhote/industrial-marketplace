const Product = require("../models/Product");

// ================= GET PRODUCTS =================
exports.getProducts = async (request, reply) => {
	try {
		const filter = {};
		const {
			make,
			model,
			limit,
			page,
			search,
			brand,
			category,
			priceMin,
			priceMax,
			mileageMax,
			conditions
		} = request.query || {};

		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		// Load active brands for slug mapping
		const Brand = require("../models/Brand");
		const brands = await Brand.find({ isActive: true }).lean();

		// Fetch products matching basic website_id tenant filter
		let query = Product.find(filter).populate("category").sort({ price: 1, createdAt: -1 });
		let products = await query;

		let filtered = [...products];

		// 1. Search filter: model / make / name / engineCode / registrationNumber
		if (search) {
			const queryStr = search.toLowerCase();
			filtered = filtered.filter((p) => {
				return (
					p.name?.toLowerCase().includes(queryStr) ||
					p.make?.toLowerCase().includes(queryStr) ||
					p.model?.toLowerCase().includes(queryStr) ||
					p.engineCode?.toLowerCase().includes(queryStr) ||
					p.registrationNumber?.toLowerCase().includes(queryStr)
				);
			});
		}

		// 2. Brand filter (mapping slug to makes)
		if (brand) {
			const brandObj = brands.find((b) => b.slug === brand);
			const possibleMakes = [
				brand.toLowerCase(),
				brandObj?.name?.toLowerCase(),
				brandObj?.productMake?.toLowerCase(),
			].filter(Boolean);

			filtered = filtered.filter((p) => {
				if (!p.make) return false;
				const pm = p.make.toLowerCase();
				return (
					p.brand?.slug === brand ||
					p.brand === brand ||
					possibleMakes.some(
						(makeName) =>
							pm === makeName ||
							pm.includes(makeName) ||
							makeName.includes(pm) ||
							(pm === "vw" && makeName === "volkswagen") ||
							(pm === "volkswagen" && makeName === "vw") ||
							(pm === "mercedes" && makeName === "mercedes-benz") ||
							(pm === "mercedes-benz" && makeName === "mercedes")
					)
				);
			});
		}

		// 3. Model filter
		if (model) {
			const targetModelSlug = model.toLowerCase().replace(/[\s_-]+/g, "-");
			filtered = filtered.filter(
				(p) =>
					p.model?.toLowerCase().replace(/[\s_-]+/g, "-") === targetModelSlug ||
					p.model?.toLowerCase() === model.toLowerCase()
			);
		}

		// 4. Category filter
		if (category && category !== "Engines") {
			filtered = filtered.filter(
				(p) =>
					p.category?.name === category ||
					(category === "Used Engines" &&
						p.condition?.toLowerCase() === "used") ||
					(category === "Reconditioned Engines" &&
						p.condition?.toLowerCase() === "reconditioned")
			);
		}

		// 5. Price Min Filter
		if (priceMin) {
			filtered = filtered.filter((p) => p.price && p.price >= Number(priceMin));
		}

		// 6. Price Max Filter
		if (priceMax) {
			filtered = filtered.filter((p) => p.price && p.price <= Number(priceMax));
		}

		// 7. Mileage Max Filter
		if (mileageMax) {
			filtered = filtered.filter((p) => {
				if (!p.mileage) return false;
				const miles = Number(p.mileage.replace(/[^\d]/g, ""));
				return miles && miles <= Number(mileageMax);
			});
		}

		// 8. Condition Filter
		if (conditions) {
			const condList = typeof conditions === "string" ? conditions.split(",") : conditions;
			const cleanCondList = condList.filter(Boolean).map(c => c.toLowerCase());
			if (cleanCondList.length > 0) {
				filtered = filtered.filter(
					(p) => p.condition && cleanCondList.includes(p.condition.toLowerCase())
				);
			}
		}

		// 9. Explicit Make filter (for backward compatibility)
		if (make) {
			const targetMake = make.toLowerCase();
			filtered = filtered.filter((p) => p.make && p.make.toLowerCase() === targetMake);
		}

		// Pagination handling
		const pageNum = Number(page);
		const limitNum = Number(limit || 10);

		if (!isNaN(pageNum) && pageNum > 0) {
			const total = filtered.length;
			const pages = Math.ceil(total / limitNum);
			const skipNum = (pageNum - 1) * limitNum;
			const paginatedProducts = filtered.slice(skipNum, skipNum + limitNum);

			return {
				success: true,
				data: paginatedProducts,
				pagination: {
					total,
					page: pageNum,
					limit: limitNum,
					pages,
				},
			};
		}

		// If page is not specified, maintain backward compatibility
		if (limit) {
			filtered = filtered.slice(0, Number(limit));
		}

		return { success: true, data: filtered };
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
			website_id: request.tenantId || payload.website_id,
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
		const query = { _id: id };
		if (request.tenantId && request.user?.role !== "super_admin") {
			query.website_id = request.tenantId;
		}
		const product = await Product.findOneAndUpdate(
			query,
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
		const query = { _id: id };
		if (request.tenantId && request.user?.role !== "super_admin") {
			query.website_id = request.tenantId;
		}
		const product = await Product.findOneAndDelete(query);
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
