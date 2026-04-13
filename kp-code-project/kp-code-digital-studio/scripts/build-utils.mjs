import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, readdir, rm, stat, writeFile, copyFile, access } from 'node:fs/promises';
import fg from 'fast-glob';
import { build as esbuild } from 'esbuild';
import { bundle as bundleCss } from 'lightningcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, '..');
export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const DIST_CSS_FILE = path.join(DIST_DIR, 'css', 'main.min.css');
export const DIST_JS_FILE = path.join(DIST_DIR, 'js', 'main.min.js');

const CSS_ENTRY = path.join(ROOT_DIR, 'css', 'main.css');
const JS_ENTRY = path.join(ROOT_DIR, 'js', 'main.js');
const ROOT_ROBOTS_PATH = path.join(ROOT_DIR, 'robots.txt');
const SERVICE_WORKER_PATH = path.join(ROOT_DIR, 'service-worker.js');
const PARTIALS_DIR = path.join(ROOT_DIR, 'src', 'partials');
const HEADER_PARTIAL_PATH = path.join(PARTIALS_DIR, 'header.html');
const FOOTER_PARTIAL_PATH = path.join(PARTIALS_DIR, 'footer.html');
const THEME_BOOTSTRAP_PARTIAL_PATH = path.join(PARTIALS_DIR, 'theme-bootstrap.html');
const ROOT_HTACCESS_PATH = path.join(ROOT_DIR, '.htaccess');
const ROOT_VENDOR_DIR = path.join(ROOT_DIR, 'vendor');
const OPTIONAL_LOCAL_CONTACT_CONFIG_PATH = path.join(ROOT_DIR, 'contact-mail.config.local.php');
const ROOT_ASSETS_DIR = path.join(ROOT_DIR, 'assets');

const PHP_RUNTIME_FILES = [
  'contact.php',
  'contact-submit.php',
  'contact-form-support.php',
  'contact-mail.config.php',
];
const PHP_RUNTIME_PARTIALS = ['header.html', 'footer.html', 'theme-bootstrap.html'];
const RUNTIME_ASSET_PATHS = [
  'fonts',
  'icons',
  'img/img_optimized',
  'img/logo',
  'og',
  'screenshots',
];
const PHPMAILER_RUNTIME_FILES = [
  'vendor/autoload.php',
  'vendor/composer',
  'vendor/phpmailer/phpmailer/src',
];

const ROOT_HTML_GLOBS = ['*.html', 'services/**/*.html', 'projects/**/*.html'];
const LEGAL_PAGE_FILES = new Set(['cookies.html', 'polityka-prywatnosci.html', 'regulamin.html']);
const SERVICE_WORKER_SHELL_ASSETS = ['/offline.html', '/css/main.min.css', '/js/main.min.js'];

export async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

export async function removeDist() {
  await rm(DIST_DIR, { recursive: true, force: true });
}

export async function buildCSS() {
  await ensureDir(path.dirname(DIST_CSS_FILE));

  const { code } = bundleCss({
    filename: CSS_ENTRY,
    minify: true,
    sourceMap: false,
  });

  await writeFile(DIST_CSS_FILE, code);
  return DIST_CSS_FILE;
}

export async function buildJS() {
  await ensureDir(path.dirname(DIST_JS_FILE));

  await esbuild({
    entryPoints: [JS_ENTRY],
    outfile: DIST_JS_FILE,
    bundle: true,
    format: 'esm',
    minify: true,
    sourcemap: false,
    target: ['es2020'],
    logLevel: 'info',
  });

  return DIST_JS_FILE;
}

export async function listPublicHtmlFiles() {
  return fg(ROOT_HTML_GLOBS, {
    cwd: ROOT_DIR,
    onlyFiles: true,
    dot: false,
  });
}

export async function copyDirectory(sourceDir, targetDir) {
  await ensureDir(targetDir);
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
      continue;
    }

    await ensureDir(path.dirname(targetPath));
    await copyFile(sourcePath, targetPath);
  }
}

export async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function rewriteHtmlAssetRefs(html) {
  return html
    .replaceAll('./css/main.css', './css/main.min.css')
    .replaceAll('../css/main.css', '../css/main.min.css')
    .replaceAll('./js/main.js', './js/main.min.js')
    .replaceAll('../js/main.js', '../js/main.min.js');
}

export function getActiveNavKey(relativeFilePath) {
  const normalizedPath = `/${relativeFilePath.replaceAll('\\', '/')}`;

  if (normalizedPath === '/index.html') {
    return 'start';
  }

  if (normalizedPath === '/about.html') {
    return 'about';
  }

  if (normalizedPath === '/contact.html') {
    return 'contact';
  }

  if (normalizedPath === '/services.html' || normalizedPath.startsWith('/services/')) {
    return 'services';
  }

  if (normalizedPath === '/projects.html' || normalizedPath.startsWith('/projects/')) {
    return 'projects';
  }

  return null;
}

export function renderHeaderPartial(headerTemplate, relativeFilePath) {
  const activeNavKey = getActiveNavKey(relativeFilePath);
  const navCurrentTokens = {
    '{{NAV_START_CURRENT}}': activeNavKey === 'start' ? ' aria-current="page"' : '',
    '{{NAV_ABOUT_CURRENT}}': activeNavKey === 'about' ? ' aria-current="page"' : '',
    '{{NAV_SERVICES_CURRENT}}': activeNavKey === 'services' ? ' aria-current="page"' : '',
    '{{NAV_PROJECTS_CURRENT}}': activeNavKey === 'projects' ? ' aria-current="page"' : '',
    '{{NAV_CONTACT_CURRENT}}': activeNavKey === 'contact' ? ' aria-current="page"' : '',
  };

  return Object.entries(navCurrentTokens).reduce(
    (markup, [token, value]) => markup.replaceAll(token, value),
    headerTemplate
  );
}

export function assembleHtml(html, relativeFilePath, partials) {
  return html
    .replace('<!-- @include:theme-bootstrap -->', partials.themeBootstrap)
    .replace('<!-- @include:header -->', renderHeaderPartial(partials.header, relativeFilePath))
    .replace('<!-- @include:footer -->', partials.footer);
}

export async function loadShellPartials() {
  const [header, footer, themeBootstrap] = await Promise.all([
    readFile(HEADER_PARTIAL_PATH, 'utf8'),
    readFile(FOOTER_PARTIAL_PATH, 'utf8'),
    readFile(THEME_BOOTSTRAP_PARTIAL_PATH, 'utf8'),
  ]);

  return {
    header,
    footer,
    themeBootstrap,
  };
}

export async function renderAssembledHtml(relativeFilePath, options = {}) {
  const { rewriteAssetRefs: shouldRewriteAssetRefs = false } = options;
  const sourcePath = path.join(ROOT_DIR, relativeFilePath);
  const [originalHtml, partials] = await Promise.all([
    readFile(sourcePath, 'utf8'),
    loadShellPartials(),
  ]);
  const assembledHtml = assembleHtml(originalHtml, relativeFilePath, partials);

  return shouldRewriteAssetRefs ? rewriteHtmlAssetRefs(assembledHtml) : assembledHtml;
}

export async function writeRewrittenHtml(relativeFilePath) {
  const targetPath = path.join(DIST_DIR, relativeFilePath);
  const rewrittenHtml = await renderAssembledHtml(relativeFilePath, {
    rewriteAssetRefs: true,
  });

  await ensureDir(path.dirname(targetPath));
  await writeFile(targetPath, rewrittenHtml, 'utf8');
}

export async function copyHtmlPages() {
  const htmlFiles = await listPublicHtmlFiles();
  await Promise.all(htmlFiles.map(writeRewrittenHtml));
}

export async function copyAssets() {
  await Promise.all(
    RUNTIME_ASSET_PATHS.map((relativePath) =>
      copyDirectory(path.join(ROOT_ASSETS_DIR, relativePath), path.join(DIST_DIR, 'assets', relativePath))
    )
  );
}

export async function copyPhpRuntime() {
  await Promise.all([
    ...PHP_RUNTIME_FILES.map(async (relativePath) => {
      const targetPath = path.join(DIST_DIR, relativePath);
      await ensureDir(path.dirname(targetPath));
      await copyFile(path.join(ROOT_DIR, relativePath), targetPath);
    }),
    (async () => {
      const targetPath = path.join(DIST_DIR, '.htaccess');
      await ensureDir(path.dirname(targetPath));
      await copyFile(ROOT_HTACCESS_PATH, targetPath);
    })(),
    ...PHPMAILER_RUNTIME_FILES.map(async (relativePath) => {
      const sourcePath = path.join(ROOT_DIR, relativePath);
      const targetPath = path.join(DIST_DIR, relativePath);
      const sourceStats = await stat(sourcePath);

      if (sourceStats.isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
        return;
      }

      await ensureDir(path.dirname(targetPath));
      await copyFile(sourcePath, targetPath);
    }),
    ...PHP_RUNTIME_PARTIALS.map(async (filename) => {
      const targetPath = path.join(DIST_DIR, 'src', 'partials', filename);
      await ensureDir(path.dirname(targetPath));
      await copyFile(path.join(PARTIALS_DIR, filename), targetPath);
    }),
  ]);

  if (await pathExists(OPTIONAL_LOCAL_CONTACT_CONFIG_PATH)) {
    const targetPath = path.join(DIST_DIR, 'contact-mail.config.local.php');
    await ensureDir(path.dirname(targetPath));
    await copyFile(OPTIONAL_LOCAL_CONTACT_CONFIG_PATH, targetPath);
  }
}

export async function hasOptionalLocalContactConfig() {
  return pathExists(OPTIONAL_LOCAL_CONTACT_CONFIG_PATH);
}

function getHtmlTagAttributes(tagMarkup) {
  return Object.fromEntries(
    Array.from(tagMarkup.matchAll(/([^\s=/>]+)\s*=\s*(['"])(.*?)\2/gs), ([, name, , value]) => [
      name.toLowerCase(),
      value.trim(),
    ])
  );
}

function extractCanonicalUrl(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = getHtmlTagAttributes(match[0]);

    if (attributes.rel?.toLowerCase() === 'canonical' && attributes.href) {
      return attributes.href;
    }
  }

  return null;
}

function extractRobotsContent(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = getHtmlTagAttributes(match[0]);

    if (attributes.name?.toLowerCase() === 'robots' && attributes.content) {
      return attributes.content;
    }
  }

  return null;
}

function isIndexableRobotsContent(robotsContent) {
  if (!robotsContent) {
    return false;
  }

  const directives = robotsContent
    .toLowerCase()
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  return directives.includes('index') && !directives.includes('noindex');
}

function getSitemapPriority(relativeFilePath) {
  const normalizedPath = relativeFilePath.replaceAll('\\', '/');

  if (normalizedPath === 'index.html') {
    return '1.0';
  }

  if (LEGAL_PAGE_FILES.has(normalizedPath)) {
    return '0.4';
  }

  if (normalizedPath.startsWith('services/') || normalizedPath.startsWith('projects/')) {
    return '0.7';
  }

  return '0.8';
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function renderSitemapXml(entries) {
  const urlEntries = entries
    .map(
      ({ canonicalUrl, priority }) => `  <url>
    <loc>${escapeXml(canonicalUrl)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

export async function generateSitemapEntries() {
  const htmlFiles = await listPublicHtmlFiles();
  const pages = await Promise.all(
    htmlFiles.map(async (relativeFilePath) => {
      const sourcePath = path.join(ROOT_DIR, relativeFilePath);
      const html = await readFile(sourcePath, 'utf8');
      const canonicalUrl = extractCanonicalUrl(html);
      const robotsContent = extractRobotsContent(html);
      const indexable = isIndexableRobotsContent(robotsContent);

      if (indexable && !canonicalUrl) {
        throw new Error(`Indexable page is missing canonical URL: ${relativeFilePath}`);
      }

      return {
        relativeFilePath,
        canonicalUrl,
        indexable,
      };
    })
  );

  return pages
    .filter((page) => page.indexable && page.canonicalUrl)
    .sort((left, right) => {
      if (left.relativeFilePath === 'index.html') {
        return -1;
      }

      if (right.relativeFilePath === 'index.html') {
        return 1;
      }

      return left.relativeFilePath.localeCompare(right.relativeFilePath);
    })
    .map((page) => ({
      ...page,
      priority: getSitemapPriority(page.relativeFilePath),
    }));
}

export async function writeGeneratedSitemap(targetPath = path.join(DIST_DIR, 'sitemap.xml')) {
  const entries = await generateSitemapEntries();
  await writeFile(targetPath, renderSitemapXml(entries), 'utf8');
}

export async function copySeoFiles() {
  const rootRobotsPath = path.join(DIST_DIR, 'robots.txt');

  await copyFile(ROOT_ROBOTS_PATH, rootRobotsPath);
  await writeGeneratedSitemap();
}

function createServiceWorkerCacheName(shellContents) {
  const hash = createHash('sha256');

  shellContents.forEach(({ path: assetPath, content }) => {
    hash.update(assetPath);
    hash.update('\n');
    hash.update(content);
    hash.update('\n');
  });

  return `kp-code-shell-${hash.digest('hex').slice(0, 12)}`;
}

export async function writeServiceWorker() {
  const [template, ...shellContents] = await Promise.all([
    readFile(SERVICE_WORKER_PATH, 'utf8'),
    ...SERVICE_WORKER_SHELL_ASSETS.map(async (assetPath) => ({
      path: assetPath,
      content: await readFile(path.join(DIST_DIR, assetPath.slice(1)), 'utf8'),
    })),
  ]);

  const cacheName = createServiceWorkerCacheName(shellContents);
  const renderedServiceWorker = template
    .replace('__CACHE_NAME__', cacheName)
    .replace('__SHELL_ASSETS__', JSON.stringify(SERVICE_WORKER_SHELL_ASSETS));

  await writeFile(path.join(DIST_DIR, 'service-worker.js'), `${renderedServiceWorker}\n`, 'utf8');
}

export async function assertFileExists(filePath) {
  await stat(filePath);
}
