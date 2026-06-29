const mongoose = require("mongoose");
const dns = require("node:dns/promises");

dns.setServers(["1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Proactive Migration: Fix missing/null product slugs to resolve duplicate key errors
    const Product = mongoose.models.Product || require("../models/Product");
    const nullSlugProducts = await Product.find({ $or: [{ slug: null }, { slug: { $exists: false } }] });
    if (nullSlugProducts.length > 0) {
      console.log(`Found ${nullSlugProducts.length} products with missing/null slugs. Generating unique slugs...`);
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
      for (const p of nullSlugProducts) {
        p.slug = slugify(p.name || "engine");
        await p.save();
      }
      console.log("✅ Proactive slug migration completed successfully.");
    }
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;