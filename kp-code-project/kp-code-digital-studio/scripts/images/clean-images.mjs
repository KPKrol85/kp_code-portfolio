import fs from "node:fs/promises";
import path from "node:path";

const CONFIG_PATH = path.resolve(process.cwd(), "image.config.json");

const loadConfig = async () => {
  const raw = await fs.readFile(CONFIG_PATH, "utf8");
  return JSON.parse(raw);
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

  const outputDir = path.resolve(process.cwd(), config.outputDir);

  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  console.log(`Cleaned ${outputDir}.`);
};

run();
