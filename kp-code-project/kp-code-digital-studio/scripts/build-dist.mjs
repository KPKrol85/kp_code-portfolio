import {
  assertFileExists,
  buildCSS,
  buildJS,
  copyAssets,
  copyHtmlPages,
  copySeoFiles,
  DIST_CSS_FILE,
  DIST_JS_FILE,
  fixManifestInDist,
  removeDist,
} from './build-utils.mjs';

await removeDist();
await buildCSS();
await buildJS();
await copyHtmlPages();
await copyAssets();
await copySeoFiles();
await fixManifestInDist();
await assertFileExists(DIST_CSS_FILE);
await assertFileExists(DIST_JS_FILE);
