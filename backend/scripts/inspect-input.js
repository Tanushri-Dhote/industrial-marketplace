const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "../input.html");
const content = fs.readFileSync(htmlPath, "utf8");

const lines = content.split("\n");
console.log(`Total lines: ${lines.length}`);

let count = 0;
lines.forEach((line, idx) => {
	if (line.toLowerCase().includes("land")) {
		console.log(`${idx + 1}: ${line.trim()}`);
		count++;
	}
});

console.log(`Found ${count} lines matching 'land'.`);
