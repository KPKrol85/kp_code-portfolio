const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const root = process.cwd();
const srcDir = path.join(root, "js");
const outDir = path.join(srcDir, "dist");

if (!fs.existsSync(srcDir)) {
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });

const entries = fs.readdirSync(srcDir, { withFileTypes: true });
const sources = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
  .map((entry) => entry.name);

const options = {
  mangle: false,
  compress: true,
  output: {
    comments: false,
  },
};

(async () => {
  for (const fileName of sources) {
    const inputPath = path.join(srcDir, fileName);
    const outputName = fileName.replace(/\.js$/i, ".min.js");
    const outputPath = path.join(outDir, outputName);

    try {
      const code = fs.readFileSync(inputPath, "utf8");
      const result = await minify(code, options);

      if (result.code) {
        fs.writeFileSync(outputPath, result.code);
      } else {
        console.error(`[minify-js] No output for: ${fileName}`);
      }
    } catch (err) {
      console.error(`[minify-js] Failed: ${fileName}`, err);
    }
  }
})();
