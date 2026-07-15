import { INDEXABLE_PAGES, SHARED_SHELL_PAGES, SITE } from "./site-config.mjs";

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
  { key: "contact", label: "Kontakt", href: "/kontakt.html" },
]);

const FOOTER_OFFER_LINKS = Object.freeze([
  { label: "Usługi", href: "/uslugi.html" },
  { label: "Pakiety", href: "/pakiety.html#pakiety" },
  { label: "Materiały", href: "/materialy.html" },
  { label: "Postępy", href: "/postepy.html" },
  { label: "FAQ", href: "/index.html#faq" },
]);

export const FOOTER_CONTACT = Object.freeze({
  phone: "+48 533 537 091",
  telephoneUri: "tel:+48533537091",
  email: "kontakt@kp-code.pl",
  emailUri: "mailto:kontakt@kp-code.pl",
  address: "ul. Marynarki Wojennej 12/31, 33-100 Tarnów, Polska",
});

export const FOOTER_LEGAL_LINKS = Object.freeze([
  { label: "Polityka prywatności", href: "/polityka-prywatnosci.html" },
  { label: "Regulamin", href: "/regulamin.html" },
  { label: "Polityka cookies", href: "/cookies.html" },
]);

const FOOTER_INFORMATION_LINKS = Object.freeze([
  { label: "O Lauren", href: "/index.html#about" },
  { label: "Kontakt", href: "/kontakt.html" },
  ...FOOTER_LEGAL_LINKS,
]);

export const FOOTER_SOCIAL_LINKS = Object.freeze([
  { label: "GitHub", href: "https://github.com/KPKrol85" },
  { label: "Facebook", href: "https://www.facebook.com/kpkrol85" },
  { label: "X", href: "https://x.com/KP_Code_85" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kp-code/" },
  { label: "Instagram", href: "https://www.instagram.com/kp_code_/" },
]);

export const FOOTER_COPYRIGHT =
  "© 2026 KP_Code Digital Studio | Wszelkie prawa zastrzeżone.";

const getPage = (pageKey) => {
  const page = SHARED_SHELL_PAGES.find(({ key }) => key === pageKey);
  if (!page) {
    throw new Error(`Unknown shared-shell page key: ${pageKey}`);
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

const renderSocialLinks = () =>
  FOOTER_SOCIAL_LINKS.map(
    ({ label, href }) => `          <li>
            <a class="footer__social-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label} – KP_Code Digital Studio (otwiera się w nowej karcie)">${label}</a>
          </li>`,
  ).join("\n");

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
            </div>
            <ul class="nav__list" role="list">
${renderNavItems(pageKey)}
            </ul>
            <button class="button button--ghost theme-toggle nav__theme" type="button" aria-label="Włącz tryb ciemny" aria-pressed="false" data-theme-toggle hidden>
              <span class="theme-toggle__icons" aria-hidden="true">
                <img class="theme-toggle__icon theme-toggle__icon--sun" src="/assets/icons/sun.svg" alt="" width="24" height="24" />
                <img class="theme-toggle__icon theme-toggle__icon--moon" src="/assets/icons/moon.svg" alt="" width="24" height="24" />
              </span>
            </button>
            <a class="button button--primary nav__cta" href="/kontakt.html#formularz">Umów rozmowę</a>
          </div>
        </nav>
        <div class="header__actions">
        <a class="button button--primary header__cta" href="/kontakt.html#formularz">Umów rozmowę</a>
          <button class="button button--ghost theme-toggle" type="button" aria-label="Włącz tryb ciemny" aria-pressed="false" data-theme-toggle hidden>
            <span class="theme-toggle__icons" aria-hidden="true">
              <img class="theme-toggle__icon theme-toggle__icon--sun" src="/assets/icons/sun.svg" alt="" width="24" height="24" />
              <img class="theme-toggle__icon theme-toggle__icon--moon" src="/assets/icons/moon.svg" alt="" width="24" height="24" />
            </span>
          </button>
        </div>
      </div>
    </header>
${SHELL_MARKERS.headerEnd}`;
};

export const renderSharedFooter = () => `${SHELL_MARKERS.footerStart}
    <footer class="footer">
      <div class="container footer__grid">
        <section class="footer__column footer__column--brand" aria-labelledby="footer-brand-title">
          <h2 class="sr-only" id="footer-brand-title">Marka</h2>
          <a class="footer__brand" href="/index.html">
            <img class="footer__logo-image" src="${SITE.brandLogo.path}" alt="" width="${SITE.brandLogo.width}" height="${SITE.brandLogo.height}" />
            <span class="footer__brand-text">Lauren – Clean English</span>
          </a>
          <p class="footer__text">Profesjonalny angielski w spokojnym rytmie.</p>
        </section>
        <section class="footer__column" aria-labelledby="footer-offer-title">
          <h2 class="footer__title" id="footer-offer-title">Oferta</h2>
          <ul class="footer__list" role="list">
${renderFooterLinks(FOOTER_OFFER_LINKS)}
          </ul>
        </section>
        <section class="footer__column" aria-labelledby="footer-contact-title">
          <h2 class="footer__title" id="footer-contact-title">Kontakt</h2>
          <ul class="footer__list footer__list--contact" role="list">
            <li><a class="footer__contact-link" href="${FOOTER_CONTACT.telephoneUri}">${FOOTER_CONTACT.phone}</a></li>
            <li><a class="footer__contact-link" href="${FOOTER_CONTACT.emailUri}">${FOOTER_CONTACT.email}</a></li>
            <li><address class="footer__address">${FOOTER_CONTACT.address}</address></li>
            <li><a class="footer__quiet-link" href="/kontakt.html">Przejdź do strony kontaktowej</a></li>
          </ul>
        </section>
        <section class="footer__column" aria-labelledby="footer-information-title">
          <h2 class="footer__title" id="footer-information-title">Informacje</h2>
          <ul class="footer__list" role="list">
${renderFooterLinks(FOOTER_INFORMATION_LINKS)}
          </ul>
        </section>
      </div>
      <section class="container footer__social" aria-labelledby="footer-social-title">
        <h2 class="footer__social-title" id="footer-social-title">KP_Code Digital Studio w sieci</h2>
        <ul class="footer__social-list" role="list">
${renderSocialLinks()}
        </ul>
      </section>
      <div class="footer__bottom">
        <div class="container">
          <p>${FOOTER_COPYRIGHT}</p>
        </div>
      </div>
    </footer>
${SHELL_MARKERS.footerEnd}`;
