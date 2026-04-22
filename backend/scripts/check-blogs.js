require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Blog = require("../src/models/Blog");

async function check() {
  await connectDB();
  const blogCount = await Blog.countDocuments();
  console.log(`Total Blogs in DB: ${blogCount}`);
  
  const blogs = await Blog.find().select("title website_id");
  console.log("Blogs (sample):", JSON.stringify(blogs, null, 2));
  
  if (blogCount === 0) {
    console.log("Creating dummy blogs...");
    const siteId = "69e8673412160cce47989b95";
    await Blog.create([
      { title: "Maintaining Your Diesel Engine", slug: "maintaining-diesel-engine", content: "...", category: "Maintenance", website_id: siteId },
      { title: "Top 5 Industrial Engines of 2026", slug: "top-5-engines-2026", content: "...", category: "Review", website_id: siteId }
    ]);
    console.log("Dummy blogs created.");
  }
  
  process.exit(0);
}

check();
