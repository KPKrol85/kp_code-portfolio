import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = path.resolve("assets/images");
const outputDir = path.resolve("assets/images/optimized");

if (!fs.existsSync(inputDir)) {
  console.log("No images directory found. Skipping.");
  process.exit(0);
}

fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter((file) => /\.(jpe?g|png)$/i.test(file));

await Promise.all(
  files.map(async (file) => {
    const input = path.join(inputDir, file);
    const base = path.parse(file).name;
    await sharp(input)
      .webp({ quality: 82 })
      .toFile(path.join(outputDir, `${base}.webp`));
    await sharp(input)
      .avif({ quality: 55 })
      .toFile(path.join(outputDir, `${base}.avif`));
  })
);

console.log(`Converted ${files.length} image(s).`);
