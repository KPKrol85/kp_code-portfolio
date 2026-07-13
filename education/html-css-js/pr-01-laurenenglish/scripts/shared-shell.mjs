import { INDEXABLE_PAGES, SITE } from "./site-config.mjs";

export const PRIMARY_PAGES = INDEXABLE_PAGES;

export const SHELL_MARKERS = Object.freeze({
  headerStart: "    <!-- shared-shell:header:start -->",
  headerEnd: "    <!-- shared-shell:header:end -->",
  footerStart: "    <!-- shared-shell:footer:start -->",
  footerEnd: "    <!-- shared-shell:footer:end -->",
});

const NAV_ITEMS = Object.freeze([
  { key: "services", label: "Usługi", href: "/uslugi.html" },
  { key: "packages", label: "Pakiety", href: "/pakiety.html#pakiety" },
  { key: "materials", label: "Materiały", href: "/materialy.html" },
  { key: "progress", label: "Postępy", href: "/postepy.html" },
  { label: "Metodyka", href: "/index.html#how" },
  { label: "O Lauren", href: "/index.html#about" },
  { label: "FAQ", href: "/index.html#faq" },
  { label: "Kontakt", href: "/index.html#contact" },
]);

const FOOTER_LINKS = Object.freeze([
  { label: "Usługi", href: "/uslugi.html" },
  { label: "Pakiety", href: "/pakiety.html#pakiety" },
  { label: "Materiały", href: "/materialy.html" },
  { label: "Postępy", href: "/postepy.html" },
  { label: "Kontakt", href: "/index.html#contact" },
]);

const getPage = (pageKey) => {
  const page = PRIMARY_PAGES.find(({ key }) => key === pageKey);
  if (!page) {
    throw new Error(`Unknown primary page key: ${pageKey}`);
  }
  return page;
};

const renderNavItems = (pageKey) =>
  NAV_ITEMS.map(({ key, label, href }) => {
    const current = key === pageKey ? ' aria-current="page"' : "";
    return `              <li class="nav__item">
                <a class="nav__link" href="${href}"${current}>${label}</a>
              </li>`;
  }).join("\n");

const renderFooterLinks = (links) =>
  links
    .map(({ label, href }) => {
      return `            <li><a href="${href}">${label}</a></li>`;
    })
    .join("\n");

export const renderSharedHeader = (pageKey) => {
  getPage(pageKey);
  const logoCurrent = pageKey === "home" ? ' aria-current="page"' : "";
  const preservedHomeAnnotation =
    pageKey === "home" ? "\n\n    <!-- Header -->" : "";
  const navToggleStart =
    pageKey === "home"
      ? '          <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-drawer" hidden>'
      : `          <button
            class="nav__toggle"
            type="button"
            aria-expanded="false"
            aria-controls="nav-drawer"
            hidden
          >`;

  return `${SHELL_MARKERS.headerStart}
    <a class="skip-link" href="#main">Przejdź do treści</a>${preservedHomeAnnotation}
    <header class="header" id="top">
      <div class="container header__inner">
        <a class="header__logo" href="/index.html" aria-label="Lauren – Clean English"${logoCurrent}>
          <img class="header__logo-image" src="${SITE.brandLogo.path}" alt="" width="${SITE.brandLogo.width}" height="${SITE.brandLogo.height}" />
          <span class="header__logo-text">Lauren – Clean English</span>
        </a>
        <nav class="nav" aria-label="Główna nawigacja">
${navToggleStart}
            <span class="nav__toggle-line"></span>
            <span class="nav__toggle-line"></span>
            <span class="nav__toggle-line"></span>
            <span class="sr-only" data-nav-toggle-label>Otwórz menu</span>
          </button>
          <div class="nav__drawer" id="nav-drawer" data-drawer>
            <div class="nav__drawer-header">
              <span class="nav__drawer-title">Menu</span>
              <button class="nav__close" type="button" data-drawer-close hidden>
                <span aria-hidden="true">×</span>
                <span class="sr-only">Zamknij menu</span>
              </button>
            </div>
            <ul class="nav__list" role="list">
${renderNavItems(pageKey)}
            </ul>
            <button class="button button--ghost nav__theme" type="button" aria-pressed="false" data-theme-toggle hidden>
              <span class="button__icon" aria-hidden="true">🌓</span>
              <span>Tryb ciemny</span>
            </button>
            <a class="button button--primary nav__cta" href="/index.html#contact">Informacje o zapisach</a>
          </div>
        </nav>
        <div class="header__actions">
          <button class="button button--ghost" type="button" aria-pressed="false" data-theme-toggle hidden>
            <span class="button__icon" aria-hidden="true">🌓</span>
            <span>Tryb ciemny</span>
          </button>
          <a class="button button--primary header__cta" href="/index.html#contact">Informacje o zapisach</a>
        </div>
      </div>
    </header>
${SHELL_MARKERS.headerEnd}`;
};

export const renderSharedFooter = () => `${SHELL_MARKERS.footerStart}
    <footer class="footer">
      <div class="container footer__grid">
        <div>
          <a class="footer__brand" href="/index.html">
            <img class="footer__logo-image" src="${SITE.brandLogo.path}" alt="" width="${SITE.brandLogo.width}" height="${SITE.brandLogo.height}" />
            <span class="footer__brand-text">Lauren – Clean English</span>
          </a>
          <p class="footer__text">Profesjonalny angielski w spokojnym rytmie.</p>
        </div>
        <div>
          <h3 class="footer__title">Linki</h3>
          <ul class="footer__list" role="list">
${renderFooterLinks(FOOTER_LINKS)}
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>Lauren – Clean English — informacje o nauce angielskiego i materiałach.</p>
      </div>
    </footer>
${SHELL_MARKERS.footerEnd}`;
