import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAssembledHtml } from '../build-utils.mjs';
import { createCheckResult, listExpectedHtmlOutputs } from './utils.mjs';

const TAG_ATTRIBUTE_PATTERN = /([^\s=/>]+)\s*=\s*(["'])(.*?)\2/gs;
const ID_ATTRIBUTE_PATTERN = /\bid\s*=\s*(["'])(.*?)\1/gis;
const HEADING_PATTERN = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
const MAIN_PATTERN = /<main\b/gi;
const H1_PATTERN = /<h1\b/gi;
const SKIP_LINK_PATTERN = /<a\b[^>]*class\s*=\s*(["'])[^"']*\bskip-link\b[^"']*\1[^>]*>/gis;
const ARIA_IDREF_ATTRIBUTES = ['aria-labelledby', 'aria-describedby'];

function countMatches(html, pattern) {
  return Array.from(html.matchAll(pattern)).length;
}

function extractTagAttributes(tagMarkup) {
  return Object.fromEntries(
    Array.from(tagMarkup.matchAll(TAG_ATTRIBUTE_PATTERN), ([, name, , value]) => [
      name.toLowerCase(),
      value.trim(),
    ])
  );
}

function decodeBasicEntities(value) {
  return value
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function stripTags(value) {
  return decodeBasicEntities(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function collectIds(html) {
  const ids = new Map();

  for (const match of html.matchAll(ID_ATTRIBUTE_PATTERN)) {
    const id = match[2].trim();
    if (!id) {
      continue;
    }

    ids.set(id, (ids.get(id) ?? 0) + 1);
  }

  return ids;
}

function checkSingleElementCount(errors, relativePath, html, pattern, elementName) {
  const count = countMatches(html, pattern);

  if (count !== 1) {
    errors.push(`${relativePath}: expected exactly one <${elementName}>, found ${count}`);
  }
}

function checkDuplicateIds(errors, relativePath, ids) {
  for (const [id, count] of ids) {
    if (count > 1) {
      errors.push(`${relativePath}: duplicate id "${id}" found ${count} times`);
    }
  }
}

function checkSkipLinkTargets(errors, relativePath, html, ids) {
  for (const match of html.matchAll(SKIP_LINK_PATTERN)) {
    const attributes = extractTagAttributes(match[0]);
    const href = attributes.href ?? '';

    if (!href.startsWith('#')) {
      continue;
    }

    const targetId = href.slice(1);
    if (!targetId || !ids.has(targetId)) {
      errors.push(`${relativePath}: skip link target "${href}" does not match an existing id`);
    }
  }
}

function checkAriaIdReferences(errors, relativePath, html, ids) {
  for (const attributeName of ARIA_IDREF_ATTRIBUTES) {
    const attributePattern = new RegExp(`\\b${attributeName}\\s*=\\s*(["'])(.*?)\\1`, 'gis');

    for (const match of html.matchAll(attributePattern)) {
      const referencedIds = match[2].split(/\s+/).filter(Boolean);

      for (const id of referencedIds) {
        if (!ids.has(id)) {
          errors.push(`${relativePath}: ${attributeName} references missing id "${id}"`);
        }
      }
    }
  }
}

function checkHeadings(errors, relativePath, html) {
  let previousLevel = 0;

  for (const match of html.matchAll(HEADING_PATTERN)) {
    const level = Number(match[1]);
    const text = stripTags(match[2]);

    if (!text) {
      errors.push(`${relativePath}: empty <h${level}> heading found`);
    }

    if (previousLevel && level - previousLevel > 1) {
      errors.push(
        `${relativePath}: heading level jumps from h${previousLevel} to h${level} (${text || 'empty heading'})`
      );
    }

    previousLevel = level;
  }
}

function checkPage(relativePath, html) {
  const errors = [];
  const warnings = [];
  const ids = collectIds(html);

  checkSingleElementCount(errors, relativePath, html, MAIN_PATTERN, 'main');
  checkSingleElementCount(errors, relativePath, html, H1_PATTERN, 'h1');
  checkDuplicateIds(errors, relativePath, ids);
  checkSkipLinkTargets(errors, relativePath, html, ids);
  checkAriaIdReferences(errors, relativePath, html, ids);
  checkHeadings(errors, relativePath, html);

  return { errors, warnings };
}

function formatDirectRunResult(result) {
  if (result.warnings?.length) {
    for (const warning of result.warnings) {
      console.warn(`WARN ${warning}`);
    }
  }

  if (result.ok) {
    console.log(`PASS ${result.name}`);
    return;
  }

  console.error(`FAIL ${result.name}`);
  for (const error of result.errors) {
    console.error(error);
  }
}

export async function checkSemanticStructure() {
  const errors = [];
  const warnings = [];
  const htmlFiles = await listExpectedHtmlOutputs();

  for (const relativePath of htmlFiles) {
    const html = await renderAssembledHtml(relativePath);
    const result = checkPage(relativePath, html);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return {
    ...createCheckResult('semantic-structure', errors),
    warnings,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await checkSemanticStructure();
  formatDirectRunResult(result);

  if (!result.ok) {
    process.exit(1);
  }
}
