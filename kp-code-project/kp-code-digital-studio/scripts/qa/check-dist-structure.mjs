import path from 'node:path';
import {
  DIST_CSS_FILE,
  DIST_DIR,
  DIST_JS_FILE,
  FORBIDDEN_DIST_FILES,
  REQUIRED_DIST_FILES,
  REQUIRED_PHP_RUNTIME_FILES,
  createCheckResult,
  distPathExists,
  hasOptionalLocalContactConfig,
  listExpectedHtmlOutputs,
} from './utils.mjs';

export async function checkDistStructure() {
  const errors = [];
  const requiredPaths = [
    ...REQUIRED_DIST_FILES,
    ...REQUIRED_PHP_RUNTIME_FILES,
    path.relative(DIST_DIR, DIST_CSS_FILE),
    path.relative(DIST_DIR, DIST_JS_FILE),
  ];

  for (const relativePath of requiredPaths) {
    if (!(await distPathExists(relativePath))) {
      errors.push(`Missing required dist file: ${relativePath}`);
    }
  }

  const expectedHtmlFiles = await listExpectedHtmlOutputs();

  for (const relativePath of expectedHtmlFiles) {
    if (!(await distPathExists(relativePath))) {
      errors.push(`Missing generated HTML page: ${relativePath}`);
    }
  }

  if (await hasOptionalLocalContactConfig()) {
    if (!(await distPathExists('contact-mail.config.local.php'))) {
      errors.push('Missing copied local contact config: contact-mail.config.local.php');
    }
  }

  for (const relativePath of FORBIDDEN_DIST_FILES) {
    if (await distPathExists(relativePath)) {
      errors.push(`Forbidden dist file present: ${relativePath}`);
    }
  }

  return createCheckResult('dist-structure', errors);
}
