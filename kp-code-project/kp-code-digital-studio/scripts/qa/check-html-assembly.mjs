import { createCheckResult, listExpectedHtmlOutputs, readDistHtml } from "./utils.mjs";

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

export async function checkHtmlAssembly() {
  const errors = [];
  const htmlFiles = await listExpectedHtmlOutputs();

  for (const relativePath of htmlFiles) {
    const html = await readDistHtml(relativePath);

    if (html.includes("@include:")) {
      errors.push(`${relativePath}: unresolved include placeholder found`);
    }

    if (/\{\{NAV_[A-Z_]+_CURRENT\}\}/.test(html)) {
      errors.push(`${relativePath}: unresolved header nav token found`);
    }

    if (countMatches(html, /<header class="header">/g) !== 1) {
      errors.push(`${relativePath}: expected exactly one shared header`);
    }

    if (countMatches(html, /<footer class="footer">/g) !== 1) {
      errors.push(`${relativePath}: expected exactly one shared footer`);
    }

    if (/href="\.\.?\/css\/main\.css"/.test(html)) {
      errors.push(`${relativePath}: source CSS reference found in dist HTML`);
    }

    if (/src="\.\.?\/js\/main\.js"/.test(html)) {
      errors.push(`${relativePath}: source JS reference found in dist HTML`);
    }

    if (!/href="\.\.?\/css\/main\.min\.css"/.test(html)) {
      errors.push(`${relativePath}: minified CSS reference missing`);
    }

    if (!/src="\.\.?\/js\/main\.min\.js"/.test(html)) {
      errors.push(`${relativePath}: minified JS reference missing`);
    }
  }

  return createCheckResult("html-assembly", errors);
}
