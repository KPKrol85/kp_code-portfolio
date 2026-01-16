import fg from "fast-glob";
import pc from "picocolors";
import sharp from "sharp";
import { existsSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import {
  IMG_SRC_DIR,
  IMG_GEN_DIR,
  ensureDir,
  ensureGitkeep,
  looksGenerated,
  toPosix,
} from "./lib/img-utils.js";

const TARGET_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1600];
const WEBP_QUALITY = 80;
const WEBP_EFFORT = 4;
const AVIF_QUALITY = 50;
const AVIF_EFFORT = 5; // Balanced encode speed vs. compression for CI/dev machines.
const CONCURRENCY = 4;
const MANIFEST_PATH = join(IMG_GEN_DIR, "manifest.json");

const formatMs = (ms) => `${(ms / 1000).toFixed(2)}s`;

const getStat = (filePath) => statSync(filePath);

const runWithLimit = async (tasks, limit) => {
  let index = 0;
  const results = new Array(tasks.length);
  const workers = Array.from({ length: limit }, async () => {
    while (index < tasks.length) {
      const current = index;
      index += 1;
      results[current] = await tasks[current]();
    }
  });
  await Promise.all(workers);
  return results;
};

const getWidths = (sourceWidth) => {
  const widths = TARGET_WIDTHS.filter((w) => w <= sourceWidth);
  if (!widths.includes(sourceWidth)) {
    widths.push(sourceWidth);
  }
  return widths.sort((a, b) => a - b);
};

const buildOne = async (relPath, stats, manifest) => {
  const inputPath = join(IMG_SRC_DIR, relPath);
  const inputExt = extname(relPath).toLowerCase();
  const baseName = basename(relPath, inputExt);

  if (inputExt === ".webp" && looksGenerated(baseName)) {
    stats.skippedInputs += 1;
    console.log(pc.yellow(`[img] Skip generated-like source: ${relPath}`));
    return;
  }

  const metadata = await sharp(inputPath, { failOnError: false }).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Missing dimensions for ${relPath}.`);
  }

  const widths = getWidths(metadata.width);
  const relDir = dirname(relPath);
  const outputDir = join(IMG_GEN_DIR, relDir);
  ensureDir(outputDir);

  const sourceEntry = {
    w: metadata.width,
    h: metadata.height,
    bytes: getStat(inputPath).size,
  };

  const entry = {
    source: sourceEntry,
    webp: [],
    avif: [],
  };

  for (const width of widths) {
    const webpPath = join(outputDir, `${baseName}-w${width}.webp`);
    const avifPath = join(outputDir, `${baseName}-w${width}.avif`);

    const webpInfo = await renderVariant({
      inputPath,
      outputPath: webpPath,
      width,
      format: "webp",
      stats,
    });
    const avifInfo = await renderVariant({
      inputPath,
      outputPath: avifPath,
      width,
      format: "avif",
      stats,
    });

    entry.webp.push({
      w: width,
      path: toPosix(relative(IMG_GEN_DIR, webpPath)),
      bytes: webpInfo.bytes,
    });
    entry.avif.push({
      w: width,
      path: toPosix(relative(IMG_GEN_DIR, avifPath)),
      bytes: avifInfo.bytes,
    });
  }

  manifest.items[toPosix(relPath)] = entry;
  console.log(pc.green(`[img] Built ${relPath}`));
};

const renderVariant = async ({ inputPath, outputPath, width, format, stats }) => {
  const inputStat = getStat(inputPath);
  if (existsSync(outputPath)) {
    const outputStat = getStat(outputPath);
    if (outputStat.mtimeMs >= inputStat.mtimeMs) {
      stats.skipped += 1;
      return { bytes: outputStat.size, skipped: true };
    }
  }

  const pipeline = sharp(inputPath, { failOnError: false }).rotate().resize({
    width,
    withoutEnlargement: true,
  });

  if (format === "webp") {
    await pipeline.webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT }).toFile(outputPath);
  } else {
    await pipeline.avif({ quality: AVIF_QUALITY, effort: AVIF_EFFORT }).toFile(outputPath);
  }

  const outputStat = getStat(outputPath);
  stats.generated += 1;
  return { bytes: outputStat.size, skipped: false };
};

const build = async () => {
  const startedAt = Date.now();
  ensureDir(IMG_SRC_DIR);
  ensureDir(IMG_GEN_DIR);
  ensureGitkeep(IMG_GEN_DIR);

  const inputs = await fg(["**/*.{jpg,jpeg,png,webp}"], {
    cwd: IMG_SRC_DIR,
    onlyFiles: true,
    caseSensitiveMatch: false,
  });

  if (!inputs.length) {
    console.log("0 files found in assets/img/_src.");
    return;
  }

  const stats = {
    generated: 0,
    skipped: 0,
    skippedInputs: 0,
  };

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    items: {},
  };

  const tasks = inputs.map((relPath) => async () => {
    try {
      await buildOne(relPath, stats, manifest);
    } catch (error) {
      throw new Error(`[img] ${relPath}: ${error.message}`);
    }
  });

  await runWithLimit(tasks, CONCURRENCY);

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  const elapsed = formatMs(Date.now() - startedAt);
  console.log(
    pc.bold(
      `[img] Done: ${inputs.length} source(s), ${stats.generated} generated, ${stats.skipped} skipped in ${elapsed}`
    )
  );
  if (stats.skippedInputs) {
    console.log(pc.yellow(`[img] Skipped inputs: ${stats.skippedInputs}`));
  }
};

build().catch((error) => {
  console.error(pc.red(error.message));
  process.exitCode = 1;
});
