export const PRIMARY_PAGES = Object.freeze([
  { key: "home", file: "index.html", currentHref: "/index.html" },
  { key: "services", file: "uslugi.html", currentHref: "/uslugi.html" },
  {
    key: "packages",
    file: "pakiety.html",
    currentHref: "/pakiety.html#pakiety",
  },
  { key: "materials", file: "materialy.html", currentHref: "/materialy.html" },
  { key: "progress", file: "postepy.html", currentHref: "/postepy.html" },
]);

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
  { label: "Opinie", href: "/index.html#testimonials" },
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

const SOCIAL_LINKS = Object.freeze([
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
]);

const LEGAL_LINKS = Object.freeze([
  { label: "Polityka prywatności", href: "/offline.html" },
  { label: "Regulamin", href: "/offline.html" },
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

const renderFooterLinks = (links, { external = false } = {}) =>
  links
    .map(({ label, href }) => {
      const rel = external ? ' rel="noreferrer"' : "";
      return `            <li><a href="${href}"${rel}>${label}</a></li>`;
    })
    .join("\n");

export const renderSharedHeader = (pageKey) => {
  getPage(pageKey);
  const logoCurrent = pageKey === "home" ? ' aria-current="page"' : "";

  return `${SHELL_MARKERS.headerStart}
    <a class="skip-link" href="#main">Przejdź do treści</a>
    <header class="header" id="top">
      <div class="container header__inner">
        <a class="header__logo" href="/index.html" aria-label="Lauren – Clean English"${logoCurrent}>
          <span class="header__logo-mark">LC</span>
          <span class="header__logo-text">Lauren – Clean English</span>
        </a>
        <nav class="nav" aria-label="Główna nawigacja">
          <button
            class="nav__toggle"
            type="button"
            aria-expanded="false"
            aria-controls="nav-drawer"
            hidden
          >
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
            <a class="button button--primary nav__cta" href="/index.html#contact">Umów lekcję</a>
          </div>
        </nav>
        <div class="header__actions">
          <button class="button button--ghost" type="button" aria-pressed="false" data-theme-toggle hidden>
            <span class="button__icon" aria-hidden="true">🌓</span>
            <span>Tryb ciemny</span>
          </button>
          <a class="button button--primary header__cta" href="/index.html#contact">Umów lekcję</a>
        </div>
      </div>
    </header>
${SHELL_MARKERS.headerEnd}`;
};

export const renderSharedFooter = () => `${SHELL_MARKERS.footerStart}
    <footer class="footer">
      <div class="container footer__grid">
        <div>
          <a class="header__logo" href="/index.html">
            <span class="header__logo-mark">LC</span>
            <span class="header__logo-text">Lauren – Clean English</span>
          </a>
          <p class="footer__text">Profesjonalny angielski w spokojnym rytmie.</p>
        </div>
        <div>
          <h3 class="footer__title">Linki</h3>
          <ul class="footer__list" role="list">
${renderFooterLinks(FOOTER_LINKS)}
          </ul>
        </div>
        <div>
          <h3 class="footer__title">Social</h3>
          <ul class="footer__list" role="list">
${renderFooterLinks(SOCIAL_LINKS, { external: true })}
          </ul>
        </div>
        <div>
          <h3 class="footer__title">Legal</h3>
          <ul class="footer__list" role="list">
${renderFooterLinks(LEGAL_LINKS)}
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© 2026 Lauren – Clean English. Wszystkie prawa zastrzeżone.</p>
      </div>
    </footer>
${SHELL_MARKERS.footerEnd}`;
