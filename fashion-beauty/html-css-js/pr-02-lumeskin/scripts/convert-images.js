import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const srcDir = path.resolve("assets/src-images");
const outputDir = path.resolve("assets/images");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const isImage = (file) => /\.(png|jpe?g)$/i.test(file);

const convertImage = async (file) => {
  const inputPath = path.join(srcDir, file);
  const baseName = path.parse(file).name;
  const webpPath = path.join(outputDir, `${baseName}.webp`);
  const avifPath = path.join(outputDir, `${baseName}.avif`);

  await sharp(inputPath).webp({ quality: 82 }).toFile(webpPath);
  await sharp(inputPath).avif({ quality: 50 }).toFile(avifPath);
  console.log(`Converted ${file} -> ${baseName}.webp/.avif`);
};

const run = async () => {
  if (!fs.existsSync(srcDir)) {
    console.log("No source images found. Add files to assets/src-images.");
    return;
  }

  ensureDir(outputDir);
  const files = fs.readdirSync(srcDir).filter(isImage);

  if (!files.length) {
    console.log("No PNG/JPG files to convert.");
    return;
  }

  for (const file of files) {
    await convertImage(file);
  }
};

run().catch((error) => {
  console.error("Image conversion failed:", error);
  process.exit(1);
});
