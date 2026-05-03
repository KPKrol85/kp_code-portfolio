import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT_DIR } from '../build-utils.mjs';
import {
  createCheckResult,
  isIgnoredReference,
  listExpectedHtmlOutputs,
  normalizeSlashes,
  readSourceHtml,
  rootPathExists,
  stripQueryAndHash,
} from './utils.mjs';

const SRCSET_ATTRIBUTE_PATTERN = /\bsrcset\s*=\s*(["'])(.*?)\1/gis;

function extractSrcsetAttributes(html) {
  return Array.from(html.matchAll(SRCSET_ATTRIBUTE_PATTERN), (match) => match[2]);
}

function splitSrcsetCandidates(srcset) {
  const candidates = [];
  let start = 0;

  for (let index = 0; index < srcset.length; index += 1) {
    if (srcset[index] !== ',') {
      continue;
    }

    const nextCharacter = srcset[index + 1] ?? '';
    if (nextCharacter && !/\s/.test(nextCharacter)) {
      continue;
    }

    candidates.push(srcset.slice(start, index).trim());
    start = index + 1;
  }

  candidates.push(srcset.slice(start).trim());
  return candidates.filter(Boolean);
}

function parseSrcsetCandidate(candidate) {
  const [url] = candidate.trim().split(/\s+/, 1);
  return url || null;
}

function resolveSourceReference(pageRelativePath, rawValue) {
  const cleaned = stripQueryAndHash(rawValue.trim());

  if (!cleaned || isIgnoredReference(cleaned)) {
    return null;
  }

  if (cleaned.startsWith('/')) {
    return normalizeSlashes(path.posix.normalize(cleaned.slice(1)));
  }

  const pageDir = path.posix.dirname(normalizeSlashes(pageRelativePath));
  const resolved = pageDir === '.' ? cleaned : path.posix.join(pageDir, cleaned);
  return normalizeSlashes(path.posix.normalize(resolved));
}

export async function checkSrcsetAssets() {
  const errors = [];
  const htmlFiles = await listExpectedHtmlOutputs();

  for (const relativePath of htmlFiles) {
    const html = await readSourceHtml(relativePath);
    const srcsets = extractSrcsetAttributes(html);

    for (const srcset of srcsets) {
      for (const candidate of splitSrcsetCandidates(srcset)) {
        const url = parseSrcsetCandidate(candidate);
        if (!url) {
          continue;
        }

        const resolvedPath = resolveSourceReference(relativePath, url);
        if (!resolvedPath) {
          continue;
        }

        if (!(await rootPathExists(resolvedPath))) {
          const resolvedFilePath = normalizeSlashes(path.join(ROOT_DIR, resolvedPath));
          errors.push(
            `${relativePath}: missing srcset asset "${candidate}" -> ${resolvedPath} (${resolvedFilePath})`
          );
        }
      }
    }
  }

  return createCheckResult('srcset-assets', errors);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await checkSrcsetAssets();

  if (result.ok) {
    console.log(`PASS ${result.name}`);
  } else {
    console.error(`FAIL ${result.name}`);
    for (const error of result.errors) {
      console.error(error);
    }
    process.exit(1);
  }
}
