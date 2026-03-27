# VOLT GARAGE

## Dokumentacja projektu (PL)

### Przegląd
Volt Garage to wielostronicowy front-end sklepu internetowego oparty na statycznych plikach HTML, modularnym JavaScripcie i własnej strukturze CSS. Repozytorium zawiera warstwę PWA z `site.webmanifest`, service workerem, stroną offline oraz zestawem skryptów QA zdefiniowanych w `package.json`.

### Kluczowe funkcje
- Wielostronicowa struktura z widokami: strona główna, sklep, produkt, koszyk, checkout, kontakt, strony prawne, `404.html` i `offline.html`.
- Dynamiczne renderowanie list produktów, nowości, promocji i rekomendacji z `data/products.json`.
- Front-endowy koszyk z podsumowaniem zamówienia i obsługą ilości produktów.
- Formularz kontaktowy i formularz checkout z walidacją po stronie klienta.
- Przełącznik motywu z zapisem preferencji w `localStorage`.
- Modal informacyjny projektu z akceptacją regulaminu i focus trapem.
- Funkcje PWA: manifest, rejestracja service workera, cache offline, prompt instalacji i obsługa aktualizacji.
- SEO i dane strukturalne: canonical, Open Graph, Twitter cards, JSON-LD, `robots.txt`, `sitemap.xml`.

### Tech stack
- HTML5
- CSS z podziałem na partiale: `base`, `layout`, `components`, `themes`
- Vanilla JavaScript ES modules
- Node.js tooling: PostCSS, cssnano, Terser, ESLint, Stylelint, Prettier, html-validate
- Netlify-oriented deployment files: `_headers`, `_redirects`

### Struktura projektu
- `index.html`, `404.html`, `offline.html`
- `pages/*.html`
- `css/main.css` i `css/partials/*.css`
- `js/main.js` oraz `js/core`, `js/ui`, `js/features`, `js/services`
- `data/products.json`
- `assets/`
- `site.webmanifest`, `sw.js`, `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`
- `scripts/` i `tools/` dla walidacji oraz optymalizacji obrazów

### Setup i uruchomienie
Wymagania: Node.js i npm.

```bash
npm install
npm run qa
```

Repozytorium nie definiuje własnego skryptu dev-servera. Do lokalnego podglądu trzeba użyć dowolnego statycznego serwera HTTP.

Przydatne komendy:
- `npm run build` minifikuje `css/main.css` i `js/main.js`.
- `npm run qa:links` sprawdza linki wewnętrzne pomiędzy stronami HTML.
- `npm run validate:jsonld` sprawdza bloki JSON-LD.
- `npm run qa:smoke` uruchamia smoke test Lighthouse.

### Build i wdrożenie
- Projekt ma pliki wdrożeniowe pod hosting statyczny z konfiguracją Netlify.
- `site.webmanifest` ustawia `start_url`, `scope`, skróty i screenshoty aplikacji.
- `js/main.js` rejestruje `/sw.js`, a `sw.js` obsługuje cache wersjonowany i fallback offline.
- `_headers` definiuje nagłówki bezpieczeństwa oraz długie cache dla `/assets/*`, `/css/*` i `/js/*`.

### Dostępność
- Strony mają skip link do głównej treści.
- Nawigacja ustawia `aria-current`, obsługuje `aria-expanded` i sterowanie klawiaturą dla dropdownów.
- Modal projektu ma `role="dialog"`, `aria-modal="true"` i focus trap.
- Formularze ustawiają `aria-invalid`, `aria-describedby` i komunikaty `aria-live`.
- CSS i JS uwzględniają `prefers-reduced-motion`.
- Baseline bez JavaScript jest częściowy: kluczowe sekcje katalogu pokazują fallback tekstowy, ale nie pełną listę produktów.

### SEO
- Główne strony zawierają `meta description`, canonical, Open Graph i Twitter cards.
- Repozytorium zawiera `robots.txt` i `sitemap.xml`.
- Strony mają bloki JSON-LD dla `Organization` i `WebSite`, a nawigacja breadcrumbów jest rozszerzana w JS o dane strukturalne.
- W repo istnieje asset OG: `assets/images/og/og-1200x630.jpg`.

### Wydajność
- Produkty korzystają z `<picture>` z AVIF/WebP/JPG oraz `loading="lazy"` i `decoding="async"`.
- Fonty lokalne `woff2` są deklarowane z `font-display: swap`.
- Hero na stronie głównej używa preloaded obrazu AVIF.
- CSS entry jest zbudowany z `@import`, co wydłuża łańcuch ładowania względem jednego zbundlowanego arkusza.
- Długie cache dla `/css/*` i `/js/*` wymagają ostrożności, bo HTML odwołuje się do niezhashowanych nazw plików.

### Roadmap
- Naprawić konflikt CSP z osadzoną mapą Google na stronie kontaktu.
- Rozszerzyć baseline bez JS dla list i widoków produktów.
- Włączyć walidację `404.html`, `offline.html` i JSON-LD do głównego skryptu `npm run qa`.
- Ograniczyć ręczną duplikację współdzielonego markupu między stronami.
- Wprowadzić wersjonowanie assetów lub zmianę polityki cache dla CSS i JS.

### Licencja
Plik licencji nie został wykryty w repozytorium.

---

## Project documentation (EN)

### Overview
Volt Garage is a multi-page storefront front end built with static HTML, modular JavaScript, and a custom CSS structure. The repository includes a PWA layer with `site.webmanifest`, a service worker, an offline page, and QA scripts defined in `package.json`.

### Key features
- Multi-page structure covering home, shop, product, cart, checkout, contact, legal pages, `404.html`, and `offline.html`.
- Dynamic product rendering, new arrivals, sale listings, and related-product sections backed by `data/products.json`.
- Client-side cart with checkout summary and quantity controls.
- Contact and checkout forms with client-side validation.
- Theme switcher with persisted preference in `localStorage`.
- Project information modal with terms acceptance and focus trap.
- PWA support: manifest, service worker registration, offline caching, install prompt, and update prompt flow.
- SEO and structured data: canonical URLs, Open Graph, Twitter cards, JSON-LD, `robots.txt`, and `sitemap.xml`.

### Tech stack
- HTML5
- CSS split into partials: `base`, `layout`, `components`, `themes`
- Vanilla JavaScript ES modules
- Node.js tooling: PostCSS, cssnano, Terser, ESLint, Stylelint, Prettier, html-validate
- Netlify-oriented deployment files: `_headers`, `_redirects`

### Project structure
- `index.html`, `404.html`, `offline.html`
- `pages/*.html`
- `css/main.css` and `css/partials/*.css`
- `js/main.js` plus `js/core`, `js/ui`, `js/features`, `js/services`
- `data/products.json`
- `assets/`
- `site.webmanifest`, `sw.js`, `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`
- `scripts/` and `tools/` for validation and image optimization

### Setup and run
Requirements: Node.js and npm.

```bash
npm install
npm run qa
```

The repository does not define a dedicated dev-server script. Local preview requires any static HTTP server.

Useful commands:
- `npm run build` minifies `css/main.css` and `js/main.js`.
- `npm run qa:links` validates internal HTML links.
- `npm run validate:jsonld` validates JSON-LD blocks.
- `npm run qa:smoke` runs the Lighthouse smoke script.

### Build and deployment notes
- The project ships deployment files for static hosting with Netlify-style configuration.
- `site.webmanifest` defines the app scope, shortcuts, and screenshots.
- `js/main.js` registers `/sw.js`, and `sw.js` manages versioned caches with an offline fallback.
- `_headers` defines security headers and long-lived caching for `/assets/*`, `/css/*`, and `/js/*`.

### Accessibility notes
- Pages include a skip link to the main content.
- Navigation applies `aria-current`, maintains `aria-expanded`, and supports keyboard control for dropdown menus.
- The project modal uses `role="dialog"`, `aria-modal="true"`, and a focus trap.
- Forms manage `aria-invalid`, `aria-describedby`, and `aria-live` feedback.
- CSS and JS both account for `prefers-reduced-motion`.
- The no-JS baseline is partial: core catalog areas show fallback text instead of a complete product listing.

### SEO notes
- Main pages include `meta description`, canonical, Open Graph, and Twitter metadata.
- The repository contains `robots.txt` and `sitemap.xml`.
- JSON-LD blocks for `Organization` and `WebSite` are present, and breadcrumb structured data is injected by JavaScript.
- The OG image asset exists at `assets/images/og/og-1200x630.jpg`.

### Performance notes
- Product cards use `<picture>` with AVIF/WebP/JPG plus `loading="lazy"` and `decoding="async"`.
- Local `woff2` fonts are declared with `font-display: swap`.
- The homepage hero image is preloaded in AVIF format.
- The CSS entry relies on `@import`, which creates a longer loading chain than a single bundled stylesheet.
- Long-lived caching for `/css/*` and `/js/*` needs care because HTML points to unhashed filenames.

### Roadmap
- Fix the CSP conflict with the embedded Google Map on the contact page.
- Improve the no-JS baseline for product-driven views.
- Add `404.html`, `offline.html`, and JSON-LD validation to the main `npm run qa` path.
- Reduce manual duplication of shared markup across pages.
- Introduce asset versioning or adjust cache policy for CSS and JS.

### License
No license file was detected in the repository.
