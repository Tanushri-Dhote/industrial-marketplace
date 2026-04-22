require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Product = require("../src/models/Product");

async function check() {
  await connectDB();
  const productCount = await Product.countDocuments();
  console.log(`Total Products in DB: ${productCount}`);
  
  const products = await Product.find().select("name website_id");
  console.log("Products (sample):", JSON.stringify(products, null, 2));
  
  process.exit(0);
}

check();
