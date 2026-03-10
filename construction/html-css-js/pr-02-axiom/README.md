# Axiom Construction

## PL

### Przegląd projektu
Axiom Construction to statyczny serwis front-end (MPA) dla firmy budowlano-remontowej. Projekt zawiera stronę główną, podstrony usług i podstrony prawne, a także warstwę PWA (manifest + service worker).

### Kluczowe funkcje (potwierdzone w repozytorium)
- Strona główna (`index.html`) oraz dedykowane podstrony usług (`services/*.html`) i treści prawnych (`legal/*.html`).
- Formularz kontaktowy Netlify (`data-netlify="true"`, honeypot, reCAPTCHA, statusy `aria-live`, fallback bez JS).
- Komponenty JS: menu mobilne, przełącznik motywu, lightbox galerii, „powrót na górę”, banner informacji/cookies.
- SEO i social metadata: canonical, robots meta, Open Graph, Twitter cards, JSON-LD.
- Artefakty deploy/SEO/PWA: `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `sw.js`, `offline.html`.

### Tech stack
- HTML5 (wielostronicowy serwis statyczny).
- CSS oparty o podział: `tokens` / `base` / `layout` / `components` / `sections`.
- Vanilla JavaScript (moduły `js/core`, `js/components`, `js/sections`, `js/utils`).
- Node.js + npm scripts do budowania assetów, QA i przygotowania dystrybucji.

### Struktura projektu (skrót)
- Widoki główne: `index.html`, `404.html`, `offline.html`, `success.html`
- Podstrony: `services/`, `legal/`
- Style: `css/`
- Skrypty: `js/`
- Assety: `assets/`
- Narzędzia: `tools/`

### Setup i uruchomienie
1. `npm install`
2. `npm run serve` — podgląd katalogu roboczego na porcie 8080.
3. `npm run build` — pełny build release.
4. `npm run serve:dist` — podgląd wynikowego `dist/`.

### Build i deployment
- Główny pipeline produkcyjny to: `build:clean` → `build:css` → `build:js` → `build:sw` → `build:dist`.
- `_headers` definiuje polityki bezpieczeństwa i cache.
- `_redirects` jest obecnie plikiem opisowym (komentarze), bez aktywnych reguł przekierowań.

### Dostępność (A11y)
- Obecny skip link i semantyczny układ sekcji (`header`, `nav`, `main`, `section`, `footer`).
- Nawigacja mobilna aktualizuje `aria-expanded`, `aria-hidden`, wspiera ESC i przywracanie fokusu.
- Formularz ma komunikaty statusowe, podsumowanie błędów, sterowanie fokusem i fallback bez JS.
- Obsłużono `prefers-reduced-motion` w CSS i w zachowaniu scroll-top.
- Kontrast: pełna ocena zgodności wymaga analizy computed styles w runtime.

### SEO
- Wdrożone meta description, canonical, Open Graph, Twitter cards.
- Obecne JSON-LD na stronach HTML.
- `robots.txt` oraz `sitemap.xml` są obecne i spójne względem domeny kanonicznej.

### Wydajność
- Obrazy używają `picture` + AVIF/WebP/JPEG, `srcset/sizes`, lazy loading dla większości zasobów poniżej „folda”.
- Obrazy contentowe mają jawne `width/height`.
- Fonty są preloadowane i ładowane przez `@font-face` z `font-display: swap`.
- Service worker cache’uje zasoby statyczne i dokumenty oraz zapewnia fallback offline.

### Roadmap
- Uzupełnić aktywne reguły w `_redirects` (canonical host/HTTPS/trailing slash), jeśli są wymagane operacyjnie.
- Ograniczyć render-blocking `@import` w CSS przez bundlowanie do pojedynczego pliku wynikowego dla środowiska dev.
- Ujednolicić źródło danych JSON-LD (inline vs `js/structured-data/*`).
- Dodać automatyczny checker integralności linków i metadanych SEO do CI.
- Dodać automatyczne testy przepływów klawiaturowych dla menu/lightbox/modala.

### Licencja
MIT (`LICENSE`).

---

## EN

### Project overview
Axiom Construction is a static multi-page front-end website for a construction and renovation business. The repository includes a homepage, service subpages, legal subpages, and a PWA layer (manifest + service worker).

### Key features (repository-verified)
- Homepage (`index.html`) plus dedicated service (`services/*.html`) and legal (`legal/*.html`) pages.
- Netlify contact form (`data-netlify="true"`) with honeypot, reCAPTCHA, `aria-live` status messaging, and no-JS fallback.
- JS UI modules: mobile navigation, theme toggle, gallery lightbox, back-to-top, project/cookie info modal.
- SEO/social metadata: canonical, robots meta, Open Graph, Twitter cards, JSON-LD.
- Deployment/SEO/PWA files: `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `sw.js`, `offline.html`.

### Tech stack
- HTML5 static MPA.
- Layered CSS architecture (`tokens` / `base` / `layout` / `components` / `sections`).
- Vanilla JS modules (`js/core`, `js/components`, `js/sections`, `js/utils`).
- Node.js/npm scripts for build, QA, and release packaging.

### Structure overview
- Main views: `index.html`, `404.html`, `offline.html`, `success.html`
- Subpages: `services/`, `legal/`
- Styles: `css/`
- Scripts: `js/`
- Assets: `assets/`
- Tooling: `tools/`

### Setup & run
1. `npm install`
2. `npm run serve` — serve source workspace on port 8080.
3. `npm run build` — run full production build pipeline.
4. `npm run serve:dist` — serve built `dist/` output.

### Build & deployment notes
- Production pipeline is: `build:clean` → `build:css` → `build:js` → `build:sw` → `build:dist`.
- `_headers` defines security and cache policies.
- `_redirects` currently contains descriptive comments only (no active redirect rules).

### Accessibility notes
- Skip link and semantic document structure are implemented.
- Mobile nav updates `aria-expanded`/`aria-hidden`, supports Escape, and restores focus.
- Contact form includes status messaging, error summary, focus behavior, and no-JS fallback.
- `prefers-reduced-motion` is handled in CSS and JS behavior.
- Color contrast compliance cannot be fully confirmed without runtime computed style analysis.

### SEO notes
- Meta description, canonical, Open Graph, and Twitter metadata are present.
- JSON-LD is present across HTML pages.
- `robots.txt` and `sitemap.xml` are present and aligned with the canonical domain.

### Performance notes
- Image strategy uses `picture`, AVIF/WebP/JPEG, `srcset/sizes`, and lazy loading for non-critical media.
- Content images include explicit `width/height`.
- Fonts are preloaded and configured via `@font-face` with `font-display: swap`.
- Service worker provides static/document caching and offline fallback.

### Roadmap
- Add active redirect rules in `_redirects` when operationally required.
- Reduce render-blocking CSS `@import` chains in development output.
- Consolidate JSON-LD data source (inline blocks vs `js/structured-data/*`).
- Add automated internal link and SEO metadata consistency checks in CI.
- Add keyboard-flow regression tests for nav/lightbox/modal behaviors.

### License
MIT (`LICENSE`).
