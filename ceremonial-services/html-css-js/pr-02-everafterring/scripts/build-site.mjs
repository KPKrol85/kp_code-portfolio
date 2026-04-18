import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const pagesDir = path.join(srcDir, 'pages');

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const replaceBlockToken = (source, token, value) =>
  source.replace(new RegExp(`[\\t ]*{{${token}}}[\\t ]*`, 'g'), `\n${value.trim()}\n`);

const replaceInlineTokens = (source, replacements) =>
  Object.entries(replacements).reduce((html, [token, value]) => html.replaceAll(`{{${token}}}`, value), source);

const readText = (relativePath) => readFile(path.join(rootDir, relativePath), 'utf8');

const readPartial = (name) => readText(path.join('src', 'partials', name));

const buildServicesLinks = (useLocalAnchors) => {
  const prefix = useLocalAnchors ? '' : 'uslugi.html';
  return {
    servicesOverviewHref: 'uslugi.html',
    servicesSaleHref: `${prefix}#sale`,
    servicesDecorHref: `${prefix}#wystroj`,
    servicesTransportHref: `${prefix}#transport`,
    servicesCoordinationHref: `${prefix}#koordynacja`,
    servicesVendorsHref: `${prefix}#dostawcy`
  };
};

const buildHeader = (template, page) => {
  const current = (target) => (page.activeNav === target ? ' aria-current="page"' : '');
  const servicesLinks = buildServicesLinks(page.servicesLinksMode === 'local');

  return replaceInlineTokens(template, {
    homeCurrent: current('home'),
    ofertaCurrent: current('oferta'),
    realizacjeCurrent: current('realizacje'),
    onasCurrent: current('o-nas'),
    kontaktCurrent: current('kontakt'),
    servicesOverviewCurrent: page.activeNav === 'uslugi' ? ' aria-current="page"' : '',
    ...servicesLinks
  });
};

const buildPage = async (page, partials) => {
  const template = await readText(path.join('src', 'pages', page.template));
  let output = replaceInlineTokens(template, {
    title: escapeHtml(page.title),
    description: escapeHtml(page.description),
    canonical: escapeHtml(page.canonical)
  });

  output = replaceBlockToken(output, 'sharedHead', partials.sharedHead);
  output = replaceBlockToken(output, 'header', buildHeader(partials.header, page));
  output = replaceBlockToken(output, 'footer', partials.footer);
  output = replaceBlockToken(output, 'entryScript', partials.entryScript);

  const formatted = await prettier.format(output, {
    parser: 'html',
    printWidth: 120,
    singleQuote: true,
    htmlWhitespaceSensitivity: 'css'
  });

  await writeFile(path.join(rootDir, page.output), formatted, 'utf8');
};

const buildSite = async () => {
  await mkdir(pagesDir, { recursive: true });

  const pages = JSON.parse(await readText('src/pages.json'));
  const [sharedHead, header, footer, entryScript] = await Promise.all([
    readPartial('shared-head.html'),
    readPartial('header.html'),
    readPartial('footer.html'),
    readPartial('entry-script.html')
  ]);

  const partials = { sharedHead, header, footer, entryScript };

  for (const page of pages) {
    await buildPage(page, partials);
  }

  console.log(`Built ${pages.length} static page(s).`);
};

await buildSite();
