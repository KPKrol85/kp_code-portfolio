import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import postcssImport from "postcss-import";
import cssnano from "cssnano";
import * as esbuild from "esbuild";
import { buildRobotsTxt, buildSitemapXml } from "./seo-config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const DIST_CSS = path.join(DIST, "css");
const DIST_JS = path.join(DIST, "js");
const HTML_ENTRY_GLOB = /\.html$/i;
const STATIC_DIRS = ["assets", "data"];
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

const writeTextToDir = async (baseDir, relativePath, content) => {
  const fullPath = path.join(baseDir, relativePath);
  await ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, content, "utf8");
};

const shouldCopyAssetPath = (sourcePath) => {
  const relativePath = path.relative(ROOT, sourcePath);
  const normalizedPath = relativePath.split(path.sep).join("/");

  if (!normalizedPath || normalizedPath.startsWith("..")) return false;
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

const copyStaticAssets = async () => {
  await Promise.all(
    STATIC_DIRS.map(async (dirName) => {
      await fs.cp(path.join(ROOT, dirName), path.join(DIST, dirName), {
        recursive: true,
        filter: shouldCopyAssetPath,
      });
    })
  );
};

const generateSeoFiles = async (targetDir) => {
  await Promise.all([
    writeTextToDir(targetDir, "robots.txt", buildRobotsTxt()),
    writeTextToDir(targetDir, "sitemap.xml", buildSitemapXml()),
  ]);
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
};

const buildDist = async () => {
  await emptyDir(DIST);
  await prepareDist();
  await generateSeoFiles(ROOT);
  await Promise.all([buildCss(), buildJs(), copyStaticAssets(), buildHtml(), generateSeoFiles(DIST)]);
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
    await generateSeoFiles(ROOT);
    await Promise.all([copyStaticAssets(), generateSeoFiles(DIST)]);
    break;
  case "seo":
    await generateSeoFiles(ROOT);
    await generateSeoFiles(DIST);
    break;
  case "images":
    throw new Error("build-dist images command has been removed; use `npm run build:images`.");
    break;
  case "build":
    await buildDist();
    break;
  default:
    throw new Error(`Unknown build-dist command: ${command}`);
}
