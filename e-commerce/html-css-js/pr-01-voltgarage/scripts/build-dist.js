const fs = require('node:fs/promises');
const path = require('node:path');

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const REQUIRED_FILES = [
  'index.html',
  '404.html',
  'offline.html',
  'site.webmanifest',
  'sw.js',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  '_redirects',
  'humans.txt',
];
const REQUIRED_DIRS = ['pages', 'assets', 'data'];
const PROD_ASSETS = [
  ['css/main.min.css', 'css/main.min.css'],
  ['js/main.min.js', 'js/main.min.js'],
];
const HTML_REWRITES = [
  [/\/css\/main\.css\b/g, '/css/main.min.css'],
  [/\.\.\/js\/main\.js\b/g, '../js/main.min.js'],
  [/\.\/js\/main\.js\b/g, './js/main.min.js'],
  [/(?<!min\.)\bjs\/main\.js\b/g, 'js/main.min.js'],
];

const ensureExists = async (relativePath) => {
  const absolutePath = path.join(ROOT_DIR, relativePath);
  try {
    const stats = await fs.stat(absolutePath);
    if (!stats.isFile()) {
      throw new Error(`${relativePath} exists but is not a file.`);
    }
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      throw new Error(`Missing required build output: ${relativePath}`);
    }
    throw error;
  }
};

const copyFileIntoDist = async (sourceRelativePath, targetRelativePath = sourceRelativePath) => {
  const source = path.join(ROOT_DIR, sourceRelativePath);
  const target = path.join(DIST_DIR, targetRelativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
};

const copyDirIntoDist = async (sourceRelativePath, targetRelativePath = sourceRelativePath) => {
  const source = path.join(ROOT_DIR, sourceRelativePath);
  const target = path.join(DIST_DIR, targetRelativePath);
  await fs.cp(source, target, { recursive: true });
};

const collectHtmlFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const htmlFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      htmlFiles.push(...(await collectHtmlFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }

  return htmlFiles;
};

const rewriteHtmlAssets = async () => {
  const htmlFiles = await collectHtmlFiles(DIST_DIR);

  await Promise.all(
    htmlFiles.map(async (filePath) => {
      const original = await fs.readFile(filePath, 'utf8');
      const rewritten = HTML_REWRITES.reduce(
        (content, [pattern, replacement]) => content.replace(pattern, replacement),
        original
      );
      await fs.writeFile(filePath, rewritten);
    })
  );
};

const assertNoSourceAssetRefs = async () => {
  const htmlFiles = await collectHtmlFiles(DIST_DIR);
  const errors = [];

  for (const filePath of htmlFiles) {
    const content = await fs.readFile(filePath, 'utf8');
    if (content.includes('/css/main.css')) {
      errors.push(`${path.relative(ROOT_DIR, filePath)} still references /css/main.css`);
    }
    if (
      content.includes('./js/main.js') ||
      content.includes('../js/main.js') ||
      content.includes('src="js/main.js"')
    ) {
      errors.push(`${path.relative(ROOT_DIR, filePath)} still references main.js`);
    }
  }

  if (errors.length) {
    throw new Error(`Dist packaging validation failed:\n- ${errors.join('\n- ')}`);
  }
};

const main = async () => {
  await Promise.all(PROD_ASSETS.map(([source]) => ensureExists(source)));

  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });

  await Promise.all(REQUIRED_FILES.map((file) => copyFileIntoDist(file)));
  await Promise.all(REQUIRED_DIRS.map((dir) => copyDirIntoDist(dir)));
  await Promise.all(PROD_ASSETS.map(([source, target]) => copyFileIntoDist(source, target)));

  await rewriteHtmlAssets();
  await assertNoSourceAssetRefs();
};

main().catch((error) => {
  console.error('Unable to build dist package.');
  console.error(error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
