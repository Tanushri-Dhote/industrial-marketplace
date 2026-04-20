const Product = require("../models/Product");

// ================= CREATE PRODUCT =================
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      website_id: req.tenantId, // 🔥 tenant safe
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Product created",
      data: product,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET PRODUCTS =================
exports.getProducts = async (req, res) => {
  try {
    const filter = {};

    // 🔥 Tenant filter
    if (req.tenantId) {
      filter.website_id = req.tenantId;
    }

    const products = await Product.find(filter);

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        website_id: req.tenantId, // 🔥 security
      },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({
      _id: id,
      website_id: req.tenantId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createProduct: exports.createProduct,
  getProducts: exports.getProducts,
  updateProduct: exports.updateProduct,
  deleteProduct: exports.deleteProduct,
};