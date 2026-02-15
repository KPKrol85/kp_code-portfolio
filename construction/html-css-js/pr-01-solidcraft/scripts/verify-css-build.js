const fs = require("fs");
const path = require("path");

const outputPath = path.join(process.cwd(), "css", "style.min.css");

if (!fs.existsSync(outputPath)) {
  console.error(`Missing CSS output: ${outputPath}`);
  process.exit(1);
}

const css = fs.readFileSync(outputPath, "utf8");

if (/@import\b/i.test(css)) {
  console.error("CSS build verification failed: '@import' found in css/style.min.css");
  process.exit(1);
}

console.log("CSS build verification passed.");
