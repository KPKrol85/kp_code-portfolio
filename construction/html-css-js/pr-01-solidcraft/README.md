# Solidcraft

## PL — Dokumentacja projektu

### 1. Project Overview

Solidcraft to statyczny serwis WWW firmy remontowo-budowlanej. Repozytorium zawiera stronę główną, podstrony ofertowe, strony dokumentów, stronę 404, stronę offline oraz stronę potwierdzenia wysłania formularza.

### 2. Key Features

- Wielosekcyjna strona główna (oferta, realizacje, opinie, FAQ, kontakt).
- Podstrony usług w katalogu `oferta/`.
- Formularz kontaktowy oparty o Netlify Forms (`netlify`, `data-netlify`, `netlify-honeypot`) z walidacją po stronie klienta.
- Walidacja formularza obejmująca komunikaty błędów ARIA, blokadę wielokrotnego wysyłania, timeout żądania, honeypot i proste heurystyki antyspamowe.
- Nawigacja responsywna z menu mobilnym, dropdownem, obsługą klawiatury (`Tab`, `Shift+Tab`, `Escape`) i scroll-spy.
- Lightbox galerii/oferty z obsługą klawiatury, focus management i atrybutami dialogu modalnego.
- Przełącznik motywu jasny/ciemny z zapisem preferencji w `localStorage` oraz inicjalizacją motywu przed renderowaniem.
- Baner cookies z zapisem decyzji użytkownika w `localStorage`.
- Lazy-load osadzonej mapy po akcji użytkownika (`data-map-src`, przycisk „Załaduj mapę”).
- Warstwa PWA: `manifest.webmanifest`, rejestracja Service Workera, `offline.html`.
- SEO: `robots.txt`, `sitemap.xml`, metadane Open Graph/Twitter, canonicale i JSON-LD.

### 3. Tech Stack

- HTML5 (architektura wielostronicowa).
- CSS z architekturą modułową (`css/style.css` + `css/modules/*`).
- JavaScript (Vanilla JS, moduły ES).
- Node.js + npm.
- PostCSS: `postcss-import`, `postcss-preset-env`, `autoprefixer`, `cssnano`.
- Bundling/minifikacja JS: `esbuild`.
- Środowisko deweloperskie: `live-server`.
- Formatowanie: `prettier`.
- Przetwarzanie obrazów: `sharp` (skrypt `scripts/images.js`).
- QA: Playwright + axe-core (audyt dostępności), skrypty kontroli linków i assetów HTML, Lighthouse CI.
- Hosting/deployment: Netlify (`netlify.toml`, `_headers`, `_redirects`).

### 4. Project Structure

- `index.html` — strona główna.
- `oferta/*.html` — podstrony usług.
- `doc/*.html` — strony dokumentów.
- `404.html`, `offline.html`, `thank-you.html` — strony systemowe.
- `css/style.css` + `css/modules/*.css` — źródła stylów.
- `css/style.min.css` — artefakt produkcyjny CSS.
- `js/script.js`, `js/theme-init.js`, `js/sw-register.js` — źródła JS.
- `js/modules/*.js` — moduły logiki UI (nawigacja, formularze, lightbox, consent mapy, cookies, itp.).
- `js/script.min.js`, `js/theme-init.min.js` — artefakty produkcyjne JS.
- `sw.js` — Service Worker.
- `scripts/*` — skrypty build/QA/automatyzacji.
- `assets/img-src/*` — źródła grafik.
- `assets/img/*` — wygenerowane zasoby obrazów.
- `dist/` — katalog publikacyjny generowany przez `npm run build:dist`.

### 5. Setup and Installation

```bash
npm install
```

### 6. Local Development

```bash
npm run dev
npm run watch:css
npm run watch:js
npm run check:html
npm run qa:a11y
```

### 7. Production Build

```bash
npm run build
npm run build:dist
```

- `npm run build` generuje artefakty produkcyjne: `css/style.min.css`, `js/theme-init.min.js`, `js/script.min.js`.
- `npm run build:dist`:
  - czyści i buduje `dist/`,
  - kopiuje pliki HTML i zasoby runtime,
  - kopiuje pliki deploy (`_headers`, `_redirects`, `netlify.toml`, `robots.txt`, `manifest.webmanifest`, `sw.js` itd. jeśli istnieją),
  - podmienia odwołania w HTML z plików źródłowych na zminifikowane,
  - uruchamia generowanie mapy strony (`npm run build:sitemap`).

### 8. Deployment

- Konfiguracja Netlify jest częścią repozytorium.
- `netlify.toml` definiuje:
  - komendę build: `npm run build:dist`,
  - katalog publikacji: `dist`.
- `_headers` definiuje nagłówki bezpieczeństwa i CSP.
- `_redirects` definiuje przekierowania 301 oraz fallback `/* /404.html 404`.

### 9. Accessibility

- Rozbudowane użycie atrybutów ARIA w nawigacji, formularzu, FAQ, banerze cookies i lightboxie.
- Obsługa klawiatury w menu mobilnym i dropdownie, w tym trap focus i zamykanie klawiszem `Escape`.
- Lightbox z `role="dialog"`, `aria-modal="true"` oraz kontrolą fokusu.
- Formularz z komunikatami statusu (`role="status"`, `aria-live="polite"`) i polami błędów.
- Skrypt audytu dostępności `npm run qa:a11y` (Playwright + axe-core).

### 10. SEO

- Metatagi: `title`, `description`, `canonical`, `robots` na stronach HTML.
- Open Graph i Twitter Card.
- Dane strukturalne JSON-LD (`GeneralContractor`, `WebSite`, `CollectionPage`, `FAQPage`).
- `robots.txt` z adresem mapy strony.
- `sitemap.xml` oraz skrypt `scripts/generate-sitemap.mjs`.

### 11. Performance

- Minifikacja CSS i JS (PostCSS + esbuild).
- Responsywne obrazy (`srcset`, `sizes`) oraz wiele formatów (`AVIF`, `WebP`, `JPG`).
- `loading="lazy"` dla części obrazów.
- Preload kluczowych fontów i obrazu hero.
- Service Worker:
  - pre-cache wskazanych zasobów statycznych,
  - strategia **network-first** dla HTML (z fallbackiem do cache i `offline.html`),
  - strategia **cache-first** dla zasobów statycznych.

### 12. Project Maintenance

- Główna orkiestracja aplikacji: `js/script.js`.
- Moduły UI i logika domenowa: `js/modules/*.js`.
- Inicjalizacja motywu przed renderowaniem: `js/theme-init.js`.
- Rejestracja PWA: `js/sw-register.js`; logika cache: `sw.js`.
- Architektura CSS oparta o moduły importowane przez `css/style.css`.
- Proces build/deploy i QA utrzymywany przez skrypty w `scripts/` oraz konfiguracje `postcss.config.js`, `lighthouserc.json`, `netlify.toml`.

### 13. Roadmap

- Dodać pipeline CI uruchamiający automatycznie `check:html`, `qa:a11y` i `qa:lhci`.
- Uzupełnić testy E2E dla krytycznych ścieżek (formularz kontaktowy, nawigacja mobilna, lightbox).
- Rozszerzyć automatyczną kontrolę jakości o linting JS/CSS.
- Sparametryzować `SITE_URL` dla wielu środowisk deploymentu bez zmian w skryptach lokalnych.
- Uporządkować i udokumentować konwencję nazewnictwa assetów (w tym pliki odstające) w katalogach obrazów.

### 14. License

MIT (zgodnie z `package.json`).

---

## EN — Project Documentation

### 1. Project Overview

Solidcraft is a static website for a construction and renovation business. The repository includes a homepage, service subpages, document pages, a 404 page, an offline page, and a form submission confirmation page.

### 2. Key Features

- Multi-section homepage (offer, projects, testimonials, FAQ, contact).
- Service subpages in the `oferta/` directory.
- Contact form built with Netlify Forms (`netlify`, `data-netlify`, `netlify-honeypot`) and client-side validation.
- Form validation with ARIA error/status messaging, duplicate-submit guard, request timeout, honeypot, and basic anti-spam heuristics.
- Responsive navigation with mobile menu, dropdown, keyboard handling (`Tab`, `Shift+Tab`, `Escape`), and scroll-spy.
- Gallery/offer lightbox with keyboard support, focus management, and modal dialog semantics.
- Light/dark theme switch with `localStorage` persistence and pre-render theme initialization.
- Cookie banner with user decision persisted in `localStorage`.
- Lazy-loaded embedded map after explicit user action (`data-map-src`, “Load map” button).
- PWA layer: `manifest.webmanifest`, Service Worker registration, `offline.html`.
- SEO layer: `robots.txt`, `sitemap.xml`, Open Graph/Twitter metadata, canonicals, and JSON-LD.

### 3. Tech Stack

- HTML5 (multi-page architecture).
- CSS with modular architecture (`css/style.css` + `css/modules/*`).
- JavaScript (Vanilla JS, ES modules).
- Node.js + npm.
- PostCSS: `postcss-import`, `postcss-preset-env`, `autoprefixer`, `cssnano`.
- JS bundling/minification: `esbuild`.
- Local development server: `live-server`.
- Formatting: `prettier`.
- Image processing: `sharp` (via `scripts/images.js`).
- QA: Playwright + axe-core (accessibility audit), HTML link/asset checks, Lighthouse CI.
- Hosting/deployment: Netlify (`netlify.toml`, `_headers`, `_redirects`).

### 4. Project Structure

- `index.html` — homepage.
- `oferta/*.html` — service pages.
- `doc/*.html` — document pages.
- `404.html`, `offline.html`, `thank-you.html` — system pages.
- `css/style.css` + `css/modules/*.css` — style sources.
- `css/style.min.css` — production CSS artifact.
- `js/script.js`, `js/theme-init.js`, `js/sw-register.js` — JS sources.
- `js/modules/*.js` — UI/domain modules (navigation, forms, lightbox, map consent, cookies, etc.).
- `js/script.min.js`, `js/theme-init.min.js` — production JS artifacts.
- `sw.js` — Service Worker.
- `scripts/*` — build/QA/automation scripts.
- `assets/img-src/*` — image source assets.
- `assets/img/*` — generated image assets.
- `dist/` — publish directory generated by `npm run build:dist`.

### 5. Setup and Installation

```bash
npm install
```

### 6. Local Development

```bash
npm run dev
npm run watch:css
npm run watch:js
npm run check:html
npm run qa:a11y
```

### 7. Production Build

```bash
npm run build
npm run build:dist
```

- `npm run build` generates production artifacts: `css/style.min.css`, `js/theme-init.min.js`, `js/script.min.js`.
- `npm run build:dist`:
  - cleans and rebuilds `dist/`,
  - copies HTML files and runtime assets,
  - copies deployment files (`_headers`, `_redirects`, `netlify.toml`, `robots.txt`, `manifest.webmanifest`, `sw.js`, etc. when present),
  - rewrites HTML references from source assets to minified artifacts,
  - runs sitemap generation (`npm run build:sitemap`).

### 8. Deployment

- Netlify deployment config is included in the repository.
- `netlify.toml` defines:
  - build command: `npm run build:dist`,
  - publish directory: `dist`.
- `_headers` defines security headers and CSP.
- `_redirects` defines 301 redirects and the fallback `/* /404.html 404`.

### 9. Accessibility

- Extensive ARIA usage in navigation, form, FAQ, cookie banner, and lightbox.
- Keyboard support in mobile nav and dropdown, including focus trap and `Escape` handling.
- Lightbox uses `role="dialog"`, `aria-modal="true"`, and focus control.
- Form uses status messaging (`role="status"`, `aria-live="polite"`) and field-level error handling.
- Dedicated accessibility audit script `npm run qa:a11y` (Playwright + axe-core).

### 10. SEO

- Meta tags: `title`, `description`, `canonical`, `robots` across HTML pages.
- Open Graph and Twitter Card metadata.
- JSON-LD structured data (`GeneralContractor`, `WebSite`, `CollectionPage`, `FAQPage`).
- `robots.txt` including sitemap location.
- `sitemap.xml` and `scripts/generate-sitemap.mjs`.

### 11. Performance

- CSS and JS minification (PostCSS + esbuild).
- Responsive images (`srcset`, `sizes`) with multiple formats (`AVIF`, `WebP`, `JPG`).
- `loading="lazy"` on selected images.
- Preloading of key fonts and hero image.
- Service Worker strategy:
  - pre-cache of selected static assets,
  - **network-first** for HTML (with cache and `offline.html` fallback),
  - **cache-first** for static assets.

### 12. Project Maintenance

- Main application orchestration: `js/script.js`.
- UI/domain modules: `js/modules/*.js`.
- Pre-render theme bootstrap: `js/theme-init.js`.
- PWA registration: `js/sw-register.js`; cache logic: `sw.js`.
- CSS architecture maintained through modules imported by `css/style.css`.
- Build/deploy/QA flow maintained in `scripts/` and config files (`postcss.config.js`, `lighthouserc.json`, `netlify.toml`).

### 13. Roadmap

- Add a CI pipeline to run `check:html`, `qa:a11y`, and `qa:lhci` automatically.
- Add E2E tests for critical paths (contact form, mobile navigation, lightbox).
- Extend quality checks with JS/CSS linting.
- Parameterize `SITE_URL` for multiple deployment environments without local script changes.
- Standardize and document asset naming conventions (including outlier files) in image directories.

### 14. License

MIT (as defined in `package.json`).
