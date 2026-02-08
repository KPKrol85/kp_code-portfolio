import { promises as fs } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const outputFile = path.join(projectRoot, "js", "precache-manifest.js");
const APP_BASE_PATH = "/performance-coach";
const HTML_FILES = ["index.html", "privacy.html", "offline.html", "404.html"];
const ICON_FILES = [
  "assets/icons/icon.svg",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png"
];

const toPosixPath = (value) => value.split(path.sep).join("/");

async function fileExists(filePath) {
  try {
    await fs.access(path.join(projectRoot, filePath));
    return true;
  } catch {
    return false;
  }
}

async function collectFilesRecursively(dir, extension) {
  const absoluteDir = path.join(projectRoot, dir);
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(absoluteDir, entry.name);
      const relativePath = path.relative(projectRoot, absolutePath);

      if (entry.isDirectory()) {
        return collectFilesRecursively(relativePath, extension);
      }

      if (entry.isFile() && entry.name.endsWith(extension)) {
        const normalizedPath = toPosixPath(relativePath);
        if (normalizedPath === "js/precache-manifest.js") {
          return [];
        }

        return [normalizedPath];
      }

      return [];
    })
  );

  return files.flat();
}

const htmlFiles = (await Promise.all(HTML_FILES.map(async (file) => ((await fileExists(file)) ? file : null))))
  .filter(Boolean)
  .map(toPosixPath);

const jsFiles = await collectFilesRecursively("js", ".js");

const staticFiles = ["css/style.min.css", "manifest.webmanifest"];
const existingStaticFiles = (
  await Promise.all(staticFiles.map(async (file) => ((await fileExists(file)) ? file : null)))
)
  .filter(Boolean)
  .map(toPosixPath);

const iconFiles = (await Promise.all(ICON_FILES.map(async (file) => ((await fileExists(file)) ? file : null))))
  .filter(Boolean)
  .map(toPosixPath);

const normalizedEntries = Array.from(
  new Set([
    `${APP_BASE_PATH}/`,
    ...htmlFiles,
    ...existingStaticFiles,
    ...iconFiles,
    ...jsFiles
  ])
)
  .map((entry) => (entry.startsWith("/") ? entry : `${APP_BASE_PATH}/${entry}`))
  .sort((left, right) => left.localeCompare(right, "en"));

const manifestContent = `self.__PRECACHE_URLS = ${JSON.stringify(normalizedEntries, null, 2)};\n`;

await fs.writeFile(outputFile, manifestContent, "utf8");

console.log(`Generated ${path.relative(projectRoot, outputFile)} with ${normalizedEntries.length} entries.`);
