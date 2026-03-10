# Vista — Hotels & Travel

## 🇵🇱 Dokumentacja (PL)

### Przegląd projektu
Statyczna strona front-end dla marki hotelowo-turystycznej „Vista”, zbudowana w oparciu o wielostronicowy HTML, modularny CSS i modularny JavaScript. Projekt wdraża przełączanie motywu (light/dark/auto), elementy PWA (manifest + service worker) oraz konfigurację wdrożeniową dla Netlify.

### Kluczowe funkcje (potwierdzone w repozytorium)
- Wielostronicowy serwis: strona główna, pokoje, oferty, galeria, kontakt, o nas oraz strony prawne.
- Responsywna nawigacja mobilna z obsługą klawiatury (Escape + pułapka focusu).
- Przełącznik motywu i inicjalizacja motywu przed renderem.
- Dynamiczne ustawianie `aria-current` w nawigacji.
- Formularz kontaktowo-rezerwacyjny z walidacją kliencką i integracją Netlify Forms.
- Lekki mechanizm lightboxa oraz filtrowanie kategorii galerii.
- JSON-LD fallback + dynamiczne ładowanie danych strukturalnych z plików `assets/seo/*.json`.
- PWA: `site.webmanifest`, `pwa/service-worker.js`, strona offline.

### Tech stack
- HTML5 (MVP, strony statyczne)
- CSS (architektura modułowa przez `@import`, tokeny design systemu)
- Vanilla JavaScript (ES modules)
- PostCSS (`postcss`, `autoprefixer`, `cssnano`, `postcss-import`)
- Narzędzia Node.js (`sharp`, `chokidar`) do optymalizacji obrazów i prostych testów integralności
- Netlify (`netlify/_headers`, `netlify/_redirects`)

### Struktura projektu (skrót)
- `*.html` — strony serwisu
- `css/style.css` + `css/modules/*.css` — warstwa stylów (tokeny, baza, layout, komponenty, sekcje, motion)
- `js/script.js` + `js/features/*.js` — bootstrap i moduły funkcjonalne
- `assets/` — obrazy, fonty, JSON-LD
- `pwa/service-worker.js`, `site.webmanifest`, `offline.html` — PWA/offline
- `scripts/*.mjs` — skrypty developerskie (obrazy, linki, a11y)
- `netlify/` — konfiguracja nagłówków i redirectów

### Instalacja i uruchomienie
1. `npm ci`
2. Build CSS i obrazów: `npm run build`
3. W trakcie pracy:
   - `npm run css:watch`
   - `npm run img:watch`
4. Kontrola jakości:
   - `npm run check:links`
   - `npm run test:a11y` (wymaga dostępu do npm registry)

### Build i wdrożenie
- Build lokalny opiera się o `npm run build`.
- Deploy target: Netlify (nagłówki bezpieczeństwa i reguły trasowania).
- Service worker utrzymuje cache statyczny i fallback `offline.html` dla nawigacji.

### Dostępność
- Zaimplementowano skip-link, focus styles i preferencję ograniczenia ruchu (`prefers-reduced-motion`).
- Menu mobilne oraz lightbox mają obsługę klawiatury i podstawowe zarządzanie focusem.
- Formularz posiada komunikaty walidacyjne z `aria-live`.
- Część zgodności kontrastu wymaga analizy runtime (computed styles), nie samego audytu statycznego.

### SEO
- Każda strona ma metadane (`description`, canonical, OG, Twitter) i tag robots.
- Repo zawiera `robots.txt`, `sitemap.xml` i dane strukturalne JSON-LD.
- `og:url` jest zgodny z canonical na przejrzanych podstronach.

### Wydajność
- Obrazy hero i galerie korzystają z nowoczesnych formatów (`avif`, `webp`) i `srcset`.
- Większość obrazów ma jawne `width/height` i lazy loading poza elementami lightboxa.
- Fonty lokalne ładowane przez `@font-face` z `font-display: swap`.

### Roadmap (zalecenia)
- Scalić CSS do jednego pliku produkcyjnego (`style.min.css`) i przełączyć referencje HTML.
- Ujednolicić i zautomatyzować walidację danych strukturalnych JSON-LD.
- Dodać zautomatyzowane testy a11y uruchamiane offline/CI bez dynamicznego pobierania pakietów.
- Dopracować atrybuty wymiarów w lightboxie, by ograniczyć CLS.
- Rozważyć metryki Lighthouse/Web Vitals jako stały element jakości.

### Licencja
MIT (zgodnie z `package.json`).

---

## 🇬🇧 Documentation (EN)

### Project overview
A static multi-page front-end website for the “Vista” hospitality brand, built with HTML, modular CSS, and modular JavaScript. The implementation includes theme switching (light/dark/auto), PWA capabilities (manifest + service worker), and Netlify deployment configuration.

### Key implemented features
- Multi-page website: home, rooms, offers, gallery, contact, about, and legal pages.
- Responsive mobile navigation with keyboard support (Escape + focus trap).
- Theme switcher with early theme initialization.
- Dynamic navigation `aria-current` handling.
- Booking/contact form with client-side validation and Netlify Forms attributes.
- Lightbox interactions and gallery category filtering.
- JSON-LD fallback plus dynamic loading from `assets/seo/*.json`.
- PWA support: `site.webmanifest`, `pwa/service-worker.js`, offline fallback page.

### Tech stack
- HTML5
- CSS (modular architecture via `@import` + tokenized design system)
- Vanilla JavaScript (ES modules)
- PostCSS toolchain (`postcss`, `autoprefixer`, `cssnano`, `postcss-import`)
- Node.js scripts (`sharp`, `chokidar`) for image processing and checks
- Netlify headers and redirects

### Project structure (overview)
- `*.html` — site pages
- `css/style.css` + `css/modules/*.css` — styles
- `js/script.js` + `js/features/*.js` — app bootstrap and feature modules
- `assets/` — images, fonts, structured data
- `pwa/service-worker.js`, `site.webmanifest`, `offline.html` — PWA/offline
- `scripts/*.mjs` — developer scripts
- `netlify/` — deployment headers and redirects

### Setup and run
1. `npm ci`
2. Build assets: `npm run build`
3. During development:
   - `npm run css:watch`
   - `npm run img:watch`
4. Quality checks:
   - `npm run check:links`
   - `npm run test:a11y` (requires npm registry access)

### Build & deployment notes
- Local build pipeline uses `npm run build`.
- Deployment target is Netlify with security headers and redirects.
- Service worker provides static caching and offline navigation fallback.

### Accessibility notes
- Skip link, focus-visible styles, and reduced-motion support are implemented.
- Mobile nav and lightbox provide keyboard behavior and focus management.
- Form validation feedback uses `aria-live`.
- Full contrast compliance requires runtime/computed-style verification.

### SEO notes
- Pages provide `description`, canonical, Open Graph, Twitter cards, and robots meta.
- Repository includes `robots.txt`, `sitemap.xml`, and JSON-LD payload files.
- `og:url` and canonical are aligned on reviewed pages.

### Performance notes
- Hero and gallery images use AVIF/WebP and responsive `srcset`.
- Most images define dimensions and lazy loading outside dynamic lightbox updates.
- Local fonts are loaded with `font-display: swap`.

### Roadmap
- Ship and reference bundled/minified production CSS consistently.
- Add stricter automated JSON-LD validation.
- Make accessibility checks CI-friendly without on-demand package downloads.
- Keep explicit image dimensions in lightbox flows to reduce CLS.
- Add repeatable Lighthouse/Web Vitals tracking.

### License
MIT (as declared in `package.json`).
