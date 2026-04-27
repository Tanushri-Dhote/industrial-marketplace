// Seed file for initial brands and models
// Run with: node backend/scripts/seedBrandsAndModels.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const dns = require("node:dns/promises");

dns.setServers(["1.1.1.1"]);

dotenv.config({ path: path.join(__dirname, "../.env") });

const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

const seedData = {
	brands: [
		{
			name: "BMW",
			slug: "bmw",
			productMake: "BMW",
			logoUrl: "https://via.placeholder.com/200?text=BMW",
			heroImage: "https://via.placeholder.com/1200x400?text=BMW+Hero",
			description: "Luxury performance vehicles from Bavaria",
			isActive: true,
		},
		{
			name: "Mercedes-Benz",
			slug: "mercedes",
			productMake: "Mercedes-Benz",
			logoUrl: "https://via.placeholder.com/200?text=Mercedes",
			heroImage: "https://via.placeholder.com/1200x400?text=Mercedes+Hero",
			description: "Premium German engineering and luxury",
			isActive: true,
		},
		{
			name: "Audi",
			slug: "audi",
			productMake: "Audi",
			logoUrl: "https://via.placeholder.com/200?text=Audi",
			heroImage: "https://via.placeholder.com/1200x400?text=Audi+Hero",
			description: "Innovation and sophistication in every drive",
			isActive: true,
		},
		{
			name: "Volkswagen",
			slug: "volkswagen",
			productMake: "Volkswagen",
			logoUrl: "https://via.placeholder.com/200?text=VW",
			heroImage: "https://via.placeholder.com/1200x400?text=VW+Hero",
			description: "Reliable, efficient, and affordable vehicles",
			isActive: true,
		},
		{
			name: "Ford",
			slug: "ford",
			productMake: "Ford",
			logoUrl: "https://via.placeholder.com/200?text=Ford",
			heroImage: "https://via.placeholder.com/1200x400?text=Ford+Hero",
			description: "American reliability and innovation",
			isActive: true,
		},
		{
			name: "Toyota",
			slug: "toyota",
			productMake: "Toyota",
			logoUrl: "https://via.placeholder.com/200?text=Toyota",
			heroImage: "https://via.placeholder.com/1200x400?text=Toyota+Hero",
			description: "Quality vehicles built to last",
			isActive: true,
		},
	],
	models: [
		// BMW Models
		{
			brandSlug: "bmw",
			name: "3 Series",
			slug: "3-series",
			imageUrl: "https://via.placeholder.com/250x150?text=3+Series",
			series: "3 Series",
			isActive: true,
			spritePosition: { x: 0, y: 0 },
		},
		{
			brandSlug: "bmw",
			name: "5 Series",
			slug: "5-series",
			imageUrl: "https://via.placeholder.com/250x150?text=5+Series",
			series: "5 Series",
			isActive: true,
			spritePosition: { x: 100, y: 0 },
		},
		{
			brandSlug: "bmw",
			name: "X5",
			slug: "x5",
			imageUrl: "https://via.placeholder.com/250x150?text=X5",
			series: "X Series",
			isActive: true,
			spritePosition: { x: 200, y: 0 },
		},
		{
			brandSlug: "bmw",
			name: "M440",
			slug: "m440",
			imageUrl: "https://via.placeholder.com/250x150?text=M440",
			series: "M Series",
			isActive: true,
			spritePosition: { x: 300, y: 0 },
		},
		// Mercedes Models
		{
			brandSlug: "mercedes",
			name: "C-Class",
			slug: "c-class",
			imageUrl: "https://via.placeholder.com/250x150?text=C-Class",
			series: "C-Class",
			isActive: true,
			spritePosition: { x: 0, y: 100 },
		},
		{
			brandSlug: "mercedes",
			name: "E-Class",
			slug: "e-class",
			imageUrl: "https://via.placeholder.com/250x150?text=E-Class",
			series: "E-Class",
			isActive: true,
			spritePosition: { x: 100, y: 100 },
		},
		{
			brandSlug: "mercedes",
			name: "GLE",
			slug: "gle",
			imageUrl: "https://via.placeholder.com/250x150?text=GLE",
			series: "SUV",
			isActive: true,
			spritePosition: { x: 200, y: 100 },
		},
		{
			brandSlug: "mercedes",
			name: "AMG GT",
			slug: "amg-gt",
			imageUrl: "https://via.placeholder.com/250x150?text=AMG+GT",
			series: "AMG Performance",
			isActive: true,
			spritePosition: { x: 300, y: 100 },
		},
		// Audi Models
		{
			brandSlug: "audi",
			name: "A4",
			slug: "a4",
			imageUrl: "https://via.placeholder.com/250x150?text=A4",
			series: "A Series",
			isActive: true,
			spritePosition: { x: 0, y: 200 },
		},
		{
			brandSlug: "audi",
			name: "A6",
			slug: "a6",
			imageUrl: "https://via.placeholder.com/250x150?text=A6",
			series: "A Series",
			isActive: true,
			spritePosition: { x: 100, y: 200 },
		},
		{
			brandSlug: "audi",
			name: "Q5",
			slug: "q5",
			imageUrl: "https://via.placeholder.com/250x150?text=Q5",
			series: "Q Series",
			isActive: true,
			spritePosition: { x: 200, y: 200 },
		},
		{
			brandSlug: "audi",
			name: "RS6",
			slug: "rs6",
			imageUrl: "https://via.placeholder.com/250x150?text=RS6",
			series: "RS Performance",
			isActive: true,
			spritePosition: { x: 300, y: 200 },
		},
		// Volkswagen Models
		{
			brandSlug: "volkswagen",
			name: "Golf",
			slug: "golf",
			imageUrl: "https://via.placeholder.com/250x150?text=Golf",
			series: "Golf",
			isActive: true,
			spritePosition: { x: 0, y: 300 },
		},
		{
			brandSlug: "volkswagen",
			name: "Passat",
			slug: "passat",
			imageUrl: "https://via.placeholder.com/250x150?text=Passat",
			series: "Passat",
			isActive: true,
			spritePosition: { x: 100, y: 300 },
		},
		{
			brandSlug: "volkswagen",
			name: "Tiguan",
			slug: "tiguan",
			imageUrl: "https://via.placeholder.com/250x150?text=Tiguan",
			series: "SUV",
			isActive: true,
			spritePosition: { x: 200, y: 300 },
		},
		// Ford Models
		{
			brandSlug: "ford",
			name: "Mustang",
			slug: "mustang",
			imageUrl: "https://via.placeholder.com/250x150?text=Mustang",
			series: "Performance",
			isActive: true,
			spritePosition: { x: 0, y: 400 },
		},
		{
			brandSlug: "ford",
			name: "Focus",
			slug: "focus",
			imageUrl: "https://via.placeholder.com/250x150?text=Focus",
			series: "Focus",
			isActive: true,
			spritePosition: { x: 100, y: 400 },
		},
		{
			brandSlug: "ford",
			name: "Explorer",
			slug: "explorer",
			imageUrl: "https://via.placeholder.com/250x150?text=Explorer",
			series: "SUV",
			isActive: true,
			spritePosition: { x: 200, y: 400 },
		},
		// Toyota Models
		{
			brandSlug: "toyota",
			name: "Corolla",
			slug: "corolla",
			imageUrl: "https://via.placeholder.com/250x150?text=Corolla",
			series: "Corolla",
			isActive: true,
			spritePosition: { x: 0, y: 500 },
		},
		{
			brandSlug: "toyota",
			name: "Camry",
			slug: "camry",
			imageUrl: "https://via.placeholder.com/250x150?text=Camry",
			series: "Camry",
			isActive: true,
			spritePosition: { x: 100, y: 500 },
		},
		{
			brandSlug: "toyota",
			name: "RAV4",
			slug: "rav4",
			imageUrl: "https://via.placeholder.com/250x150?text=RAV4",
			series: "SUV",
			isActive: true,
			spritePosition: { x: 200, y: 500 },
		},
	],
};

async function seedDatabase() {
	try {
		// Connect to MongoDB
		const mongoUri =
			process.env.MONGO_URI ||
			process.env.MONGODB_URI ||
			"mongodb://localhost:27017/industrial-marketplace";
		await mongoose.connect(mongoUri);
		console.log("✅ Connected to MongoDB");

		// Check if data already exists
		const existingBrands = await Brand.countDocuments();
		if (existingBrands > 0) {
			console.log(`⚠️  Database already contains ${existingBrands} brands. Skipping seed.`);
			console.log("💡 To reseed, run: db.brands.deleteMany({}); db.models.deleteMany({})");
			await mongoose.connection.close();
			return;
		}

		// Insert brands
		console.log("📝 Seeding brands...");
		const createdBrands = await Brand.insertMany(seedData.brands);
		console.log(`✅ Created ${createdBrands.length} brands`);

		// Create a map of slug to brand ID
		const brandMap = {};
		createdBrands.forEach((brand) => {
			brandMap[brand.slug] = brand._id;
		});

		// Insert models with correct brand references
		console.log("📝 Seeding models...");
		const modelsWithBrandIds = seedData.models.map((model) => ({
			...model,
			brandId: brandMap[model.brandSlug],
		}));

		// Remove the temporary brandSlug field
		modelsWithBrandIds.forEach((model) => {
			delete model.brandSlug;
		});

		const createdModels = await Model.insertMany(modelsWithBrandIds);
		console.log(`✅ Created ${createdModels.length} models`);

		// Print summary
		console.log("\n📊 Seed Summary:");
		console.log("─".repeat(40));
		seedData.brands.forEach((brand) => {
			const modelCount = seedData.models.filter((m) => m.brandSlug === brand.slug).length;
			console.log(`  ${brand.name}: ${modelCount} models`);
		});
		console.log("─".repeat(40));
		console.log(`Total: ${createdBrands.length} brands, ${createdModels.length} models`);

		console.log("\n✨ Seed completed successfully!");
		console.log("🚀 You can now:");
		console.log("   1. Start your server and test the API");
		console.log("   2. Log in to admin dashboard and view Brands/Models modules");
		console.log("   3. Try the brand/model selector on the homepage");

		await mongoose.connection.close();
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
}

// Run seed
seedDatabase();
