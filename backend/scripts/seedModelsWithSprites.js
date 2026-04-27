const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = require("../src/config/db");
const Brand = require("../src/models/Brand");
const Model = require("../src/models/Model");

const modelData = [
    { name: "m8", x: 0, y: -76, brandSlug: "bmw" },
    { name: "m6", x: -270, y: -152, brandSlug: "bmw" },
    { name: "m-series", x: -135, y: -228, brandSlug: "bmw" },
    { name: "m5", x: -540, y: -76, brandSlug: "bmw" },
    { name: "m4", x: -540, y: -152, brandSlug: "bmw" },
    { name: "m3", x: -540, y: -228, brandSlug: "bmw" },
    { name: "1 series", x: -135, y: -228, brandSlug: "bmw" }, // Fallback to m-series position if 1-series not found
    { name: "2 series", x: -135, y: -228, brandSlug: "bmw" },
    { name: "3 series", x: -135, y: -228, brandSlug: "bmw" },
    { name: "4 series", x: -135, y: -228, brandSlug: "bmw" },
    { name: "5 series", x: -135, y: -228, brandSlug: "bmw" },
    { name: "6 series", x: -135, y: -228, brandSlug: "bmw" },
    { name: "7 series", x: -135, y: -228, brandSlug: "bmw" },
    { name: "8 series", x: -135, y: -228, brandSlug: "bmw" },
    { name: "x1", x: -945, y: -836, brandSlug: "bmw" }, // Placeholder search
    { name: "x3", x: -945, y: -836, brandSlug: "bmw" },
    { name: "x5", x: -945, y: -836, brandSlug: "bmw" },
    { name: "a5", x: -945, y: -532, brandSlug: "audi" },
    { name: "q2", x: -270, y: -760, brandSlug: "audi" },
    { name: "a-class", x: -1215, y: -228, brandSlug: "mercedes-benz" },
    { name: "v-class", x: -1080, y: -76, brandSlug: "mercedes-benz" },
    { name: "golf", x: -1350, y: -152, brandSlug: "volkswagen-vw" }, // Scirocco/Golf placeholder
    { name: "tiguan", x: -945, y: -836, brandSlug: "volkswagen-vw" },
    { name: "touran", x: -540, y: -1064, brandSlug: "volkswagen-vw" },
    { name: "fiesta", x: -810, y: -988, brandSlug: "ford" },
    { name: "kuga", x: -270, y: -1292, brandSlug: "ford" },
    { name: "civic", x: -540, y: -988, brandSlug: "honda" },
    { name: "accord", x: -675, y: -228, brandSlug: "honda" },
    { name: "clio", x: -1215, y: -1064, brandSlug: "renault" },
    { name: "megane", x: -270, y: -76, brandSlug: "renault" },
    { name: "captur", x: -1350, y: -1140, brandSlug: "renault" },
    { name: "octavia", x: -540, y: -456, brandSlug: "skoda" },
    { name: "scala", x: -945, y: -152, brandSlug: "skoda" },
    { name: "kodiaq", x: -810, y: -228, brandSlug: "skoda" },
    { name: "picanto", x: -810, y: -380, brandSlug: "kia" },
    { name: "carens", x: -675, y: -988, brandSlug: "kia" },
    { name: "i20", x: -405, y: -760, brandSlug: "hyundai" },
    { name: "ioniq", x: -135, y: -1064, brandSlug: "hyundai" },
    { name: "accent", x: -945, y: -608, brandSlug: "hyundai" },
    { name: "vios", x: -1215, y: -836, brandSlug: "toyota" },
    { name: "avalon", x: -1080, y: -1140, brandSlug: "toyota" },
    { name: "premio", x: -1215, y: -1140, brandSlug: "toyota" },
    { name: "estima", x: -1350, y: -684, brandSlug: "toyota" },
    { name: "juke", x: -1080, y: -456, brandSlug: "nissan" },
    { name: "serena", x: -1350, y: -0, brandSlug: "nissan" },
    { name: "fuga", x: -1350, y: -988, brandSlug: "nissan" },
    { name: "demio", x: -0, y: -608, brandSlug: "mazda" },
    { name: "ct-200h", x: -540, y: 0, brandSlug: "lexus" },
    { name: "rx-350", x: -405, y: -152, brandSlug: "lexus" },
    { name: "nx-300", x: -270, y: -380, brandSlug: "lexus" },
    { name: "is-250", x: -405, y: -380, brandSlug: "lexus" },
    { name: "gs-300", x: -0, y: -456, brandSlug: "lexus" },
    { name: "ls", x: -405, y: -532, brandSlug: "lexus" },
    { name: "xc60", x: -810, y: -1140, brandSlug: "volvo" },
    { name: "xc90", x: -135, y: -988, brandSlug: "volvo" }
];

const SPRITE_SHEET_URL = "/images/car_sprites.png";

async function seed() {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Cache brands
        const brands = await Brand.find({});
        const brandMap = {};
        brands.forEach(b => brandMap[b.slug] = b._id);

        for (const data of modelData) {
            const brandId = brandMap[data.brandSlug];
            if (!brandId) {
                console.warn(`Brand not found for slug: ${data.brandSlug}, skipping model: ${data.name}`);
                continue;
            }

            const slug = data.name.toLowerCase().replace(/\s+/g, "-");
            const update = {
                brandId,
                name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
                slug,
                spriteClass: `bg-${slug}`,
                spriteSheetUrl: SPRITE_SHEET_URL,
                spritePosition: { x: data.x, y: data.y },
                spriteSize: { width: 135, height: 76 },
                isActive: true
            };

            await Model.findOneAndUpdate(
                { brandId, slug },
                { $set: update },
                { upsert: true, new: true }
            );
            console.log(`Upserted model: ${data.name} for brand: ${data.brandSlug}`);
        }

        console.log("Model seeding complete");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
