/**
 * Migration Script: Consolidate to Single Tenant "All Engine 4 You"
 *
 * What this does:
 * 1. Creates (or finds) a single canonical Website: "All Engine 4 You"
 * 2. Re-links ALL existing users to this website
 * 3. Deletes all other orphan Website records that were auto-created from business_name
 *
 * Run with: node scripts/migrate-to-single-tenant.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

// Import models
const Website = require("../src/models/Website");
const User = require("../src/models/User");

async function run() {
  await connectDB();

  // Step 1: Create or find the canonical site
  let canonicalSite = await Website.findOne({ name: "All Engine 4 You" });

  if (!canonicalSite) {
    canonicalSite = await Website.create({
      name: "All Engine 4 You",
      domain: "allengine4you.com",
      description: "The primary industrial engine marketplace platform.",
      status: "active",
    });
    console.log(`✅ Created canonical site: ${canonicalSite._id}`);
  } else {
    // Update with new fields if they're missing
    canonicalSite.domain = canonicalSite.domain || "allengine4you.com";
    canonicalSite.description = canonicalSite.description || "The primary industrial engine marketplace platform.";
    canonicalSite.status = canonicalSite.status || "active";
    await canonicalSite.save();
    console.log(`✅ Found existing canonical site: ${canonicalSite._id}`);
  }

  // Step 2: Re-link all users to the canonical site
  const userResult = await User.updateMany(
    {}, // all users
    { $set: { website_id: canonicalSite._id } }
  );
  console.log(`✅ Re-linked ${userResult.modifiedCount} users to canonical site`);

  // Step 3: Set canonical site owner to the first super_admin
  const superAdmin = await User.findOne({ role: "super_admin" });
  if (superAdmin) {
    canonicalSite.owner = superAdmin._id;
    await canonicalSite.save();
    console.log(`✅ Set site owner to super_admin: ${superAdmin.email}`);
  }

  // Step 4: Remove all orphan Website records (everything except the canonical site)
  const deleteResult = await Website.deleteMany({
    _id: { $ne: canonicalSite._id },
  });
  console.log(`🗑️  Removed ${deleteResult.deletedCount} orphan website records`);

  console.log(`\n🎉 Migration complete!`);
  console.log(`   Canonical Site ID: ${canonicalSite._id}`);
  console.log(`   Add this to your .env: DEFAULT_SITE_ID=${canonicalSite._id}`);
  console.log(`   Add to your frontend .env: REACT_APP_SITE_ID=${canonicalSite._id}`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
