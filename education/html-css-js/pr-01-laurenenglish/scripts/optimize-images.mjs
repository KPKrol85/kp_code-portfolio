import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import imageminAvif from "imagemin-avif";
import imageminWebp from "imagemin-webp";

import {
  CONTENT_IMAGE_ASSETS,
  MODERN_IMAGE_FORMATS,
  getModernImagePath,
} from "./image-config.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RASTER_EXTENSION = /\.(?:jpe?g|png)$/i;

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const toFilePath = (publicPath) => resolve(ROOT, `.${publicPath}`);

const createPlugin = (extension) => {
  if (extension === "avif") {
    return imageminAvif({ quality: 60, speed: 4 });
  }

  if (extension === "webp") {
    return imageminWebp({ quality: 82, method: 6, metadata: "all" });
  }

  throw new Error(`Unsupported image format: ${extension}`);
};

const optimizeAsset = async (asset) => {
  assert(
    RASTER_EXTENSION.test(asset.fallbackPath),
    `Image source must be a JPEG or PNG fallback: ${asset.fallbackPath}`,
  );

  const sourcePath = toFilePath(asset.fallbackPath);
  const source = await readFile(sourcePath);
  const sourceStats = await stat(sourcePath);
  assert(
    sourceStats.isFile(),
    `Image source is not a file: ${asset.fallbackPath}`,
  );

  const outputs = await Promise.all(
    MODERN_IMAGE_FORMATS.map(async ({ extension }) => {
      const outputPath = toFilePath(
        getModernImagePath(asset.fallbackPath, extension),
      );
      const data = await createPlugin(extension)(source);
      assert(
        Buffer.isBuffer(data) || data instanceof Uint8Array,
        `Optimizer did not return ${extension.toUpperCase()} data for ${asset.fallbackPath}`,
      );
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, data);
      return { extension, outputPath, size: data.length };
    }),
  );

  return { asset, sourceSize: source.length, outputs };
};

const run = async () => {
  const results = await Promise.all(CONTENT_IMAGE_ASSETS.map(optimizeAsset));
  for (const { asset, sourceSize, outputs } of results) {
    const details = outputs
      .map(({ extension, size }) => `${extension} ${size} B`)
      .join(", ");
    console.log(`${asset.fallbackPath} (${sourceSize} B) -> ${details}`);
  }
};

run().catch((error) => {
  console.error(`Image optimization failed: ${error.message}`);
  process.exitCode = 1;
});
