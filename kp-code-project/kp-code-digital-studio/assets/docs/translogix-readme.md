# TransLogix

## PL

### Przegląd projektu

TransLogix to statyczny, wielostronicowy projekt front-endowy dla marki transportowo-logistycznej. Repozytorium jest przygotowane jako portfolio/reference build KP_Code Digital Studio: źródła są jawne, build jest powtarzalny, a jakość jest weryfikowana przez skrypty npm i testy Playwright.

Projekt nie używa frameworka front-endowego ani backendu aplikacyjnego. Warstwa runtime opiera się na HTML, modularnym CSS i Vanilla JavaScript w modułach ES. Pliki źródłowe są kanoniczne, a `dist/`, `assets/css/style.min.css` i `assets/js/main.min.js` są artefaktami generowanymi przez build.

### Kluczowe funkcje

- Wielostronicowa struktura: strona główna, usługi, szczegóły usługi, flota, cennik, kontakt, strony prawne, 404 i fallback offline.
- Wspólne partiale nagłówka i stopki w `partials/`, z kopiami szablonowymi w `templates/partials/`.
- Nawigacja mobilna, kompaktowy nagłówek, przełącznik motywu, aktywny stan nawigacji i panel zgody.
- Zakładki, akordeon FAQ, filtrowanie usług, filtrowanie floty, lightbox galerii i strona szczegółów usługi oparta o dane JSON.
- Formularz kontaktowy z atrybutami Netlify Forms, honeypotem i walidacją po stronie klienta.
- Service worker z precache stron root, fallbackiem offline i strategią stale-while-revalidate dla assetów.
- Web App Manifest z ikonami, skrótami i screenshotami.
- Skrypty build, QA, weryfikacji assetów, budżetów wydajnościowych, Lighthouse CI i testów E2E.

### Stack technologiczny

Runtime:

- HTML5
- CSS importowany modularnie przez `assets/css/style.css`
- Vanilla JavaScript jako ES modules
- Service Worker API
- Web App Manifest

Build i QA:

- Node.js / npm
- PostCSS, `postcss-import`, Autoprefixer, cssnano
- `html-validate`
- `pa11y-ci`
- Playwright
- Lighthouse CI
- `http-server`
- Sharp

### Struktura projektu

```text
.
├── *.html                         # źródłowe strony root
├── assets/
│   ├── css/
│   │   ├── style.css              # źródłowy entrypoint CSS
│   │   └── modules/               # settings, base, layout, components, utilities, pages
│   ├── data/
│   │   ├── services.json          # dane usług
│   │   └── jsonld/                # pliki danych strukturalnych
│   ├── fonts/                     # lokalne fonty woff2
│   ├── icons/                     # favicony, manifest i ikony aplikacji
│   ├── img/                       # obrazy, SVG, OG images i screenshoty
│   └── js/                        # moduły interakcji front-end
├── partials/                      # wspólny header i footer
├── templates/partials/            # kopie szablonowe partiali
├── scripts/                       # build, walidacja i weryfikacja
├── tests/e2e/                     # testy Playwright
├── dist/                          # generowany output builda
├── _headers                       # nagłówki i polityki cache dla hostingu statycznego
├── _redirects                     # reguły przekierowań/przepisania ścieżek
├── robots.txt
├── sitemap.xml
└── sw.js
```

### Instalacja i konfiguracja

```bash
npm install
```

Zależności developerskie są zdefiniowane w `package.json` i zablokowane w `package-lock.json`. Pakiet jest oznaczony jako prywatny.

### Development lokalny

Projekt nie ma osobnego skryptu `dev`. Do pracy edytuj pliki źródłowe: root `*.html`, `partials/`, `assets/css/modules/`, `assets/js/`, `assets/data/` i `scripts/`.

Po zbudowaniu paczki produkcyjnej można uruchomić lokalny podgląd `dist/`:

```bash
npm run preview:dist
```

### Build produkcyjny

```bash
npm run build
```

Najważniejsze skrypty builda:

- `npm run build:css` - generuje `assets/css/style.min.css` z `assets/css/style.css`.
- `npm run build:js` - generuje `assets/js/main.min.js`.
- `npm run build:assets` - uruchamia build CSS i JS.
- `npm run build:dist` - buduje `dist/`, kopiuje strony i assety, inlinuje header/footer oraz przepisuje referencje na minifikowane assety.
- `npm run clean` - usuwa `dist/`.

### Deployment

Repozytorium zawiera pliki wspierające hosting statyczny:

- `_headers` z nagłówkami bezpieczeństwa, CSP i politykami cache.
- `_redirects` z regułami dla ścieżek `/services`, `/fleet`, `/pricing`, `/contact` oraz przekierowaniem `/index.html`.
- `robots.txt` wskazujący sitemap.
- `sitemap.xml` z publicznymi adresami stron.
- `sw.js` i `assets/icons/site.webmanifest`.

### Dostępność

Projekt zawiera dostępnościowe wzorce widoczne w kodzie:

- Skip linki prowadzące do `main id="main"`.
- Semantyczne landmarki, nagłówki, nawigacje i sekcje.
- Stany ARIA dla menu mobilnego, zakładek, akordeonu i lightboxa.
- `aria-live`, `aria-invalid` i fokusowanie pierwszego niepoprawnego pola w formularzu.
- Widoczne style `:focus-visible`.
- Obsługa `prefers-reduced-motion` w CSS i wybranych modułach JS.
- Automatyczny `pa11y-ci` skonfigurowany dla 11 stron root w standardzie WCAG2AA.

### SEO

Źródła zawierają zweryfikowane elementy SEO i social metadata:

- Tytuły stron i `meta description`.
- Linki canonical na głównych stronach biznesowych i prawnych.
- Open Graph i Twitter Card metadata.
- Inline JSON-LD w stronach root.
- Dane JSON-LD w `assets/data/jsonld/` oraz walidator `npm run qa:jsonld`.
- `robots.txt`, `sitemap.xml` i obrazy OG w `assets/img/og-img/`.

### Wydajność

Repozytorium zawiera jawne mechanizmy wydajnościowe:

- Minifikacja CSS i JS w pipeline builda.
- Budżety gzip dla `assets/css/style.min.css` i grafu modułów `assets/js/main.min.js`.
- Lokalne fonty `woff2` z `font-display: swap`.
- Obrazy w formatach AVIF, WebP, JPG, PNG i SVG.
- `image-set()` dla obrazów hero oraz `loading="lazy"` i wymiary na wybranych obrazach.
- Service worker z precache stron root i runtime cachingiem assetów.

### Quality Assurance

Główne komendy:

```bash
npm run qa
npm run release-check
npm run test:e2e
```

Dostępne kontrole szczegółowe:

```bash
npm run qa:html
npm run qa:jsonld
npm run qa:links
npm run qa:a11y
npm run qa:budget
npm run qa:lighthouse
npm run assets:verify
```

Zakres:

- `qa` uruchamia walidacje HTML, JSON-LD, linków lokalnych i dostępności.
- `release-check` uruchamia finalną lokalną bramkę: `qa`, `assets:verify`, `qa:budget` i `test:e2e`.
- `test:e2e` uruchamia Playwright na zbudowanym `dist/`.
- Testy E2E obejmują formularz kontaktowy, lightbox floty, nawigację mobilną, stronę offline, service worker/offline fallback i filtrowanie usług.
- `qa:lighthouse` używa konfiguracji Lighthouse CI dla strony głównej, usług i kontaktu.

### Utrzymanie projektu

- Edytuj źródła, nie artefakty: `dist/`, `assets/css/style.min.css` i `assets/js/main.min.js` są generowane.
- Zmiany w headerze i footerze utrzymuj w `partials/`; `templates/partials/` przechowuje kopie szablonowe.
- Po zmianach w assetach, ścieżkach lub service workerze uruchamiaj `npm run assets:verify` i `npm run qa:links`.
- Po zmianach w HTML uruchamiaj `npm run qa:html` i odpowiednie testy dostępności.
- Po zmianach w interakcjach uruchamiaj odpowiednie testy Playwright albo `npm run release-check`.

### Roadmap

- Dodać computed contrast checks albo visual regression dla kluczowych widoków.
- Rozszerzyć Playwright o warianty strony szczegółów usługi i przypadki brzegowe formularza kontaktowego.
- Doprecyzować dokumentację workflow preview/deployment po wyborze docelowego hostingu.

### Licencja

`UNLICENSED` zgodnie z deklaracją w `package.json`.

---

## EN

### Project Overview

TransLogix is a static multi-page front-end project for a transport and logistics brand. The repository is prepared as a KP_Code Digital Studio portfolio/reference build: sources are explicit, the build is repeatable, and quality is verified through npm scripts and Playwright tests.

The project does not use a front-end framework or an application backend. The runtime layer is built with HTML, modular CSS, and Vanilla JavaScript ES modules. Source files are canonical, while `dist/`, `assets/css/style.min.css`, and `assets/js/main.min.js` are generated build artifacts.

### Key Features

- Multi-page structure: home, services, service detail, fleet, pricing, contact, legal pages, 404, and offline fallback.
- Shared header and footer partials in `partials/`, with template copies in `templates/partials/`.
- Mobile navigation, compact header, theme toggle, active navigation state, and consent panel.
- Tabs, FAQ accordion, services filtering, fleet filtering, gallery lightbox, and JSON data-driven service detail page.
- Contact form with Netlify Forms attributes, honeypot field, and client-side validation.
- Service worker with root-page precache, offline fallback, and stale-while-revalidate strategy for assets.
- Web App Manifest with icons, shortcuts, and screenshots.
- Build, QA, asset verification, performance budget, Lighthouse CI, and E2E test scripts.

### Tech Stack

Runtime:

- HTML5
- CSS imported modularly through `assets/css/style.css`
- Vanilla JavaScript as ES modules
- Service Worker API
- Web App Manifest

Build and QA:

- Node.js / npm
- PostCSS, `postcss-import`, Autoprefixer, cssnano
- `html-validate`
- `pa11y-ci`
- Playwright
- Lighthouse CI
- `http-server`
- Sharp

### Project Structure

```text
.
├── *.html                         # root source pages
├── assets/
│   ├── css/
│   │   ├── style.css              # source CSS entrypoint
│   │   └── modules/               # settings, base, layout, components, utilities, pages
│   ├── data/
│   │   ├── services.json          # services data
│   │   └── jsonld/                # structured data files
│   ├── fonts/                     # local woff2 fonts
│   ├── icons/                     # favicons, manifest, and app icons
│   ├── img/                       # images, SVG, OG images, and screenshots
│   └── js/                        # front-end interaction modules
├── partials/                      # shared header and footer
├── templates/partials/            # template copies of partials
├── scripts/                       # build, validation, and verification
├── tests/e2e/                     # Playwright tests
├── dist/                          # generated build output
├── _headers                       # headers and cache policies for static hosting
├── _redirects                     # redirect/rewrite rules
├── robots.txt
├── sitemap.xml
└── sw.js
```

### Setup and Installation

```bash
npm install
```

Development dependencies are declared in `package.json` and locked in `package-lock.json`. The package is marked as private.

### Local Development

The project has no separate `dev` script. For development, edit source files: root `*.html`, `partials/`, `assets/css/modules/`, `assets/js/`, `assets/data/`, and `scripts/`.

After generating the production package, preview `dist/` locally:

```bash
npm run preview:dist
```

### Production Build

```bash
npm run build
```

Main build scripts:

- `npm run build:css` - generates `assets/css/style.min.css` from `assets/css/style.css`.
- `npm run build:js` - generates `assets/js/main.min.js`.
- `npm run build:assets` - runs the CSS and JS builds.
- `npm run build:dist` - builds `dist/`, copies pages and assets, inlines header/footer, and rewrites references to minified assets.
- `npm run clean` - removes `dist/`.

### Deployment

The repository contains files that support static hosting:

- `_headers` with security headers, CSP, and cache policies.
- `_redirects` with rules for `/services`, `/fleet`, `/pricing`, `/contact`, and `/index.html`.
- `robots.txt` pointing to the sitemap.
- `sitemap.xml` with public page URLs.
- `sw.js` and `assets/icons/site.webmanifest`.

### Accessibility

The project includes accessibility-focused patterns visible in the codebase:

- Skip links targeting `main id="main"`.
- Semantic landmarks, headings, navigation, and sections.
- ARIA states for the mobile menu, tabs, accordion, and lightbox.
- `aria-live`, `aria-invalid`, and focus movement to the first invalid form field.
- Visible `:focus-visible` styles.
- `prefers-reduced-motion` handling in CSS and selected JS modules.
- Automated `pa11y-ci` checks configured for 11 root pages using WCAG2AA.

### SEO

The source files include verified SEO and social metadata:

- Page titles and `meta description`.
- Canonical links on the main business and legal pages.
- Open Graph and Twitter Card metadata.
- Inline JSON-LD in root pages.
- JSON-LD data in `assets/data/jsonld/` and validation through `npm run qa:jsonld`.
- `robots.txt`, `sitemap.xml`, and OG images in `assets/img/og-img/`.

### Performance

The repository includes explicit performance mechanisms:

- CSS and JS minification in the build pipeline.
- Gzip budgets for `assets/css/style.min.css` and the `assets/js/main.min.js` module graph.
- Local `woff2` fonts with `font-display: swap`.
- Images in AVIF, WebP, JPG, PNG, and SVG formats.
- `image-set()` for hero imagery plus `loading="lazy"` and dimensions on selected images.
- Service worker root-page precache and runtime asset caching.

### Quality Assurance

Main commands:

```bash
npm run qa
npm run release-check
npm run test:e2e
```

Available focused checks:

```bash
npm run qa:html
npm run qa:jsonld
npm run qa:links
npm run qa:a11y
npm run qa:budget
npm run qa:lighthouse
npm run assets:verify
```

Scope:

- `qa` runs HTML, JSON-LD, local link, and accessibility checks.
- `release-check` runs the final local gate: `qa`, `assets:verify`, `qa:budget`, and `test:e2e`.
- `test:e2e` runs Playwright against the built `dist/` package.
- E2E tests cover the contact form, fleet lightbox, mobile navigation, offline page, service worker/offline fallback, and services filtering.
- `qa:lighthouse` uses the Lighthouse CI configuration for the home, services, and contact pages.

### Project Maintenance

- Edit source files, not artifacts: `dist/`, `assets/css/style.min.css`, and `assets/js/main.min.js` are generated.
- Keep header and footer changes in `partials/`; `templates/partials/` stores template copies.
- After asset, path, or service worker changes, run `npm run assets:verify` and `npm run qa:links`.
- After HTML changes, run `npm run qa:html` and the relevant accessibility checks.
- After interaction changes, run the relevant Playwright tests or `npm run release-check`.

### Roadmap

- Add computed contrast checks or visual regression for key views.
- Expand Playwright coverage for service-detail variants and contact-form edge cases.
- Clarify the preview/deployment workflow after the target static host is finalized.

### License

`UNLICENSED` as declared in `package.json`.
