# Ambre — front-end portfolio project

## 🇵🇱 Wersja polska

### Przegląd projektu
Ambre to wielostronicowa strona portfolio restauracji fine dining. Projekt działa w oparciu o statyczne HTML + modularny CSS + Vanilla JS (ES Modules), z dodatkowymi elementami PWA (`manifest.webmanifest`, `sw.js`, `offline.html`) i konfiguracją pod deployment na Netlify (`_headers`, `_redirects`).

### Kluczowe funkcje
- Wielostronicowa struktura: `index.html`, `menu.html`, `galeria.html`, strony prawne (`cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`), `404.html`, `offline.html`.
- Responsywna nawigacja z drawerem mobilnym, trapem focusu, obsługą `Escape` i synchronizacją `aria-expanded`.
- Dynamiczne `aria-current` dla nawigacji oraz scrollspy dla sekcji na stronie głównej.
- Przełącznik motywu light/dark (z `localStorage` i fallbackiem do `prefers-color-scheme`).
- Interaktywne moduły: sekcje FAQ, filtrowanie galerii, „load more”, lightbox, przewijanie do sekcji i przycisk powrotu do góry.
- Formularz rezerwacji z walidacją, honeypotem (`company`), komunikatami ARIA i wysyłką zgodną z Netlify Forms.
- PWA: manifest, Service Worker z cache app-shell i fallbackiem offline.

### Tech stack
- HTML5
- CSS3 (architektura: `base/`, `layout/`, `components/`, `pages/`)
- JavaScript ES Modules (Vanilla JS)
- Narzędzia: PostCSS, esbuild, ESLint, Stylelint, html-validate, Lighthouse CI
- Deployment: Netlify

### Struktura projektu
- `css/base/` — tokeny, bazowe reguły, typografia
- `css/layout/` — layout header/footer
- `css/components/` — komponenty i utilities
- `css/pages/` — style specyficzne dla podstron
- `js/modules/` — moduły funkcjonalne UI/UX
- `scripts/` — skrypty QA (linki, SEO, a11y, obrazy)

### Setup i uruchomienie
```bash
npm install
npm run build
```

Dodatkowo:
- tryb obserwacji: `npm run watch:css`, `npm run watch:js`
- pełny pakiet QA: `npm run qa`

### Build i deployment
- Build assetów: `npm run build:css`, `npm run build:js`, `npm run build`.
- Netlify:
  - `_headers`: security headers + CSP.
  - `_redirects`: mapowanie krótkich URL i fallback `404.html`.
- Service Worker rejestrowany tylko poza środowiskami lokalnymi (`localhost`, LAN), co ogranicza problemy developerskie przy cache.

### Dostępność
- Obecne: skip link, semantyczna struktura nagłówków, landmarks (`header/main/footer`), fokus przez `:focus-visible`.
- Nawigacja mobilna: trap focusu, zamykanie klawiszem `Escape`, kontrola `aria-expanded`.
- `prefers-reduced-motion` obsłużone w CSS i części interakcji JS.
- Bazowa używalność bez JS jest utrzymana (struktura HTML + fallback formularza).

### SEO
- Meta SEO: `title`, `description`, `canonical`, OpenGraph, Twitter Cards.
- `robots.txt` i `sitemap.xml` obecne i spójne domenowo.
- JSON-LD obecny na stronach (m.in. `WebSite`, `Restaurant`, `WebPage`).

### Wydajność
- Obrazy: `picture` z AVIF/WebP + fallback JPG.
- Atrybuty stabilizujące layout: `width`/`height` dla obrazów.
- Lazy-loading i `decoding="async"` dla zasobów poza LCP.
- Fonty WOFF2 z preloadem i `font-display: swap`.

### Roadmap
- Dodać automatyczną walidację JSON-LD do pipeline QA.
- Uzupełnić automatyczne testy a11y (Playwright + axe) w CI z progami błędów.
- Ustalić jedną politykę użycia artefaktów minifikowanych (`style.min.css` / `script.min.js`) na produkcji.
- Dodać testy regresji wizualnej dla kluczowych komponentów (header, menu, lightbox).

### Licencja
MIT (na podstawie `package.json`).

---

## 🇬🇧 English version

### Project overview
Ambre is a multi-page fine-dining restaurant portfolio website built with static HTML, modular CSS, and Vanilla JS (ES Modules). The project includes PWA elements (`manifest.webmanifest`, `sw.js`, `offline.html`) and Netlify deployment configuration (`_headers`, `_redirects`).

### Key features
- Multi-page structure: `index.html`, `menu.html`, `galeria.html`, legal pages (`cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`), `404.html`, `offline.html`.
- Responsive navigation with mobile drawer, focus trap, `Escape` handling, and synchronized `aria-expanded`.
- Dynamic `aria-current` handling and scrollspy for homepage sections.
- Light/dark theme switcher (`localStorage` with `prefers-color-scheme` fallback).
- Interactive modules: FAQ, gallery filtering, “load more”, lightbox, scroll-to-section, and back-to-top.
- Reservation form with validation, honeypot (`company`), ARIA feedback, and Netlify-compatible submission.
- PWA layer: manifest, Service Worker app-shell caching, and offline fallback.

### Tech stack
- HTML5
- CSS3 (architecture: `base/`, `layout/`, `components/`, `pages/`)
- JavaScript ES Modules (Vanilla JS)
- Tooling: PostCSS, esbuild, ESLint, Stylelint, html-validate, Lighthouse CI
- Deployment: Netlify

### Structure overview
- `css/base/` — tokens, base rules, typography
- `css/layout/` — header/footer layout
- `css/components/` — UI components and utilities
- `css/pages/` — page-specific styles
- `js/modules/` — feature modules
- `scripts/` — QA scripts (links, SEO, a11y, images)

### Setup & run
```bash
npm install
npm run build
```

Additionally:
- watch mode: `npm run watch:css`, `npm run watch:js`
- full QA suite: `npm run qa`

### Build & deployment notes
- Asset build: `npm run build:css`, `npm run build:js`, `npm run build`.
- Netlify:
  - `_headers`: security headers + CSP.
  - `_redirects`: short URL mapping and `404.html` fallback.
- Service Worker is only registered outside local environments (`localhost`, LAN), reducing dev-cache issues.

### Accessibility notes
- Implemented: skip link, semantic heading hierarchy, landmarks (`header/main/footer`), and visible focus states.
- Mobile navigation supports focus trap, `Escape` closing, and `aria-expanded` control.
- `prefers-reduced-motion` is handled in CSS and selected JS interactions.
- No-JS baseline remains usable (HTML-first structure + form fallback).

### SEO notes
- SEO metadata implemented: `title`, `description`, `canonical`, OpenGraph, Twitter Cards.
- `robots.txt` and `sitemap.xml` are present and domain-aligned.
- JSON-LD is present across pages (including `WebSite`, `Restaurant`, `WebPage`).

### Performance notes
- Images use `picture` with AVIF/WebP and JPG fallback.
- `width`/`height` attributes are set for layout stability.
- Lazy loading and `decoding="async"` are used for non-LCP assets.
- WOFF2 fonts are preloaded and use `font-display: swap`.

### Roadmap
- Add JSON-LD validation to QA pipeline.
- Add automated accessibility checks in CI (Playwright + axe) with fail thresholds.
- Standardize production use of minified bundles (`style.min.css` / `script.min.js`).
- Add visual regression checks for core components (header, menu, lightbox).

### License
MIT (as declared in `package.json`).
