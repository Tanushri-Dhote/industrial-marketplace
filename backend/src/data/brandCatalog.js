const engineImages = [
	"https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=900&q=80",
	"https://images.unsplash.com/photo-1549399613-4a1f93a5345e?auto=format&fit=crop&w=900&q=80",
	"https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=80",
];

const brandDefinitions = [
	{ name: "Alfa Romeo", slug: "alfa-romeo", productMake: "Alfa Romeo" },
	{ name: "Audi", slug: "audi", productMake: "Audi" },
	{ name: "BMW", slug: "bmw", productMake: "BMW" },
	{ name: "Citroen", slug: "citroen", productMake: "Citroen" },
	{ name: "Fiat", slug: "fiat", productMake: "Fiat" },
	{ name: "Ford", slug: "ford", productMake: "Ford" },
	{ name: "Honda", slug: "honda", productMake: "Honda" },
	{ name: "Hyundai", slug: "hyundai", productMake: "Hyundai" },
	{ name: "Isuzu", slug: "isuzu", productMake: "Isuzu" },
	{ name: "Iveco", slug: "iveco", productMake: "Iveco" },
	{ name: "Jaguar", slug: "jaguar", productMake: "Jaguar" },
	{ name: "Kia", slug: "kia", productMake: "Kia" },
	{ name: "Land Rover", slug: "land-rover", productMake: "Land Rover" },
	{ name: "Lexus", slug: "lexus", productMake: "Lexus" },
	{ name: "Mazda", slug: "mazda", productMake: "Mazda" },
	{ name: "Mercedes-Benz", slug: "mercedes-benz", productMake: "Mercedes" },
	{ name: "MINI", slug: "mini", productMake: "MINI" },
	{ name: "Mitsubishi", slug: "mitsubishi", productMake: "Mitsubishi" },
	{ name: "Nissan", slug: "nissan", productMake: "Nissan" },
	{ name: "Peugeot", slug: "peugeot", productMake: "Peugeot" },
	{ name: "Porsche", slug: "porsche", productMake: "Porsche" },
	{ name: "Range Rover", slug: "range-rover", productMake: "Land Rover", logoSlug: "land-rover" },
	{ name: "Renault", slug: "renault", productMake: "Renault" },
	{ name: "Seat", slug: "seat", productMake: "Seat" },
	{ name: "Skoda", slug: "skoda", productMake: "Skoda" },
	{ name: "Subaru", slug: "subaru", productMake: "Subaru" },
	{ name: "Suzuki", slug: "suzuki", productMake: "Suzuki" },
	{ name: "Toyota", slug: "toyota", productMake: "Toyota" },
	{ name: "Vauxhall", slug: "vauxhall", productMake: "Vauxhall" },
	{ name: "Volvo", slug: "volvo", productMake: "Volvo" },
	{ name: "Volkswagen", slug: "volkswagen", productMake: "VW" },
];

const buildLogoUrl = (slug) =>
	`https://cdn.jsdelivr.net/gh/filippofilip95/car-logos-dataset@master/logos/optimized/${slug}.png`;

const buildFeaturedCars = (brand) => {
	const carLabels = ["City", "Touring", "SUV"];

	return carLabels.map((label, index) => ({
		name: `${brand.name} ${label}`,
		trim: index === 0 ? "Best Seller" : "Popular Model",
		imageUrl: `https://placehold.co/720x420/f8fafc/0f172a?text=${encodeURIComponent(`${brand.name} ${label}`)}`,
	}));
};

const buildBrandDocs = () =>
	brandDefinitions.map((brand) => ({
		name: brand.name,
		slug: brand.slug,
		productMake: brand.productMake,
		logoUrl: buildLogoUrl(brand.logoSlug || brand.slug),
		description: `Explore ${brand.name} cars, popular engines, and live price comparisons powered by our latest listings.`,
		heroImage: `https://placehold.co/1200x600/f8fafc/0f172a?text=${encodeURIComponent(brand.name)}`,
		featuredCars: buildFeaturedCars(brand),
	}));

const buildBrandProducts = ({ categoryId, websiteId }) => {
	const templates = [
		{
			slug: "turbo-diesel",
			engineType: "Diesel",
			model: "Touring",
			year: 2020,
			price: 1995,
			nickname: "2.0 Turbo Diesel",
			condition: "Reconditioned",
			description: "Popular diesel setup with strong economy and daily-drive reliability.",
		},
		{
			slug: "petrol-sport",
			engineType: "Petrol",
			model: "City",
			year: 2021,
			price: 2245,
			nickname: "1.5 Petrol Sport",
			condition: "Used",
			description: "Refined petrol option suited to mixed urban and motorway use.",
		},
		{
			slug: "hybrid-performance",
			engineType: "Hybrid",
			model: "SUV",
			year: 2022,
			price: 2895,
			nickname: "Hybrid Performance",
			condition: "New",
			description:
				"Latest-generation hybrid package with a strong balance of power and efficiency.",
		},
	];

	return brandDefinitions.flatMap((brand, brandIndex) =>
		templates.map((template, templateIndex) => ({
			name: `${brand.name} ${template.nickname} Engine`,
			slug: `${brand.slug}-${template.slug}`,
			description: `${brand.name} ${template.nickname.toLowerCase()} package for ${template.model.toLowerCase()} and similar models.`,
			supplierNotes: `Dummy listing for ${brand.name} customers. Includes inspection, warranty and fitting options on request.`,
			price: template.price + brandIndex * 35 + templateIndex * 85,
			condition: template.condition,
			make: brand.productMake,
			model: template.model,
			year: template.year,
			engineType: template.engineType,
			category: categoryId,
			website_id: websiteId,
			images: [engineImages[templateIndex % engineImages.length]],
			seller: {
				name: `${brand.name} Engine Centre`,
				rating: "4.8",
				icon: "https://example.com/seller-icon.png",
			},
			shipping: {
				location: "United Kingdom",
				delivery: "2-3 Working Days",
				returns: "30 Days Returns",
			},
			pricingBreakdown: {
				item: template.price + brandIndex * 35 + templateIndex * 85,
				delivery: 50,
				vatRate: 0.2,
			},
			specifications: {
				Fuel: template.engineType,
				"Engine Size":
					template.templateSize ||
					(templateIndex === 0 ? "2.0L" : templateIndex === 1 ? "1.5L" : "Hybrid"),
				Warranty: templateIndex === 0 ? "12 Months" : "6 Months",
			},
			source: "brand-seed",
		})),
	);
};

module.exports = {
	brandDefinitions,
	buildBrandDocs,
	buildBrandProducts,
};
