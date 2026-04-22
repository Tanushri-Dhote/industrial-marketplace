require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Blog = require("../src/models/Blog");

async function sync() {
  await connectDB();
  const canonicalSiteId = "69e8673412160cce47989b95";
  
  const result = await Blog.updateMany(
    {}, 
    { $set: { website_id: canonicalSiteId } }
  );
  
  console.log(`✅ Re-linked ${result.modifiedCount} blogs to canonical site.`);
  process.exit(0);
}

sync();
