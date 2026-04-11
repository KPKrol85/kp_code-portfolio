import { createCheckResult, listExpectedHtmlOutputs, readSourceHtml } from './utils.mjs';

const PLACEHOLDER_HREF_PATTERN = /href=(['"])(#|)\1/gi;

function countLineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

export async function checkSourcePlaceholderLinks() {
  const errors = [];
  const htmlFiles = await listExpectedHtmlOutputs();

  for (const relativePath of htmlFiles) {
    const html = await readSourceHtml(relativePath);

    for (const match of html.matchAll(PLACEHOLDER_HREF_PATTERN)) {
      const hrefValue = match[2];
      const lineNumber = countLineNumber(html, match.index ?? 0);
      const context = match[0];

      errors.push(
        `${relativePath}:${lineNumber}: placeholder link found (${context || `href="${hrefValue}"`})`
      );
    }
  }

  return createCheckResult('source-placeholder-links', errors);
}
