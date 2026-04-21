const mongoose = require("mongoose");
const dns = require("node:dns/promises");

dns.setServers(["1.1.1.1"]);
const Website = require("../src/models/Website");
const Product = require("../src/models/Product");
const User = require("../src/models/User");
require("dotenv").config();

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 2. Get or Create a User (for createdBy)
    let user = await User.findOne({ role: "admin" });
    if (!user) {
      user = await User.findOne(); // grab any user if no admin
    }
    if (!user) {
      console.log("No user found. Please create a user first.");
      process.exit(1);
    }

    // 3. Get or Create a Website (Tenant)
    let website = await Website.findOne({ name: "Industrial Marketplace" });
    if (!website) {
      website = await Website.create({
        name: "Industrial Marketplace",
        owner: user._id
      });
      console.log("Created default Website (Tenant):", website._id);
    } else {
      console.log("Using existing Website (Tenant):", website._id);
    }

    // 4. Clear existing products (Optional - keep it for clean dev)
    await Product.deleteMany({ website_id: website._id });
    console.log("Cleared existing products for this tenant.");

    // 5. Product Data
    const transporterEngine = {
      name: "Volkswagen Transporter T28 TLine TDI BMT 2019 CXGB",
      slug: "volkswagen-transporter-engine-2019",
      description: "This is a premium, fully tested Volkswagen Transporter T28 TLine TDI engine. Engineered for maximum durability and fuel efficiency, it has undergone a rigorous 50-point inspection by our certified technicians. Ideal for professional fleet maintenance or individual vehicle upgrades.",
      supplierNotes: "THIS ENGINE IS A FULLY TESTED ENGINE WITH 42,000 MILES. WE CAN ALSO RECONDITION YOUR OLD ENGINE OR SUPPLY YOU WITH A RECONDITIONED ENGINE FITTING SERVICE IS AVAILABLE AT REQUEST. SOLD ON AN EXCHANGE BASIS.",
      price: 3450,
      currency: "GBP",
      condition: "Used",
      images: [
        "https://images.unsplash.com/photo-1598450844431-238449974247?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1000"
      ],
      seller: {
        name: "Lancashire Light Services LTD",
        rating: "100% positive",
        icon: "ET"
      },
      shipping: {
        location: "Oldham",
        delivery: "Varies",
        returns: "Returns accepted. See details"
      },
      pricingBreakdown: {
        item: 3450,
        delivery: 70,
        vatRate: 0.20
      },
      specifications: {
        "Engine Code": "CXGB",
        "Mileage": "42,000 miles",
        "Year": "2019",
        "Fuel Type": "Diesel",
        "Engine Size": "2.0L",
        "Condition": "Used / Fully Tested",
        "Warranty": "12 Months",
        "Gearbox": "Manual / DSG Compatible"
      },
      compatibility: [
        { make: "Volkswagen", model: "Transporter", chassis: "T6 [2015-2019]", variant: "Panel Van", type: "2.0 TDI", year: "2015-2019", engine: "1968cc 102HP (Diesel)", code: "CXGB" },
        { make: "Volkswagen", model: "Transporter", chassis: "T6 [2015-2019]", variant: "Kombi", type: "2.0 TDI", year: "2015-2019", engine: "1968cc 102HP (Diesel)", code: "CXGB" },
        { make: "Volkswagen", model: "Caravelle", chassis: "T6 [2015-2019]", variant: "MPV", type: "2.0 TDI", year: "2015-2019", engine: "1968cc 102HP (Diesel)", code: "CXGB" }
      ],
      website_id: website._id,
      createdBy: user._id
    };

    const product = await Product.create(transporterEngine);
    console.log("Seeded Product ID:", product._id);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
