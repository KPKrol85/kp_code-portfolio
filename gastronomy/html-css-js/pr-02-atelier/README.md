# Atelier No.02

## PL

### Przegląd projektu
Atelier No.02 to wielostronicowy serwis portfolio restauracji fine dining zbudowany w oparciu o statyczne HTML, modularny CSS i JavaScript ES Modules. Projekt zawiera stronę główną, podstrony: O nas, Menu, Galeria, strony prawne, stronę offline, stronę 404 i stronę potwierdzenia formularza.

### Kluczowe funkcje (potwierdzone w kodzie)
- Responsywna nawigacja z menu mobilnym, dropdownami oraz obsługą stanów ARIA (`aria-expanded`, `aria-hidden`, `inert`).
- Przełącznik motywu light/dark z persistencją preferencji w `localStorage`.
- Sekcje reveal i animacje z obsługą preferencji `prefers-reduced-motion`.
- Dynamiczne renderowanie pozycji menu z `data/menu.json`.
- Galeria zdjęć z lightboxem i obsługą klawiatury.
- Formularz kontaktowy Netlify (`data-netlify`, honeypot `bot-field`) z walidacją po stronie klienta.
- PWA baseline: `manifest.webmanifest`, `sw.js`, `offline.html`.

### Tech stack
- HTML5 (architektura wielostronicowa).
- CSS3 z podziałem na: `base`, `layout`, `components`, `pages`, `utilities`.
- JavaScript ES Modules.
- Narzędzia: PostCSS, esbuild, sharp, fast-glob, http-server.

### Struktura projektu
- `css/base/` — tokeny, reset, typografia, style globalne.
- `css/layout/` — układ i siatka.
- `css/components/` — komponenty UI (header/nav/cards/forms/buttons/footer/lightbox/modal/sections).
- `css/pages/` — style specyficzne dla podstron.
- `css/utilities/` — helpery, stany, animacje.
- `js/app/`, `js/features/`, `js/core/` — warstwa aplikacyjna i moduły funkcjonalne.
- `assets/` — fonty, ikony i obrazy.
- `data/` — dane źródłowe dla menu.

### Setup i uruchomienie
1. `npm install`
2. `npm run build`
3. `npm run dev:server`

### Quality checks
- `npm run lint` — linting JavaScript (`js/**/*.js`).
- `npm run validate:html` — walidacja plików HTML w katalogu projektu.
- `npm run check:links` — deterministyczny crawl linków pod lokalnym adresem `http://127.0.0.1:5173` (tylko lokalny origin, explicit entry points dla wszystkich podstron, walidacja fragmentów `#id`).
- `npm run check:a11y` — smoke testy a11y (baseline WCAG2AA) dla kluczowych szablonów i powierzchni interaktywnych w stanie spoczynku (konfiguracja w `.pa11yci`).
- `npm run check` — pełny pakiet QA (lint + HTML + linki + a11y smoke tests uruchamiane automatycznie z lokalnym serwerem, retry/wait i walidacją linków + anchorów).

### Build i wdrożenie
- Konfiguracja hostingu: `_headers`, `_redirects`.
- SEO crawl: `robots.txt`, `sitemap.xml`.
- PWA: `manifest.webmanifest`, `sw.js`, `offline.html`.
- Na Netlify `publish directory` musi wskazywać na `gastronomy/html-css-js/pr-02-atelier`.
- Serwis jest wdrażany z root (`/`) domeny Netlify, więc ścieżki absolutne (`/...`) są oczekiwane i poprawne.
- Hosting pod subpath nie jest wspierany bez wdrożenia dedykowanej strategii base-path (routing, manifest, scope/ścieżki Service Workera, canonical/OG URL).

#### Dev vs Deploy assets
- Development/local runtime domyślnie korzysta z niezminifikowanych entrypointów: `css/style.css` oraz `js/script.js`.
- Przed finalnym wdrożeniem na Netlify należy ręcznie wygenerować artefakty produkcyjne: `css/style.min.css` oraz `js/script.min.js`.
- Komendy build:
  - `npm run build` (uruchamia całość),
  - lub osobno: `npm run build:css` i `npm run build:js`.
- Wynik builda:
  - `npm run build:css` -> `css/style.min.css`,
  - `npm run build:js` -> `js/script.min.js`.

#### Uwaga o Service Worker pre-cache
- Referencje do zminifikowanych plików w pre-cache Service Workera są celowe i zgodne z workflow deployu.
- Podczas developmentu/lokalnych testów runtime może ładować `css/style.css` i `js/script.js` — to zamierzone i nie oznacza błędu konfiguracji.

### Dostępność
- Skip link jest wdrożony na stronach.
- Hierarchia nagłówków jest zachowana (brak wykrytych przeskoków poziomów).
- Interaktywne komponenty (menu mobilne, lightbox, modal) obsługują klawiaturę i ESC.
- Widoczny focus dla kluczowych elementów interaktywnych (`:focus-visible`).
- Baseline bez JavaScript pozostaje używalny (nawigacja i treści są dostępne).

### SEO
- Obecne: `title`, `meta description`, canonical, OpenGraph, Twitter tags na głównych podstronach.
- `og:url` jest spójny z canonical na stronach, które zawierają oba pola.
- JSON-LD występuje na głównych podstronach i jest poprawny składniowo.
- JSON-LD nie wykryto na: `404.html`, `offline.html`, `thank-you.html`.

### Wydajność
- Obrazy dostarczane przez `<picture>` (AVIF/WebP/JPG fallback).
- Obrazy mają atrybuty `width`/`height`.
- Lazy loading jest używany dla zasobów niekrytycznych.
- Fonty są preloadowane, a definicje fontów używają `font-display: swap`.

### Roadmap
- Ujednolicić referencje produkcyjne do zminifikowanych assetów albo spójnie zmienić strategię build/runtime.
- Ograniczyć zależność od ścieżek absolutnych (`/`) dla łatwiejszego wdrożenia pod subpath.
- Dodać automatyczne testy CI (link-check, walidacja HTML, a11y smoke tests).
- Rozdzielić JS per typ strony, aby zmniejszyć payload na podstronach prawnych.
- Uspójnić politykę cache z wersjonowaniem assetów (hash/fingerprint).

### Licencja
MIT (zgodnie z `package.json`).

---

## EN

### Project overview
Atelier No.02 is a multi-page fine-dining portfolio website built with static HTML, modular CSS, and JavaScript ES Modules. The project includes home, About, Menu, Gallery, legal pages, an offline page, a 404 page, and a thank-you page.

### Key features (code-verified)
- Responsive navigation with mobile menu, dropdowns, and ARIA state handling (`aria-expanded`, `aria-hidden`, `inert`).
- Light/dark theme switch with preference persisted in `localStorage`.
- Reveal sections and motion handling with `prefers-reduced-motion` support.
- Dynamic menu rendering from `data/menu.json`.
- Gallery with keyboard-accessible lightbox.
- Netlify contact form (`data-netlify`, `bot-field` honeypot) with client-side validation.
- PWA baseline: `manifest.webmanifest`, `sw.js`, `offline.html`.

### Tech stack
- HTML5 (multi-page architecture).
- CSS3 split into: `base`, `layout`, `components`, `pages`, `utilities`.
- JavaScript ES Modules.
- Tooling: PostCSS, esbuild, sharp, fast-glob, http-server.

### Structure overview
- `css/base/` — tokens, reset, typography, global styles.
- `css/layout/` — layout and grid.
- `css/components/` — UI components (header/nav/cards/forms/buttons/footer/lightbox/modal/sections).
- `css/pages/` — page-specific styles.
- `css/utilities/` — helpers, states, animations.
- `js/app/`, `js/features/`, `js/core/` — app layer and feature modules.
- `assets/` — fonts, icons, and images.
- `data/` — source data for menu content.

### Setup & run
1. `npm install`
2. `npm run build`
3. `npm run dev:server`

### Quality checks
- `npm run lint` — JavaScript linting (`js/**/*.js`).
- `npm run validate:html` — validate HTML files in the project root.
- `npm run check:links` — deterministic local-origin crawl at `http://127.0.0.1:5173` (explicit entry points for all pages, plus fragment/anchor `#id` validation).
- `npm run check:a11y` — accessibility smoke checks (WCAG2AA baseline) for key templates and interactive surfaces in their default loaded state (configured in `.pa11yci`).
- `npm run check` — full QA suite (lint + HTML + links + a11y smoke checks, with automatic local server lifecycle, wait/retry stability, and link + fragment checks).

### Build & deployment notes
- Hosting config: `_headers`, `_redirects`.
- SEO crawl files: `robots.txt`, `sitemap.xml`.
- PWA files: `manifest.webmanifest`, `sw.js`, `offline.html`.
- On Netlify, the `publish directory` must point to `gastronomy/html-css-js/pr-02-atelier`.
- The site is deployed from the Netlify domain root (`/`), so absolute paths (`/...`) are expected and correct.
- Subpath hosting is not supported unless a dedicated base-path strategy is implemented (routing, manifest, Service Worker scope/paths, canonical/OG URLs).

#### Dev vs Deploy assets
- Development/local runtime intentionally uses the non-minified entrypoints: `css/style.css` and `js/script.js`.
- Before final Netlify deployment, minified production artifacts must be generated manually: `css/style.min.css` and `js/script.min.js`.
- Build commands:
  - `npm run build` (full build),
  - or separately: `npm run build:css` and `npm run build:js`.
- Build outputs:
  - `npm run build:css` -> `css/style.min.css`,
  - `npm run build:js` -> `js/script.min.js`.

#### Service Worker pre-cache note
- Service Worker pre-cache references to minified assets are intentional and aligned with the deploy workflow.
- During development/local testing, runtime may load `css/style.css` and `js/script.js` by design; this is not a configuration error.

### Accessibility notes
- Skip link is present on pages.
- Heading hierarchy is consistent (no skipped heading levels detected).
- Interactive components (mobile nav, lightbox, modal) support keyboard and ESC behavior.
- Visible focus styling is present for key interactive elements (`:focus-visible`).
- No-JS baseline remains usable (navigation and core content are still accessible).

### SEO notes
- Present: `title`, `meta description`, canonical, OpenGraph, and Twitter tags on primary pages.
- `og:url` aligns with canonical on pages where both are present.
- JSON-LD is present on primary pages and syntactically valid.
- JSON-LD not detected on: `404.html`, `offline.html`, `thank-you.html`.

### Performance notes
- Images are served through `<picture>` with AVIF/WebP/JPG fallback.
- Images include explicit `width` and `height`.
- Lazy loading is used for non-critical media.
- Fonts are preloaded and configured with `font-display: swap`.

### Roadmap
- Standardize production references to minified assets or align build/runtime strategy.
- Reduce reliance on absolute root paths (`/`) to support subpath deployments.
- Add CI automation (link checks, HTML validation, a11y smoke tests).
- Split JS by page type to reduce payload on legal/static pages.
- Align cache policy with asset versioning (hash/fingerprint).

### License
MIT (as declared in `package.json`).
