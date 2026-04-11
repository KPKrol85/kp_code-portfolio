import path from 'node:path';
import { access, readFile } from 'node:fs/promises';
import {
  DIST_DIR,
  DIST_CSS_FILE,
  DIST_JS_FILE,
  ROOT_DIR,
  hasOptionalLocalContactConfig,
  listPublicHtmlFiles,
} from '../build-utils.mjs';

export const REQUIRED_DIST_FILES = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'service-worker.js',
  'assets/icons/site.webmanifest',
];
export const REQUIRED_PHP_RUNTIME_FILES = [
  '.htaccess',
  'contact.php',
  'contact-submit.php',
  'contact-form-support.php',
  'contact-mail.config.php',
  'vendor/autoload.php',
  'vendor/phpmailer/phpmailer/src/DSNConfigurator.php',
  'vendor/phpmailer/phpmailer/src/Exception.php',
  'vendor/phpmailer/phpmailer/src/OAuth.php',
  'vendor/phpmailer/phpmailer/src/OAuthTokenProvider.php',
  'vendor/phpmailer/phpmailer/src/PHPMailer.php',
  'vendor/phpmailer/phpmailer/src/POP3.php',
  'vendor/phpmailer/phpmailer/src/SMTP.php',
  'src/partials/header.html',
  'src/partials/footer.html',
  'src/partials/theme-bootstrap.html',
];
export const FORBIDDEN_DIST_FILES = [
  'contact-mail.config.example.php',
  'assets/img/img_src',
  'vendor/phpmailer/phpmailer/docs',
  'vendor/phpmailer/phpmailer/examples',
  'vendor/phpmailer/phpmailer/test',
  'vendor/phpmailer/phpmailer/README.md',
  'vendor/phpmailer/phpmailer/changelog.md',
  'vendor/phpmailer/phpmailer/SECURITY.md',
  'vendor/phpmailer/phpmailer/SMTPUTF8.md',
  'vendor/phpmailer/phpmailer/UPGRADING.md',
  'vendor/phpmailer/phpmailer/composer.json',
  'vendor/phpmailer/phpmailer/phpcs.xml.dist',
  'vendor/phpmailer/phpmailer/phpdoc.dist.xml',
  'vendor/phpmailer/phpmailer/phpunit.xml.dist',
  'vendor/phpmailer/phpmailer/LICENSE',
  'vendor/phpmailer/phpmailer/COMMITMENT',
  'vendor/phpmailer/phpmailer/VERSION',
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

export async function readSourceHtml(relativePath) {
  return readFile(path.join(ROOT_DIR, relativePath), 'utf8');
}

export async function distPathExists(relativePath) {
  try {
    await access(path.join(DIST_DIR, relativePath));
    return true;
  } catch {
    return false;
  }
}

export async function rootPathExists(relativePath) {
  try {
    await access(path.join(ROOT_DIR, relativePath));
    return true;
  } catch {
    return false;
  }
}

export { hasOptionalLocalContactConfig };

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
