const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

const newBmwModels = [
	{ model: "3/15 DA", startYear: 1929, endYear: 1932, type: "Saloon" },
	{ model: "327", startYear: 1937, endYear: 1941, type: "Coupe; Cabriolet" },
	{ model: "501", startYear: 1952, endYear: 1962, type: "Saloon" },
	{ model: "502", startYear: 1954, endYear: 1963, type: "Saloon" },
	{ model: "700", startYear: 1959, endYear: 1965, type: "Coupe; Saloon" },
	{ model: "New Class", startYear: 1962, endYear: 1977, type: "Saloon" },
	{ model: "02 Series", startYear: 1966, endYear: 1977, type: "Coupe; Saloon" },
	{ model: "5 Series", startYear: 1972, endYear: 1981, type: "Saloon" },
	{ model: "3 Series", startYear: 1975, endYear: 1983, type: "Coupe" },
	{ model: "6 Series", startYear: 1976, endYear: 1989, type: "Coupe" },
	{ model: "7 Series", startYear: 1977, endYear: 1986, type: "Saloon" },
	{ model: "5 Series", startYear: 1981, endYear: 1988, type: "Saloon" },
	{ model: "3 Series", startYear: 1982, endYear: 1994, type: "Saloon; Coupe; Convertible; Touring" },
	{ model: "7 Series", startYear: 1986, endYear: 1994, type: "Saloon" },
	{ model: "5 Series", startYear: 1988, endYear: 1996, type: "Saloon; Touring" },
	{ model: "8 Series", startYear: 1989, endYear: 1999, type: "Coupe" },
	{ model: "3 Series", startYear: 1990, endYear: 2000, type: "Saloon; Coupe; Convertible; Touring; Compact" },
	{ model: "7 Series", startYear: 1994, endYear: 2001, type: "Saloon" },
	{ model: "5 Series", startYear: 1995, endYear: 2004, type: "Saloon; Touring" },
	{ model: "Z3", startYear: 1995, endYear: 2002, type: "Roadster; Coupe" },
	{ model: "X5", startYear: 1999, endYear: 2006, type: "SUV" },
	{ model: "3 Series", startYear: 1998, endYear: 2006, type: "Saloon; Coupe; Convertible; Touring; Compact" },
	{ model: "X3", startYear: 2003, endYear: 2010, type: "SUV" },
	{ model: "1 Series", startYear: 2004, endYear: 2013, type: "Hatchback; Coupe; Convertible" },
	{ model: "5 Series", startYear: 2003, endYear: 2010, type: "Saloon; Touring" },
	{ model: "6 Series", startYear: 2003, endYear: 2010, type: "Coupe; Convertible" },
	{ model: "7 Series", startYear: 2001, endYear: 2008, type: "Saloon" },
	{ model: "Z4", startYear: 2002, endYear: 2008, type: "Roadster; Coupe" },
	{ model: "X5", startYear: 2006, endYear: 2013, type: "SUV" },
	{ model: "X6", startYear: 2008, endYear: 2014, type: "SUV Coupe" },
	{ model: "X1", startYear: 2009, endYear: 2015, type: "SUV" },
	{ model: "3 Series", startYear: 2011, endYear: 2019, type: "Saloon; Touring; GT" },
	{ model: "4 Series", startYear: 2013, endYear: 2020, type: "Coupe; Convertible; Gran Coupe" },
	{ model: "2 Series", startYear: 2014, endYear: 2021, type: "Coupe; Convertible" },
	{ model: "5 Series", startYear: 2017, endYear: "Present", type: "Saloon; Touring" },
	{ model: "7 Series", startYear: 2022, endYear: "Present", type: "Saloon" },
	{ model: "8 Series", startYear: 2018, endYear: "Present", type: "Coupe; Convertible; Gran Coupe" },
	{ model: "1 Series", startYear: 2019, endYear: "Present", type: "Hatchback" },
	{ model: "2 Series Gran Coupe", startYear: 2020, endYear: "Present", type: "Gran Coupe" },
	{ model: "2 Series Active Tourer", startYear: 2021, endYear: "Present", type: "MPV" },
	{ model: "3 Series", startYear: 2019, endYear: "Present", type: "Saloon; Touring" },
	{ model: "4 Series", startYear: 2020, endYear: "Present", type: "Coupe; Convertible; Gran Coupe" },
	{ model: "X1", startYear: 2022, endYear: "Present", type: "SUV" },
	{ model: "X2", startYear: 2024, endYear: "Present", type: "SUV Coupe" },
	{ model: "X3", startYear: 2024, endYear: "Present", type: "SUV" },
	{ model: "X4", startYear: 2018, endYear: "Present", type: "SUV Coupe" },
	{ model: "X5", startYear: 2018, endYear: "Present", type: "SUV" },
	{ model: "X6", startYear: 2019, endYear: "Present", type: "SUV Coupe" },
	{ model: "X7", startYear: 2018, endYear: "Present", type: "SUV" },
	{ model: "XM", startYear: 2022, endYear: "Present", type: "SUV" },
	{ model: "i3", startYear: 2013, endYear: 2022, type: "Hatchback" },
	{ model: "i4", startYear: 2021, endYear: "Present", type: "Gran Coupe" },
	{ model: "i5", startYear: 2023, endYear: "Present", type: "Saloon; Touring" },
	{ model: "i7", startYear: 2022, endYear: "Present", type: "Saloon" },
	{ model: "iX1", startYear: 2022, endYear: "Present", type: "SUV" },
	{ model: "iX2", startYear: 2024, endYear: "Present", type: "SUV Coupe" },
	{ model: "iX", startYear: 2021, endYear: "Present", type: "SUV" },
];

async function update() {
	try {
		await connectDB();
		const brand = await Brand.findOne({ slug: "bmw" });
		if (!brand) {
			console.error("❌ Brand 'bmw' not found in database.");
			process.exit(1);
		}
		console.log(`Found BMW brand with ID: ${brand._id}`);

		// Delete old models
		const deleteResult = await Model.deleteMany({ brandId: brand._id });
		console.log(`🗑️ Deleted ${deleteResult.deletedCount} old BMW models.`);

		// Prepare new models
		const modelsToInsert = newBmwModels.map((m) => {
			const name = m.model;
			const yearStr = m.startYear === m.endYear ? m.startYear.toString() : (m.endYear === "Present" ? `${m.startYear} - Present` : `${m.startYear} - ${m.endYear}`);
			const slug = `bmw-${m.model}-${m.startYear}-${m.endYear}-${m.type}`
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");

			// Determine sprite position
			const nameLower = name.toLowerCase();
			let spritePosition = { x: -135, y: -228 }; // Default: M-series / general saloon-coupe position
			
			if (nameLower.startsWith("x") || nameLower.startsWith("ix")) {
				spritePosition = { x: -945, y: -836 }; // SUV sprite position
			}

			return {
				brandId: brand._id,
				name,
				year: yearStr,
				type: m.type,
				slug,
				spriteClass: `bg-${slug}`,
				spriteSheetUrl: "/images/car_sprites.png",
				spritePosition,
				spriteSize: { width: 135, height: 76 },
				isActive: true,
			};
		});

		// Insert new models
		const insertResult = await Model.insertMany(modelsToInsert);
		console.log(`✅ Successfully added ${insertResult.length} new BMW models.`);

		process.exit(0);
	} catch (error) {
		console.error("❌ Update failed:", error);
		process.exit(1);
	}
}

update();
