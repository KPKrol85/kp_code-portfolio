# Ambre

## PL

### 1. Project Overview
Ambre to statyczny, wielostronicowy projekt front-end dla restauracji fine dining. Repozytorium zawiera publiczne widoki HTML, modularny system stylów CSS, logikę interfejsu w Vanilla JavaScript oraz warstwę PWA (manifest, Service Worker, strona offline).

### 2. Key Features
- Architektura MPA oparta o pliki: `index.html`, `menu.html`, `galeria.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `offline.html`, `404.html`.
- Responsywna nawigacja z trybem mobilnym, `aria-current`, scrollspy, sticky header shadow i przewijaniem do sekcji (`data-target`).
- Przełącznik motywu (light/dark) z obsługą `prefers-color-scheme` i zapisem preferencji.
- Interaktywne moduły UI: tabs, filtrowanie galerii, mechaniki „load more”, FAQ (`details/summary`), lightbox, CTA pulse, przyciski scroll góra/dół.
- Formularz rezerwacji z walidacją po stronie klienta, honeypotem antybotowym, komunikatami statusu i wysyłką przez `fetch`.
- Elementy PWA: `manifest.webmanifest`, rejestracja SW, cache app shell i cache obrazów runtime, fallback offline (`offline.html`), obsługa instalacji aplikacji.
- Dedykowane strony legalne oraz demo modal dla informacji prawnych.

### 3. Tech Stack
- HTML5.
- CSS (warstwy: `base`, `layout`, `components`, `pages`; punkt wejścia: `css/style.css`).
- Vanilla JavaScript (ES Modules).
- Esbuild (bundling/minifikacja JS).
- PostCSS (`postcss-import`, `autoprefixer`, `cssnano`) dla bundlingu/minifikacji CSS.
- ESLint, Stylelint, html-validate.
- Playwright + `@axe-core/playwright`, Lighthouse CI.
- Sharp (optymalizacja obrazów).

### 4. Project Structure
- Główne widoki: `index.html`, `menu.html`, `galeria.html`.
- Widoki pomocnicze/prawne: `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `offline.html`, `404.html`.
- `css/`
  - `base/` — tokeny, baza, typografia.
  - `layout/` — layout nagłówka i stopki.
  - `components/` — komponenty UI.
  - `pages/` — style per podstrona.
  - `style.css`, `style.min.css` — wejście i artefakt produkcyjny.
- `js/`
  - `script.js`, `script.min.js` — bootstrap aplikacji i bundle produkcyjny.
  - `modules/` — moduły funkcjonalne (nawigacja, formularz, tabs, lightbox, FAQ, scroll, motyw).
  - `sw-register.js`, `pwa-install.js` — logika PWA po stronie klienta.
- `sw.js`, `manifest.webmanifest` — konfiguracja PWA.
- `assets/` — fonty, obrazy, ikony.
- `scripts/` — automatyzacje QA, SEO, a11y, CSP, linków i pipeline obrazów.
- `_headers`, `_redirects` — konfiguracja hostingu statycznego.

### 5. Setup and Installation
Projekt zawiera `package.json`.

```bash
npm install
```

### 6. Local Development
Dostępne komendy lokalne:

```bash
npm run watch:css
npm run watch:js
npm run build
npm run lint
npm run qa
npm run check
npm run check:server:prod
```

### 7. Production Build
Build produkcyjny:

```bash
npm run build
```

Szczegóły:
- `npm run build:css` — generuje `css/style.min.css` i weryfikuje brak `@import` w artefakcie.
- `npm run build:js` — generuje `js/script.min.js` i weryfikuje brak składni importów modułowych.

### 8. Deployment
Repozytorium zawiera konfigurację wdrożeniową dla hostingu statycznego:
- `_redirects` — mapowanie clean URLs na strony `.html` oraz obsługa trasy 404.
- `_headers` — nagłówki bezpieczeństwa (m.in. CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- `scripts/check-server-prod.mjs` — skrypt kontroli zachowania środowiska serwera produkcyjnego.

### 9. Accessibility
Potwierdzone elementy dostępności:
- Skip link do treści głównej.
- ARIA i atrybuty semantyczne w nawigacji, formularzu, tabs, FAQ i lightboxie.
- Obsługa klawiatury (m.in. `Escape`) i zarządzanie fokusem w komponentach interaktywnych.
- Komunikaty statusowe (`aria-live`) w wybranych interakcjach.
- Wsparcie `prefers-reduced-motion` w logice interfejsu.

### 10. SEO
Zaimplementowane elementy SEO:
- `meta description`, `robots`, canonical, Open Graph, Twitter Cards.
- JSON-LD (`WebSite`, `Restaurant`, `WebPage`) na stronie głównej.
- `robots.txt` i `sitemap.xml`.
- Dedykowane metadane dla stron systemowych, w tym `404.html` i `offline.html`.

### 11. Performance
Wdrożone optymalizacje:
- Responsywne obrazy (`picture`, `srcset`, warianty AVIF/WebP/JPG).
- Atrybuty ładowania (`loading`, `decoding`, `fetchpriority`).
- Preload fontów WOFF2.
- Minifikacja i bundling CSS/JS.
- Service Worker z cache warstwy aplikacji i cache runtime obrazów.
- Skrypty optymalizacji oraz weryfikacji zasobów obrazów.

### 12. Project Maintenance
Kluczowe miejsca utrzymania:
- `js/script.js` — centralny bootstrap modułów UI.
- `js/modules/` — logika komponentów i zachowań.
- `css/` — warstwowa organizacja stylów.
- `scripts/` — automatyczne kontrole jakości i zgodności.
- Konfiguracje narzędzi: `postcss.config.cjs`, `.eslintrc.cjs`, `stylelint.config.cjs`, `.htmlvalidate.json`, `lighthouserc.json`.

### 13. Roadmap
- Dodać pojedynczy skrypt `dev` uruchamiający równolegle watchery CSS/JS i lokalny serwer statyczny.
- Rozszerzyć testy E2E Playwright o regresję dla formularza rezerwacji i scenariuszy filtrów galerii.
- Rozbudować walidację produkcyjną o automatyczne sprawdzanie zgodności `_headers` z polityką CSP.
- Ustandaryzować pipeline QA (`qa` + `check`) w CI dla push/PR.
- Dodać automatyczny test integralności mapy URL (`_redirects` + `sitemap.xml`).

### 14. License
MIT (zgodnie z `package.json`).

---

## EN

### 1. Project Overview
Ambre is a static multi-page front-end project for a fine dining restaurant. The repository contains public HTML views, a modular CSS styling system, Vanilla JavaScript UI logic, and a PWA layer (manifest, Service Worker, offline page).

### 2. Key Features
- MPA architecture based on: `index.html`, `menu.html`, `galeria.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `offline.html`, `404.html`.
- Responsive navigation with mobile mode, `aria-current`, scrollspy, sticky header shadow, and section scrolling via `data-target`.
- Light/dark theme switcher with `prefers-color-scheme` support and persisted preference.
- Interactive UI modules: tabs, gallery filtering, “load more” mechanics, FAQ (`details/summary`), lightbox, CTA pulse, and scroll up/down controls.
- Reservation form with client-side validation, anti-bot honeypot, status messaging, and `fetch` submission.
- PWA elements: `manifest.webmanifest`, SW registration, app-shell + runtime image caching, offline fallback (`offline.html`), app-install prompt handling.
- Dedicated legal pages and a demo legal-information modal.

### 3. Tech Stack
- HTML5.
- CSS (layers: `base`, `layout`, `components`, `pages`; entrypoint: `css/style.css`).
- Vanilla JavaScript (ES Modules).
- Esbuild (JS bundling/minification).
- PostCSS (`postcss-import`, `autoprefixer`, `cssnano`) for CSS bundling/minification.
- ESLint, Stylelint, html-validate.
- Playwright + `@axe-core/playwright`, Lighthouse CI.
- Sharp (image optimization).

### 4. Project Structure
- Main views: `index.html`, `menu.html`, `galeria.html`.
- Utility/legal views: `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `offline.html`, `404.html`.
- `css/`
  - `base/` — tokens, base styles, typography.
  - `layout/` — header/footer layout.
  - `components/` — UI components.
  - `pages/` — per-page styling.
  - `style.css`, `style.min.css` — source entry and production artifact.
- `js/`
  - `script.js`, `script.min.js` — application bootstrap and production bundle.
  - `modules/` — functional modules (navigation, form, tabs, lightbox, FAQ, scroll, theme).
  - `sw-register.js`, `pwa-install.js` — client-side PWA logic.
- `sw.js`, `manifest.webmanifest` — PWA configuration.
- `assets/` — fonts, images, icons.
- `scripts/` — QA, SEO, accessibility, CSP, link, and image pipeline automations.
- `_headers`, `_redirects` — static hosting configuration.

### 5. Setup and Installation
The project includes a `package.json` file.

```bash
npm install
```

### 6. Local Development
Available local commands:

```bash
npm run watch:css
npm run watch:js
npm run build
npm run lint
npm run qa
npm run check
npm run check:server:prod
```

### 7. Production Build
Production build command:

```bash
npm run build
```

Details:
- `npm run build:css` — generates `css/style.min.css` and verifies no `@import` remains.
- `npm run build:js` — generates `js/script.min.js` and verifies no module import syntax remains.

### 8. Deployment
The repository includes static-hosting deployment configuration:
- `_redirects` — clean-URL mapping to `.html` pages and 404 route handling.
- `_headers` — security headers (including CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- `scripts/check-server-prod.mjs` — script for production server behavior checks.

### 9. Accessibility
Confirmed accessibility implementation:
- Skip link to main content.
- ARIA and semantic attributes in navigation, form, tabs, FAQ, and lightbox.
- Keyboard support (including `Escape`) and focus handling in interactive components.
- Status messaging (`aria-live`) in selected interactions.
- `prefers-reduced-motion` support in UI logic.

### 10. SEO
Implemented SEO elements:
- `meta description`, `robots`, canonical, Open Graph, Twitter Cards.
- JSON-LD (`WebSite`, `Restaurant`, `WebPage`) on the homepage.
- `robots.txt` and `sitemap.xml`.
- Dedicated metadata for system pages, including `404.html` and `offline.html`.

### 11. Performance
Implemented optimizations:
- Responsive images (`picture`, `srcset`, AVIF/WebP/JPG variants).
- Loading attributes (`loading`, `decoding`, `fetchpriority`).
- WOFF2 font preloads.
- CSS/JS minification and bundling.
- Service Worker with app-shell and runtime image caching.
- Scripts for image optimization and verification.

### 12. Project Maintenance
Core maintenance locations:
- `js/script.js` — central UI module bootstrap.
- `js/modules/` — component and behavior logic.
- `css/` — layered style architecture.
- `scripts/` — automated quality and compliance checks.
- Tooling configs: `postcss.config.cjs`, `.eslintrc.cjs`, `stylelint.config.cjs`, `.htmlvalidate.json`, `lighthouserc.json`.

### 13. Roadmap
- Add a single `dev` script to run CSS/JS watchers and a local static server in parallel.
- Extend Playwright E2E coverage for reservation form regression and gallery filtering scenarios.
- Expand production validation with automated `_headers` to CSP consistency checks.
- Standardize QA pipeline execution (`qa` + `check`) in CI for push/PR.
- Add an automated URL integrity check (`_redirects` + `sitemap.xml`).

### 14. License
MIT (as declared in `package.json`).
