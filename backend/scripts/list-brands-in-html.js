const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "../input.html");
const content = fs.readFileSync(htmlPath, "utf8");

const brandRegex = /Most Popular\s+(?:<span>)?([a-zA-Z0-9\s-]+?)(?:<\/span>)?\s+Engines/gi;
let match;
while ((match = brandRegex.exec(content)) !== null) {
	console.log(`Brand found: "${match[1].trim()}" at index ${match.index}`);
}
