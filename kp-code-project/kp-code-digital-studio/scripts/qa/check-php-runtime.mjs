import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { createCheckResult, distPathExists, DIST_DIR, readDistHtml } from './utils.mjs';

async function readDistText(relativePath) {
  return readDistHtml(relativePath);
}

export async function checkPhpRuntime() {
  const errors = [];
  const [contactPhp, contactSubmitPhp, supportPhp, htaccess] = await Promise.all([
    readDistText('contact.php'),
    readDistText('contact-submit.php'),
    readDistText('contact-form-support.php'),
    readDistText('.htaccess'),
  ]);

  if (!contactPhp.includes("__DIR__ . '/contact.html'")) {
    errors.push('contact.php: expected runtime template path to contact.html in dist');
  }

  if (!contactPhp.includes("require_once __DIR__ . '/contact-form-support.php'")) {
    errors.push('contact.php: missing support runtime require');
  }

  if (!contactSubmitPhp.includes("__DIR__ . '/contact-mail.config.php'")) {
    errors.push('contact-submit.php: missing dist config path');
  }

  if (!contactSubmitPhp.includes("__DIR__ . '/vendor/autoload.php'")) {
    errors.push('contact-submit.php: missing dist vendor autoload path');
  }

  if (!supportPhp.includes("const CONTACT_FORM_PARTIALS_DIR = __DIR__ . '/src/partials';")) {
    errors.push('contact-form-support.php: missing dist partials path');
  }

  if (supportPhp.includes('contact-mail.config.example.php')) {
    errors.push('contact-form-support.php: example config must not be referenced');
  }

  if (!htaccess.includes('RewriteRule ^contact\\.html$ contact.php [L]')) {
    errors.push('.htaccess: expected contact.html rewrite rule');
  }

  if (!(await distPathExists('contact.html'))) {
    errors.push('dist runtime missing contact.html template');
  }

  const phpmailerDir = path.join(DIST_DIR, 'vendor', 'phpmailer', 'phpmailer');
  if (await distPathExists('vendor/phpmailer/phpmailer')) {
    const entries = await readdir(phpmailerDir, { withFileTypes: true });
    const extraEntries = entries
      .map((entry) => entry.name)
      .filter((name) => name !== 'src')
      .sort();

    if (extraEntries.length > 0) {
      errors.push(
        `vendor/phpmailer/phpmailer contains non-runtime entries: ${extraEntries.join(', ')}`
      );
    }
  }

  return createCheckResult('php-runtime', errors);
}
