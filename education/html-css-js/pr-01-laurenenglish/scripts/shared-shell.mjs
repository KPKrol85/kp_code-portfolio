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
  { key: "packages", label: "Pakiety", href: "/pakiety.html" },
  { key: "materials", label: "Materiały", href: "/materialy.html" },
  { key: "progress", label: "Postępy", href: "/postepy.html" },
  { label: "Metodyka", href: "/index.html#how" },
  { label: "O Lauren", href: "/index.html#about" },
  { label: "FAQ", href: "/index.html#faq" },
  { key: "contact", label: "Kontakt", href: "/kontakt.html" },
]);

const FOOTER_OFFER_LINKS = Object.freeze([
  { label: "Usługi", href: "/uslugi.html" },
  { label: "Pakiety", href: "/pakiety.html" },
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
  {
    label: "GitHub",
    href: "https://github.com/KPKrol85",
    viewBox: "0 0 448 512",
    pathData:
      "M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM223.7 96c-88.4 0-159.7 72.2-159.7 160.6 0 69.4 44.1 126.9 103.4 148.4 8.4 3.1 16.6-2.5 16.6-10.9l0-25c-4.4 1.9-10 3.1-15 3.1-20.6 0-32.8-11.2-41.6-32.2-3.4-8.4-7.2-13.4-14.4-14.4-3.7-.3-5-1.9-5-3.8 0-3.7 6.2-6.6 12.5-6.6 9.1 0 16.9 5.6 25 17.2 6.2 9.1 12.8 13.1 20.6 13.1s12.8-2.8 20-10c5.3-5.3 9.4-10 13.1-13.1-41.3-5-70.3-34.7-70.3-73.1 0-15.6 5.6-32.5 15-43.8-4.1-10.3-3.4-32.2 1.2-41.2 12.5-1.6 29.4 5 39.4 14.1 11.9-3.7 24.4-5.6 39.7-5.6s27.8 1.9 39.1 5.3c9.7-8.8 26.9-15.3 39.4-13.8 4.4 8.4 5 30.3 .9 40.9 10 11.9 15.3 27.8 15.3 44.1 0 38.4-29.1 67.5-70.9 72.8 10.6 6.9 17.8 21.9 17.8 39.1l0 32.5c0 9.4 7.8 14.7 17.2 10.9 56.6-21.6 100.9-78.1 100.9-148.1 0-88.4-71.9-160.6-160.3-160.6z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/kpkrol85",
    viewBox: "0 0 448 512",
    pathData:
      "M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l98.2 0 0-145.8-52.8 0 0-78.2 52.8 0 0-33.7c0-87.1 39.4-127.5 125-127.5 16.2 0 44.2 3.2 55.7 6.4l0 70.8c-6-.6-16.5-1-29.6-1-42 0-58.2 15.9-58.2 57.2l0 27.8 83.6 0-14.4 78.2-69.3 0 0 145.8 129 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32z",
  },
  {
    label: "X",
    href: "https://x.com/KP_Code_85",
    viewBox: "0 0 448 512",
    pathData:
      "M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm297.1 84l-103.8 118.6 122.1 161.4-95.6 0-74.8-97.9-85.7 97.9-47.5 0 111-126.9-117.1-153.1 98 0 67.7 89.5 78.2-89.5 47.5 0zM323.3 367.6l-169.9-224.7-28.3 0 171.8 224.7 26.4 0z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kp-code/",
    viewBox: "0 0 448 512",
    pathData:
      "M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm5 170.2l66.5 0 0 213.8-66.5 0 0-213.8zm71.7-67.7a38.5 38.5 0 1 1 -77 0 38.5 38.5 0 1 1 77 0zM317.9 416l0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2-66.4 0z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kp_code_/",
    viewBox: "0 0 448 512",
    pathData:
      "M194.4 211.7a53.3 53.3 0 1 0 59.2 88.6 53.3 53.3 0 1 0 -59.2-88.6zm142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12-18.1-7.1-57.6-6.8-83.1-6.5-4.1 0-7.9 .1-11.2 .1s-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2 0 4.1 .1 7.9 .1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2 2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5 4.1 0 7.9-.1 11.2-.1s7.2 0 11.4 .1c25.5 .3 64.8 .7 82.9-6.5 6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83 0-4.2-.1-8.1-.1-11.4s0-7.1 .1-11.4c.3-25.5 .7-64.9-6.5-83-2.7-6.9-6.8-13.1-12-18.4l0 .2zm-67.1 44.5c18.1 12.1 30.6 30.9 34.9 52.2s-.2 43.5-12.3 61.6c-6 9-13.7 16.6-22.6 22.6s-19 10.1-29.6 12.2c-21.3 4.2-43.5-.2-61.6-12.3s-30.6-30.9-34.9-52.2 .2-43.5 12.2-61.6 30.9-30.6 52.2-34.9 43.5 .2 61.6 12.2l.1 0zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1 2.6-7.1 5.2-9.8 6.1-4.5 9.8-5.2 7.6-.4 11.1 1.1 6.5 3.9 8.6 7 3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2-3.9 3.2-6.2 4.2-4.8 1.5-7.3 1.5c-3.8 0-7.5-1.1-10.6-3.2l-.1 0zM448 96c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320zM357 389c-18.7 18.7-41.4 24.6-67 25.9-26.4 1.5-105.6 1.5-132 0-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132 1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0 25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9-1.3 25.6-7.1 48.3-25.8 67l0 .1z",
  },
]);

const FOOTER_SOCIAL_ICON_ATTRIBUTION =
  "<!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->";

export const FOOTER_COPYRIGHT =
  "© 2026 KP_Code Digital Studio | Wszelkie prawa zastrzeżone.";

export const FOOTER_BRAND_DESCRIPTION =
  "Indywidualna nauka angielskiego dopasowana do Twoich celów, poziomu i tempa. Spokojnie, konkretnie i bez chaosu.";

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
    ({ label, href, viewBox, pathData }) => `          <li>
            <a class="footer__social-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label} — KP_Code Digital Studio">
              <svg class="footer__social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" aria-hidden="true" focusable="false" fill="currentColor">
                ${FOOTER_SOCIAL_ICON_ATTRIBUTION}
                <path d="${pathData}" />
              </svg>
            </a>
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
          <div class="footer__brand-block">
            <a class="footer__brand" href="/index.html">
              <img class="footer__logo-image" src="${SITE.brandLogo.path}" alt="" width="${SITE.brandLogo.width}" height="${SITE.brandLogo.height}" />
              <span class="footer__brand-text">Lauren – Clean English</span>
            </a>
            <p class="footer__text">${FOOTER_BRAND_DESCRIPTION}</p>
          </div>
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
        <h2 class="footer__social-title" id="footer-social-title">SOCIAL MEDIA</h2>
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
