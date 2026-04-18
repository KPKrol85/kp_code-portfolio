import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const htmlFiles = ['index.html', 'kontakt.html', 'oferta.html', 'o-nas.html', 'realizacje.html', 'uslugi.html'];
const requiredFiles = [
  ...htmlFiles,
  'robots.txt',
  'sitemap.xml',
  'js/app.js',
  'css/tokens.css',
  'css/base.css',
  'css/layout.css',
  'css/main.css',
  'assets/favicon.svg',
  'assets/hero.svg'
];

const missingFiles = [];
const errors = [];

const localReferencePattern = /\b(?:href|src)=["']([^"']+)["']/gi;

const hasLocalReference = (value) => {
  if (!value) return false;

  return !(
    value.startsWith('#') ||
    value.startsWith('//') ||
    value.startsWith('data:') ||
    /^[a-z]+:/i.test(value)
  );
};

const normalizeReference = (value) => value.split('#')[0].split('?')[0];

const fileExists = async (relativePath) => {
  try {
    await access(path.join(rootDir, relativePath));
    return true;
  } catch {
    return false;
  }
};

const ensureRequiredFiles = async () => {
  await Promise.all(
    requiredFiles.map(async (relativePath) => {
      if (!(await fileExists(relativePath))) {
        missingFiles.push(relativePath);
      }
    })
  );
};

const ensureHtmlStructure = (filePath, source) => {
  if (!/<title>[\s\S]*?<\/title>/i.test(source)) {
    errors.push(`${filePath}: missing <title>.`);
  }

  if (!/<meta\s+name=["']description["'][^>]*>/i.test(source)) {
    errors.push(`${filePath}: missing meta description.`);
  }

  if (!/<link\s+rel=["']canonical["'][^>]*>/i.test(source)) {
    errors.push(`${filePath}: missing canonical link.`);
  }

  if (!/<main\b/i.test(source)) {
    errors.push(`${filePath}: missing <main> element.`);
  }

  if (!/<script\s+type=["']module["']\s+src=["']js\/app\.js["'][^>]*><\/script>/i.test(source)) {
    errors.push(`${filePath}: missing module entry script "js/app.js".`);
  }
};

const ensureLocalReferences = async (filePath, source) => {
  const seen = new Set();
  const matches = source.matchAll(localReferencePattern);

  for (const match of matches) {
    const originalReference = match[1];
    if (!hasLocalReference(originalReference)) continue;

    const normalizedReference = normalizeReference(originalReference);
    if (!normalizedReference) continue;

    const resolvedPath = path
      .normalize(path.join(path.dirname(filePath), normalizedReference))
      .replace(/\\/g, '/');

    if (seen.has(resolvedPath)) continue;
    seen.add(resolvedPath);

    if (!(await fileExists(resolvedPath))) {
      errors.push(`${filePath}: local reference "${originalReference}" points to a missing file.`);
    }
  }
};

const run = async () => {
  await ensureRequiredFiles();

  if (missingFiles.length > 0) {
    missingFiles
      .sort()
      .forEach((relativePath) => errors.push(`Missing required deploy-ready file: ${relativePath}`));
  }

  for (const htmlFile of htmlFiles) {
    const fullPath = path.join(rootDir, htmlFile);
    const source = await readFile(fullPath, 'utf8');

    ensureHtmlStructure(htmlFile, source);
    await ensureLocalReferences(htmlFile, source);
  }

  if (errors.length > 0) {
    console.error('Static readiness check failed:\n');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log('Static readiness check passed.');
};

await run();
