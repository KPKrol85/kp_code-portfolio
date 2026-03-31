import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, readdir, rm, stat, writeFile, copyFile } from "node:fs/promises";
import fg from "fast-glob";
import { build as esbuild } from "esbuild";
import { bundle as bundleCss } from "lightningcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "..");
export const DIST_DIR = path.join(ROOT_DIR, "dist");
export const DIST_CSS_FILE = path.join(DIST_DIR, "css", "main.min.css");
export const DIST_JS_FILE = path.join(DIST_DIR, "js", "main.min.js");

const CSS_ENTRY = path.join(ROOT_DIR, "css", "main.css");
const JS_ENTRY = path.join(ROOT_DIR, "js", "main.js");
const MANIFEST_PATH = path.join(ROOT_DIR, "assets", "icons", "site.webmanifest");
const SEO_DIR = path.join(ROOT_DIR, "seo");

const ROOT_HTML_GLOBS = [
  "*.html",
  "services/**/*.html",
  "projects/**/*.html"
];

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function removeDist() {
  await rm(DIST_DIR, { recursive: true, force: true });
}

export async function buildCSS() {
  await ensureDir(path.dirname(DIST_CSS_FILE));

  const { code } = bundleCss({
    filename: CSS_ENTRY,
    minify: true,
    sourceMap: false
  });

  await writeFile(DIST_CSS_FILE, code);
  return DIST_CSS_FILE;
}

export async function buildJS() {
  await ensureDir(path.dirname(DIST_JS_FILE));

  await esbuild({
    entryPoints: [JS_ENTRY],
    outfile: DIST_JS_FILE,
    bundle: true,
    format: "esm",
    minify: true,
    sourcemap: false,
    target: ["es2020"],
    logLevel: "info"
  });

  return DIST_JS_FILE;
}

export async function listPublicHtmlFiles() {
  return fg(ROOT_HTML_GLOBS, {
    cwd: ROOT_DIR,
    onlyFiles: true,
    dot: false
  });
}

export async function copyDirectory(sourceDir, targetDir) {
  await ensureDir(targetDir);
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
      continue;
    }

    await ensureDir(path.dirname(targetPath));
    await copyFile(sourcePath, targetPath);
  }
}

function rewriteHtmlAssetRefs(html) {
  return html
    .replaceAll("./css/main.css", "./css/main.min.css")
    .replaceAll("../css/main.css", "../css/main.min.css")
    .replaceAll("./js/main.js", "./js/main.min.js")
    .replaceAll("../js/main.js", "../js/main.min.js");
}

export async function writeRewrittenHtml(relativeFilePath) {
  const sourcePath = path.join(ROOT_DIR, relativeFilePath);
  const targetPath = path.join(DIST_DIR, relativeFilePath);
  const originalHtml = await readFile(sourcePath, "utf8");
  const rewrittenHtml = rewriteHtmlAssetRefs(originalHtml);

  await ensureDir(path.dirname(targetPath));
  await writeFile(targetPath, rewrittenHtml, "utf8");
}

export async function copyHtmlPages() {
  const htmlFiles = await listPublicHtmlFiles();
  await Promise.all(htmlFiles.map(writeRewrittenHtml));
}

export async function copyAssets() {
  await copyDirectory(path.join(ROOT_DIR, "assets"), path.join(DIST_DIR, "assets"));
}

export async function copySeoFiles() {
  await copyDirectory(SEO_DIR, path.join(DIST_DIR, "seo"));

  const rootRobotsPath = path.join(DIST_DIR, "robots.txt");
  const rootSitemapPath = path.join(DIST_DIR, "sitemap.xml");
  const robotsContent = "User-agent: *\nAllow: /\nSitemap: https://www.kp-code.pl/sitemap.xml\n";

  await copyFile(path.join(SEO_DIR, "sitemap.xml"), rootSitemapPath);
  await writeFile(rootRobotsPath, robotsContent, "utf8");
}

export async function fixManifestInDist() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const fixedManifest = {
    ...manifest,
    icons: (manifest.icons ?? []).map((icon) => ({
      ...icon,
      src: icon.sizes === "192x192"
        ? "/assets/icons/web-app-manifest-192x192.png"
        : icon.sizes === "512x512"
          ? "/assets/icons/web-app-manifest-512x512.png"
          : icon.src
    }))
  };

  const distManifestPath = path.join(DIST_DIR, "assets", "icons", "site.webmanifest");
  await writeFile(distManifestPath, `${JSON.stringify(fixedManifest, null, 2)}\n`, "utf8");
}

export async function assertFileExists(filePath) {
  await stat(filePath);
}
