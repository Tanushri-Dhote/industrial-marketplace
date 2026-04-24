const mongoose = require("mongoose");
const dns = require("node:dns/promises");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Website = require("./models/Website");
const PartType = require("./models/PartType");
const Brand = require("./models/Brand");
const { buildBrandDocs, buildBrandProducts } = require("./data/brandCatalog");

dns.setServers(["1.1.1.1"]);
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const engines = [
	{
		name: "Ford Transit 2.0 EcoBlue Engine",
		make: "Ford",
		model: "Transit",
		year: 2019,
		engineType: "Diesel",
		price: 2450,
		condition: "Reconditioned",
		description: "Fully reconditioned Ford Transit 2.0 EcoBlue engine. Euro 6 compatible.",
	},
	{
		name: "VW Golf 1.6 TDI CAYC Engine",
		make: "VW",
		model: "Golf",
		year: 2014,
		engineType: "Diesel",
		price: 850,
		condition: "Used",
		description: "Tested used engine from a low mileage Golf. 3 months warranty.",
	},
	{
		name: "BMW 330i B48 2.0 Petrol Engine",
		make: "BMW",
		model: "3 Series",
		year: 2020,
		engineType: "Petrol",
		price: 3200,
		condition: "Reconditioned",
		description: "High performance B48 engine for BMW G20 models. Fully balanced.",
	},
	{
		name: "Audi A4 2.0 TFSI CNC Engine",
		make: "Audi",
		model: "A4",
		year: 2017,
		engineType: "Petrol",
		price: 2100,
		condition: "Used",
		description: "Excellent condition TFSI engine. Fits A4, A5, and Q5 models.",
	},
	{
		name: "Mercedes C220d OM651 Engine",
		make: "Mercedes",
		model: "C-Class",
		year: 2016,
		engineType: "Diesel",
		price: 1950,
		condition: "Reconditioned",
		description: "Reliable OM651 engine. Fully inspected and reconditioned with new rings.",
	},
	{
		name: "Ford Fiesta 1.0 EcoBoost Engine",
		make: "Ford",
		model: "Fiesta",
		year: 2018,
		engineType: "Petrol",
		price: 1250,
		condition: "Reconditioned",
		description: "Popular 1.0 EcoBoost engine. All common faults addressed during recon.",
	},
	{
		name: "BMW X5 30d N57 Diesel Engine",
		make: "BMW",
		model: "X5",
		year: 2015,
		engineType: "Diesel",
		price: 2800,
		condition: "Used",
		description: "Robust N57 straight-six diesel engine. 60k miles from donor vehicle.",
	},
	{
		name: "VW Transporter 2.0 BiTDI CFCA Engine",
		make: "VW",
		model: "Transporter",
		year: 2013,
		engineType: "Diesel",
		price: 3800,
		condition: "Reconditioned",
		description: "BiTDI engine with updated cylinder head to fix oil consumption issues.",
	},
	{
		name: "Honda Civic 1.6 i-DTEC Engine",
		make: "Honda",
		model: "Civic",
		year: 2018,
		engineType: "Diesel",
		price: 1500,
		condition: "Used",
		description: "Tested Honda diesel engine. Excellent fuel economy and reliability.",
	},
	{
		name: "Toyota Hilux 2.4 D-4D 2GD-FTV Engine",
		make: "Toyota",
		model: "Hilux",
		year: 2021,
		engineType: "Diesel",
		price: 4500,
		condition: "Reconditioned",
		description: "Late model Hilux engine. Like new condition, 12 months warranty.",
	},
];

const gearboxes = [
	{
		name: "VW Golf 6-Speed Manual Gearbox",
		make: "VW",
		model: "Golf",
		year: 2015,
		engineType: "Diesel",
		price: 450,
		condition: "Used",
		description: "6-speed manual gearbox for VW Golf MK7 1.6 TDI. Tested and working.",
	},
	{
		name: "BMW 8-Speed Automatic Transmission",
		make: "BMW",
		model: "5 Series",
		year: 2018,
		engineType: "Petrol",
		price: 1200,
		condition: "Reconditioned",
		description: "ZF 8HP automatic gearbox, fully reconditioned with new seals.",
	},
	{
		name: "Ford Transit 6-Speed Gearbox",
		make: "Ford",
		model: "Transit",
		year: 2017,
		engineType: "Diesel",
		price: 650,
		condition: "Used",
		description: "Manual gearbox for Ford Transit 2.0 EcoBlue. Low mileage.",
	},
];

const turbos = [
	{
		name: "Ford Transit 2.0 EcoBlue Turbocharger",
		make: "Ford",
		model: "Transit",
		year: 2020,
		engineType: "Diesel",
		price: 350,
		condition: "New",
		description: "Brand new original Garrett turbocharger for Ford Transit.",
	},
	{
		name: "VW Golf 1.6 TDI Turbocharger",
		make: "VW",
		model: "Golf",
		year: 2014,
		engineType: "Diesel",
		price: 250,
		condition: "Reconditioned",
		description: "Fully reconditioned turbo with new core and balancing.",
	},
	{
		name: "BMW 330i B48 Turbocharger",
		make: "BMW",
		model: "3 Series",
		year: 2019,
		engineType: "Petrol",
		price: 550,
		condition: "Used",
		description: "Tested used turbocharger from a low mileage BMW G20.",
	},
];

const partTypes = [
	{
		name: "Engine",
		description: "Complete car engine units",
	},
	{
		name: "Gearbox",
		description: "Manual and automatic gearboxes",
	},
	{
		name: "Turbocharger",
		description: "Turbo units for diesel and petrol engines",
	},
	{
		name: "Cylinder Head",
		description: "Engine cylinder heads and components",
	},
	{
		name: "Fuel Injector",
		description: "Fuel injection systems and injectors",
	},
	{
		name: "Alternator",
		description: "Vehicle alternators and charging systems",
	},
	{
		name: "Starter Motor",
		description: "Starter motors for engine ignition",
	},
	{
		name: "Radiator",
		description: "Cooling systems and radiators",
	},
	{
		name: "ECU",
		description: "Engine control units and electronics",
	},
	{
		name: "Clutch Kit",
		description: "Clutch plates, pressure plates, and kits",
	},
	{
		name: "Brake Disc",
		description: "Front and rear brake discs",
	},
	{
		name: "Brake Pad",
		description: "Brake pads for various models",
	},
	{
		name: "Suspension Strut",
		description: "Shock absorbers and suspension struts",
	},
	{
		name: "Control Arm",
		description: "Suspension control arms and wishbones",
	},
	{
		name: "Exhaust Muffler",
		description: "Exhaust silencers and mufflers",
	},
	{
		name: "Catalytic Converter",
		description: "Emission control catalytic converters",
	},
	{
		name: "Headlight",
		description: "Front headlight units",
	},
	{
		name: "Tail Light",
		description: "Rear tail light units",
	},
	{
		name: "Door Mirror",
		description: "Wing mirrors and mirror assemblies",
	},
	{
		name: "Window Regulator",
		description: "Electric and manual window regulators",
	},
	{
		name: "Power Steering Pump",
		description: "Hydraulic and electric steering pumps",
	},
	{
		name: "ABS Pump",
		description: "Anti-lock braking system pumps and modules",
	},
	{
		name: "Air Conditioning Compressor",
		description: "A/C compressors and pumps",
	},
];
async function seed() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB...");

		// Create or find Website
		let website = await Website.findOne({ name: "All Engine 4 You" });
		if (!website) {
			website = await Website.create({
				name: "All Engine 4 You",
			});
			console.log("Created Website:", website.name);
		} else {
			console.log("Using existing Website:", website.name);
		}

		// Create or find Category
		let category = await Category.findOne({ slug: "car-engines" });
		if (!category) {
			category = await Category.create({
				name: "Car Engines",
				slug: "car-engines",
				description: "High quality new, used and reconditioned car engines.",
			});
			console.log("Created Category:", category.name);
		} else {
			console.log("Using existing Category:", category.name);
		}

		const brandDocs = buildBrandDocs();
		for (const brand of brandDocs) {
			await Brand.findOneAndUpdate({ slug: brand.slug }, brand, { upsert: true });
		}
		console.log("Synced Brands:", brandDocs.length);

		const partTypeData = partTypes.map((pt) => ({
			...pt,
			slug: pt.name.toLowerCase().replace(/ /g, "-"),
		}));

		for (const pt of partTypeData) {
			await PartType.findOneAndUpdate({ slug: pt.slug }, pt, { upsert: true });
		}
		console.log("Synced Part Types:", partTypeData.length);

		const brandProducts = buildBrandProducts({ categoryId: category._id, websiteId: website._id });

		// Seed Products
		const productData = [
			...engines.map((engine) => ({
				...engine,
				slug: engine.name
					.toLowerCase()
					.replace(/ /g, "-")
					.replace(/[^\w-]+/g, ""),
				category: category._id,
				website_id: website._id,
				seller: {
					name: "Premium Engine Suppliers",
					rating: "4.8",
					icon: "https://example.com/seller-icon.png",
				},
				images: [
					"https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=800&q=80",
				],
				shipping: {
					location: "United Kingdom",
					delivery: "2-3 Working Days",
					returns: "30 Days Returns",
				},
				pricingBreakdown: {
					item: engine.price,
					delivery: 50,
					vatRate: 0.2,
				},
			})),
			...gearboxes.map((gb) => ({
				...gb,
				slug: gb.name
					.toLowerCase()
					.replace(/ /g, "-")
					.replace(/[^\w-]+/g, ""),
				category: category._id,
				website_id: website._id,
				seller: {
					name: "Gearbox Specialists",
					rating: "4.9",
					icon: "https://example.com/seller-icon.png",
				},
				images: [
					"https://images.unsplash.com/photo-1549399613-4a1f93a5345e?auto=format&fit=crop&w=800&q=80",
				],
				shipping: {
					location: "United Kingdom",
					delivery: "3-5 Working Days",
					returns: "14 Days Returns",
				},
				pricingBreakdown: {
					item: gb.price,
					delivery: 65,
					vatRate: 0.2,
				},
			})),
			...turbos.map((turbo) => ({
				...turbo,
				slug: turbo.name
					.toLowerCase()
					.replace(/ /g, "-")
					.replace(/[^\w-]+/g, ""),
				category: category._id,
				website_id: website._id,
				seller: {
					name: "Turbo Direct",
					rating: "4.7",
					icon: "https://example.com/seller-icon.png",
				},
				images: [
					"https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80",
				],
				shipping: {
					location: "United Kingdom",
					delivery: "1-2 Working Days",
					returns: "30 Days Returns",
				},
				pricingBreakdown: {
					item: turbo.price,
					delivery: 15,
					vatRate: 0.2,
				},
			})),
			...brandProducts,
		];

		for (const product of productData) {
			await Product.findOneAndUpdate({ slug: product.slug }, product, { upsert: true });
		}
		console.log(`Successfully synced ${productData.length} products!`);

		await mongoose.disconnect();
		process.exit(0);
	} catch (error) {
		console.error("Seeding failed:", error);
		process.exit(1);
	}
}

seed();
