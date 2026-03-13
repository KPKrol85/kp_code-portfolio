# Vista — Hotels & Travel

## Wersja polska

### Przegląd projektu
Vista to statyczny, wielostronicowy serwis front-end zbudowany w oparciu o HTML, modularny CSS i modularny JavaScript. Repozytorium zawiera strony publiczne (`index.html`, `rooms.html`, `offers.html`, `gallery.html`, `contact.html`, `onas.html`, strony prawne, `404.html`, `offline.html`), lokalne fonty, obrazy responsywne, manifest PWA, service worker oraz konfigurację wdrożeniową dla Netlify.

### Kluczowe funkcje
- Wielostronicowa struktura serwisu z nawigacją główną, breadcrumbs na podstronach i stopką z linkami prawnymi.
- Przełącznik motywu `light` / `dark` / `auto` z inicjalizacją motywu przed załadowaniem stylów.
- Mobilne menu z obsługą klawiatury, pułapką fokusu i aktualizacją `aria-expanded`.
- Zakładki w sekcji pokoi oraz filtrowanie galerii z aktualizacją `aria-current`.
- Lightbox galerii z obsługą klawiatury, przyciskami poprzedni/następny i zarządzaniem fokusem.
- Formularz kontaktowo-rezerwacyjny z walidacją po stronie klienta, komunikatami `aria-live` i atrybutami Netlify Forms.
- Dynamiczne ładowanie danych strukturalnych JSON-LD z plików `assets/seo/*.json` tam, gdzie strona deklaruje `meta name="ld-json"`.
- Manifest PWA, `offline.html` i service worker do cache’owania zasobów.

### Tech stack
- HTML5
- CSS z architekturą modułową przez `@import`
- Vanilla JavaScript z modułami ES
- PostCSS (`postcss`, `postcss-import`, `autoprefixer`, `cssnano`)
- Esbuild do bundlowania JS
- Sharp + chokidar do pipeline’u obrazów
- Playwright + axe-core do testów dostępności
- Netlify (`netlify/_headers`, `netlify/_redirects`)

### Struktura projektu
- `*.html` — strony publiczne serwisu
- `css/style.css` + `css/modules/*.css` — wejście CSS i moduły stylów
- `js/script.js` + `js/features/*.js` — bootstrap aplikacji i moduły funkcjonalne
- `assets/fonts/` — fonty lokalne
- `assets/img/` — obrazy UI, źródłowe i zoptymalizowane
- `assets/seo/` — pliki JSON z danymi strukturalnymi
- `pwa/service-worker.js`, `site.webmanifest`, `offline.html` — elementy PWA/offline
- `scripts/*.mjs` — skrypty buildowe i QA
- `netlify/` — reguły nagłówków i przekierowań

### Instalacja i uruchomienie
1. `npm ci`
2. `npm run build`
3. Opcjonalnie zbuduj folder wdrożeniowy: `npm run build:dist`
4. W trybie pracy ciągłej:
   - `npm run watch:css`
   - `npm run watch:js`
   - `npm run img:watch`
5. Kontrola jakości:
   - `npm run check:links`
   - `npm run test:a11y`

### Build i wdrożenie
- `npm run build:css` generuje zminifikowany CSS.
- `npm run build:js` bundle’uje i minifikuje JS.
- `npm run build` uruchamia CSS, JS i aktualnie także `build:dist`.
- `npm run build:dist` przygotowuje czysty folder `dist/` do wdrożenia statycznego.
- Repo zawiera konfigurację Netlify przez `_headers` i `_redirects`.

### Notatki dostępności
- Każda publiczna strona ma pojedynczy nagłówek `h1`.
- Wdrożono skip link, style `:focus-visible`, obsługę `prefers-reduced-motion` i klasę bazową `no-js`.
- Menu mobilne, zakładki i lightbox mają obsługę klawiatury oraz przywracanie fokusu.
- Formularz kontaktowy używa `aria-invalid`, `aria-live` i logicznej kolejności pól.
- Zgodność kontrastu nie może zostać potwierdzona wyłącznie na podstawie statycznej analizy kodu; wymaga obliczonych stylów w runtime.

### Notatki SEO
- Strony publiczne mają `meta description`, `canonical`, Open Graph i Twitter Cards.
- Repo zawiera `robots.txt` i `sitemap.xml`.
- JSON-LD jest obecny na stronie głównej, kontakcie, pokojach, ofertach, galerii oraz stronach prawnych.
- Strona `onas.html` nie zawiera deklaracji `ld-json` ani fallbackowego skryptu JSON-LD.

### Notatki wydajnościowe
- Obrazy korzystają z `avif`, `webp`, `srcset`, `sizes`, `loading="lazy"` i jawnych wymiarów `width` / `height`.
- Hero na stronie głównej ma preload obrazu.
- Fonty lokalne są ładowane przez `@font-face` z `font-display: swap`.
- Animacje reveal mają fallback bez `IntersectionObserver` oraz osobny blok `prefers-reduced-motion`.

### Roadmap
- Naprawić zakres działania service workera dla stron w katalogu głównym.
- Ujednolicić strategię cache service workera z aktualnym pipeline’em build/deploy.
- Ograniczyć duplikację markupu w `rooms.html` i `gallery.html`.
- Dodać dane strukturalne do `onas.html`.
- Uzupełnić stały pomiar Lighthouse / Web Vitals i kontrastu w pipeline QA.

### Licencja
MIT, zgodnie z plikiem `LICENSE`.

---

## English Version

### Project Overview
Vista is a static multi-page front-end website built with HTML, modular CSS, and modular JavaScript. The repository includes public pages (`index.html`, `rooms.html`, `offers.html`, `gallery.html`, `contact.html`, `onas.html`, legal pages, `404.html`, `offline.html`), local fonts, responsive images, a PWA manifest, a service worker, and Netlify deployment configuration.

### Key Features
- Multi-page site structure with primary navigation, breadcrumbs on subpages, and a legal/footer navigation block.
- `light` / `dark` / `auto` theme switcher with early theme initialization before stylesheet load.
- Mobile navigation with keyboard support, focus trapping, and `aria-expanded` updates.
- Tabs for room categories and gallery filtering with `aria-current` state updates.
- Gallery lightbox with keyboard support, previous/next controls, and focus management.
- Contact/booking form with client-side validation, `aria-live` messaging, and Netlify Forms attributes.
- Dynamic JSON-LD loading from `assets/seo/*.json` on pages that expose `meta name="ld-json"`.
- PWA manifest, `offline.html`, and a service worker for static asset caching.

### Tech Stack
- HTML5
- Modular CSS via `@import`
- Vanilla JavaScript with ES modules
- PostCSS (`postcss`, `postcss-import`, `autoprefixer`, `cssnano`)
- Esbuild for JS bundling
- Sharp + chokidar for the image pipeline
- Playwright + axe-core for accessibility checks
- Netlify (`netlify/_headers`, `netlify/_redirects`)

### Project Structure
- `*.html` — public site pages
- `css/style.css` + `css/modules/*.css` — CSS entry point and style modules
- `js/script.js` + `js/features/*.js` — app bootstrap and feature modules
- `assets/fonts/` — local webfonts
- `assets/img/` — UI, source, and optimized images
- `assets/seo/` — structured data JSON payloads
- `pwa/service-worker.js`, `site.webmanifest`, `offline.html` — PWA/offline assets
- `scripts/*.mjs` — build and QA scripts
- `netlify/` — deployment headers and redirects

### Setup and Run
1. `npm ci`
2. `npm run build`
3. Optionally build the deployment folder: `npm run build:dist`
4. During development:
   - `npm run watch:css`
   - `npm run watch:js`
   - `npm run img:watch`
5. Quality checks:
   - `npm run check:links`
   - `npm run test:a11y`

### Build and Deployment Notes
- `npm run build:css` generates minified CSS.
- `npm run build:js` bundles and minifies JavaScript.
- `npm run build` currently runs CSS, JS, and `build:dist`.
- `npm run build:dist` prepares a clean `dist/` folder for static deployment.
- Netlify headers and redirects are included in the repository.

### Accessibility Notes
- Each public page exposes exactly one `h1`.
- The codebase includes a skip link, `:focus-visible` styles, `prefers-reduced-motion`, and a `no-js` baseline.
- Mobile nav, tabs, and lightbox support keyboard interaction and focus return.
- The contact form uses `aria-invalid`, `aria-live`, and a coherent field order.
- Contrast compliance cannot be verified from static source code alone; it requires computed-style analysis at runtime.

### SEO Notes
- Public pages include `meta description`, `canonical`, Open Graph, and Twitter metadata.
- The repository includes `robots.txt` and `sitemap.xml`.
- JSON-LD is present on the home page, contact page, rooms page, offers page, gallery page, and legal pages.
- `onas.html` does not include `ld-json` metadata or fallback JSON-LD.

### Performance Notes
- Images use `avif`, `webp`, `srcset`, `sizes`, `loading="lazy"`, and explicit `width` / `height`.
- The home hero image is preloaded.
- Local fonts are loaded through `@font-face` with `font-display: swap`.
- Reveal animations include a no-`IntersectionObserver` fallback and a dedicated `prefers-reduced-motion` block.

### Roadmap
- Fix service worker scope so it controls root-level pages.
- Align service worker cache strategy with the current build/deploy output.
- Reduce duplicated markup in `rooms.html` and `gallery.html`.
- Add structured data to `onas.html`.
- Add repeatable Lighthouse / Web Vitals and contrast checks to QA.

### License
MIT, as declared in `LICENSE`.
