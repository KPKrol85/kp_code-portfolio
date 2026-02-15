const fs = require("fs");
const path = require("path");

const outputPath = path.join(process.cwd(), "js", "script.min.js");

if (!fs.existsSync(outputPath)) {
  console.error(`Missing JS output: ${outputPath}`);
  process.exit(1);
}

const js = fs.readFileSync(outputPath, "utf8");
const hasImport = /\bimport\s+/m.test(js);
const hasExport = /\bexport\s+/m.test(js);

if (hasImport || hasExport) {
  console.error("JS build verification failed: 'import' or 'export' found in js/script.min.js");
  process.exit(1);
}

console.log("JS build verification passed.");
