# Atelier No.02

## Wersja Polska

### Przegląd projektu
Atelier No.02 to wielostronicowy front-end restauracji fine dining przygotowany jako projekt portfolio. Implementacja jest statyczna (HTML/CSS/Vanilla JS) i oparta o modularną architekturę CSS oraz modułową strukturę JS.

### Kluczowe funkcje
- Wielostronicowy serwis: `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`, strony prawne (`cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`) oraz techniczne (`offline.html`, `404.html`, `thank-you.html`).
- Responsywna nawigacja z menu mobilnym, dropdownami, obsługą klawiatury i synchronizacją `aria-expanded`.
- Przełącznik motywu jasny/ciemny z zapisem preferencji (`localStorage`) i aktualizacją `theme-color`.
- Dynamiczne renderowanie menu z `data/menu.json`, filtrowanie i wyszukiwanie na podstronie menu.
- Galeria z lightboxem (klawiatura, focus trap, fullscreen, swipe).
- Formularz kontaktowy Netlify (`data-netlify="true"`, `netlify-honeypot`) z walidacją po stronie klienta.
- PWA baseline: `manifest.webmanifest`, `sw.js`, strona offline.

### Tech Stack
- HTML5
- CSS (moduły `base/layout/components/pages`, tokeny w `css/base/tokens.css`)
- JavaScript ES Modules (`js/app`, `js/features`, `js/core`)
- Tooling: PostCSS, esbuild, ESLint, html-validate, linkinator, pa11y-ci

### Struktura projektu
- `css/base` - tokeny, reset, baza, typografia
- `css/layout` - układ globalny (header/footer/grid)
- `css/components` - komponenty, utility, stany
- `css/pages` - style specyficzne dla podstron
- `js/app` - orchestracja inicjalizacji
- `js/features` - funkcjonalności UI
- `js/core` - helpery bazowe
- `assets` - obrazy, fonty, ikony
- `data/menu.json` - dataset menu

### Setup i uruchomienie
1. `npm install`
2. `npm run dev:server`
3. `npm run check`

### Build i deployment
- Build produkcyjny assetów: `npm run build` (`css/style.min.css`, `js/script.min.js`).
- Strategia development: runtime lokalny działa na `css/style.css` i `js/script.js`; brak `.min.*` w dev nie jest traktowany jako błąd krytyczny.
- Deployment config: `_headers`, `_redirects`, `manifest.webmanifest`, `sw.js`.
- Produkcyjny link-check po build: `npm run check:server:prod`.

### Dostępność
- Skip link oraz focus management (`#main`, `:focus-visible`) są zaimplementowane.
- Obsługa klawiatury i focus trap w nawigacji mobilnej i lightboxie.
- `prefers-reduced-motion` obsłużone w CSS/JS (`reveal`, `modal`).
- No-JS fallback obecny na wszystkich stronach jako spójny komunikat PL.
- Lokalny audyt `pa11y-ci` (WCAG2AA) przechodzi dla 10/10 URL.

### SEO
- Strony indeksowalne mają `meta description`, `canonical`, `robots`, OpenGraph i Twitter meta.
- JSON-LD obecny na stronach głównych/funkcyjnych/prawnych.
- `robots.txt` i `sitemap.xml` obecne; sitemap zawiera `contact.html`.

### Wydajność
- Obrazy w wariantach AVIF/WEBP/JPG z `srcset`/`sizes`.
- Obrazy w HTML mają jawne `width`/`height`.
- Lazy loading stosowany poza krytycznymi elementami above-the-fold.
- Fonty preloadowane i ładowane przez `@font-face` z `font-display: swap`.

### Roadmap
- Uporządkowanie polityk security headers pod zewnętrzne embedy (np. mapa Google) bez osłabiania bezpieczeństwa.
- Ujednolicenie strategii pre-cache w Service Worker względem runtime assetów.
- Usunięcie pozostałych reguł `!important` tam, gdzie można je zastąpić lepszym scopingiem.
- Rozszerzenie automatycznych testów QA o workflow CI.

### Licencja
MIT (zgodnie z `package.json`).

---

## English Version

### Project Overview
Atelier No.02 is a multi-page fine-dining restaurant front-end portfolio project. It is implemented as a static site (HTML/CSS/Vanilla JS) with modular CSS and modular JavaScript architecture.

### Key Features
- Multi-page website: `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`, legal pages (`cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`), and technical pages (`offline.html`, `404.html`, `thank-you.html`).
- Responsive navigation with mobile drawer, dropdowns, keyboard handling, and `aria-expanded` synchronization.
- Light/dark theme toggle with persisted preference (`localStorage`) and dynamic `theme-color` update.
- Dynamic menu rendering from `data/menu.json`, with filtering and search on the menu page.
- Gallery lightbox (keyboard controls, focus trap, fullscreen, swipe).
- Netlify contact form (`data-netlify="true"`, `netlify-honeypot`) with client-side validation.
- PWA baseline: `manifest.webmanifest`, `sw.js`, offline page.

### Tech Stack
- HTML5
- CSS (modular split: `base/layout/components/pages`, tokens in `css/base/tokens.css`)
- JavaScript ES Modules (`js/app`, `js/features`, `js/core`)
- Tooling: PostCSS, esbuild, ESLint, html-validate, linkinator, pa11y-ci

### Project Structure
- `css/base` - tokens, reset, base, typography
- `css/layout` - global layout (header/footer/grid)
- `css/components` - components, utilities, states
- `css/pages` - page-specific styles
- `js/app` - app initialization orchestration
- `js/features` - UI features
- `js/core` - core helpers
- `assets` - images, fonts, icons
- `data/menu.json` - menu dataset

### Setup & Run
1. `npm install`
2. `npm run dev:server`
3. `npm run check`

### Build & Deployment Notes
- Production asset build: `npm run build` (`css/style.min.css`, `js/script.min.js`).
- Development strategy: local runtime uses `css/style.css` and `js/script.js`; missing `.min.*` in dev is not treated as a critical error.
- Deployment config: `_headers`, `_redirects`, `manifest.webmanifest`, `sw.js`.
- Production link validation after build: `npm run check:server:prod`.

### Accessibility Notes
- Skip link and focus management (`#main`, `:focus-visible`) are implemented.
- Keyboard support and focus trap are implemented in mobile nav and lightbox.
- `prefers-reduced-motion` is handled in CSS/JS (`reveal`, `modal`).
- No-JS fallback is present on all pages with a consistent Polish message.
- Local `pa11y-ci` WCAG2AA audit passes for 10/10 URLs.

### SEO Notes
- Indexable pages include `meta description`, `canonical`, `robots`, OpenGraph, and Twitter metadata.
- JSON-LD is present on core/functional/legal pages.
- `robots.txt` and `sitemap.xml` are present; sitemap includes `contact.html`.

### Performance Notes
- Images use AVIF/WEBP/JPG variants with `srcset`/`sizes`.
- HTML images include explicit `width`/`height`.
- Lazy loading is used outside critical above-the-fold media.
- Fonts are preloaded and served via `@font-face` with `font-display: swap`.

### Roadmap
- Align security header policy with third-party embeds (e.g., Google Maps) without weakening baseline security.
- Align Service Worker pre-cache strategy with runtime asset strategy.
- Remove remaining `!important` rules where better selector scoping is feasible.
- Extend QA automation with CI workflows.

### License
MIT (as defined in `package.json`).
