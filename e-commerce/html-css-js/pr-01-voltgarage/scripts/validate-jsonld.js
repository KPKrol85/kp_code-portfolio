
const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT_DIR = process.cwd();
const HTML_EXT = '.html';
const SKIP_DIRS = new Set(['node_modules', '.git']);
const JSON_LD_REGEX = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

async function collectHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) {
        continue;
      }
      files.push(...(await collectHtmlFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(HTML_EXT)) {
      files.push(fullPath);
    }
  }

  return files;
}

function validateJsonLdBlocks(filePath, content) {
  const errors = [];
  let match;
  let blockIndex = 0;

  while ((match = JSON_LD_REGEX.exec(content)) !== null) {
    blockIndex += 1;
    const jsonText = match[1].trim();

    if (!jsonText) {
      errors.push(`${filePath} [block ${blockIndex}]: empty JSON-LD block.`);
      continue;
    }

    try {
      JSON.parse(jsonText);
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error);
      errors.push(`${filePath} [block ${blockIndex}]: ${details}`);
    }
  }

  return errors;
}

async function main() {
  const htmlFiles = await collectHtmlFiles(ROOT_DIR);
  const errors = [];

  for (const filePath of htmlFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    const relPath = path.relative(ROOT_DIR, filePath);
    errors.push(...validateJsonLdBlocks(relPath, content));
  }

  if (errors.length > 0) {
    console.error('JSON-LD validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`JSON-LD validation passed for ${htmlFiles.length} HTML files.`);
}

main().catch((error) => {
  console.error('Unable to run JSON-LD validation.');
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
