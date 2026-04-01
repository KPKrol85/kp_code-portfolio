import path from "node:path";
import {
  DIST_CSS_FILE,
  DIST_DIR,
  DIST_JS_FILE,
  REQUIRED_DIST_FILES,
  createCheckResult,
  distPathExists,
  listExpectedHtmlOutputs
} from "./utils.mjs";

export async function checkDistStructure() {
  const errors = [];
  const requiredPaths = [
    ...REQUIRED_DIST_FILES,
    path.relative(DIST_DIR, DIST_CSS_FILE),
    path.relative(DIST_DIR, DIST_JS_FILE)
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

  return createCheckResult("dist-structure", errors);
}
