# Atelier

## PL

### 1. Przegląd projektu
Atelier to statyczny, wielostronicowy serwis restauracji, zbudowany w oparciu o HTML, modularny CSS i Vanilla JavaScript. Repozytorium zawiera strony publiczne, strony prawne i systemowe, warstwę danych menu (`data/menu.json`) oraz konfigurację jakości, PWA i wdrożenia statycznego.

### 2. Kluczowe funkcje
- Wielostronicowa struktura HTML (`index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `thank-you.html`, `offline.html`, `404.html`).
- Responsywna nawigacja z menu mobilnym i dropdownami.
- Scrollspy dla sekcji menu (`js/core/scrollspy.js`).
- Przełącznik motywu jasny/ciemny z zapisem preferencji w `localStorage`.
- Dynamiczne renderowanie pozycji menu z pliku `data/menu.json`.
- Filtrowanie i wyszukiwanie pozycji na stronie menu.
- Galeria zdjęć z modułem lightbox (nawigacja, licznik, fullscreen).
- Formularz kontaktowy z walidacją po stronie klienta i komunikatami statusu.
- Banner online/offline i komunikaty dla trybu offline.
- Service Worker z cache zasobów i fallbackiem do `offline.html`.

### 3. Tech Stack
- HTML5.
- CSS (architektura: `base`, `layout`, `components`, `pages`).
- JavaScript (ES Modules, Vanilla JS).
- Node.js + npm.
- PostCSS (`postcss-cli`, `postcss-import`, `cssnano`).
- esbuild (bundle i minifikacja JS).
- ESLint.
- html-validate.
- linkinator.
- pa11y-ci.
- sharp + fast-glob (pipeline obrazów).
- http-server, start-server-and-test, cross-env (lokalne uruchamianie i automatyzacja checków).

### 4. Struktura projektu
- `assets/` — obrazy, ikony, fonty i zasoby multimedialne.
- `css/` — style bazowe, layout, komponenty i style per podstrona.
- `js/`
  - `app/` — orkiestracja inicjalizacji,
  - `core/` — narzędzia bazowe (m.in. scrollspy),
  - `features/` — moduły funkcjonalne (nawigacja, menu, galeria, formularz, motyw, sieć itd.).
- `data/menu.json` — źródło danych dla renderowania menu.
- `scripts/images/build-images.js` — generowanie wariantów obrazów.
- `manifest.webmanifest`, `sw.js` — elementy PWA.
- `_headers`, `_redirects` — konfiguracja hostingu statycznego.

### 5. Setup i instalacja
Wymagane środowisko: Node.js + npm.

```bash
npm install
```

### 6. Lokalny development
Uruchomienie lokalnego serwera:

```bash
npm run dev:server
```

Najważniejsze komendy:

```bash
npm run lint
npm run validate:html
npm run check
npm run check:server
npm run check:server:prod
```

### 7. Build produkcyjny
Build assetów frontendowych:

```bash
npm run build
```

Składniki:
- `npm run build:css` → `css/style.min.css`
- `npm run build:js` → `js/script.min.js` i `js/core.min.js`

Build obrazów:

```bash
npm run images:build
```

### 8. Wdrożenie
Repozytorium zawiera konfigurację dla wdrożenia statycznego:
- `_headers` — nagłówki bezpieczeństwa, cache-control i deklaracja manifestu.
- `_redirects` — fallback trasy do `404.html`.
- `contact.html` — konfiguracja formularza zgodna z Netlify Forms.

### 9. Dostępność
Zidentyfikowane elementy dostępności:
- semantyczne sekcje i role ARIA w komponentach interaktywnych,
- obsługa klawiatury dla nawigacji, modala i lightboxa,
- komunikaty `aria-live` (status formularza, status sieci),
- zarządzanie fokusem (menu mobilne, modal prawny, lightbox),
- wsparcie `prefers-reduced-motion` w animacjach reveal,
- konfiguracja automatycznych testów a11y (`.pa11yci`, standard WCAG2AA).

### 10. SEO
Wdrożone elementy SEO:
- `meta description`, `canonical`, `robots`,
- Open Graph i Twitter Card,
- dane strukturalne JSON-LD (`application/ld+json`),
- `robots.txt` i `sitemap.xml`.

### 11. Wydajność
Wdrożone optymalizacje:
- minifikacja CSS i JS przez skrypty build,
- responsywne obrazy (`picture`, `srcset`, `sizes`) i wiele formatów,
- `loading="lazy"` dla obrazów niekrytycznych,
- cache zasobów statycznych przez Service Worker,
- preloading wybranych zasobów (m.in. fonty / kluczowe assety).

### 12. Utrzymanie projektu
Najważniejsze miejsca utrzymaniowe:
- inicjalizacja aplikacji: `js/bootstrap.js`, `js/script.js`, `js/app/init.js`,
- logika funkcjonalna: `js/features/*.js`,
- warstwa danych: `data/menu.json`,
- warstwa stylów: `css/style.css` i moduły w `css/**`,
- jakość i automatyzacja: `package.json`, `eslint.config.mjs`, `.htmlvalidate.json`, `.pa11yci`,
- PWA i deployment: `manifest.webmanifest`, `sw.js`, `_headers`, `_redirects`.

### 13. Roadmap
- Dodać automatyczne testy E2E dla krytycznych przepływów (menu mobile, formularz, filtry menu, lightbox).
- Rozszerzyć pipeline QA o testy linków i a11y po buildzie produkcyjnym z raportem artefaktów.
- Dodać wersjonowanie cache Service Workera powiązane z wersją wydania.
- Uzupełnić automatyczną walidację spójności adresów pomiędzy plikami HTML, `sitemap.xml` i `manifest.webmanifest`.
- Rozdzielić konfigurację środowiskową dla domeny produkcyjnej i lokalnej (np. host fallback w formularzu) do centralnego pliku konfiguracyjnego.

### 14. Licencja
MIT.

---

## EN

### 1. Project Overview
Atelier is a static multi-page restaurant website built with HTML, modular CSS, and Vanilla JavaScript. The repository includes public pages, legal/system pages, a menu data layer (`data/menu.json`), and quality, PWA, and static deployment configuration.

### 2. Key Features
- Multi-page HTML structure (`index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `thank-you.html`, `offline.html`, `404.html`).
- Responsive navigation with mobile menu and dropdowns.
- Section scrollspy for menu navigation (`js/core/scrollspy.js`).
- Light/dark theme toggle with `localStorage` persistence.
- Dynamic menu rendering from `data/menu.json`.
- Filtering and search on the menu page.
- Image gallery with lightbox module (navigation, counter, fullscreen).
- Contact form with client-side validation and status messaging.
- Online/offline status banner and offline-mode notices.
- Service Worker with asset caching and `offline.html` fallback.

### 3. Tech Stack
- HTML5.
- CSS (architecture: `base`, `layout`, `components`, `pages`).
- JavaScript (ES Modules, Vanilla JS).
- Node.js + npm.
- PostCSS (`postcss-cli`, `postcss-import`, `cssnano`).
- esbuild (JS bundling and minification).
- ESLint.
- html-validate.
- linkinator.
- pa11y-ci.
- sharp + fast-glob (image pipeline).
- http-server, start-server-and-test, cross-env (local serving and check automation).

### 4. Project Structure
- `assets/` — images, icons, fonts, and media assets.
- `css/` — base styles, layout, components, and page-specific styles.
- `js/`
  - `app/` — initialization orchestration,
  - `core/` — base utilities (including scrollspy),
  - `features/` — feature modules (navigation, menu, gallery, form, theme, network, etc.).
- `data/menu.json` — source data for menu rendering.
- `scripts/images/build-images.js` — image variant generation.
- `manifest.webmanifest`, `sw.js` — PWA elements.
- `_headers`, `_redirects` — static hosting configuration.

### 5. Setup and Installation
Required environment: Node.js + npm.

```bash
npm install
```

### 6. Local Development
Run local server:

```bash
npm run dev:server
```

Primary commands:

```bash
npm run lint
npm run validate:html
npm run check
npm run check:server
npm run check:server:prod
```

### 7. Production Build
Build front-end assets:

```bash
npm run build
```

Includes:
- `npm run build:css` → `css/style.min.css`
- `npm run build:js` → `js/script.min.js` and `js/core.min.js`

Build images:

```bash
npm run images:build
```

### 8. Deployment
The repository includes static deployment configuration:
- `_headers` — security headers, cache-control, and manifest declaration.
- `_redirects` — route fallback to `404.html`.
- `contact.html` — form setup compatible with Netlify Forms.

### 9. Accessibility
Detected accessibility implementation:
- semantic sections and ARIA roles in interactive components,
- keyboard support for navigation, modal, and lightbox,
- `aria-live` announcements (form status and network status),
- focus management (mobile nav, legal modal, lightbox),
- `prefers-reduced-motion` support in reveal animations,
- automated accessibility checks configured in `.pa11yci` (WCAG2AA).

### 10. SEO
Implemented SEO elements:
- `meta description`, `canonical`, `robots`,
- Open Graph and Twitter Card metadata,
- JSON-LD structured data (`application/ld+json`),
- `robots.txt` and `sitemap.xml`.

### 11. Performance
Implemented performance optimizations:
- CSS and JS minification via build scripts,
- responsive images (`picture`, `srcset`, `sizes`) with multiple formats,
- `loading="lazy"` for non-critical images,
- static asset caching via Service Worker,
- preload of selected assets (including fonts / critical assets).

### 12. Project Maintenance
Core maintenance locations:
- app bootstrapping: `js/bootstrap.js`, `js/script.js`, `js/app/init.js`,
- feature logic: `js/features/*.js`,
- data layer: `data/menu.json`,
- styling layer: `css/style.css` and modules in `css/**`,
- quality and automation: `package.json`, `eslint.config.mjs`, `.htmlvalidate.json`, `.pa11yci`,
- PWA and deployment: `manifest.webmanifest`, `sw.js`, `_headers`, `_redirects`.

### 13. Roadmap
- Add automated E2E tests for critical flows (mobile menu, form, menu filters, lightbox).
- Extend QA pipeline with post-build link and accessibility checks plus artifact reporting.
- Introduce Service Worker cache versioning tied to release version.
- Add automatic URL consistency validation across HTML files, `sitemap.xml`, and `manifest.webmanifest`.
- Move production/local environment toggles (e.g., form host fallback logic) into centralized configuration.

### 14. License
MIT.
