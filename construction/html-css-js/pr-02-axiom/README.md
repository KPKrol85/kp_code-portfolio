# Axiom Construction — dokumentacja projektu

## Wersja polska

### Przegląd projektu
Axiom Construction to wielostronicowy serwis portfolio (HTML/CSS/JS) dla firmy budowlano-remontowej. Projekt obejmuje stronę główną, podstrony usługowe i prawne, stronę offline, stronę 404, stronę sukcesu formularza oraz konfigurację deployu statycznego (Netlify-compatible).

### Kluczowe funkcje
- Wielostronicowa struktura: `index.html`, `services/*.html`, `legal/*.html`, `404.html`, `offline.html`, `success.html`.
- Architektura CSS warstwowa: tokeny (`css/tokens`), baza (`css/base`), layout (`css/layout`), komponenty (`css/components`), sekcje (`css/sections`) i agregacja przez `css/main.css`.
- Nazewnictwo BEM + utility classes (`.u-*`, `.visually-hidden`, `.sr-only`) oraz tokeny design systemu (`--space-*`, `--primary-*`, `--surface-*`).
- Formularz kontaktowy z Netlify Forms (`data-netlify="true"`), honeypotem (`netlify-honeypot="trap"`) i walidacją po stronie klienta.
- PWA: `manifest.webmanifest`, service worker (`sw.js`) i strona `offline.html`.
- SEO: canonical, robots meta, OpenGraph/Twitter oraz `robots.txt` i `sitemap.xml`.
- Structured data JSON-LD osadzone inline w stronach HTML.

### Tech stack
- HTML5
- CSS3 (Custom Properties + modularna architektura)
- Vanilla JavaScript (ES Modules + bundling do `dist/script.min.js`)
- Node.js tooling (`tools/`): build head/CSS/JS/SW, pipeline obrazów
- Netlify (pliki `_headers`, `_redirects`)

### Structure overview
- `assets/` — obrazy, fonty, favicony, ikony
- `css/` — tokeny, base, layout, components, sections
- `js/` — core/components/sections/utils + JSON dla structured data
- `dist/` — zminifikowane artefakty (`style.min.css`, `script.min.js`)
- `services/`, `legal/` — podstrony treściowe
- `tools/` — narzędzia buildowe
- pliki deploy/PWA/SEO: `_headers`, `_redirects`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `sw.js`

### Setup & run
1. Instalacja zależności:
   ```bash
   npm install
   ```
2. Build projektu:
   ```bash
   npm run build
   ```
3. Uruchomienie lokalnego serwera:
   ```bash
   npm run serve
   ```
4. Podgląd: `http://localhost:8080`

### Build/deployment notes
- Główny build uruchamia: `build:head`, `build:css`, `build:js`, `build:sw`.
- `dist/style.min.css` i `dist/script.min.js` są artefaktami produkcyjnymi.
- `_headers` definiuje CSP, polityki bezpieczeństwa i cache.
- `_redirects` zawiera przekierowania canonical host/HTTPS i fallback 404.

### Accessibility notes
- Obecne: skip link do treści, jedna sekcja `<main>`, poprawna hierarchia nagłówków (1x H1 na stronę), style `:focus-visible`, obsługa `prefers-reduced-motion`, atrybuty `aria-expanded` i `aria-current`.
- Formularz: etykiety `for`, `aria-live` dla statusu, fokus na pierwszym błędzie, komunikaty `<noscript>`.
- No-JS baseline dla formularza jest zachowany (`method="POST"`, `action="/success.html"`), jednak mobilna nawigacja zależy od JS (audit w `AUDIT.md`).

### SEO notes
- Każda strona ma canonical, robots i `og:url` zgodne z canonical.
- `robots.txt` wskazuje `sitemap.xml`.
- JSON-LD jest osadzane inline i składniowo poprawne.

### Performance notes
- Obrazy mają AVIF/WEBP/JPG i szerokie użycie `srcset`/`sizes`.
- W większości przypadków ustawione są `width`/`height` i `loading="lazy"` dla treści poza above-the-fold.
- Fonty są preloadowane jako WOFF2 i mają `font-display: swap`.

### Roadmap
- Ujednolicić strategię ładowania JS (jedna ścieżka runtime dla wszystkich stron).
- Ujednolicić rejestrację service workera ścieżką absolutną.
- Dodać automatyczną walidację A11y/SEO/linków do CI.
- Ograniczyć duplikację danych SEO/JSON-LD przez jeden generator źródeł.
- Dodać budżety wydajności dla CSS/JS/obrazów.

### Licencja
ISC (wg `package.json`).

---

## English version

### Project overview
Axiom Construction is a multi-page portfolio website (HTML/CSS/JS) for a construction/renovation company. The project includes a homepage, service/legal subpages, an offline page, a 404 page, a form success page, and static hosting deployment configuration (Netlify-compatible).

### Key features
- Multi-page structure: `index.html`, `services/*.html`, `legal/*.html`, `404.html`, `offline.html`, `success.html`.
- Layered CSS architecture: tokens (`css/tokens`), base (`css/base`), layout (`css/layout`), components (`css/components`), sections (`css/sections`), aggregated via `css/main.css`.
- BEM naming + utility classes (`.u-*`, `.visually-hidden`, `.sr-only`) and design tokens (`--space-*`, `--primary-*`, `--surface-*`).
- Contact form integrated with Netlify Forms (`data-netlify="true"`), honeypot (`netlify-honeypot="trap"`), and client-side validation.
- PWA support: `manifest.webmanifest`, service worker (`sw.js`), and `offline.html`.
- SEO metadata: canonical, robots meta, OpenGraph/Twitter, plus `robots.txt` and `sitemap.xml`.
- Inline JSON-LD structured data in HTML pages.

### Tech stack
- HTML5
- CSS3 (Custom Properties + modular architecture)
- Vanilla JavaScript (ES Modules + bundling to `dist/script.min.js`)
- Node.js tooling (`tools/`): head/CSS/JS/SW build, image pipeline
- Netlify (via `_headers`, `_redirects`)

### Structure overview
- `assets/` — images, fonts, favicons, icons
- `css/` — tokens, base, layout, components, sections
- `js/` — core/components/sections/utils + structured data JSON files
- `dist/` — minified artifacts (`style.min.css`, `script.min.js`)
- `services/`, `legal/` — content subpages
- `tools/` — build tooling
- deploy/PWA/SEO files: `_headers`, `_redirects`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `sw.js`

### Setup & run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build project:
   ```bash
   npm run build
   ```
3. Start local static server:
   ```bash
   npm run serve
   ```
4. Preview: `http://localhost:8080`

### Build/deployment notes
- Main build runs: `build:head`, `build:css`, `build:js`, `build:sw`.
- `dist/style.min.css` and `dist/script.min.js` are production artifacts.
- `_headers` defines CSP, security policies, and caching behavior.
- `_redirects` defines canonical host/HTTPS redirects and custom 404 fallback.

### Accessibility notes
- Implemented: skip link to content, one `<main>` landmark, valid heading hierarchy (single H1 per page), `:focus-visible` styling, `prefers-reduced-motion` handling, `aria-expanded` and `aria-current` usage.
- Form: proper `label for`, `aria-live` status updates, first-invalid focus, `<noscript>` fallbacks.
- No-JS form baseline is preserved (`method="POST"`, `action="/success.html"`), but mobile navigation still depends on JS (see `AUDIT.md`).

### SEO notes
- Pages include canonical, robots, and `og:url` aligned with canonical.
- `robots.txt` points to `sitemap.xml`.
- Inline JSON-LD is syntactically valid.

### Performance notes
- Images are delivered as AVIF/WEBP/JPG with broad `srcset`/`sizes` usage.
- Most images include explicit `width`/`height` and `loading="lazy"` outside above-the-fold.
- Fonts are preloaded as WOFF2 and use `font-display: swap`.

### Roadmap
- Unify runtime JS delivery strategy (single path across all pages).
- Register service worker with an absolute path.
- Add automated A11y/SEO/link validation in CI.
- Reduce duplicated SEO/JSON-LD by generating from a single source.
- Add CSS/JS/image performance budgets.

### License
ISC (as defined in `package.json`).
