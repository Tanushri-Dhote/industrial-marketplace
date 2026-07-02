const Product = require("../models/Product");

const escapeRegex = (string) => {
	return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

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

		const andConditions = [];

		if (request.tenantId) {
			filter.website_id = request.tenantId;
		}

		// 1. Search filter: model / make / name / engineCode / registrationNumber
		if (search) {
			const searchRegex = new RegExp(escapeRegex(search), "i");
			andConditions.push({
				$or: [
					{ name: searchRegex },
					{ make: searchRegex },
					{ model: searchRegex },
					{ engineCode: searchRegex },
					{ registrationNumber: searchRegex }
				]
			});
		}

		// 2. Brand filter (mapping slug to makes)
		if (brand) {
			const Brand = require("../models/Brand");
			const brands = await Brand.find({ isActive: true }).lean();
			const brandObj = brands.find((b) => b.slug === brand);
			const possibleMakes = [
				brand.toLowerCase(),
				brandObj?.name?.toLowerCase(),
				brandObj?.productMake?.toLowerCase(),
			].filter(Boolean);

			const makeConditions = possibleMakes.flatMap((m) => {
				const conds = [new RegExp(escapeRegex(m), "i")];
				if (m === "vw") conds.push(/volkswagen/i);
				if (m === "volkswagen") conds.push(/vw/i);
				if (m === "mercedes") conds.push(/mercedes-benz/i);
				if (m === "mercedes-benz") conds.push(/mercedes/i);
				return conds;
			});

			andConditions.push({
				$or: [
					{ "brand.slug": brand },
					{ brand: brand },
					{ make: { $in: makeConditions } }
				]
			});
		}

		// 3. Model filter
		if (model) {
			const escapedModel = escapeRegex(model);
			const slugRegexStr = escapedModel.replace(/[\s_-]+/g, "[\\s_-]*");
			filter.model = { $regex: new RegExp(`^${slugRegexStr}$`, "i") };
		}

		// 4. Category filter
		if (category && category !== "Engines") {
			const Category = require("../models/Category");
			const categoryObj = await Category.findOne({ name: category });
			
			const categoryConditions = [];
			if (categoryObj) {
				categoryConditions.push({ category: categoryObj._id });
			}
			
			if (category === "Used Engines") {
				categoryConditions.push({ condition: { $regex: /^used$/i } });
			} else if (category === "Reconditioned Engines") {
				categoryConditions.push({ condition: { $regex: /^reconditioned$/i } });
			}

			if (categoryConditions.length > 0) {
				andConditions.push({ $or: categoryConditions });
			}
		}

		// 5. Price Min Filter
		if (priceMin) {
			filter.price = filter.price || {};
			filter.price.$gte = Number(priceMin);
		}

		// 6. Price Max Filter
		if (priceMax) {
			filter.price = filter.price || {};
			filter.price.$lte = Number(priceMax);
		}

		// 8. Condition Filter
		if (conditions) {
			const condList = typeof conditions === "string" ? conditions.split(",") : conditions;
			const cleanCondList = condList.filter(Boolean);
			if (cleanCondList.length > 0) {
				filter.condition = { $in: cleanCondList.map(c => new RegExp(`^${escapeRegex(c)}$`, "i")) };
			}
		}

		// 9. Explicit Make filter (for backward compatibility)
		if (make) {
			filter.make = { $regex: new RegExp(`^${escapeRegex(make)}$`, "i") };
		}

		// Apply andConditions if any
		if (andConditions.length > 0) {
			filter.$and = andConditions;
		}

		const pageNum = Number(page);
		const limitNum = Number(limit || 10);
		const needsInMemoryFilter = !!mileageMax;

		if (!needsInMemoryFilter) {
			// Perform everything on the database side for maximum efficiency
			if (!isNaN(pageNum) && pageNum > 0) {
				const skipNum = (pageNum - 1) * limitNum;
				const total = await Product.countDocuments(filter);
				const products = await Product.find(filter)
					.populate("category")
					.sort({ price: 1, createdAt: -1 })
					.skip(skipNum)
					.limit(limitNum)
					.lean();
				
				return {
					success: true,
					data: products,
					pagination: {
						total,
						page: pageNum,
						limit: limitNum,
						pages: Math.ceil(total / limitNum),
					},
				};
			} else {
				let query = Product.find(filter).populate("category").sort({ price: 1, createdAt: -1 });
				if (limit) {
					query = query.limit(Number(limit));
				}
				const products = await query.lean();
				return { success: true, data: products };
			}
		} else {
			// Fallback to in-memory filtering for complex fields (like mileageMax)
			const products = await Product.find(filter)
				.populate("category")
				.sort({ price: 1, createdAt: -1 })
				.lean();
			
			let filtered = [...products];

			if (mileageMax) {
				filtered = filtered.filter((p) => {
					if (!p.mileage) return false;
					const miles = Number(p.mileage.replace(/[^\d]/g, ""));
					return miles && miles <= Number(mileageMax);
				});
			}

			if (!isNaN(pageNum) && pageNum > 0) {
				const total = filtered.length;
				const skipNum = (pageNum - 1) * limitNum;
				const paginatedProducts = filtered.slice(skipNum, skipNum + limitNum);

				return {
					success: true,
					data: paginatedProducts,
					pagination: {
						total,
						page: pageNum,
						limit: limitNum,
						pages: Math.ceil(total / limitNum),
					},
				};
			}

			if (limit) {
				filtered = filtered.slice(0, Number(limit));
			}

			return { success: true, data: filtered };
		}
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
