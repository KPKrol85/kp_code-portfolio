import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, "..", "..");

const IMG_SRC_DIR = resolve(PROJECT_ROOT, "assets/img/_src");
const IMG_GEN_DIR = resolve(PROJECT_ROOT, "assets/img/_gen");

const ensureDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

const ensureGitkeep = (dir) => {
  const filePath = join(dir, ".gitkeep");
  if (!existsSync(filePath)) {
    writeFileSync(filePath, "");
  }
};

const toPosix = (value) => value.split("\\").join("/");

const looksGenerated = (name) => /-w\d+$/.test(name);

export { IMG_SRC_DIR, IMG_GEN_DIR, ensureDir, ensureGitkeep, toPosix, looksGenerated };
