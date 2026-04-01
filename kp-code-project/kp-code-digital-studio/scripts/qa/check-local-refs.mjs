import {
  createCheckResult,
  distPathExists,
  extractAttributeValues,
  extractSrcsetValues,
  isIgnoredReference,
  listExpectedHtmlOutputs,
  readDistHtml,
  resolveDistReference,
} from './utils.mjs';

function collectReferences(html) {
  return [
    ...extractAttributeValues(html, 'href'),
    ...extractAttributeValues(html, 'src'),
    ...extractSrcsetValues(html),
  ];
}

export async function checkLocalRefs() {
  const errors = [];
  const htmlFiles = await listExpectedHtmlOutputs();

  for (const relativePath of htmlFiles) {
    const html = await readDistHtml(relativePath);
    const references = collectReferences(html);
    const seen = new Set();

    for (const reference of references) {
      if (isIgnoredReference(reference)) {
        continue;
      }

      const resolvedPath = resolveDistReference(relativePath, reference);

      if (!resolvedPath || seen.has(resolvedPath)) {
        continue;
      }

      seen.add(resolvedPath);

      if (!(await distPathExists(resolvedPath))) {
        errors.push(`${relativePath}: broken local reference "${reference}" -> ${resolvedPath}`);
      }
    }
  }

  return createCheckResult('local-refs', errors);
}
