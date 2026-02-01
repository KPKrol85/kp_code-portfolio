import fs from "node:fs/promises";
import path from "node:path";

import * as csso from "csso";
import fg from "fast-glob";
import { minify as terserMinify } from "terser";

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist");
const SOURCE_DIRS = {
  assets: path.join(ROOT, "assets"),
  data: path.join(ROOT, "data"),
};
const ROOT_FILES = ["site.webmanifest", "robots.txt", "sitemap.xml", "_headers", "_redirects"];

const log = (message) => {
  console.log(`[build] ${message}`);
};

const formatBytes = (bytes) => {
  if (bytes === 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value < 10 && index > 0 ? 2 : 1)} ${units[index]}`;
};

const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const exists = async (targetPath) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const copyDirIfExists = async (src, dest) => {
  if (await exists(src)) {
    await fs.cp(src, dest, { recursive: true });
    return true;
  }
  return false;
};

const rewriteHtmlLinks = (html) => {
  const withCss = html.replace(/href=(["'])styles\/([^"']+?)\.css\1/g, (match, quote, file) => {
    if (file.endsWith(".min")) {
      return match;
    }
    return `href=${quote}styles/${file}.min.css${quote}`;
  });
  return withCss.replace(/src=(["'])js\/([^"']+?)\.js\1/g, (match, quote, file) => {
    if (file.endsWith(".min")) {
      return match;
    }
    return `src=${quote}js/${file}.min.js${quote}`;
  });
};

const rewriteJsImports = (code) => {
  const rewriteSpecifier = (spec) => {
    if (spec.endsWith(".min.js")) {
      return spec;
    }
    if (spec.endsWith(".js")) {
      return spec.replace(/\.js$/, ".min.js");
    }
    return spec;
  };

  const importExport = code.replace(
    /((?:import|export)\s+[^'"]*?\s+from\s+)(['"])(\.{1,2}\/[^'"]+?)\2/g,
    (match, prefix, quote, spec) => `${prefix}${quote}${rewriteSpecifier(spec)}${quote}`,
  );

  return importExport.replace(
    /(import\()\s*(['"])(\.{1,2}\/[^'"]+?)\2(\s*\))/g,
    (match, start, quote, spec, end) => `${start}${quote}${rewriteSpecifier(spec)}${quote}${end}`,
  );
};

const minifyCss = async () => {
  const files = await fg(["styles/**/*.css"], { dot: false });
  if (!files.length) {
    throw new Error("No CSS files found to minify.");
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const srcPath = path.join(ROOT, file);
    const input = await fs.readFile(srcPath, "utf8");
    const result = csso.minify(input, { filename: path.basename(file) });
    if (!result.css) {
      throw new Error(`CSS minification produced empty output for ${file}`);
    }
    const relPath = file.replace(/^styles[\\/]/, "");
    const outPath = path.join(DIST_DIR, "styles", relPath.replace(/\.css$/, ".min.css"));
    await ensureDir(path.dirname(outPath));
    await fs.writeFile(outPath, result.css, "utf8");

    totalBefore += Buffer.byteLength(input, "utf8");
    totalAfter += Buffer.byteLength(result.css, "utf8");
  }

  log(`CSS: ${files.length} files, ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)}`);
};

const minifyJs = async () => {
  const files = await fg(["js/**/*.js"], { dot: false });
  if (!files.length) {
    throw new Error("No JS files found to minify.");
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const srcPath = path.join(ROOT, file);
    const input = await fs.readFile(srcPath, "utf8");
    const rewritten = rewriteJsImports(input);
    const result = await terserMinify(rewritten, { module: true, compress: true, mangle: true });
    if (!result.code) {
      throw new Error(`JS minification produced empty output for ${file}`);
    }
    const relPath = file.replace(/^js[\\/]/, "");
    const outPath = path.join(DIST_DIR, "js", relPath.replace(/\.js$/, ".min.js"));
    await ensureDir(path.dirname(outPath));
    await fs.writeFile(outPath, result.code, "utf8");

    totalBefore += Buffer.byteLength(rewritten, "utf8");
    totalAfter += Buffer.byteLength(result.code, "utf8");
  }

  log(`JS: ${files.length} files, ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)}`);
};

const copyRootFiles = async () => {
  let copied = 0;
  for (const file of ROOT_FILES) {
    const srcPath = path.join(ROOT, file);
    if (await exists(srcPath)) {
      const destPath = path.join(DIST_DIR, file);
      await ensureDir(path.dirname(destPath));
      await fs.copyFile(srcPath, destPath);
      copied += 1;
    }
  }
  if (copied) {
    log(`Root files: copied ${copied}`);
  }
};

const buildHtml = async () => {
  const indexPath = path.join(ROOT, "index.html");
  if (!(await exists(indexPath))) {
    throw new Error("index.html not found.");
  }
  const html = await fs.readFile(indexPath, "utf8");
  const rewritten = rewriteHtmlLinks(html);
  await fs.writeFile(path.join(DIST_DIR, "index.html"), rewritten, "utf8");
  log("HTML: index.html rewritten");

  const legalFiles = await fg(["legal/**/*.html"], { dot: false });
  if (legalFiles.length) {
    for (const file of legalFiles) {
      const srcPath = path.join(ROOT, file);
      const content = await fs.readFile(srcPath, "utf8");
      const updated = rewriteHtmlLinks(content);
      const outPath = path.join(DIST_DIR, file);
      await ensureDir(path.dirname(outPath));
      await fs.writeFile(outPath, updated, "utf8");
    }
    log(`HTML: legal pages rewritten (${legalFiles.length})`);
  }
};

const build = async () => {
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await ensureDir(DIST_DIR);
  log("dist/ cleaned");

  await minifyCss();
  await minifyJs();

  const copiedDirs = [];
  if (await copyDirIfExists(SOURCE_DIRS.assets, path.join(DIST_DIR, "assets"))) {
    copiedDirs.push("assets/");
  }
  if (await copyDirIfExists(SOURCE_DIRS.data, path.join(DIST_DIR, "data"))) {
    copiedDirs.push("data/");
  }
  if (copiedDirs.length) {
    log(`Copied: ${copiedDirs.join(", ")}`);
  }
  await copyRootFiles();
  await buildHtml();

  log("Build complete");
};

try {
  await build();
} catch (error) {
  console.error("[build] Failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
