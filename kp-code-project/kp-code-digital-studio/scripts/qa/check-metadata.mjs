import { createCheckResult, listExpectedHtmlOutputs, readDistHtml } from './utils.mjs';

const JSONLD_EXPECTED_PAGES = new Set([
  'index.html',
  'about.html',
  'services.html',
  'services/websites.html',
  'services/wordpress.html',
  'services/seo.html',
  'services/design.html',
  'projects.html',
  'projects/ambre.html',
  'projects/atelier-no-02.html',
  'projects/aurora.html',
  'projects/axiom-construction.html',
  'projects/outland-gear.html',
  'projects/solidcraft.html',
  'projects/vista.html',
  'projects/volt-garage.html',
  'contact.html',
  'case-digital-vault.html',
  'ecosystem.html',
  'cookies.html',
  'polityka-prywatnosci.html',
  'regulamin.html',
]);

function extractTagAttributes(tagMarkup) {
  return Object.fromEntries(
    Array.from(tagMarkup.matchAll(/([^\s=/>]+)\s*=\s*(['"])(.*?)\2/gs), ([, name, , value]) => [
      name.toLowerCase(),
      value.trim(),
    ])
  );
}

function findMetaContent(html, attributeName, attributeValue) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = extractTagAttributes(match[0]);

    if (attributes[attributeName]?.toLowerCase() === attributeValue.toLowerCase()) {
      return attributes.content?.trim() || null;
    }
  }

  return null;
}

function findCanonicalHref(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = extractTagAttributes(match[0]);

    if (attributes.rel?.toLowerCase() === 'canonical') {
      return attributes.href?.trim() || null;
    }
  }

  return null;
}

function isIndexableRobotsContent(robotsContent) {
  if (!robotsContent) {
    return false;
  }

  const directives = robotsContent
    .toLowerCase()
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  return directives.includes('index') && !directives.includes('noindex');
}

function countJsonLdBlocks(html) {
  let count = 0;

  for (const match of html.matchAll(
    /<script\b[^>]*type\s*=\s*(['"])application\/ld\+json\1[^>]*>/gi
  )) {
    if (match[0]) {
      count += 1;
    }
  }

  return count;
}

export async function checkMetadata() {
  const errors = [];
  const htmlFiles = await listExpectedHtmlOutputs();

  for (const relativePath of htmlFiles) {
    const html = await readDistHtml(relativePath);
    const robots = findMetaContent(html, 'name', 'robots');
    const canonical = findCanonicalHref(html);
    const ogUrl = findMetaContent(html, 'property', 'og:url');
    const ogImage = findMetaContent(html, 'property', 'og:image');
    const ogImageAlt = findMetaContent(html, 'property', 'og:image:alt');
    const indexable = isIndexableRobotsContent(robots);

    if (indexable && !canonical) {
      errors.push(`${relativePath}: indexable page missing canonical`);
    }

    if (indexable && !ogUrl) {
      errors.push(`${relativePath}: indexable page missing og:url`);
    }

    if (indexable && !robots) {
      errors.push(`${relativePath}: indexable page missing robots`);
    }

    if (ogImage && !ogImageAlt) {
      errors.push(`${relativePath}: missing og:image:alt for declared og:image`);
    }

    if (JSONLD_EXPECTED_PAGES.has(relativePath) && countJsonLdBlocks(html) === 0) {
      errors.push(`${relativePath}: expected JSON-LD block not found`);
    }
  }

  return createCheckResult('metadata', errors);
}
