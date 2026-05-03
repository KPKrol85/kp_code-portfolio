import { checkDistStructure } from './check-dist-structure.mjs';
import { checkHtmlAssembly } from './check-html-assembly.mjs';
import { checkLocalRefs } from './check-local-refs.mjs';
import { checkMetadata } from './check-metadata.mjs';
import { checkPhpRuntime } from './check-php-runtime.mjs';
import { checkSemanticStructure } from './check-semantic-structure.mjs';
import { checkSrcsetAssets } from './check-srcset-assets.mjs';
import { checkSourcePlaceholderLinks } from './check-source-placeholder-links.mjs';
import { formatFailures } from './utils.mjs';

const checks = [
  checkDistStructure,
  checkHtmlAssembly,
  checkLocalRefs,
  checkMetadata,
  checkPhpRuntime,
  checkSemanticStructure,
  checkSrcsetAssets,
  checkSourcePlaceholderLinks,
];

const results = await Promise.all(checks.map((check) => check()));
const hasFailures = results.some((result) => !result.ok);

for (const result of results) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name}`);

  if (result.warnings?.length) {
    for (const warning of result.warnings) {
      console.warn(`WARN ${warning}`);
    }
  }
}

if (hasFailures) {
  console.error('\nQA failed.\n');
  console.error(formatFailures(results));
  process.exit(1);
}

console.log('\nQA passed.');
