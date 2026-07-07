const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

const newAudiModels = [
	{ model: "50", startYear: 1974, endYear: 1978, type: "Hatchback" },
	{ model: "80", startYear: 1972, endYear: 1978, type: "Saloon" },
	{ model: "80", startYear: 1978, endYear: 1986, type: "Saloon; Avant" },
	{ model: "80", startYear: 1986, endYear: 1991, type: "Saloon" },
	{ model: "80", startYear: 1991, endYear: 1996, type: "Saloon; Avant; Cabriolet" },
	{ model: "90", startYear: 1984, endYear: 1987, type: "Saloon" },
	{ model: "90", startYear: 1987, endYear: 1991, type: "Saloon" },
	{ model: "100", startYear: 1968, endYear: 1976, type: "Saloon" },
	{ model: "100", startYear: 1976, endYear: 1982, type: "Saloon; Avant" },
	{ model: "100", startYear: 1982, endYear: 1991, type: "Saloon; Avant" },
	{ model: "100", startYear: 1991, endYear: 1994, type: "Saloon; Avant" },
	{ model: "A1", startYear: 2010, endYear: 2018, type: "Hatchback; Sportback" },
	{ model: "A1", startYear: 2018, endYear: "Present", type: "Sportback" },
	{ model: "A2", startYear: 2000, endYear: 2005, type: "MPV" },
	{ model: "A3", startYear: 1996, endYear: 2003, type: "Hatchback" },
	{ model: "A3", startYear: 2003, endYear: 2013, type: "Hatchback; Sportback; Cabriolet" },
	{ model: "A3", startYear: 2013, endYear: 2020, type: "Hatchback; Saloon; Cabriolet" },
	{ model: "A3", startYear: 2020, endYear: "Present", type: "Sportback; Saloon" },
	{ model: "A4", startYear: 1995, endYear: 2001, type: "Saloon; Avant" },
	{ model: "A4", startYear: 2001, endYear: 2005, type: "Saloon; Avant; Cabriolet" },
	{ model: "A4", startYear: 2005, endYear: 2008, type: "Saloon; Avant; Cabriolet" },
	{ model: "A4", startYear: 2008, endYear: 2015, type: "Saloon; Avant; Allroad" },
	{ model: "A4", startYear: 2015, endYear: 2024, type: "Saloon; Avant; Allroad" },
	{ model: "A5", startYear: 2007, endYear: 2016, type: "Coupe; Cabriolet; Sportback" },
	{ model: "A5", startYear: 2016, endYear: 2024, type: "Coupe; Cabriolet; Sportback" },
	{ model: "A5", startYear: 2024, endYear: "Present", type: "Sportback; Avant" },
	{ model: "A6", startYear: 1994, endYear: 1997, type: "Saloon; Avant" },
	{ model: "A6", startYear: 1997, endYear: 2004, type: "Saloon; Avant; Allroad" },
	{ model: "A6", startYear: 2004, endYear: 2011, type: "Saloon; Avant" },
	{ model: "A6", startYear: 2011, endYear: 2018, type: "Saloon; Avant; Allroad" },
	{ model: "A6", startYear: 2018, endYear: "Present", type: "Saloon; Avant; Allroad" },
	{ model: "A7", startYear: 2010, endYear: 2018, type: "Sportback" },
	{ model: "A7", startYear: 2018, endYear: "Present", type: "Sportback" },
	{ model: "A8", startYear: 1994, endYear: 2002, type: "Saloon" },
	{ model: "A8", startYear: 2002, endYear: 2010, type: "Saloon" },
	{ model: "A8", startYear: 2010, endYear: 2017, type: "Saloon" },
	{ model: "A8", startYear: 2017, endYear: "Present", type: "Saloon" },
	{ model: "Q2", startYear: 2016, endYear: "Present", type: "SUV" },
	{ model: "Q3", startYear: 2011, endYear: 2018, type: "SUV" },
	{ model: "Q3", startYear: 2018, endYear: "Present", type: "SUV; Sportback" },
	{ model: "Q5", startYear: 2008, endYear: 2017, type: "SUV" },
	{ model: "Q5", startYear: 2017, endYear: "Present", type: "SUV; Sportback" },
	{ model: "Q7", startYear: 2006, endYear: 2015, type: "SUV" },
	{ model: "Q7", startYear: 2015, endYear: "Present", type: "SUV" },
	{ model: "Q8", startYear: 2018, endYear: "Present", type: "SUV" },
	{ model: "TT", startYear: 1998, endYear: 2006, type: "Coupe; Roadster" },
	{ model: "TT", startYear: 2006, endYear: 2014, type: "Coupe; Roadster" },
	{ model: "TT", startYear: 2014, endYear: 2023, type: "Coupe; Roadster" },
	{ model: "R8", startYear: 2007, endYear: 2015, type: "Coupe; Spyder" },
	{ model: "R8", startYear: 2015, endYear: 2024, type: "Coupe; Spyder" },
	{ model: "Allroad", startYear: 2000, endYear: "Present", type: "Estate; Crossover" },
	{ model: "RS3", startYear: 2011, endYear: "Present", type: "Hatchback; Saloon" },
	{ model: "RS4", startYear: 2000, endYear: "Present", type: "Saloon; Avant" },
	{ model: "RS5", startYear: 2010, endYear: "Present", type: "Coupe; Sportback" },
	{ model: "RS6", startYear: 2002, endYear: "Present", type: "Saloon; Avant" },
	{ model: "RSQ3", startYear: 2013, endYear: "Present", type: "SUV; Sportback" },
	{ model: "RSQ8", startYear: 2020, endYear: "Present", type: "SUV" },
	{ model: "S1", startYear: 2014, endYear: 2018, type: "Hatchback; Sportback" },
	{ model: "S3", startYear: 1999, endYear: "Present", type: "Hatchback; Saloon; Cabriolet" },
	{ model: "S4", startYear: 1997, endYear: "Present", type: "Saloon; Avant; Cabriolet" },
	{ model: "S5", startYear: 2007, endYear: "Present", type: "Coupe; Sportback; Cabriolet" },
	{ model: "SQ2", startYear: 2019, endYear: "Present", type: "SUV" },
	{ model: "SQ5", startYear: 2013, endYear: "Present", type: "SUV" },
	{ model: "SQ7", startYear: 2016, endYear: "Present", type: "SUV" },
	{ model: "SQ8", startYear: 2019, endYear: "Present", type: "SUV" },
	{ model: "TTRS", startYear: 2009, endYear: "Present", type: "Coupe; Roadster" },
	{ model: "TTS", startYear: 2008, endYear: "Present", type: "Coupe; Roadster" },
];

async function update() {
	try {
		await connectDB();
		const brand = await Brand.findOne({ slug: "audi" });
		if (!brand) {
			console.error("❌ Brand 'audi' not found in database.");
			process.exit(1);
		}
		console.log(`Found Audi brand with ID: ${brand._id}`);

		// Delete old models
		const deleteResult = await Model.deleteMany({ brandId: brand._id });
		console.log(`🗑️ Deleted ${deleteResult.deletedCount} old Audi models.`);

		// Prepare new models
		const modelsToInsert = newAudiModels.map((m) => {
			const name = m.model;
			const yearStr = m.startYear === m.endYear ? m.startYear.toString() : (m.endYear === "Present" ? `${m.startYear} - Present` : `${m.startYear} - ${m.endYear}`);
			const slug = `audi-${m.model}-${m.startYear}-${m.endYear}-${m.type}`
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");

			// Determine sprite position using matching data
			const modelNameLower = name.toLowerCase();
			let spriteFields = {};

			const audiModelData = [
				{ name: "a1", x: -1485, y: -760 },
				{ name: "a2", x: -3105, y: -2280 },
				{ name: "a3", x: -1620, y: -2736 },
				{ name: "a4", x: -945, y: -1672 },
				{ name: "a5", x: -945, y: -532 },
				{ name: "a6", x: -1215, y: -1444 },
				{ name: "a7", x: -810, y: -2888 },
				{ name: "a8", x: -2835, y: -2356 },
				{ name: "allroad", x: -2295, y: -2128 },
				{ name: "q2", x: -270, y: -760 },
				{ name: "q3", x: -1755, y: -2280 },
				{ name: "q5", x: -2430, y: -2736 },
				{ name: "q7", x: -2025, y: -2508 },
				{ name: "q8", x: -3105, y: -2356 },
				{ name: "r8", x: -2835, y: -2812 },
				{ name: "rs3", x: -3105, y: -2128 },
				{ name: "rs4", x: -3105, y: -1976 },
				{ name: "rs5", x: -3105, y: -1900 },
				{ name: "rs6", x: -3105, y: -1824 },
				{ name: "rsq3", x: -3105, y: -1748 },
				{ name: "rsq8", x: -3105, y: -1672 },
				{ name: "s1", x: -3105, y: -1596 },
				{ name: "s3", x: -2970, y: -2964 },
				{ name: "s4", x: -3105, y: 0 },
				{ name: "s5", x: -3105, y: -76 },
				{ name: "sq2", x: -3105, y: -152 },
				{ name: "sq5", x: -3105, y: -228 },
				{ name: "sq7", x: -3105, y: -304 },
				{ name: "sq8", x: -3105, y: -380 },
				{ name: "tt", x: -1215, y: -1748 },
				{ name: "ttrs", x: -270, y: -532 },
				{ name: "tts", x: -3105, y: -456 }
			];

			const match = audiModelData.find(d => {
				const spriteName = d.name.toLowerCase();
				return modelNameLower === spriteName || 
					modelNameLower.startsWith(spriteName + " ") ||
					modelNameLower.startsWith(spriteName + "-") ||
					(spriteName.length > 1 && modelNameLower.startsWith(spriteName));
			});

			if (match) {
				spriteFields = {
					spriteClass: `bg-${match.name}`,
					spriteSheetUrl: "/images/car_sprites.png",
					spritePosition: { x: match.x, y: match.y },
					spriteSize: { width: 135, height: 76 }
				};
			}

			return {
				brandId: brand._id,
				name,
				year: yearStr,
				type: m.type,
				slug,
				...spriteFields,
				isActive: true,
			};
		});

		// Insert new models
		const insertResult = await Model.insertMany(modelsToInsert);
		console.log(`✅ Successfully added ${insertResult.length} new Audi models.`);

		process.exit(0);
	} catch (error) {
		console.error("❌ Update failed:", error);
		process.exit(1);
	}
}

update();
