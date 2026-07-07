const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "../input.html");
const content = fs.readFileSync(htmlPath, "utf8");

const bInfo = { name: "Land Rover", index: 200282 };
const htmlSection = content.substring(bInfo.index);

const cleanBrandName = bInfo.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
const blockRegex = new RegExp(`bg-([a-zA-Z0-9-]+)[\\s\\S]*?>\\s*(?:${cleanBrandName})\\s+([A-Za-z0-9\\s-+]+?)\\s+Engines`, "gi");

const mappings = [];
const seenClasses = new Set();
let match;
while ((match = blockRegex.exec(htmlSection)) !== null) {
	const cls = `bg-${match[1].trim()}`;
	const modelName = match[2].trim().replace(/\s+/g, " ");
	if (!seenClasses.has(cls)) {
		seenClasses.add(cls);
		mappings.push({ name: modelName, cls });
	}
}

console.log(`Found ${mappings.length} model mappings for Land Rover in HTML:`);
mappings.forEach(m => console.log(`- Model: "${m.name}", Class: "${m.cls}"`));
