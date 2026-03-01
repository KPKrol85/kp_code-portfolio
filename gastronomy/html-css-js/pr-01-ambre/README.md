# Ambre

## PL

### 1. Project Overview
Ambre to statyczny, wielostronicowy projekt front-end dla restauracji fine dining. Repozytorium zawiera stronę główną, podstrony menu/galerii/treści prawnych, moduły interakcji w Vanilla JavaScript oraz elementy Progressive Web App (manifest, service worker, strona offline).

### 2. Key Features
- Architektura multi-page oparta o pliki HTML: `index.html`, `menu.html`, `galeria.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `offline.html`, `404.html`.
- Responsywna nawigacja z mobilnym drawerem, overlayem, focus trapem, obsługą `Escape`, `aria-current` i scrollspy.
- Komponenty interaktywne: przełącznik motywu (localStorage + `prefers-color-scheme`), przewijanie do sekcji (`data-target`), przycisk przewijania góra/dół, CTA pulse oraz baner demo zapisywany w localStorage.
- Sekcje menu i galerii z filtrowaniem tabami oraz mechaniką „load more” z komunikatami statusu.
- Lightbox dla zdjęć dań i galerii z obsługą klawiatury, licznikiem pozycji, preloadem sąsiednich obrazów i zarządzaniem `aria-hidden`.
- Formularz rezerwacji z walidacją po stronie klienta (telefon, zgoda, pola wymagane), honeypotem antybotowym, komunikatami `aria-live` i wysyłką przez `fetch` z fallbackiem `form.submit()`.
- FAQ oparte o `details/summary` z automatycznym uzupełnianiem atrybutów ARIA.
- PWA: rejestracja service workera, cache app shell, cache runtime obrazów, fallback offline (`offline.html`) oraz obsługa promptu instalacji aplikacji.

### 3. Tech Stack
- HTML5.
- CSS (modułowa struktura katalogów `base`, `layout`, `components`, `pages`; wejście: `css/style.css`).
- Vanilla JavaScript (ES Modules, bundling przez esbuild).
- PostCSS (`postcss-import`, `autoprefixer`, `cssnano`).
- Narzędzia jakości: ESLint, Stylelint, html-validate.
- Narzędzia QA/audytu: Playwright, `@axe-core/playwright`, Lighthouse CI.
- Pipeline obrazów: Sharp.

### 4. Project Structure
- `index.html`, `menu.html`, `galeria.html` — główne widoki użytkowe.
- `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `offline.html`, `404.html` — podstrony pomocnicze i prawne.
- `css/`
  - `base/` — tokeny, reset/baza, typografia.
  - `layout/` — style układu nagłówka i stopki.
  - `components/` — style komponentów UI.
  - `pages/` — style specyficzne dla podstron.
  - `style.css` — główny punkt wejścia CSS (importy).
- `js/`
  - `script.js` — centralna orkiestracja inicjalizacji modułów.
  - `modules/*.js` — logika komponentów (nav, form, tabs, load-more, lightbox, faq, theme, scroll).
  - `sw-register.js`, `pwa-install.js` — logika PWA po stronie klienta.
- `sw.js`, `manifest.webmanifest` — warstwa PWA.
- `assets/` — fonty i zasoby graficzne.
- `scripts/*.mjs` — automatyzacje QA, SEO, a11y, linków, obrazów i CSP.
- `_headers`, `_redirects` — konfiguracja hostingu statycznego.
- `robots.txt`, `sitemap.xml` — pliki SEO.

### 5. Setup and Installation
Repozytorium zawiera `package.json`.

```bash
npm install
```

### 6. Local Development
Dostępne komendy developerskie:

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
- `npm run build:css` — generuje `css/style.min.css` z `css/style.css` i sprawdza brak `@import` w wynikowym bundlu.
- `npm run build:js` — bundluje/minifikuje `js/script.js` do `js/script.min.js` i sprawdza brak importów modułowych w artefakcie.

### 8. Deployment
W repozytorium znajduje się konfiguracja wdrożeniowa dla statycznego hostingu:
- `_redirects` — przekierowania czytelnych ścieżek do plików `.html` oraz trasa `404`.
- `_headers` — nagłówki bezpieczeństwa (m.in. CSP, HSTS, Referrer-Policy, Permissions-Policy, X-Frame-Options).
- `scripts/check-server-prod.mjs` — lokalna weryfikacja odpowiedzi serwera statycznego.

### 9. Accessibility
Zaimplementowane elementy dostępności:
- Skip link do głównej treści.
- Rozbudowane atrybuty ARIA w komponentach interaktywnych (nawigacja mobilna, taby, lightbox, formularz, FAQ).
- Obsługa klawiatury (m.in. `Escape`, focus trap, sterowanie lightboxem).
- Komunikaty statusowe w regionach `aria-live`.
- Uwzględnienie `prefers-reduced-motion` w interakcjach JS.

### 10. SEO
Wdrożone elementy SEO:
- Meta tagi (`description`, `robots`), canonical, Open Graph, Twitter Cards.
- Dane strukturalne JSON-LD (`WebSite`, `Restaurant`, `WebPage`) na stronie głównej.
- `robots.txt` i `sitemap.xml`.
- Dedykowane metadane na podstronach, w tym `404.html` i `offline.html`.

### 11. Performance
Zaimplementowane optymalizacje wydajności:
- Responsywne obrazy (`<picture>`, `srcset`, AVIF/WebP/JPG).
- Atrybuty optymalizujące ładowanie (`loading="lazy"`, `decoding="async"`, `fetchpriority="high"`).
- Preload fontów `woff2`.
- Bundling i minifikacja CSS/JS.
- Service worker z cache app shell i cache runtime obrazów.
- Skrypty optymalizacji i weryfikacji obrazów (`img:opt`, `img:webp`, `img:avif`, `img:verify`).

### 12. Project Maintenance
Główne miejsca utrzymaniowe:
- `js/script.js` — punkt inicjalizacji wszystkich funkcji UI.
- `js/modules/*.js` — implementacje logiki komponentów.
- `css/` — podział stylów na warstwy i komponenty.
- `scripts/*.mjs` — automatyzacje jakości i walidacji.
- Konfiguracje narzędzi: `postcss.config.cjs`, `.eslintrc.cjs`, `stylelint.config.cjs`, `.htmlvalidate.json`, `lighthouserc.json`.

### 13. Roadmap
- Dodać skrypt `dev` uruchamiający równolegle watchery CSS/JS i serwer statyczny.
- Rozszerzyć `check:server:prod` o walidację nagłówków bezpieczeństwa z `_headers`.
- Dodać automatyczny test regresji lightboxa i filtrów tabów w Playwright.
- Rozszerzyć QA o automatyczną walidację spójności tras z `_redirects`.
- Włączyć stałe uruchamianie `qa` i `check` w CI (workflow per push/PR).

### 14. License
MIT (zgodnie z `package.json`).

---

## EN

### 1. Project Overview
Ambre is a static multi-page front-end project for a fine dining restaurant. The repository includes a homepage, menu/gallery/legal subpages, Vanilla JavaScript interaction modules, and Progressive Web App elements (manifest, service worker, offline page).

### 2. Key Features
- Multi-page HTML architecture: `index.html`, `menu.html`, `galeria.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `offline.html`, `404.html`.
- Responsive navigation with mobile drawer, overlay, focus trap, `Escape` handling, `aria-current`, and scrollspy.
- Interactive components: theme switcher (localStorage + `prefers-color-scheme`), section scrolling via `data-target`, scroll up/down controls, CTA pulse, and demo banner persisted in localStorage.
- Menu and gallery sections with tab filtering and “load more” mechanics with status messaging.
- Lightbox for dish/gallery media with keyboard support, item counter, adjacent image preload, and `aria-hidden` state handling.
- Reservation form with client-side validation (phone, consent, required fields), anti-bot honeypot, `aria-live` status feedback, and `fetch` submission with `form.submit()` fallback.
- FAQ built on `details/summary` with automatic ARIA wiring.
- PWA support: service worker registration, app shell cache, runtime image cache, offline fallback (`offline.html`), and app install prompt handling.

### 3. Tech Stack
- HTML5.
- CSS (modular directory structure: `base`, `layout`, `components`, `pages`; entrypoint: `css/style.css`).
- Vanilla JavaScript (ES Modules, bundled with esbuild).
- PostCSS (`postcss-import`, `autoprefixer`, `cssnano`).
- Quality tools: ESLint, Stylelint, html-validate.
- QA/audit tooling: Playwright, `@axe-core/playwright`, Lighthouse CI.
- Image pipeline: Sharp.

### 4. Project Structure
- `index.html`, `menu.html`, `galeria.html` — primary user-facing pages.
- `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `offline.html`, `404.html` — legal and utility pages.
- `css/`
  - `base/` — tokens, reset/base styles, typography.
  - `layout/` — header/footer layout styles.
  - `components/` — UI component styles.
  - `pages/` — page-specific styles.
  - `style.css` — main CSS entrypoint (imports).
- `js/`
  - `script.js` — central module initialization orchestrator.
  - `modules/*.js` — component logic (nav, form, tabs, load-more, lightbox, faq, theme, scroll).
  - `sw-register.js`, `pwa-install.js` — client-side PWA logic.
- `sw.js`, `manifest.webmanifest` — PWA layer.
- `assets/` — fonts and image assets.
- `scripts/*.mjs` — QA, SEO, a11y, links, image, and CSP automation scripts.
- `_headers`, `_redirects` — static hosting configuration.
- `robots.txt`, `sitemap.xml` — SEO files.

### 5. Setup and Installation
`package.json` is present.

```bash
npm install
```

### 6. Local Development
Available development commands:

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
Production build:

```bash
npm run build
```

Details:
- `npm run build:css` — generates `css/style.min.css` from `css/style.css` and verifies no `@import` remains.
- `npm run build:js` — bundles/minifies `js/script.js` into `js/script.min.js` and verifies no module import syntax remains.

### 8. Deployment
The repository includes deployment configuration for static hosting:
- `_redirects` — clean-path redirects to `.html` files and `404` route handling.
- `_headers` — security headers (including CSP, HSTS, Referrer-Policy, Permissions-Policy, X-Frame-Options).
- `scripts/check-server-prod.mjs` — local verification of static server responses.

### 9. Accessibility
Implemented accessibility elements:
- Skip link to main content.
- ARIA attributes across interactive components (mobile navigation, tabs, lightbox, form, FAQ).
- Keyboard interaction support (including `Escape`, focus trap, lightbox controls).
- Status messaging in `aria-live` regions.
- `prefers-reduced-motion` support in JS interactions.

### 10. SEO
Implemented SEO elements:
- Meta tags (`description`, `robots`), canonical, Open Graph, Twitter Cards.
- JSON-LD structured data (`WebSite`, `Restaurant`, `WebPage`) on the homepage.
- `robots.txt` and `sitemap.xml`.
- Dedicated metadata on subpages, including `404.html` and `offline.html`.

### 11. Performance
Implemented performance optimizations:
- Responsive images (`<picture>`, `srcset`, AVIF/WebP/JPG).
- Loading attributes (`loading="lazy"`, `decoding="async"`, `fetchpriority="high"`).
- `woff2` font preloads.
- CSS/JS bundling and minification.
- Service worker with app shell caching and runtime image caching.
- Image optimization and verification scripts (`img:opt`, `img:webp`, `img:avif`, `img:verify`).

### 12. Project Maintenance
Primary maintenance locations:
- `js/script.js` — UI feature initialization entrypoint.
- `js/modules/*.js` — component behavior implementations.
- `css/` — layered styling architecture.
- `scripts/*.mjs` — quality and validation automation.
- Tooling configs: `postcss.config.cjs`, `.eslintrc.cjs`, `stylelint.config.cjs`, `.htmlvalidate.json`, `lighthouserc.json`.

### 13. Roadmap
- Add a `dev` script to run CSS/JS watchers and a static server in parallel.
- Extend `check:server:prod` with security-header validation based on `_headers`.
- Add Playwright regression checks for lightbox and tab filtering.
- Extend QA with automated route-consistency checks against `_redirects`.
- Enforce recurring `qa` and `check` runs in CI (per push/PR).

### 14. License
MIT (as defined in `package.json`).
