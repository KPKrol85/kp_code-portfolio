import { access, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  PRIMARY_PAGES,
  SHELL_MARKERS,
  renderSharedFooter,
  renderSharedHeader,
} from "./shared-shell.mjs";
import {
  CONTENT_MARKERS,
  renderHomeMaterialPanels,
  renderHomePackageCards,
  renderHomePackagesLink,
  renderMaterialsCatalog,
  renderPackagePageCards,
  validateContentData,
} from "./content-renderers.mjs";
import {
  ALL_PAGES,
  SEO_MARKERS,
  SITE,
  renderRedirects,
  renderRobots,
  renderSeoHead,
  renderSitemap,
} from "./site-config.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK_ONLY = process.argv.includes("--check");

const countOccurrences = (source, value) => source.split(value).length - 1;

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const getRegion = (source, startMarker, endMarker, file) => {
  assert(
    countOccurrences(source, startMarker) === 1,
    `${file}: expected exactly one marker ${startMarker.trim()}`,
  );
  assert(
    countOccurrences(source, endMarker) === 1,
    `${file}: expected exactly one marker ${endMarker.trim()}`,
  );

  const startIndex = source.indexOf(startMarker);
  const endIndex = source.indexOf(endMarker, startIndex);
  assert(
    endIndex > startIndex,
    `${file}: generated-region markers are out of order`,
  );

  return source.slice(startIndex, endIndex + endMarker.length);
};

const replaceRegion = (source, startMarker, endMarker, replacement, file) => {
  const currentRegion = getRegion(source, startMarker, endMarker, file);
  return source.replace(currentRegion, replacement);
};

const removeGeneratedHeadAssets = (source) =>
  source.replace(
    /^[\t ]*<link\s+rel="(?:manifest|icon)"[^>]*\/>[\t ]*(?:\n|$)/gim,
    "",
  );

const assemblePage = (source, page) => {
  const normalizedSource = removeGeneratedHeadAssets(
    source.replace(/\r\n?/g, "\n"),
  );
  const withSeo = replaceRegion(
    normalizedSource,
    SEO_MARKERS.start,
    SEO_MARKERS.end,
    renderSeoHead(page),
    page.file,
  );

  if (!PRIMARY_PAGES.includes(page)) return withSeo;

  const withHeader = replaceRegion(
    withSeo,
    SHELL_MARKERS.headerStart,
    SHELL_MARKERS.headerEnd,
    renderSharedHeader(page.key),
    page.file,
  );

  const withShell = replaceRegion(
    withHeader,
    SHELL_MARKERS.footerStart,
    SHELL_MARKERS.footerEnd,
    renderSharedFooter(),
    page.file,
  );

  let withContent = withShell;

  if (page.key === "home") {
    withContent = replaceRegion(
      withContent,
      CONTENT_MARKERS.homePackages.start,
      CONTENT_MARKERS.homePackages.end,
      renderHomePackageCards(),
      page.file,
    );
    withContent = replaceRegion(
      withContent,
      CONTENT_MARKERS.homeMaterials.start,
      CONTENT_MARKERS.homeMaterials.end,
      renderHomeMaterialPanels(),
      page.file,
    );
    withContent = replaceRegion(
      withContent,
      CONTENT_MARKERS.homePackagesLink.start,
      CONTENT_MARKERS.homePackagesLink.end,
      renderHomePackagesLink(),
      page.file,
    );
  }

  if (page.key === "packages") {
    withContent = replaceRegion(
      withContent,
      CONTENT_MARKERS.packagePage.start,
      CONTENT_MARKERS.packagePage.end,
      renderPackagePageCards(),
      page.file,
    );
  }

  if (page.key === "materials") {
    withContent = replaceRegion(
      withContent,
      CONTENT_MARKERS.materialsCatalog.start,
      CONTENT_MARKERS.materialsCatalog.end,
      renderMaterialsCatalog(),
      page.file,
    );
  }

  return withContent;
};

const getIds = (html) =>
  [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);

const getAnchorHref = (anchor) => anchor.match(/\shref="([^"]+)"/)?.[1] ?? null;
const getAttribute = (tag, name) =>
  tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1] ?? null;

const validateLocalLink = async (href, page, assembledPages) => {
  if (/^(?:https?:|mailto:|tel:)/.test(href)) return;

  const [pathname, fragment] = href.split("#");
  const targetFile = pathname
    ? pathname === "/"
      ? "index.html"
      : pathname.replace(/^\//, "")
    : page.file;

  assert(
    targetFile.endsWith(".html") && !targetFile.includes(".."),
    `${page.file}: unsupported local shell destination ${href}`,
  );

  const targetPath = resolve(ROOT, targetFile);
  await access(targetPath).catch(() => {
    throw new Error(
      `${page.file}: local shell destination does not exist: ${href}`,
    );
  });

  if (!fragment) return;
  const targetHtml =
    assembledPages.get(targetFile) ?? (await readFile(targetPath, "utf8"));
  const targetIds = new Set(getIds(targetHtml));
  assert(
    targetIds.has(fragment),
    `${page.file}: local shell fragment does not exist: ${href}`,
  );
};

const validatePage = async (html, page, assembledPages) => {
  const header = getRegion(
    html,
    SHELL_MARKERS.headerStart,
    SHELL_MARKERS.headerEnd,
    page.file,
  );
  const footer = getRegion(
    html,
    SHELL_MARKERS.footerStart,
    SHELL_MARKERS.footerEnd,
    page.file,
  );

  assert(
    header === renderSharedHeader(page.key),
    `${page.file}: shared header is stale`,
  );
  assert(
    footer === renderSharedFooter(),
    `${page.file}: shared footer is stale`,
  );
  assert(
    (html.match(/<h1\b/g) ?? []).length === 1,
    `${page.file}: expected one h1`,
  );
  assert(
    (html.match(/<main\b/g) ?? []).length === 1,
    `${page.file}: expected one main`,
  );
  assert(
    (html.match(/<main\b[^>]*\sid="main"/g) ?? []).length === 1,
    `${page.file}: main must expose id="main"`,
  );
  assert(
    (html.match(/<header\b/g) ?? []).length === 1,
    `${page.file}: expected one header`,
  );
  assert(
    (html.match(/<footer\b/g) ?? []).length === 1,
    `${page.file}: expected one footer`,
  );
  assert(
    (html.match(/<nav\b[^>]*\saria-label="Główna nawigacja"/g) ?? []).length ===
      1,
    `${page.file}: primary navigation needs one accessible name`,
  );
  assert(
    (html.match(/<a class="skip-link" href="#main">/g) ?? []).length === 1,
    `${page.file}: expected one skip link targeting #main`,
  );

  const ids = getIds(html);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert(
    duplicateIds.length === 0,
    `${page.file}: duplicate IDs: ${duplicateIds.join(", ")}`,
  );
  assert(
    ids.includes("main"),
    `${page.file}: skip-link target #main is missing`,
  );

  const currentAnchors = [
    ...header.matchAll(/<a\b[^>]*\saria-current="page"[^>]*>/g),
  ].map((match) => match[0]);
  assert(
    currentAnchors.length === 1,
    `${page.file}: expected exactly one aria-current="page" in the shared header`,
  );
  assert(
    getAnchorHref(currentAnchors[0]) === page.currentHref,
    `${page.file}: aria-current points to the wrong destination`,
  );
  if (page.key === "home") {
    assert(
      currentAnchors[0].includes('class="header__logo"'),
      `${page.file}: homepage current state must be on the home logo link`,
    );
  } else {
    assert(
      currentAnchors[0].includes('class="nav__link"'),
      `${page.file}: current state must be on the active navigation link`,
    );
  }

  assert(
    (header.match(/class="nav__item"/g) ?? []).length === 8,
    `${page.file}: expected eight nav items`,
  );
  assert(
    (header.match(/id="nav-drawer" data-drawer/g) ?? []).length === 1,
    `${page.file}: mobile drawer hook changed`,
  );
  assert(
    (
      header.match(
        /class="nav__toggle"[\s\S]*?aria-controls="nav-drawer"[\s\S]*?hidden/g,
      ) ?? []
    ).length === 1,
    `${page.file}: mobile drawer toggle baseline changed`,
  );
  assert(
    (header.match(/data-drawer-close/g) ?? []).length === 1,
    `${page.file}: mobile drawer close hook changed`,
  );
  assert(
    (header.match(/data-drawer-close hidden/g) ?? []).length === 1,
    `${page.file}: mobile drawer close baseline changed`,
  );
  assert(
    (header.match(/aria-controls="nav-drawer"/g) ?? []).length === 1,
    `${page.file}: mobile drawer relationship changed`,
  );
  assert(
    (header.match(/data-nav-toggle-label/g) ?? []).length === 1,
    `${page.file}: mobile drawer toggle label hook changed`,
  );
  assert(
    (header.match(/aria-pressed="false" data-theme-toggle hidden/g) ?? [])
      .length === 2,
    `${page.file}: theme-toggle hook changed`,
  );
  assert(
    !`${header}\n${footer}`.includes("Postępy (demo)"),
    `${page.file}: shared shell contains public demo wording`,
  );

  const generatedRegions = [];
  if (page.key === "home") {
    generatedRegions.push(
      {
        label: "homepage package cards",
        markers: CONTENT_MARKERS.homePackages,
        expected: renderHomePackageCards(),
      },
      {
        label: "homepage material panels",
        markers: CONTENT_MARKERS.homeMaterials,
        expected: renderHomeMaterialPanels(),
      },
      {
        label: "homepage package link",
        markers: CONTENT_MARKERS.homePackagesLink,
        expected: renderHomePackagesLink(),
      },
    );
  }
  if (page.key === "packages") {
    generatedRegions.push({
      label: "package-page cards",
      markers: CONTENT_MARKERS.packagePage,
      expected: renderPackagePageCards(),
    });
  }
  if (page.key === "materials") {
    generatedRegions.push({
      label: "materials catalogue",
      markers: CONTENT_MARKERS.materialsCatalog,
      expected: renderMaterialsCatalog(),
    });
  }

  for (const { label, markers, expected } of generatedRegions) {
    const region = getRegion(html, markers.start, markers.end, page.file);
    assert(region === expected, `${page.file}: generated ${label} is stale`);
    assert(
      !region.includes('href="#"'),
      `${page.file}: generated ${label} exposes a hash-only action`,
    );

    const generatedHrefs = [
      ...region.matchAll(/<a\b[^>]*\shref="([^"]+)"/g),
    ].map((match) => match[1]);
    for (const href of generatedHrefs) {
      await validateLocalLink(href, page, assembledPages);
    }
  }

  const headerLogoHrefs = [
    ...header.matchAll(/<a class="header__logo" href="([^"]+)"/g),
  ].map((match) => match[1]);
  const footerLogoHrefs = [
    ...footer.matchAll(/<a class="footer__brand" href="([^"]+)"/g),
  ].map((match) => match[1]);
  assert(
    headerLogoHrefs.length === 1 && headerLogoHrefs[0] === "/index.html",
    `${page.file}: header logo must link to /index.html`,
  );
  assert(
    footerLogoHrefs.length === 1 && footerLogoHrefs[0] === "/index.html",
    `${page.file}: footer logo must link to /index.html`,
  );

  const logoImages = [
    ...header.matchAll(/<img\b[^>]*class="header__logo-image"[^>]*>/g),
    ...footer.matchAll(/<img\b[^>]*class="footer__logo-image"[^>]*>/g),
  ].map((match) => match[0]);
  assert(
    logoImages.length === 2,
    `${page.file}: header and footer need one shared logo image each`,
  );
  for (const image of logoImages) {
    assert(
      getAttribute(image, "src") === SITE.brandLogo.path &&
        getAttribute(image, "alt") === "" &&
        getAttribute(image, "width") === String(SITE.brandLogo.width) &&
        getAttribute(image, "height") === String(SITE.brandLogo.height),
      `${page.file}: shared logo image attributes changed`,
    );
  }
  assert(
    !`${header}\n${footer}`.includes("header__logo-mark"),
    `${page.file}: obsolete generated logo mark remains`,
  );

  const shellHrefs = [
    ...`${header}\n${footer}`.matchAll(/<a\b[^>]*\shref="([^"]+)"/g),
  ].map((match) => match[1]);
  for (const href of shellHrefs) {
    await validateLocalLink(href, page, assembledPages);
  }
};

const run = async () => {
  validateContentData();

  const sourcePages = new Map();
  const assembledPages = new Map();

  for (const page of ALL_PAGES) {
    const source = await readFile(resolve(ROOT, page.file), "utf8");
    sourcePages.set(page.file, source);
    assembledPages.set(page.file, assemblePage(source, page));
  }

  for (const page of PRIMARY_PAGES) {
    await validatePage(assembledPages.get(page.file), page, assembledPages);
  }

  const stalePages = ALL_PAGES.filter(
    ({ file }) => sourcePages.get(file) !== assembledPages.get(file),
  );
  const generatedAssets = [
    { file: "sitemap.xml", content: renderSitemap() },
    { file: "robots.txt", content: renderRobots() },
    { file: "_redirects", content: renderRedirects() },
  ];
  const staleAssets = [];
  for (const asset of generatedAssets) {
    const source = await readFile(resolve(ROOT, asset.file), "utf8");
    if (source !== asset.content) staleAssets.push(asset);
  }

  if (CHECK_ONLY) {
    assert(
      stalePages.length === 0 && staleAssets.length === 0,
      `Generated output is stale in: ${[
        ...stalePages.map(({ file }) => file),
        ...staleAssets.map(({ file }) => file),
      ].join(", ")}. Run npm run build:html.`,
    );
    console.log(
      `Verified generated HTML regions for ${ALL_PAGES.length} pages, shared-shell invariants for ${PRIMARY_PAGES.length} primary pages, and ${generatedAssets.length} route assets.`,
    );
    return;
  }

  await Promise.all([
    ...stalePages.map(({ file }) =>
      writeFile(resolve(ROOT, file), assembledPages.get(file), "utf8"),
    ),
    ...staleAssets.map(({ file, content }) =>
      writeFile(resolve(ROOT, file), content, "utf8"),
    ),
  ]);
  console.log(
    `Assembled generated HTML and route assets (${stalePages.length} pages and ${staleAssets.length} route assets updated).`,
  );
};

run().catch((error) => {
  console.error(
    `HTML shell ${CHECK_ONLY ? "check" : "build"} failed: ${error.message}`,
  );
  process.exitCode = 1;
});
