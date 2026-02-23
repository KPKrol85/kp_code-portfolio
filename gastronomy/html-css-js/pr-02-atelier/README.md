# Atelier No.02

## Wersja polska

### Przegląd projektu
Atelier No.02 to wielostronicowa strona portfolio restauracji, zbudowana w HTML, modularnym CSS i JavaScript ES Modules. Projekt zawiera stronę główną, podstrony `about.html`, `menu.html`, `gallery.html`, strony prawne, `404.html`, `offline.html` i `thank-you.html`.

### Kluczowe funkcje
- Responsywna nawigacja z menu mobilnym, dropdownami i obsługą `aria-expanded`.
- Przełącznik motywu light/dark z zapisem preferencji w `localStorage`.
- Animacje reveal z obsługą `prefers-reduced-motion`.
- Dynamiczne renderowanie pozycji menu z `data/menu.json`.
- Galeria z lightboxem i nawigacją klawiaturą.
- Formularz kontaktowy Netlify (`data-netlify`, honeypot `bot-field`) z walidacją po stronie klienta.
- PWA baseline: `manifest.webmanifest`, `sw.js`, `offline.html`.

### Stack technologiczny
- HTML5
- CSS3 (architektura modułowa + tokeny design systemu)
- JavaScript ES Modules
- Narzędzia: PostCSS, esbuild, sharp, fast-glob, ESLint, html-validate, linkinator, pa11y-ci

### Struktura projektu
- `css/base/` - reset, typografia, tokeny
- `css/layout/` - układ i siatka
- `css/components/` - komponenty UI
- `css/pages/` - style stron
- `css/utilities/` - helpery, stany, animacje
- `js/app/`, `js/features/`, `js/core/` - logika aplikacji i moduły funkcjonalne
- `assets/` - obrazy, fonty, ikony
- `data/` - dane menu

### Setup i uruchomienie
1. `npm install`
2. `npm run build`
3. `npm run dev:server`

### Build i wdrożenie
- Konfiguracje deploy: `_headers`, `_redirects`.
- SEO crawl: `robots.txt`, `sitemap.xml`.
- PWA: `manifest.webmanifest`, `sw.js`.
- Konfiguracja Vite/Webpack: not detected in project.
- Konfiguracja Netlify/Vercel: pliki Netlify (`_headers`, `_redirects`) są obecne; `netlify.toml` i `vercel.json` not detected in project.

### Dostępność
- Skip link występuje na stronach (`.skip-link`).
- Hierarchia nagłówków jest poprawna (brak wykrytych przeskoków poziomów).
- Interaktywne komponenty obsługują klawiaturę (ESC, Tab trap w menu/lightbox/modalu).
- Widoczny focus (`:focus-visible`) jest wdrożony.
- Wersja bez JS pozostaje używalna (treść i nawigacja bazowa są dostępne).

### SEO
- Użyto `title`, `meta description`, `canonical`, Open Graph i Twitter Card.
- `og:url` jest spójne z canonical na stronach z pełnym zestawem meta.
- JSON-LD jest obecny i składniowo poprawny na stronach głównych (`index.html`, `about.html`, `menu.html`, `gallery.html`, strony prawne).

### Wydajność
- Obrazy: AVIF/WebP/JPG fallback przez `<picture>`.
- Wszystkie obrazy w HTML mają `width` i `height`.
- Lazy loading jest użyty dla zasobów niekrytycznych.
- Preload fontów i obrazu hero jest zaimplementowany.
- Minifikaty CSS/JS są generowane, ale runtime ładuje wersje nieminifikowane.

### Roadmap
- Ujednolicić runtime i pre-cache Service Workera (minified vs non-minified entrypointy).
- Naprawić błędy walidacji HTML (`sourcew`, atrybuty ARIA, `type` przy `button`).
- Ujednolicić skrypty quality pod kątem Windows/Linux.
- Ograniczyć duplikację/stare entrypointy JS (`js/core.js` vs `js/app/init.js`).
- Rozszerzyć automatyczne testy a11y w CI na więcej scenariuszy interakcji.

### Licencja
MIT (zgodnie z `package.json`).

---

## English version

### Project overview
Atelier No.02 is a multi-page restaurant portfolio website built with HTML, modular CSS, and JavaScript ES Modules. The project includes home, `about.html`, `menu.html`, `gallery.html`, legal pages, `404.html`, `offline.html`, and `thank-you.html`.

### Key features
- Responsive navigation with mobile menu, dropdowns, and `aria-expanded` handling.
- Light/dark theme switch with preference persistence in `localStorage`.
- Reveal animations with `prefers-reduced-motion` support.
- Dynamic menu rendering from `data/menu.json`.
- Gallery with lightbox and keyboard navigation.
- Netlify contact form (`data-netlify`, honeypot `bot-field`) with client-side validation.
- PWA baseline: `manifest.webmanifest`, `sw.js`, `offline.html`.

### Tech stack
- HTML5
- CSS3 (modular architecture + design tokens)
- JavaScript ES Modules
- Tooling: PostCSS, esbuild, sharp, fast-glob, ESLint, html-validate, linkinator, pa11y-ci

### Structure overview
- `css/base/` - reset, typography, tokens
- `css/layout/` - layout and grid
- `css/components/` - UI components
- `css/pages/` - page-specific styles
- `css/utilities/` - helpers, states, animations
- `js/app/`, `js/features/`, `js/core/` - app logic and feature modules
- `assets/` - images, fonts, icons
- `data/` - menu data

### Setup & run
1. `npm install`
2. `npm run build`
3. `npm run dev:server`

### Build & deployment notes
- Deployment configs: `_headers`, `_redirects`.
- SEO crawl files: `robots.txt`, `sitemap.xml`.
- PWA files: `manifest.webmanifest`, `sw.js`.
- Vite/Webpack config: not detected in project.
- Netlify/Vercel config: Netlify files (`_headers`, `_redirects`) are present; `netlify.toml` and `vercel.json` not detected in project.

### Accessibility notes
- Skip links are present (`.skip-link`).
- Heading hierarchy is valid (no detected level skips).
- Interactive components support keyboard behavior (ESC, Tab trap in nav/lightbox/modal).
- Visible focus states (`:focus-visible`) are implemented.
- No-JS baseline is usable (core navigation and content remain available).

### SEO notes
- `title`, `meta description`, `canonical`, Open Graph, and Twitter tags are implemented.
- `og:url` aligns with canonical on pages with full metadata.
- JSON-LD is present and syntactically valid on core pages (`index.html`, `about.html`, `menu.html`, `gallery.html`, legal pages).

### Performance notes
- Images use AVIF/WebP/JPG fallback through `<picture>`.
- All HTML images include `width` and `height`.
- Lazy loading is used for non-critical media.
- Font preload and hero image preload are implemented.
- Minified CSS/JS are generated, but runtime currently loads non-minified entrypoints.

### Roadmap
- Align runtime asset usage with Service Worker pre-cache (minified vs non-minified entrypoints).
- Fix HTML validation issues (`sourcew`, ARIA misuse, missing `type` on `button`).
- Make quality scripts cross-platform (Windows/Linux parity).
- Reduce JS entrypoint duplication/legacy overlap (`js/core.js` vs `js/app/init.js`).
- Extend CI accessibility coverage for more interaction scenarios.

### License
MIT (as declared in `package.json`).
