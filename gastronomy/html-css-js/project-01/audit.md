# Project Audit — Ambre Restaurant Demo

## Summary
- Static multi-page restaurant website (home, menu, gallery, legal pages) built with semantic HTML, modular CSS, and vanilla JS.
- Includes PWA setup (manifest, service worker, offline fallback) and Netlify configuration for redirects and security headers.
- Front-end is production-leaning with structured data, SEO metadata, and dedicated QA/minification scripts.

## What the project includes
- Core pages: `index.html`, `menu.html`, `galeria.html`, `cookies.html`, `polityka-prywatnosci.html`, `regulamin.html`, `404.html`, `offline.html`.
- Componentized JS modules for navigation (mobile menu, scrollspy, sticky header), theme switcher, CTA/scroll helpers, reservation form handling, gallery filters/lightbox, tabs, FAQ ARIA tweaks, and PWA install prompt.
- Styling organized in `css/` with base/layout/components/pages split; assets in `assets/` (fonts, icons, images).
- PWA files: `manifest.webmanifest`, `sw.js`, `js/sw-register.js`, `js/pwa-install.js`, plus offline image/page assets.
- Netlify deployment helpers: `_headers` (security/CSP), `_redirects` (clean URLs, 404 handling), `robots.txt`, `sitemap.xml`.

## Accessibility & UX
- Skip link to main content, semantic navigation with aria-labels/submenu labels, and focusable CTA/button patterns.
- Mobile navigation and scrollspy behavior managed via JS for consistent highlighting and sticky header shadow cues.
- Theme toggle with `prefers-color-scheme` awareness; reservation CTA and FAQ interactions kept unobtrusive (no blocking modals).

## Performance & SEO
- Meta description, canonical link, robots directives, Open Graph/Twitter cards, and JSON-LD (`WebSite`, `Restaurant`, `WebPage`).
- Font preloads for primary families; `color-scheme` hints for light/dark, and HSTS/CSP/COOP/permissions policy via Netlify `_headers`.
- Sitemap and robots provided; redirects normalize trailing slashes and map clean paths.
- Build scripts for CSS/JS minification and image optimization/verification support asset performance.

## PWA / Offline
- Service worker precaches shell, pages, icons, and offline assets; runtime caching for images with offline fallback graphic.
- Navigation preload enabled when available; offline fallback routes navigation requests to `offline.html` when network fails.
- Install prompt handler reveals a dedicated button when `beforeinstallprompt` fires and hides it after install/choice.

## Tooling / QA
- `npm run qa` aggregates: `qa:links` (link checker), `qa:html` (html-validate across key pages), `qa:js` (ESLint), `qa:css` (Stylelint).
- Minification: `minify:css` (PostCSS + cssnano), `minify:js` (Terser); `build` chains both.
- Image workflows: `img:opt`/`img:webp`/`img:avif` via `scripts/optimize-images.mjs`, `img:verify` for validation, `img:clean` to remove generated assets.
- Dev support: `watch:css` for PostCSS watch mode.

## Notable implementation details
- Service worker uses separate caches for app shell and runtime images, plus navigation preload and graceful offline fallbacks.
- Strict CSP and security headers baked into Netlify `_headers`, with script hashes for inline allowances and limited permissions/connect scopes.
- Navigation enhancements (scrollspy, sticky shadow, ARIA `aria-current` handling) initialize modularly via `js/modules/nav.js` and are bootstrapped safely in `js/script.js`.
- JSON-LD restaurant schema embedded directly in `index.html` alongside comprehensive social metadata.
- Clean URL support and 404 routing handled via `_redirects` to keep canonical paths consistent.

## Risks / TODO (optional)
- Externalize menu/galeria content to structured data (e.g., JSON + templates) to avoid manual HTML duplication.
- Add staging/preview pipeline with `noindex` defaults and automated link/Lighthouse checks before production deploys.
- Integrate CMS-driven content (e.g., headless CMS with i18n) to manage menu/gallery/legal content at scale.
- Consider reservation platform integration (Calendly/Booksy/ResDiary) with availability view and deposit support.
- Add monitoring/observability (JS error tracking, Web Vitals budgets, service worker update logs).

## Quick commands
- Install deps: `npm install`
- Full QA: `npm run qa`
- Minify assets: `npm run build` (or `npm run minify:css`, `npm run minify:js`)
- Image tasks: `npm run img:opt`, `npm run img:webp`, `npm run img:avif`, `npm run img:verify`, `npm run img:clean`
- Watch CSS: `npm run watch:css`
