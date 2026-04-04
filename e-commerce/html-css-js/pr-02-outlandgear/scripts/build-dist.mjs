import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import postcssImport from "postcss-import";
import cssnano from "cssnano";
import * as esbuild from "esbuild";
import { buildImages } from "./optimize-images.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const DIST_CSS = path.join(DIST, "css");
const DIST_JS = path.join(DIST, "js");
const DIST_IMG = path.join(DIST, "assets", "img");
const HTML_ENTRY_GLOB = /\.html$/i;
const STATIC_DIRS = ["assets", "data"];
const STATIC_FILES = ["robots.txt", "sitemap.xml"];
const PARTIALS = {
  header: {
    path: "partials/header.html",
    tag: "header",
  },
  footer: {
    path: "partials/footer.html",
    tag: "footer",
  },
};

const command = process.argv[2] || "build";

const ensureDir = async (targetPath) => {
  await fs.mkdir(targetPath, { recursive: true });
};

const emptyDir = async (targetPath) => {
  await fs.rm(targetPath, { recursive: true, force: true });
  await ensureDir(targetPath);
};

const readText = async (relativePath) => fs.readFile(path.join(ROOT, relativePath), "utf8");

const writeText = async (relativePath, content) => {
  const fullPath = path.join(ROOT, relativePath);
  await ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, content, "utf8");
};

const shouldCopyAssetPath = (sourcePath) => {
  const relativePath = path.relative(ROOT, sourcePath);
  const normalizedPath = relativePath.split(path.sep).join("/");

  if (!normalizedPath || normalizedPath.startsWith("..")) return false;
  if (normalizedPath === "assets/img" || normalizedPath.startsWith("assets/img/")) return false;
  if (normalizedPath === "assets/img-src" || normalizedPath.startsWith("assets/img-src/")) return false;
  if (path.basename(sourcePath).startsWith(".")) return false;

  return true;
};

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const inlinePartial = (html, { tag, partialPath, partialContent }) => {
  const partialPattern = new RegExp(
    `<${tag}([^>]*?)\\sdata-partial-src=["']${escapeForRegExp(partialPath)}["']([^>]*)>[\\s\\S]*?<\\/${tag}>`,
    "i"
  );

  const match = html.match(partialPattern);
  if (!match) {
    throw new Error(`Missing ${tag} partial host for ${partialPath}`);
  }

  const attrs = `${match[1]}${match[2]}`.replace(/\s+/g, " ").trim();
  const openingTag = attrs ? `<${tag} ${attrs}>` : `<${tag}>`;
  return html.replace(partialPattern, `${openingTag}\n${partialContent.trim()}\n</${tag}>`);
};

const transformHtmlForDist = async (fileName) => {
  let html = await readText(fileName);
  const headerPartial = await readText(PARTIALS.header.path);
  const footerPartial = await readText(PARTIALS.footer.path);

  html = inlinePartial(html, {
    tag: PARTIALS.header.tag,
    partialPath: PARTIALS.header.path,
    partialContent: headerPartial,
  });

  html = inlinePartial(html, {
    tag: PARTIALS.footer.tag,
    partialPath: PARTIALS.footer.path,
    partialContent: footerPartial,
  });

  html = html
    .replace(/href="css\/main\.css(?:\?[^"]*)?"/g, 'href="css/main.min.css"')
    .replace(/src="js\/app\.js(?:\?[^"]*)?"/g, 'src="js/app.min.js"');

  await writeText(path.join("dist", fileName), html);
};

const buildCss = async () => {
  const cssSourcePath = path.join(ROOT, "css/main.css");
  const cssSource = await fs.readFile(cssSourcePath, "utf8");
  const result = await postcss([postcssImport(), cssnano()]).process(cssSource, {
    from: cssSourcePath,
    to: path.join(DIST_CSS, "main.min.css"),
  });

  await ensureDir(DIST_CSS);
  await fs.writeFile(path.join(DIST_CSS, "main.min.css"), result.css, "utf8");
};

const buildJs = async () => {
  await ensureDir(DIST_JS);
  await esbuild.build({
    entryPoints: [path.join(ROOT, "js/app.js")],
    outfile: path.join(DIST_JS, "app.min.js"),
    bundle: true,
    minify: true,
    format: "esm",
    target: ["es2020"],
  });
};

const buildImagesForDist = async ({ clean = false } = {}) => {
  await buildImages({
    outputDir: DIST_IMG,
    clean,
  });
};

const copyStaticAssets = async () => {
  await Promise.all(
    STATIC_DIRS.map(async (dirName) => {
      await fs.cp(path.join(ROOT, dirName), path.join(DIST, dirName), {
        recursive: true,
        filter: shouldCopyAssetPath,
      });
    })
  );

  await Promise.all(
    STATIC_FILES.map(async (fileName) => {
      await fs.copyFile(path.join(ROOT, fileName), path.join(DIST, fileName));
    })
  );
};

const buildHtml = async () => {
  const rootEntries = await fs.readdir(ROOT, { withFileTypes: true });
  const htmlFiles = rootEntries
    .filter((entry) => entry.isFile() && HTML_ENTRY_GLOB.test(entry.name))
    .map((entry) => entry.name);

  await Promise.all(htmlFiles.map((fileName) => transformHtmlForDist(fileName)));
};

const prepareDist = async () => {
  await ensureDir(DIST);
  await ensureDir(DIST_CSS);
  await ensureDir(DIST_JS);
  await ensureDir(DIST_IMG);
};

const buildDist = async () => {
  await emptyDir(DIST);
  await prepareDist();
  await Promise.all([buildCss(), buildJs(), copyStaticAssets(), buildHtml()]);
  await buildImagesForDist();
};

switch (command) {
  case "clean":
    await fs.rm(DIST, { recursive: true, force: true });
    break;
  case "prepare":
    await prepareDist();
    break;
  case "css":
    await prepareDist();
    await buildCss();
    break;
  case "js":
    await prepareDist();
    await buildJs();
    break;
  case "html":
    await prepareDist();
    await buildHtml();
    break;
  case "assets":
    await prepareDist();
    await copyStaticAssets();
    break;
  case "images":
    await prepareDist();
    await buildImagesForDist({ clean: true });
    break;
  case "build":
    await buildDist();
    break;
  default:
    throw new Error(`Unknown build-dist command: ${command}`);
}
