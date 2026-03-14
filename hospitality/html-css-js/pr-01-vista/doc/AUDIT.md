# AUDIT.md

## 1. Executive summary
Repository shows a well-structured static front-end with modular CSS/JS, multi-page IA, and visible accessibility patterns (skip link, focus styles, keyboard support for menu/tabs/lightbox, reduced-motion handling). Evidence: `css/style.css:2-10`, `js/script.js:3-15`, `js/features/nav.js:74-98`, `css/modules/utilities.css:22-54`, `css/modules/motion.css:1-17`.

Main production risks are not P0-level site outages, but deployment/runtime consistency problems around offline/PWA paths and asset linking. Evidence: `pwa/service-worker.js:18-21`, `contact.html:214-221`, `netlify/_headers:1-31`.

## 2. P0 — Critical risks
No confirmed P0 issues detected in static repository evidence.

## 3. Strengths
- Strong modular architecture for both styles and behavior (`css/modules/*`, `js/features/*`). Evidence: `css/style.css:2-10`, `js/script.js:3-15`.
- Progressive enhancement baseline exists (`<html class="no-js">` + runtime switch to `.js` + no-JS nav fallback CSS). Evidence: `index.html:2`, `js/script.js:1`, `css/modules/layout.css:139-153`.
- Accessibility foundations are implemented in code, not only documented: skip link, `:focus-visible`, keyboard/focus handling in menu and lightbox. Evidence: `index.html:138`, `css/modules/utilities.css:22-54`, `js/features/nav.js:20-45`, `js/features/lightbox.js:127-145`.
- SEO baseline is broadly present: meta description, canonical, OG/Twitter, robots, sitemap, JSON-LD fallback. Evidence: `index.html:9-37`, `robots.txt:1-4`, `sitemap.xml:1-30`, `index.html:50-122`.
- Performance-oriented image strategy is visible (`picture`, AVIF/WebP/JPG variants, dimensions, lazy loading). Evidence: `index.html:185-217`, `gallery.html:188-210`, `rooms.html:231-235`.

## 4. P1 — Improvements worth doing next (exactly 5)
All previously identified P1 issues were addressed during remediation pass
(map fallback asset restored, service worker precache typo fixed,
design token naming unified, and Netlify headers configuration verified).

No active P1 issues remain in the current repository state.

## 5. P2 — Minor refinements
- Add machine-readable CI checks for heading outline and ARIA state regressions to complement existing scripts.
- Consider reducing duplicated inline JSON-LD fallback payload size across pages to simplify maintenance.
- Standardize internal naming language (PL/EN terms mixed in some labels and link text).
- Add explicit `lastmod` entries in sitemap URLs for better crawler freshness signaling.
- Contrast compliance cannot be verified with certainty from static tokens alone; computed-style/runtime audit is still needed.

## 6. Future enhancements (exactly 5)
1. Introduce CI workflow to run `check:links`, build verification, and accessibility checks on every push.
2. Generate service worker precache manifest from build output to avoid manual drift.
3. Add automated schema validation for all `assets/seo/*.json` against selected schema rules.
4. Add visual regression screenshots for key breakpoints (home, gallery, contact, legal pages).
5. Add a dedicated content governance checklist for legal/privacy pages (update cadence + ownership).

## 7. Compliance checklist
| Check | Status | Evidence |
|---|---|---|
| headings valid | PASS | Single page-level `h1` pattern visible across pages (examples: `index.html:222-225`, `contact.html:178`, `rooms.html:167`). |
| no broken links excluding intentional minification strategy | FAIL | `npm run check:links` reports missing `assets/img/optimized/contact/map-fallback.svg` referenced by `contact.html`. |
| no console.log | PASS | No `console.log` found in runtime page JS modules (`js/script.js`, `js/features/*`); logs only in tooling scripts. |
| aria attributes valid | PASS | ARIA states and roles are consistently used in menu/tabs/lightbox/form code (`js/features/nav.js:27-41`, `js/features/tabs.js:12-52`, `js/features/lightbox.js:80-90`, `contact.html:284-329`). |
| images have width/height | PASS | Static check across root HTML found 0 `<img>` missing width/height; examples in `index.html:214-215`, `contact.html:220-221`, `gallery.html:219-220`. |
| no-JS baseline usable | PASS | `no-js` bootstrap and CSS fallback navigation are implemented (`index.html:2`, `css/modules/layout.css:139-148`, `js/script.js:1`). |
| sitemap present if expected | PASS | `sitemap.xml` present and listed in robots (`robots.txt:4`, `sitemap.xml:1-30`). |
| robots present | PASS | `robots.txt` exists with crawl and sitemap directives (`robots.txt:1-4`). |
| OG image exists | PASS | OG image metadata points to existing assets (`index.html:28-32`; files present under `assets/img/og/`). |
| JSON-LD valid | PASS | JSON files in `assets/seo/*.json` parse successfully and fallback script is embedded in pages (`index.html:50-122`, `onas.html:50-106`). |

## 8. Architecture score (0–10)
- **BEM consistency:** 8.6/10
- **Token usage:** 8.2/10
- **Accessibility:** 8.7/10
- **Performance:** 7.9/10
- **Maintainability:** 7.8/10

**Overall architecture score:** **8.2/10**

## 9. Senior rating (1–10)
**8.1/10** — Strong engineering baseline for a static front-end product (modularity, a11y patterns, SEO/PWA primitives). Score is reduced by repository-evident consistency defects in offline/deploy paths and a real broken asset reference that escaped QA.
