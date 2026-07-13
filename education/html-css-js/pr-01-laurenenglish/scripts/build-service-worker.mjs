import { createHash } from "node:crypto";
import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";

import {
  CACHE_PREFIX,
  OFFLINE_PATH,
  PRECACHE_PATHS,
  PRIMARY_DOCUMENT_PATHS,
  normalizePublicPath,
} from "./pwa-config.mjs";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const TEMPLATE_PATH = resolve(ROOT, "service-worker.template.js");
export const OUTPUT_PATH = resolve(ROOT, "service-worker.js");

const PACKAGE_PATH = resolve(ROOT, "package.json");
const SOURCE_ONLY_PATH = /^\/(?:css|js)(?:\/|$)/;
const PLACEHOLDER_PATTERN = /__[A-Z0-9_]+__/g;

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const resolvePublicFile = (publicPath) => {
  const filePath = resolve(ROOT, `.${publicPath}`);
  const projectRelativePath = relative(ROOT, filePath);
  assert(
    projectRelativePath && !projectRelativePath.startsWith(".."),
    `Precache path escapes the project root: ${publicPath}`,
  );
  return filePath;
};

export const validatePrecachePaths = async (paths = PRECACHE_PATHS) => {
  const normalizedPaths = paths.map((path) => {
    assert(
      typeof path === "string" && path.startsWith("/"),
      `Precache path must be root-relative: ${String(path)}`,
    );
    assert(
      !path.includes("?") && !path.includes("#"),
      `Precache path must not include a query or fragment: ${path}`,
    );

    const normalizedPath = normalizePublicPath(path);
    assert(
      normalizedPath === path,
      `Precache path must already be normalized: ${path} -> ${normalizedPath}`,
    );
    assert(
      !SOURCE_ONLY_PATH.test(normalizedPath),
      `Source-only CSS or JavaScript cannot be precached: ${normalizedPath}`,
    );
    return normalizedPath;
  });

  const duplicates = normalizedPaths.filter(
    (path, index) => normalizedPaths.indexOf(path) !== index,
  );
  assert(
    duplicates.length === 0,
    `Duplicate normalized precache paths: ${[...new Set(duplicates)].join(", ")}`,
  );

  const files = [];
  for (const publicPath of normalizedPaths) {
    const filePath = resolvePublicFile(publicPath);
    const fileStat = await stat(filePath).catch(() => null);
    assert(fileStat?.isFile(), `Precache file is missing: ${publicPath}`);
    files.push({
      publicPath,
      filePath,
      content: await readFile(filePath),
    });
  }

  return files;
};

const replaceQuotedPlaceholder = (source, placeholder, value) => {
  const token = JSON.stringify(placeholder);
  assert(
    source.includes(token),
    `Service-worker template is missing ${placeholder}`,
  );
  return source.replace(token, JSON.stringify(value, null, 2));
};

export const createCacheRevision = ({ version, template, precacheFiles }) => {
  const fingerprint = createHash("sha256");
  fingerprint.update(
    JSON.stringify({
      version,
      cachePrefix: CACHE_PREFIX,
      offlinePath: OFFLINE_PATH,
      primaryDocumentPaths: PRIMARY_DOCUMENT_PATHS,
      precachePaths: PRECACHE_PATHS,
    }),
  );
  fingerprint.update("\0service-worker-template\0");
  fingerprint.update(template);
  for (const { publicPath, content } of precacheFiles) {
    fingerprint.update(`\0${publicPath}\0`);
    fingerprint.update(content);
  }
  return `${version}-${fingerprint.digest("hex").slice(0, 12)}`;
};

export const createServiceWorkerBuild = async () => {
  const [{ version }, template, precacheFiles] = await Promise.all([
    readFile(PACKAGE_PATH, "utf8").then(JSON.parse),
    readFile(TEMPLATE_PATH, "utf8"),
    validatePrecachePaths(),
  ]);

  assert(version, "package.json must define a version");

  const revision = createCacheRevision({ version, template, precacheFiles });
  let source = template;
  source = replaceQuotedPlaceholder(source, "__CACHE_PREFIX__", CACHE_PREFIX);
  source = replaceQuotedPlaceholder(source, "__CACHE_REVISION__", revision);
  source = replaceQuotedPlaceholder(source, "__OFFLINE_PATH__", OFFLINE_PATH);
  source = replaceQuotedPlaceholder(
    source,
    "__PRECACHE_PATHS__",
    PRECACHE_PATHS,
  );
  source = replaceQuotedPlaceholder(
    source,
    "__PRIMARY_DOCUMENT_PATHS__",
    PRIMARY_DOCUMENT_PATHS,
  );
  source = await format(source, { parser: "babel" });

  const unresolvedPlaceholders = source.match(PLACEHOLDER_PATTERN) ?? [];
  assert(
    unresolvedPlaceholders.length === 0,
    `Unresolved service-worker placeholders: ${unresolvedPlaceholders.join(", ")}`,
  );

  return {
    cacheName: `${CACHE_PREFIX}${revision}`,
    precacheFiles,
    revision,
    source,
  };
};

const run = async () => {
  const build = await createServiceWorkerBuild();
  await writeFile(OUTPUT_PATH, build.source, "utf8");
  console.log(
    `Generated service-worker.js with cache ${build.cacheName} and ${build.precacheFiles.length} validated precache entries.`,
  );
};

const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  run().catch((error) => {
    console.error(`Service-worker build failed: ${error.message}`);
    process.exitCode = 1;
  });
}
