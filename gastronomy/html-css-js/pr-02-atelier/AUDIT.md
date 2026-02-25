# AUDIT.md

## 1. Executive summary
- Zakres: pełny przegląd projektu `C:\Users\KPKro\MY FILES\active-work\pr-02-atelier` (HTML/CSS/JS, assets, config, deploy files, package scripts).
- Wynik kontroli automatycznych:
- `npm run lint` - pass.
- `npm run validate:html` - pass.
- `npm run check:links:dev` - pass (`Successfully scanned 492 links`).
- `npm run check:a11y` - pass (`10/10 URLs passed`, WCAG2AA runner `htmlcs`).
- Architektura CSS jest modularna i spójna z podziałem `base/layout/components/pages` oraz tokenami w `css/base/tokens.css`.
- Nie stwierdzono krytycznych runtime blockerów w lokalnym środowisku deweloperskim.
- `netlify.toml` not detected in project.
- `vercel.json` not detected in project.
- `.github` not detected in project.

## 2. P0 — Critical risks
- Not detected in project for audited local runtime.

## 3. Strengths
- Modular CSS architecture and tokenization are implemented and consistently imported from a single entry point.
- Evidence: `css/style.css:1-25`, `css/base/tokens.css:1-152`.
- Accessibility baseline is solid: skip link, keyboard navigation, focus-visible handling, aria state synchronization, no-JS fallback.
- Evidence: `contact.html:80`, `js/features/nav.js:73-77`, `js/features/nav.js:266-273`, `css/base/base.css:3-12`, `css/components/states.css:37-48`.
- Automated quality gates are present and operational.
- Evidence: `package.json:30-38`, `.pa11yci`, `.htmlvalidate.json`.
- Form implementation includes Netlify handling and honeypot anti-spam.
- Evidence: `contact.html:187-188`, `contact.html:192`, `contact.html:217-225`.
- Asset delivery strategy covers responsive images (AVIF/WEBP/JPG) and explicit intrinsic dimensions.
- Evidence: image scan over all HTML files returned `missing width/height=0`.

## 4. P1 — 5 improvements worth doing next
1. Title: Scope COEP policy to avoid third-party embed breakage
- Reason: Global `Cross-Origin-Embedder-Policy: require-corp` can block cross-origin embeds such as Google Maps iframe in production.
- Evidence: `_headers:9`, `contact.html:250-251`.
- Suggested improvement: Narrow COEP to selected routes/assets that require it, or relax policy on pages that intentionally embed external iframes.
- Status (2026-02-25): scoped in `_headers` with explicit `/contact.html` override using `Cross-Origin-Embedder-Policy: unsafe-none`.

2. Title: Align Service Worker precache list with runtime asset strategy
- Reason: SW install list pre-caches `.min` assets while pages load non-min runtime assets (`style.css`, `script.js`), creating maintenance drift.
- Evidence: `sw.js:12-13`, `index.html:88`, `index.html:833`.
- Suggested improvement: Keep precache list synchronized with actually referenced production assets, generated during build.
- Status (2026-02-25): `sw.js` precache includes both runtime non-min and build-stage `.min` variants to remove filename drift.

3. Title: Remove remaining `!important` from nav link decoration
- Reason: `!important` increases selector coupling and complicates future component overrides.
- Evidence: `css/components/nav.css:18`.
- Suggested improvement: replace with explicit scope/order strategy in nav component styles.

4. Title: Add `contact.html` explicitly to link-check seed URLs
- Reason: Link checks currently rely on crawl reachability for `contact.html`; explicit seeding gives deterministic coverage.
- Evidence: `package.json:33-34` (seed list includes many pages but not direct `contact.html`).
- Suggested improvement: append `http://127.0.0.1:5173/contact.html` to `check:links:dev` and `check:links:prod` seeds.

5. Title: Unify SEO metadata policy for utility pages
- Reason: Utility pages use inconsistent SEO/OpenGraph structure (e.g., 404 has no canonical/OG; thank-you has canonical but no OG URL).
- Evidence: `404.html:1-19`, `thank-you.html:7-17`.
- Suggested improvement: define a clear policy for utility pages (minimal noindex metadata set) and apply consistently.

## 5. P2 — Minor refinements
- `X-XSS-Protection` header is legacy/deprecated in modern browsers.
- Evidence: `_headers:4`.
- Optional refinement: remove legacy header and rely on CSP + modern browser protections.

- Service worker registration logs warning with emoji-formatted message in production console.
- Evidence: `js/bootstrap.js:34`.
- Optional refinement: standardize logging format for production observability.

- `manifest.webmanifest` includes duplicated icon sources (same file for `any` and `maskable`).
- Evidence: `manifest.webmanifest:16-37`.
- Optional refinement: keep this only if intentional; otherwise reduce duplication in manifest maintenance.

## 6. Future enhancements — 5 realistic ideas
1. Add CI workflow (GitHub Actions or equivalent) running `npm run check` and `npm run check:server:prod` on pull requests.
2. Add automated screenshot/visual regression checks for light/dark themes and mobile/desktop breakpoints.
3. Generate sitemap and JSON-LD validation reports in CI to prevent metadata drift.
4. Introduce build-time generation of SW precache manifest to avoid manual cache list maintenance.
5. Add performance budget checks (Lighthouse CI or equivalent) for LCP/CLS/INP on core pages.

## 7. Compliance checklist (pass / fail)
- headings valid: PASS
- Evidence: heading-flow scan for all HTML files -> no level jumps; every page has one `h1`.

- no broken links (excluding intentional .min strategy): PASS
- Evidence: `npm run check:links:dev` -> `Successfully scanned 492 links`.

- no console.log: PASS
- Evidence: static search `console.log` -> not detected in project source.

- aria attributes valid: PASS
- Evidence: `npm run check:a11y` -> 10/10 URLs passed; nav and dropdown state sync in `js/features/nav.js`.

- images have width/height: PASS
- Evidence: HTML scan -> `missing width/height=0` for all pages.

- no-JS baseline usable: PASS
- Evidence: no-JS fallback present on all pages; JS-enhanced nav degrades to visible nav when JS is absent (`html:not(.js) .nav-toggle`).

- sitemap present (if expected): PASS
- Evidence: `sitemap.xml` present and includes indexable core pages including `contact.html`.

- robots present: PASS
- Evidence: `robots.txt` present; page-level robots meta present across audited HTML.

- OG image exists: PASS
- Evidence: OG image path configured on indexable content pages and file exists in assets.

- JSON-LD valid: PASS
- Evidence: JSON-LD parse check passed on pages where JSON-LD is present; utility pages without JSON-LD are not detected as schema pages.

## 8. Architecture Score (0–10)
- BEM consistency: 8.6/10
- Token usage: 8.8/10
- Accessibility: 9.1/10
- Performance: 8.4/10
- Maintainability: 8.2/10
- Total Architecture Score: 8.6/10

## 9. Senior rating (1–10)
- Senior rating: 8.6/10
- Justification: Projekt jest spójny architektonicznie, ma działające quality gates i bardzo dobry poziom dostępności technicznej. Główne obszary do domknięcia dotyczą polityk deploy/security headerów oraz kilku punktów utrzymaniowych (precache alignment, metadata consistency, redukcja `!important`).
