require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Website = require("../src/models/Website");

async function check() {
  await connectDB();
  const userCount = await User.countDocuments();
  const websiteCount = await Website.countDocuments();
  console.log(`Users: ${userCount}`);
  console.log(`Websites: ${websiteCount}`);
  
  const websites = await Website.find();
  console.log("Websites:", JSON.stringify(websites, null, 2));
  
  const users = await User.find().limit(5).select("name email website_id");
  console.log("Users (sample):", JSON.stringify(users, null, 2));
  
  process.exit(0);
}

check();
