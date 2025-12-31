import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import minimist from "minimist";
import chalk from "chalk";
import sharp from "sharp";

const DEFAULTS = {
  qualityJpg: 80,
  qualityWebp: 80,
  qualityAvif: 50,
  effortAvif: 6,
  mode: "inplace",
  only: "all",
};

const argv = minimist(process.argv.slice(2), {
  string: [
    "quality-jpg",
    "quality-webp",
    "quality-avif",
    "effort-avif",
    "mode",
    "out",
    "only",
    "glob",
  ],
  boolean: ["dry-run"],
  default: {
    "quality-jpg": DEFAULTS.qualityJpg,
    "quality-webp": DEFAULTS.qualityWebp,
    "quality-avif": DEFAULTS.qualityAvif,
    "effort-avif": DEFAULTS.effortAvif,
    mode: DEFAULTS.mode,
    only: DEFAULTS.only,
  },
});

const toNumber = (value, label) => {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
  return num;
};

const config = {
  qualityJpg: toNumber(argv["quality-jpg"], "quality-jpg"),
  qualityWebp: toNumber(argv["quality-webp"], "quality-webp"),
  qualityAvif: toNumber(argv["quality-avif"], "quality-avif"),
  effortAvif: toNumber(argv["effort-avif"], "effort-avif"),
  mode: String(argv.mode || DEFAULTS.mode).toLowerCase(),
  out: argv.out ? String(argv.out) : null,
  dryRun: Boolean(argv["dry-run"]),
  only: String(argv.only || DEFAULTS.only).toLowerCase(),
  glob: argv.glob ? String(argv.glob) : null,
};

if (!["inplace", "output"].includes(config.mode)) {
  console.error(chalk.red(`Invalid --mode: ${config.mode}`));
  process.exit(1);
}

if (!["jpg", "all"].includes(config.only)) {
  console.error(chalk.red(`Invalid --only: ${config.only}`));
  process.exit(1);
}

if (config.mode === "output" && !config.out) {
  console.error(chalk.red("--out is required when --mode=output"));
  process.exit(1);
}

const formatBytes = (bytes) => {
  const sign = bytes < 0 ? "-" : "";
  const abs = Math.abs(bytes);
  if (abs < 1024) return `${sign}${abs} B`;
  const kb = abs / 1024;
  if (kb < 1024) return `${sign}${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${sign}${mb.toFixed(2)} MB`;
};

const formatPct = (before, after) => {
  if (before === 0) return "0%";
  const pct = ((before - after) / before) * 100;
  return `${pct.toFixed(1)}%`;
};

const replaceExt = (filePath, ext) => {
  return `${filePath.slice(0, -path.extname(filePath).length)}.${ext}`;
};

const pad = (value) => String(value).padStart(2, "0");
const now = new Date();
const backupStamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
  now.getDate()
)}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

const projectRoot = process.cwd();
const inputRoot = path.resolve(projectRoot, "assets/images/products");
const backupRoot = path.resolve(
  projectRoot,
  "tools/image-optimizer/backup",
  backupStamp
);
const outputRoot = config.mode === "output" ? path.resolve(projectRoot, config.out) : null;

const defaultGlob = "assets/images/products/**/*.{jpg,jpeg,JPG,JPEG}";
const globPattern = config.glob || defaultGlob;

const run = async () => {
  const start = Date.now();
  let warnings = 0;
  let errors = 0;
  let processed = 0;
  let totalJpgBefore = 0;
  let totalJpgAfter = 0;
  let warnedOutsideRoot = false;
  let backupReady = false;

  const files = await fg(globPattern, {
    onlyFiles: true,
    unique: true,
    absolute: true,
    cwd: projectRoot,
    dot: false,
    caseSensitiveMatch: false,
  });

  if (files.length === 0) {
    console.log(chalk.yellow(`No JPG/JPEG files found for glob: ${globPattern}`));
    return;
  }

  files.sort();

  for (const filePath of files) {
    const absPath = path.resolve(projectRoot, filePath);
    const relFromRoot = path.relative(inputRoot, absPath);
    const relPath =
      relFromRoot.startsWith("..") || path.isAbsolute(relFromRoot)
        ? path.basename(absPath)
        : relFromRoot;

    if (!warnedOutsideRoot && relPath === path.basename(absPath) && absPath !== path.join(inputRoot, relPath)) {
      warnedOutsideRoot = true;
      warnings += 1;
      console.log(
        chalk.yellow(
          "WARN: Some files are outside assets/images/products; output paths will use basenames."
        )
      );
    }

    try {
      const stat = await fs.stat(absPath);
      const originalSize = stat.size;
      totalJpgBefore += originalSize;

      const inputBuffer = await fs.readFile(absPath);
      const baseImage = sharp(inputBuffer, { failOn: "none" });

      const jpgBuffer = await baseImage
        .clone()
        .jpeg({
          quality: config.qualityJpg,
          progressive: true,
          mozjpeg: true,
        })
        .toBuffer();

      const optimizedSize = jpgBuffer.length;
      const optimizedSmaller = optimizedSize < originalSize;

      const jpgAfterSize =
        config.mode === "inplace" ? (optimizedSmaller ? optimizedSize : originalSize) : optimizedSize;
      totalJpgAfter += jpgAfterSize;

      if (config.mode === "output" && outputRoot) {
        const outputJpgPath = path.join(outputRoot, relPath);
        if (!config.dryRun) {
          await fs.mkdir(path.dirname(outputJpgPath), { recursive: true });
          await fs.writeFile(outputJpgPath, jpgBuffer);
        }
      } else if (config.mode === "inplace") {
        if (optimizedSmaller) {
          if (!config.dryRun) {
            if (!backupReady) {
              await fs.mkdir(backupRoot, { recursive: true });
              backupReady = true;
            }
            const backupPath = path.join(backupRoot, relPath);
            await fs.mkdir(path.dirname(backupPath), { recursive: true });
            await fs.copyFile(absPath, backupPath);
            await fs.writeFile(absPath, jpgBuffer);
          }
        } else {
          warnings += 1;
          console.log(
            chalk.yellow(
              `WARN: ${path.relative(projectRoot, absPath)} optimized JPG is larger; keeping original.`
            )
          );
        }
      }

      let webpInfo = "webp: skipped";
      let avifInfo = "avif: skipped";

      if (config.only === "all") {
        const webpBuffer = await baseImage.clone().webp({ quality: config.qualityWebp }).toBuffer();
        const avifBuffer = await baseImage
          .clone()
          .avif({ quality: config.qualityAvif, effort: config.effortAvif })
          .toBuffer();

        const baseCompare = optimizedSize;
        if (webpBuffer.length > baseCompare) {
          warnings += 1;
          console.log(
            chalk.yellow(
              `WARN: ${path.relative(projectRoot, absPath)} WEBP (${formatBytes(
                webpBuffer.length
              )}) larger than optimized JPG (${formatBytes(baseCompare)}).`
            )
          );
        }
        if (avifBuffer.length > baseCompare) {
          warnings += 1;
          console.log(
            chalk.yellow(
              `WARN: ${path.relative(projectRoot, absPath)} AVIF (${formatBytes(
                avifBuffer.length
              )}) larger than optimized JPG (${formatBytes(baseCompare)}).`
            )
          );
        }

        if (config.mode === "output" && outputRoot) {
          const outputBase = path.join(outputRoot, relPath);
          const outputWebpPath = replaceExt(outputBase, "webp");
          const outputAvifPath = replaceExt(outputBase, "avif");
          if (!config.dryRun) {
            await fs.mkdir(path.dirname(outputWebpPath), { recursive: true });
            await fs.writeFile(outputWebpPath, webpBuffer);
            await fs.writeFile(outputAvifPath, avifBuffer);
          }
        } else if (config.mode === "inplace") {
          const outputWebpPath = replaceExt(absPath, "webp");
          const outputAvifPath = replaceExt(absPath, "avif");
          if (!config.dryRun) {
            await fs.writeFile(outputWebpPath, webpBuffer);
            await fs.writeFile(outputAvifPath, avifBuffer);
          }
        }

        webpInfo = `webp: ${formatBytes(webpBuffer.length)}`;
        avifInfo = `avif: ${formatBytes(avifBuffer.length)}`;
      }

      processed += 1;
      const relDisplay = path.relative(projectRoot, absPath);
      const jpgMsg = `${formatBytes(originalSize)} -> ${formatBytes(jpgAfterSize)} (${formatPct(
        originalSize,
        jpgAfterSize
      )})`;
      console.log(
        `${chalk.green("OK")} ${relDisplay} | jpg: ${jpgMsg} | ${webpInfo} | ${avifInfo}`
      );
    } catch (err) {
      errors += 1;
      console.log(
        chalk.red(`ERROR: ${path.relative(projectRoot, filePath)} - ${err.message}`)
      );
    }
  }

  const durationSec = ((Date.now() - start) / 1000).toFixed(2);
  const totalDelta = totalJpgBefore - totalJpgAfter;

  console.log("");
  console.log(chalk.bold("Summary"));
  console.log(`Files processed: ${processed}/${files.length}`);
  console.log(`Total JPG before: ${formatBytes(totalJpgBefore)}`);
  console.log(`Total JPG after:  ${formatBytes(totalJpgAfter)}`);
  console.log(`Total savings:    ${formatBytes(totalDelta)}`);
  console.log(`Warnings: ${warnings}`);
  console.log(`Errors: ${errors}`);
  console.log(`Duration: ${durationSec}s`);
};

run().catch((err) => {
  console.error(chalk.red(err.message));
  process.exit(1);
});
