# AUDIT

## 1. Executive summary

The repository is a production-oriented multi-page front-end codebase with a clear source/build split. The strongest areas are CSS layering, centralized token usage, keyboard-aware navigation, reduced-motion handling, explicit image dimensions, and a working build QA path (`css/main.css:1-11`, `css/tokens.css:7-189`, `js/modules/navigation.js:22-150`, `scripts/qa/run-qa.mjs:1-21`).

No P0 issue was confirmed from repository evidence. The next-value improvements are mostly around metadata completeness, small accessibility correctness issues, and removing source/build drift in SEO handling.

## 2. P0 — Critical risks

No P0 issues were detected from repository evidence.

## 3. Strengths

- CSS architecture is explicitly layered and easy to reason about from the entrypoint (`css/main.css:1-11`).
- Design tokens are centralized for colors, typography, spacing, motion, radius, and z-index (`css/tokens.css:7-189`).
- Focus visibility is defined globally and reinforced in navigation/components (`css/base.css:127-131`, `css/layout.css:186-190`).
- Mobile navigation includes `aria-expanded`, `aria-hidden`, `Escape`, focus trap, and focus return (`src/partials/header.html:50-57`, `js/modules/navigation.js:22-50`, `js/modules/navigation.js:53-107`).
- No-JS fallback exists for the main navigation and the contact form (`css/layout.css:290-309`, `contact.html:186-193`, `contact-submit.php:1-102`).
- Reduced-motion handling is implemented in both CSS tokens/layout and JS behavior (`css/tokens.css:171-189`, `css/layout.css:379-418`, `js/modules/scroll.js`, `js/modules/reveal.js`).
- The contact form uses progressive enhancement rather than JS-only submission (`contact.html:186-193`, `js/modules/forms.js:278-330`, `contact-form-support.php:156-183`).
- The manifest icon path strategy is deployment-aware rather than broken in isolation: the source manifest keeps deployment-tested root-style icon paths, while the build rewrites the generated manifest to valid `/assets/icons/...` paths in `dist` (`assets/icons/site.webmanifest:10-22`, `scripts/build-utils.mjs:184-200`, `dist/assets/icons/site.webmanifest:10-22`).
- Local reference QA passed during the audit via `npm run qa`, and the QA layer checks build structure, HTML assembly, and local asset/link resolution (`scripts/qa/run-qa.mjs:1-21`, `scripts/qa/check-dist-structure.mjs`, `scripts/qa/check-html-assembly.mjs`, `scripts/qa/check-local-refs.mjs`).

## 4. P1 — Improvements worth doing next

1. SEO ownership is split between source and build output. Source `seo/robots.txt:1-3` points to `https://www.kp-code.pl/seo/sitemap.xml`, while build output is generated to point at `https://www.kp-code.pl/sitemap.xml` in `scripts/build-utils.mjs:173-181`.

2. Several project detail source files are stored as dense single-line HTML, which lowers reviewability and maintainability in the source layer. This is visible in files such as `projects/aurora.html`, `projects/atelier-no-02.html`, `projects/axiom-construction.html`, and `projects/volt-garage.html`, where large sections are compressed into long single lines in the source files.

## 5. P2 — Minor refinements

- JSON-LD was not detected in `404.html`, `in-progress.html`, `offline.html`, or `thank-you.html`. This is not a runtime failure, but it leaves metadata coverage inconsistent across public pages.
- `console.log` remains in repository tooling and QA scripts (`scripts/qa/run-qa.mjs:11-21`, `scripts/preview-dist.mjs`, `scripts/images/build-images.mjs`, `scripts/images/clean-images.mjs`).
- `offline.html` exists, but no service worker registration or scope was detected, so offline support is not wired into runtime behavior.

## 6. Future enhancements

1. Generate `sitemap.xml` from the actual HTML inventory used by the build (`scripts/build-utils.mjs:24`, `scripts/build-utils.mjs:64-69`) instead of maintaining it manually.
2. Add a static QA check for metadata consistency across `canonical`, `og:url`, `robots`, sitemap inclusion, and JSON-LD presence.
3. Move duplicated head/bootstrap concerns further into shared generation logic to reduce page-by-page metadata drift.
4. Add static checks for repeated ARIA labels and similar accessibility-copy regressions in the source HTML.

## 7. Compliance checklist

- `PASS` headings valid: audited source pages contain one `h1` each; automated scan returned `ONE_H1_PER_PAGE`.
- `PASS` no broken links excluding intentional minification strategy: `npm run qa` passed during the audit, including `local-refs`.
- `FAIL` no `console.log`: repository tooling still contains `console.log` usage (`scripts/qa/run-qa.mjs:11-21` and additional tooling files).
- `PASS` aria attributes valid: audited ARIA state values such as `aria-current`, `aria-expanded`, `aria-controls`, and `aria-hidden` use valid tokens in source (`src/partials/header.html:50-57`, `js/modules/navigation.js:22-30`).
- `PASS` images have width/height: static scan of source HTML did not detect `<img>` elements missing explicit dimensions.
- `PASS` no-JS baseline usable: navigation has a CSS fallback (`css/layout.css:290-309`), and the contact form posts to PHP without requiring JS (`contact.html:186-193`, `contact-submit.php:1-102`).
- `PASS` sitemap present if expected: `seo/sitemap.xml` exists.
- `PASS` robots present: `seo/robots.txt` exists.
- `PASS` OG image exists: `assets/og/og-img.png` exists and is referenced in page metadata (`index.html:27`, `services.html:28`, `contact.html:28`).
- `PASS` JSON-LD valid: detected JSON-LD blocks parse as valid JSON; pages without JSON-LD were noted separately and not treated as invalid markup.

## 8. Architecture score (0–10)

- BEM consistency: `8/10`
  Evidence: class naming is componentized and largely BEM-like across layout, components, pages, and project-specific files.
- Token usage: `9/10`
  Evidence: color, spacing, typography, motion, radius, and z-index values are centralized in `css/tokens.css:7-189`.
- Accessibility: `8/10`
  Evidence: skip links, focus treatment, keyboard-aware navigation, reduced-motion support, and non-JS form fallback are implemented; duplicated ARIA labels in services prevent a higher score.
- Performance: `8/10`
  Evidence: self-hosted fonts with `font-display: swap`, explicit image dimensions, lazy loading, and image optimization tooling are present.
- Maintainability: `7/10`
  Evidence: source/build separation and QA are solid, but robots ownership drift and compressed HTML sources still add avoidable maintenance friction.

**Architecture score: 8.0/10**

## 9. Senior rating (1–10)

**Senior rating: 8/10**

Technical justification: the repository shows senior-level discipline in front-end structure, build tooling, accessibility fundamentals, and evidence-driven optimization choices. It does not rate higher because some operational details still depend on manual consistency rather than a single automated source of truth, especially around SEO ownership between source and build output and small accessibility-copy regressions.
