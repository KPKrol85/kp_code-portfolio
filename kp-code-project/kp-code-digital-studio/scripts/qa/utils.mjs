import path from 'node:path';
import { access, readFile } from 'node:fs/promises';
import { DIST_DIR, DIST_CSS_FILE, DIST_JS_FILE, listPublicHtmlFiles } from '../build-utils.mjs';

export const REQUIRED_DIST_FILES = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'assets/icons/site.webmanifest',
];

export { DIST_DIR, DIST_CSS_FILE, DIST_JS_FILE };

export async function listExpectedHtmlOutputs() {
  return listPublicHtmlFiles();
}

export async function listDistHtmlFiles() {
  return listPublicHtmlFiles();
}

export async function readDistHtml(relativePath) {
  return readFile(path.join(DIST_DIR, relativePath), 'utf8');
}

export async function distPathExists(relativePath) {
  try {
    await access(path.join(DIST_DIR, relativePath));
    return true;
  } catch {
    return false;
  }
}

export function createCheckResult(name, errors = []) {
  return {
    name,
    ok: errors.length === 0,
    errors,
  };
}

export function formatFailures(results) {
  return results
    .filter((result) => !result.ok)
    .map((result) => {
      const lines = [`- ${result.name}`];
      for (const error of result.errors) {
        lines.push(`  ${error}`);
      }
      return lines.join('\n');
    })
    .join('\n');
}

export function normalizeSlashes(value) {
  return value.replaceAll('\\', '/');
}

export function stripQueryAndHash(value) {
  return value.replace(/[?#].*$/, '');
}

export function isIgnoredReference(rawValue) {
  if (!rawValue) {
    return true;
  }

  return (
    rawValue.startsWith('#') ||
    rawValue.startsWith('mailto:') ||
    rawValue.startsWith('tel:') ||
    rawValue.startsWith('data:') ||
    rawValue.startsWith('javascript:') ||
    /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(rawValue)
  );
}

export function resolveDistReference(pageRelativePath, rawValue) {
  const cleaned = stripQueryAndHash(rawValue.trim());

  if (!cleaned || isIgnoredReference(cleaned)) {
    return null;
  }

  if (cleaned.startsWith('/')) {
    return cleaned.slice(1);
  }

  const pageDir = path.posix.dirname(normalizeSlashes(pageRelativePath));
  const resolved = pageDir === '.' ? cleaned : path.posix.join(pageDir, cleaned);
  return path.posix.normalize(resolved);
}

export function extractAttributeValues(html, attributeName) {
  const regex = new RegExp(`${attributeName}="([^"]+)"`, 'g');
  const values = [];

  for (const match of html.matchAll(regex)) {
    values.push(match[1]);
  }

  return values;
}

export function extractSrcsetValues(html) {
  const values = [];

  for (const srcset of extractAttributeValues(html, 'srcset')) {
    for (const candidate of srcset.split(',')) {
      const [url] = candidate.trim().split(/\s+/, 1);

      if (url) {
        values.push(url);
      }
    }
  }

  return values;
}
