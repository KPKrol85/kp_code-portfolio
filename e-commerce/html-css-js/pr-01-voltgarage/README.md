# VOLT GARAGE — dokumentacja projektu (PL)

## Przegląd projektu
VOLT GARAGE to statyczny front-end e-commerce (wersja demo) zbudowany jako zestaw stron HTML z modułowym JavaScriptem i warstwą PWA (manifest + service worker). Projekt używa własnego systemu tokenów CSS i komponentów opartych o klasy semantyczne. 

## Kluczowe funkcje (wyłącznie wykryte w repo)
- Wielostronicowa struktura: strona główna, sklep, produkt, koszyk, checkout, kontakt, strony prawne, 404 i offline.
- Dynamiczne renderowanie produktów z `data/products.json` (listy, filtrowanie, widok szczegółów, produkty powiązane, promocje, nowości).
- Koszyk klienta i podsumowanie checkout po stronie front-end.
- Tryb jasny/ciemny z zapisem preferencji.
- Modal informacyjny „demo” z focus trap.
- PWA: `site.webmanifest`, rejestracja SW, cache HTML/assetów, strona offline, prompt instalacji i komunikaty update.
- QA scripts: walidacja HTML, CSS, JS, linków wewnętrznych i JSON-LD.

## Tech stack
- HTML5 (14 plików stron + 404/offline).
- CSS (entry `css/main.css` + partials: `base/layout/components/themes`).
- Vanilla JavaScript ES modules (`js/main.js` + moduły `core`, `ui`, `features`, `services`).
- Node.js tooling w `package.json` (PostCSS/cssnano, Terser, ESLint, Stylelint, html-validate, Prettier, custom QA scripts).

## Struktura projektu (skrót)
- `index.html`, `404.html`, `offline.html`.
- `pages/*.html` — podstrony.
- `css/main.css` + `css/partials/*.css`.
- `js/main.js` + `js/{core,ui,features,services}/*.js`.
- `data/products.json`.
- `sw.js`, `site.webmanifest`, `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`.
- `scripts/*.js` — walidatory QA.

## Setup i uruchomienie
Wymagania: Node.js + npm.

```bash
npm install
npm run qa
```

Tryby przydatne lokalnie:
- `npm run build` — minifikacja CSS/JS.
- `npm run qa:links` — sprawdzenie linków HTML.
- `npm run validate:jsonld` — walidacja bloków JSON-LD.

## Build / deployment notes
- Strategia hostingu jest przygotowana pod Netlify (`_headers`, `_redirects`).
- Cache-control dla assetów ustawione na długie TTL + immutable.
- Service worker rejestruje się z `/sw.js` i obsługuje fallback offline.

## Accessibility notes
- Obecny skip link i globalny styl `:focus-visible`.
- Menu i dropdowny posiadają obsługę klawiatury (`Escape`, `ArrowDown`, `ArrowUp`, fokus).
- Modal demo ma `role="dialog"`, `aria-modal="true"` i focus trap.
- Obsłużono `prefers-reduced-motion` po stronie JS i CSS.
- Część widoków produktowych opiera się na JS (fallback tekstowy jest obecny, ale bez pełnej funkcjonalności katalogu).

## SEO notes
- Każda główna podstrona zawiera: meta description, canonical, OG/Twitter, JSON-LD.
- `robots.txt` i `sitemap.xml` są obecne i spójne względem domeny kanonicznej.
- OG image wskazuje na istniejący plik `assets/images/og/og-1200x630.jpg`.

## Performance notes
- Obecne obrazy AVIF/WebP/JPG przez `<picture>` i lazy loading (z wyjątkiem hero eager/high priority).
- Fonty lokalne `woff2` z `font-display: swap`.
- PWA cache warstwowe (HTML i assets) + trim cache.
- CSS entry korzysta z `@import`, co może opóźniać krytyczny render na słabszych warunkach sieciowych.

## Roadmap (na bazie audytu)
1. Wzmocnić baseline no-JS (np. SSR listy produktów albo statyczny fallback katalogu).
2. Ujednolicić atrybuty `width/height` dla wszystkich obrazów (w tym 404/offline/footer logo).
3. Ograniczyć inline scripts przez nonce/hash CSP i eliminację `unsafe-inline`.
4. Dodać CI dla `npm run qa` i smoke checks.
5. Rozważyć bundling CSS bez `@import` chain.

## Licencja
Nie wykryto pliku licencji w repozytorium.

---

# VOLT GARAGE — project documentation (EN)

## Project overview
VOLT GARAGE is a static front-end e-commerce demo built as multi-page HTML with modular JavaScript and PWA capabilities (manifest + service worker). It uses a custom token-based CSS system and component-oriented styling.

## Key features (repository-confirmed)
- Multi-page website: home, shop, product, cart, checkout, contact, legal pages, 404, and offline page.
- Dynamic product rendering from `data/products.json` (listing, filtering, detail view, related, sale, new arrivals).
- Client-side cart and checkout summary.
- Light/dark theme toggle with persisted preference.
- Demo modal with focus trap.
- PWA setup: `site.webmanifest`, SW registration, HTML/assets caching, offline fallback, install/update prompts.
- QA automation scripts: HTML/CSS/JS checks, internal link validation, JSON-LD validation.

## Tech stack
- HTML5 (14 page-level documents + 404/offline).
- CSS (`css/main.css` + partials: base/layout/components/themes).
- Vanilla JavaScript ES modules (`js/main.js` + `core/ui/features/services`).
- Node tooling (`package.json`): PostCSS/cssnano, Terser, ESLint, Stylelint, html-validate, Prettier, custom QA scripts.

## Structure overview
- `index.html`, `404.html`, `offline.html`.
- `pages/*.html`.
- `css/main.css` + `css/partials/*.css`.
- `js/main.js` + `js/{core,ui,features,services}/*.js`.
- `data/products.json`.
- `sw.js`, `site.webmanifest`, `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`.
- `scripts/*.js` for QA automation.

## Setup & run
Requirements: Node.js + npm.

```bash
npm install
npm run qa
```

Useful local commands:
- `npm run build` — minifies CSS/JS.
- `npm run qa:links` — validates internal links.
- `npm run validate:jsonld` — validates JSON-LD blocks.

## Build/deployment notes
- Hosting configuration aligns with Netlify conventions (`_headers`, `_redirects`).
- Asset caching policy uses long-lived immutable cache headers.
- Service worker registers at `/sw.js` and provides offline fallback.

## Accessibility notes
- Skip link and global `:focus-visible` styling are implemented.
- Navigation/dropdowns provide keyboard behavior (`Escape`, arrow navigation, focus management).
- Demo modal includes `role="dialog"`, `aria-modal="true"`, and focus trapping.
- `prefers-reduced-motion` is handled in both JS and CSS.
- Product-heavy views depend on JS (fallback text exists but full catalog UX is JS-driven).

## SEO notes
- Main pages include meta description, canonical, OG/Twitter metadata, and JSON-LD.
- `robots.txt` and `sitemap.xml` are present and aligned with the canonical domain.
- OG image points to an existing file (`assets/images/og/og-1200x630.jpg`).

## Performance notes
- Uses AVIF/WebP/JPG `<picture>` patterns and lazy-loading (hero uses eager/high priority by design).
- Local `woff2` fonts with `font-display: swap`.
- Layered SW caching for HTML/assets with cache trimming.
- CSS entry relies on `@import`, which can add render-path overhead on slower networks.

## Roadmap
1. Improve no-JS baseline for product listing flows.
2. Standardize `width`/`height` attributes for all images.
3. Tighten CSP by reducing reliance on inline scripts.
4. Add CI enforcement for QA scripts.
5. Consider CSS bundling strategy without `@import` chain.

## License
No license file was detected in the repository.
