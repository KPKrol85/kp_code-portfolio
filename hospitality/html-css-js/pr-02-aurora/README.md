# Aurora

## PL

### Przegląd projektu
Aurora to statyczny, wielostronicowy serwis front-endowy dla marki Aurora Travel. Repozytorium zawiera źródłowe pliki HTML, modularny CSS oparty na importach, modułowy JavaScript w Vanilla JS oraz lekki pipeline buildowy dla minifikacji, weryfikacji assetów i przygotowania katalogu `dist`.

### Kluczowe funkcje
- Wielostronicowa architektura oparta na statycznych plikach HTML.
- Responsywna nawigacja z mobilnym menu, obsługą `aria-expanded`, klawisza `Escape` i pułapką fokusu.
- Przełącznik motywu jasny/ciemny z zapisem preferencji w `localStorage`.
- Sekcje interaktywne oparte na modułach JS: tabs, accordion FAQ, filtry ofert, filtry galerii, lightbox.
- Dynamiczne ładowanie galerii i szczegółów wycieczki z plików JSON.
- Formularz kontaktowy przygotowany pod Netlify Forms z walidacją po stronie klienta i natywnym submit flow.
- Strony prawne, strona offline, strona 404 i strona potwierdzenia wysłania formularza.
- Inline SEO metadata: meta description, canonical, Open Graph, Twitter cards, robots, JSON-LD i `BreadcrumbList` na wybranych stronach statycznych.
- PWA baseline: `site.webmanifest`, `service-worker.js`, offline fallback.

### Tech stack
- HTML5
- CSS z podziałem na moduły i tokeny projektowe
- Vanilla JavaScript ES modules
- PostCSS (`postcss-import`, `autoprefixer`, `cssnano`)
- esbuild do bundlowania i minifikacji JS
- Netlify-compatible deployment files: `_redirects`, `_headers`, Netlify-ready form markup

### Struktura projektu
- `index.html`, `about.html`, `tours.html`, `tour.html`, `gallery.html`, `contact.html`
- `cookies.html`, `regulamin.html`, `polityka-prywatnosci.html`
- `404.html`, `offline.html`, `dziekuje.html`
- `css/style.css` jako główne wejście źródłowe CSS
- `css/modules/` z podziałem na tokens, base, layout, components, sections, fonts, subpages, utilities
- `js/script.js` jako główny entrypoint
- `js/features/` z modułami funkcjonalnymi
- `assets/` z fontami, ikonami, grafikami i danymi JSON
- `assets/img-src/` jako źródłowy katalog rasterów dla pipeline optymalizacji obrazów
- `scripts/` z narzędziami buildowymi i walidatorami repozytorium
- `service-worker.js`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`

### Setup i uruchomienie
1. Zainstaluj zależności:

```bash
npm install
```

2. Zbuduj assety produkcyjne:

```bash
npm run build
```

3. Przy pierwszym uruchomieniu workflow obrazów wykonaj bootstrap źródeł:

```bash
npm run images:bootstrap
```

4. Przygotuj pełny katalog dystrybucyjny:

```bash
npm run dist
```

5. Uruchamiaj projekt przez serwer HTTP. Service worker i moduły JS nie są przeznaczone do otwierania bezpośrednio z systemu plików.

### Build i deployment
- CSS jest budowany z `css/style.css` do `css/style.min.css`.
- JavaScript jest bundlowany z `js/script.js` do `js/script.min.js`.
- Raster images są budowane z `assets/img-src/` do `assets/img/` przez `npm run build:images`.
- `npm run images:bootstrap` jednorazowo kopiuje obecne rastry z `assets/img/` do `assets/img-src/` jako warstwę źródłową workflow.
- `npm run check:assets` sprawdza integralność odwołań assetów w źródłowych stronach HTML.
- `npm run dist` czyści katalog wynikowy, buduje assety i kopiuje wymagane pliki do `dist/`.
- Repozytorium zawiera pliki wdrożeniowe dla hostingu statycznego: `_redirects`, `_headers`, `site.webmanifest`, `service-worker.js`.
- Formularz kontaktowy używa znacznika zgodnego z Netlify Forms i przekierowuje na `dziekuje.html`.

### Notatki dostępności
- Wspólne strony mają skip link do `#main-content`.
- Mobilna nawigacja i lightbox mają obsługę klawiatury, focus management i zamykanie przez `Escape`.
- Tabs i accordion używają atrybutów ARIA.
- Formularz kontaktowy ma powiązania `label` -> `input`, komunikaty błędów przez `aria-describedby` i walidację progresywnie ulepszaną przez JS.
- W CSS obecne są reguły `prefers-reduced-motion`.
- Strony prawne mają osobne style do druku.
- Część treści kluczowych na `gallery.html` i `tour.html` zależy od JavaScript.

### Notatki SEO
- Wszystkie publiczne strony źródłowe mają title, meta description i Open Graph.
- Strony indeksowalne mają canonical i `meta name="robots"`.
- `robots.txt` wskazuje `sitemap.xml`.
- W projekcie używany jest inline JSON-LD; na zatwierdzonych stronach statycznych dodano też `BreadcrumbList`.
- Strony narzędziowe `404.html`, `offline.html` i `dziekuje.html` mają `noindex,follow`.

### Notatki wydajnościowe
- Projekt używa obrazów responsywnych z formatami AVIF, WebP i JPG.
- Część obrazów niekrytycznych ma `loading="lazy"`.
- Hero na stronie głównej ma `fetchpriority="high"` oraz jawne `width` i `height`.
- Fonty lokalne `Inter` i `Manrope` są ładowane przez `@font-face` z `font-display: swap`.
- Assety produkcyjne są minifikowane, a service worker cache'uje podstawowe zasoby statyczne i stronę offline.
- Workflow obrazów zachowuje strukturę katalogów, wspiera obecny wzorzec nazw `basename-WxH.ext` i generuje `.webp` oraz `.avif` dla responsywnych rasterów.

### Roadmapa
- Dodać fallback bez JavaScript dla galerii i strony szczegółów wycieczki.
- Ujednolicić strategię indeksacji dla `tour.html` i wpisów w sitemapie.
- Uzupełnić brakujące wymiary obrazów w źródłowych szablonach i renderowaniu JS.
- Aktywować i zweryfikować nagłówki bezpieczeństwa w `_headers`.
- Ujednolicić publiczne nazewnictwo między HTML, manifestem i materiałami prawnymi.

### Licencja
MIT, zgodnie z `package.json`.

---

## EN

### Project overview
Aurora is a static multi-page front-end website for the Aurora Travel brand. The repository contains source HTML pages, modular CSS built from imports, modular Vanilla JS, and a lightweight build pipeline for minification, asset verification, and `dist` packaging.

### Key features
- Static multi-page HTML architecture.
- Responsive navigation with mobile menu, `aria-expanded`, `Escape` handling, and focus trapping.
- Light/dark theme toggle with preference persisted in `localStorage`.
- Interactive sections powered by JS modules: tabs, FAQ accordion, offer filters, gallery filters, lightbox.
- Dynamic gallery loading and tour-detail rendering from JSON files.
- Contact form prepared for Netlify Forms with client-side validation and native form submission flow.
- Legal pages, offline page, 404 page, and a thank-you page for form submission.
- Inline SEO metadata: meta description, canonical, Open Graph, Twitter cards, robots, JSON-LD, and `BreadcrumbList` on approved static pages.
- PWA baseline with `site.webmanifest`, `service-worker.js`, and offline fallback.

### Tech stack
- HTML5
- Modular CSS with design tokens
- Vanilla JavaScript ES modules
- PostCSS (`postcss-import`, `autoprefixer`, `cssnano`)
- esbuild for JS bundling and minification
- Netlify-compatible deployment files: `_redirects`, `_headers`, Netlify-ready form markup

### Project structure
- `index.html`, `about.html`, `tours.html`, `tour.html`, `gallery.html`, `contact.html`
- `cookies.html`, `regulamin.html`, `polityka-prywatnosci.html`
- `404.html`, `offline.html`, `dziekuje.html`
- `css/style.css` as the main source CSS entry
- `css/modules/` split into tokens, base, layout, components, sections, fonts, subpages, utilities
- `js/script.js` as the main entry point
- `js/features/` for feature modules
- `assets/` for fonts, icons, images, and JSON data
- `assets/img-src/` as the source raster directory for the image optimization pipeline
- `scripts/` for build and verification utilities
- `service-worker.js`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`

### Setup and run
1. Install dependencies:

```bash
npm install
```

2. Build production assets:

```bash
npm run build
```

3. On the first run of the image workflow, bootstrap the source image directory:

```bash
npm run images:bootstrap
```

4. Prepare the distribution directory:

```bash
npm run dist
```

5. Serve the site over HTTP. The service worker and JS modules are not intended to run directly from the filesystem.

### Build and deployment notes
- CSS is built from `css/style.css` into `css/style.min.css`.
- JavaScript is bundled from `js/script.js` into `js/script.min.js`.
- Raster images are built from `assets/img-src/` into `assets/img/` via `npm run build:images`.
- `npm run images:bootstrap` performs the one-time copy of current raster assets from `assets/img/` into `assets/img-src/`.
- `npm run check:assets` verifies source HTML asset references.
- `npm run dist` cleans the output directory, builds production assets, and copies the required files into `dist/`.
- The repository includes static-hosting deployment files: `_redirects`, `_headers`, `site.webmanifest`, `service-worker.js`.
- The contact form uses Netlify-compatible markup and redirects to `dziekuje.html`.

### Accessibility notes
- Shared pages include a skip link to `#main-content`.
- Mobile navigation and the lightbox support keyboard usage, focus management, and `Escape` closing.
- Tabs and accordion components use ARIA attributes.
- The contact form has proper `label` -> `input` associations, `aria-describedby` error messaging, and progressive-enhancement validation.
- CSS includes `prefers-reduced-motion` handling.
- Legal pages include print-specific styling.
- Some core content on `gallery.html` and `tour.html` depends on JavaScript.

### SEO notes
- All public source pages include title, meta description, and Open Graph metadata.
- Indexable pages include canonical URLs and `meta name="robots"`.
- `robots.txt` points to `sitemap.xml`.
- The project uses inline JSON-LD; approved static pages also include `BreadcrumbList`.
- Utility pages `404.html`, `offline.html`, and `dziekuje.html` use `noindex,follow`.

### Performance notes
- The project uses responsive image sets in AVIF, WebP, and JPG.
- Some non-critical images use `loading="lazy"`.
- The homepage hero image uses `fetchpriority="high"` and explicit `width` and `height`.
- Local `Inter` and `Manrope` fonts are loaded via `@font-face` with `font-display: swap`.
- Production assets are minified, and the service worker caches core static assets plus the offline page.
- The image workflow preserves folder structure, keeps the current `basename-WxH.ext` naming pattern, and generates `.webp` and `.avif` for responsive raster assets.

### Roadmap
- Add no-JS fallback content for the gallery and tour-detail pages.
- Align indexing strategy for `tour.html` and sitemap entries.
- Add missing image dimensions in source templates and JS renderers.
- Activate and verify security headers in `_headers`.
- Normalize public naming across HTML, manifest, and legal content.

### License
MIT, as declared in `package.json`.
