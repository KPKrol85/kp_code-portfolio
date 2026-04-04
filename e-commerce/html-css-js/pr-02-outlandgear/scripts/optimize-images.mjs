#!/usr/bin/env node

import { readdir, mkdir, copyFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.join(ROOT_DIR, 'assets', 'img-src');
const OUTPUT_DIR = path.join(ROOT_DIR, 'assets', 'img');

const RASTER_INPUTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const SKIP_INPUTS = new Set(['.svg']);

const jpegOptions = {
  quality: 78,
  progressive: true,
  mozjpeg: true,
};

const pngOptions = {
  compressionLevel: 9,
  palette: true,
  quality: 82,
  effort: 8,
};

const webpOptions = {
  quality: 78,
  effort: 6,
};

const avifOptions = {
  quality: 50,
  effort: 6,
};

const log = {
  info(message) {
    console.info(`[optimize-images] ${message}`);
  },
  error(message) {
    console.error(`[optimize-images] ${message}`);
  },
};

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function listFilesRecursively(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await listFilesRecursively(fullPath)));
      continue;
    }

    if (entry.isFile()) {
      results.push(fullPath);
    }
  }

  return results;
}

async function ensureDirForFile(filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function optimizeSameFamily(image, targetPath, ext) {
  if (ext === '.jpg' || ext === '.jpeg') {
    await image.jpeg(jpegOptions).toFile(targetPath);
    return;
  }

  if (ext === '.png') {
    await image.png(pngOptions).toFile(targetPath);
    return;
  }

  if (ext === '.webp') {
    await image.webp(webpOptions).toFile(targetPath);
    return;
  }

  if (ext === '.avif') {
    await image.avif(avifOptions).toFile(targetPath);
  }
}

async function optimizeRaster(sourcePath, relativePath) {
  const ext = path.extname(sourcePath).toLowerCase();
  const outputOriginal = path.join(OUTPUT_DIR, relativePath);
  const baseOutput = outputOriginal.slice(0, -ext.length);

  await ensureDirForFile(outputOriginal);

  const image = sharp(sourcePath, { failOn: 'warning' });

  await optimizeSameFamily(image.clone(), outputOriginal, ext);

  const webpPath = `${baseOutput}.webp`;
  if (ext !== '.webp') {
    await image.clone().webp(webpOptions).toFile(webpPath);
  }

  const avifPath = `${baseOutput}.avif`;
  if (ext !== '.avif') {
    await image.clone().avif(avifOptions).toFile(avifPath);
  }

  return {
    relativePath,
    generated: [
      outputOriginal,
      ...(ext === '.webp' ? [] : [webpPath]),
      ...(ext === '.avif' ? [] : [avifPath]),
    ],
  };
}

async function main() {
  const shouldClean = process.argv.includes('--clean');

  if (!(await pathExists(SOURCE_DIR))) {
    log.error(`Source folder not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  if (shouldClean) {
    await rm(OUTPUT_DIR, { recursive: true, force: true });
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await listFilesRecursively(SOURCE_DIR);

  if (!files.length) {
    log.info('No source files found in assets/img-src/.');
    return;
  }

  let optimizedCount = 0;
  let skippedSvgCount = 0;
  let copiedCount = 0;

  for (const sourcePath of files) {
    const relativePath = path.relative(SOURCE_DIR, sourcePath);
    const ext = path.extname(sourcePath).toLowerCase();

    if (RASTER_INPUTS.has(ext)) {
      await optimizeRaster(sourcePath, relativePath);
      optimizedCount += 1;
      continue;
    }

    if (SKIP_INPUTS.has(ext)) {
      skippedSvgCount += 1;
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, relativePath);
    await ensureDirForFile(outputPath);
    await copyFile(sourcePath, outputPath);
    copiedCount += 1;
  }

  log.info(`Raster images optimized: ${optimizedCount}`);
  log.info(`Non-raster files copied as-is: ${copiedCount}`);
  log.info(`SVG files skipped: ${skippedSvgCount}`);
  log.info('Done.');
}

main().catch((error) => {
  log.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
