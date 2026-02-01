import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import sharp from "sharp";

const CONFIG_PATH = path.resolve(process.cwd(), "image.config.json");

const loadConfig = async () => {
  const raw = await fs.readFile(CONFIG_PATH, "utf8");
  return JSON.parse(raw);
};

const uniqueSorted = (values) => {
  return Array.from(new Set(values)).filter(Boolean).sort((a, b) => a - b);
};

const calculateWidths = (sourceWidth, config) => {
  const widths = Array.isArray(config.widths) ? config.widths : [];
  const avoidUpscale = config.avoidUpscale !== false;
  const skipIfSmallerThan = Number.isFinite(config.skipIfSmallerThan)
    ? config.skipIfSmallerThan
    : 0;

  if (sourceWidth < skipIfSmallerThan) {
    return [sourceWidth];
  }

  if (!widths.length) {
    return [sourceWidth];
  }

  if (avoidUpscale) {
    const filtered = widths.filter((w) => w <= sourceWidth);
    return uniqueSorted(filtered.length ? filtered : [sourceWidth]);
  }

  return uniqueSorted(widths);
};

const normalizeFormats = (inputExt, config, hasAlpha) => {
  const formats = Array.isArray(config.formats) ? config.formats : [];
  const input = inputExt.toLowerCase();
  const keepOriginal = Boolean(config.keepOriginal);

  if (input === ".png") {
    const filtered = formats.filter((fmt) => fmt !== "jpg");
    if (keepOriginal && !filtered.includes("png")) {
      filtered.push("png");
    }
    return uniqueSorted(filtered.map((fmt) => fmt.toLowerCase()));
  }

  const normalized = formats.map((fmt) => fmt.toLowerCase());
  if (hasAlpha) {
    return normalized.filter((fmt) => fmt !== "jpg");
  }
  return uniqueSorted(normalized);
};

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const buildOutputPath = (outputDir, relativePath, width, format) => {
  const dirName = path.dirname(relativePath);
  const baseName = path.basename(relativePath, path.extname(relativePath));
  const outputDirPath = dirName === "." ? outputDir : path.join(outputDir, dirName);
  const outputFile = `${baseName}-${width}.${format}`;
  return {
    outputDirPath,
    outputFilePath: path.join(outputDirPath, outputFile),
  };
};

const buildImage = async (inputPath, outputPath, width, format, config) => {
  const pipeline = sharp(inputPath, { failOnError: false }).resize({
    width,
    withoutEnlargement: config.avoidUpscale !== false,
  });

  if (config.keepMetadata) {
    pipeline.withMetadata();
  }

  switch (format) {
    case "jpg":
    case "jpeg":
      pipeline.jpeg({
        quality: config.quality?.jpg ?? 82,
        mozjpeg: true,
      });
      break;
    case "webp":
      pipeline.webp({
        quality: config.quality?.webp ?? 80,
      });
      break;
    case "avif":
      pipeline.avif({
        quality: config.quality?.avif ?? 50,
      });
      break;
    case "png":
      pipeline.png({
        compressionLevel: config.png?.compressionLevel ?? 9,
        adaptiveFiltering: config.png?.adaptiveFiltering ?? true,
      });
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  await pipeline.toFile(outputPath);
};

const run = async () => {
  let config;
  try {
    config = await loadConfig();
  } catch (error) {
    console.error(`Cannot read config at ${CONFIG_PATH}.`);
    console.error(error.message);
    process.exit(1);
  }

  const inputDir = path.resolve(process.cwd(), config.inputDir);
  const outputDir = path.resolve(process.cwd(), config.outputDir);

  await ensureDir(outputDir);

  const patterns = ["**/*.jpg", "**/*.jpeg", "**/*.png"];
  let files = [];
  try {
    files = await fg(patterns, {
      cwd: inputDir,
      onlyFiles: true,
      caseSensitiveMatch: false,
    });
  } catch (error) {
    console.error(`Error scanning directory ${inputDir}.`);
    console.error(error.message);
    process.exit(1);
  }

  if (!files.length) {
    console.log(`No input images found in ${inputDir}.`);
  }

  let outputCount = 0;
  let errorCount = 0;

  for (const relativePath of files) {
    const inputPath = path.join(inputDir, relativePath);
    try {
      const meta = await sharp(inputPath, { failOnError: false }).metadata();
      if (!meta.width) {
        throw new Error("Missing image width metadata.");
      }

      const hasAlpha = Boolean(meta.hasAlpha);
      const widths = calculateWidths(meta.width, config);
      const formats = normalizeFormats(path.extname(relativePath), config, hasAlpha);

      for (const width of widths) {
        for (const format of formats) {
          if (format === "jpg" && hasAlpha) {
            continue;
          }

          const { outputDirPath, outputFilePath } = buildOutputPath(
            outputDir,
            relativePath,
            width,
            format,
          );
          await ensureDir(outputDirPath);
          await buildImage(inputPath, outputFilePath, width, format, config);
          outputCount += 1;
        }
      }
    } catch (error) {
      errorCount += 1;
      console.error(`Error processing ${relativePath}.`);
      console.error(error.message);
    }
  }

  console.log(
    `Processed ${files.length} file(s). Generated ${outputCount} output(s). Errors: ${errorCount}.`,
  );
};

run();
