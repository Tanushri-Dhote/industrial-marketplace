const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../src/config/db");
const mongoose = require("mongoose");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

// Helper to generate a standardized slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\//g, "-")          // Replace slashes with hyphens
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters (except space and hyphen)
    .replace(/\s+/g, "-")         // Replace spaces with hyphens
    .replace(/-+/g, "-");         // Collapse consecutive hyphens
}

async function run() {
  let brandSlug = "";
  let filePath = "";
  let namesArg = "";
  let dryRun = false;

  // Parse command line arguments
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "--brand") {
      brandSlug = process.argv[i + 1];
      i++;
    } else if (process.argv[i] === "--file") {
      filePath = process.argv[i + 1];
      i++;
    } else if (process.argv[i] === "--names") {
      namesArg = process.argv[i + 1];
      i++;
    } else if (process.argv[i] === "--dry-run") {
      dryRun = true;
    }
  }

  if (!brandSlug) {
    console.error("❌ Error: --brand <brand-slug> is required.");
    console.log("Usage: node scripts/importModels.js --brand <brand-slug> [--file <file-path> | --names \"Model A, Model B\"]");
    process.exit(1);
  }

  // Retrieve input names
  let inputNames = [];
  if (namesArg) {
    inputNames = namesArg.split(",").map(n => n.trim()).filter(Boolean);
  } else if (filePath) {
    try {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      if (!fs.existsSync(absolutePath)) {
        console.error(`❌ Error: File not found at ${absolutePath}`);
        process.exit(1);
      }
      const fileContent = fs.readFileSync(absolutePath, "utf8");
      
      // Try to parse as JSON first
      try {
        const parsed = JSON.parse(fileContent);
        if (Array.isArray(parsed)) {
          inputNames = parsed.map(item => typeof item === "object" ? item.name || item.model : item).map(String);
        }
      } catch (e) {
        // Not a JSON file, check if it contains HTML options
        const optionRegex = /<option\s+[^>]*>([^<]+)<\/option>/gi;
        let match;
        const optionNames = [];
        while ((match = optionRegex.exec(fileContent)) !== null) {
          const val = match[1].trim();
          if (val && !val.toLowerCase().includes("select")) {
            optionNames.push(val);
          }
        }

        if (optionNames.length > 0) {
          inputNames = optionNames;
        } else {
          // Fall back to split by lines
          inputNames = fileContent
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);
        }
      }
    } catch (err) {
      console.error(`❌ Error reading or parsing file: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.error("❌ Error: Either --file <file-path> or --names \"name1,name2\" must be provided.");
    process.exit(1);
  }

  // Deduplicate input names case-insensitively
  const uniqueInputNames = [];
  const inputSet = new Set();
  for (const name of inputNames) {
    const norm = name.trim();
    if (!norm) continue;
    const lower = norm.toLowerCase();
    if (!inputSet.has(lower)) {
      inputSet.add(lower);
      uniqueInputNames.push(norm);
    }
  }

  if (uniqueInputNames.length === 0) {
    console.log("⚠️ No input models to process.");
    process.exit(0);
  }

  console.log(`🔍 Received ${uniqueInputNames.length} unique model names to import.`);

  // Connect to DB
  try {
    await connectDB();
    console.log("🔌 Connected to database successfully.");

    // Retrieve Brand
    const brand = await Brand.findOne({ slug: brandSlug.toLowerCase() });
    if (!brand) {
      console.error(`❌ Error: Brand with slug "${brandSlug}" not found in database.`);
      await mongoose.connection.close();
      process.exit(1);
    }
    console.log(`🏷️ Found Brand: "${brand.name}" (ID: ${brand._id})`);

    // Retrieve existing models for this Brand
    const existingModels = await Model.find({ brandId: brand._id });
    console.log(`ℹ️ Brand "${brand.name}" already has ${existingModels.length} models in the database.`);

    const existingSlugs = new Set(existingModels.map(m => m.slug.toLowerCase()));
    const existingNames = new Set(existingModels.map(m => m.name.toLowerCase()));

    let addedCount = 0;
    let skippedCount = 0;
    const skippedList = [];
    const addedList = [];

    for (const name of uniqueInputNames) {
      const slug = generateSlug(name);
      
      if (existingSlugs.has(slug) || existingNames.has(name.toLowerCase())) {
        skippedCount++;
        skippedList.push(name);
        continue;
      }

      // Create new model
      const newModel = new Model({
        brandId: brand._id,
        name: name,
        slug: slug,
        imageUrl: null,
        isActive: true,
        spriteSheetUrl: "/images/car_sprites.png",
        spriteClass: `bg-${slug}`,
        spritePosition: { x: 0, y: 0 },
        spriteSize: { width: 135, height: 76 }
      });

      if (!dryRun) {
        await newModel.save();
      }
      addedCount++;
      addedList.push(name);
    }

    console.log("\n=================== IMPORT SUMMARY ===================");
    if (dryRun) {
      console.log("⚠️ DRY RUN MODE: No modifications were saved to the database.");
    }
    console.log(`Total Input Models:  ${uniqueInputNames.length}`);
    console.log(`Already Present:     ${skippedCount}`);
    console.log(`Newly Added (To Add): ${addedCount}`);
    
    if (addedCount > 0) {
      console.log(dryRun ? "\nModels that would be added:" : "\nAdded Models:");
      addedList.forEach(m => console.log(`  ➕ ${m} (${generateSlug(m)})`));
    }
    
    if (skippedCount > 0) {
      console.log(`\nSkipped ${skippedCount} models (already exist).`);
    }
    console.log("======================================================");

    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  } catch (dbErr) {
    console.error(`❌ DB error during import:`, dbErr);
    try {
      await mongoose.connection.close();
    } catch (_) {}
    process.exit(1);
  }
}

run();
