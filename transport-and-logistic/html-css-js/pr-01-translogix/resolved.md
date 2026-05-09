# Resolved audit items

## 2026-05-09 — Release-check verification workflow

Resolved scope:

- `package.json`
- `README.md`
- `AUDIT.md`
- `npm run release-check`

Outcome:

- Added `release-check` as a heavier local pre-release gate composed from existing project scripts: `qa`, `assets:verify`, `qa:budget`, and `test:e2e`.
- Kept the regular `qa` command unchanged for daily development checks.
- Documented the command in the existing README QA command lists.
- `npm run release-check` passes with `8 passed` Playwright tests after the aggregate QA, asset, and budget checks.

Notes:

- No dependencies, source HTML/CSS/JS implementation files, Playwright tests, Lighthouse config, minified files, or `dist/` files were changed intentionally.
- This resolves only the dedicated release-check workflow improvement.

## 2026-05-09 — Services E2E Polish counter assertion

Resolved scope:

- `tests/e2e/services.spec.js`
- services filter Playwright smoke coverage

Outcome:

- Updated the stale services E2E assertions from `Wyswietlono` to the current runtime UI copy `Wyświetlono`.
- Test behavior was otherwise unchanged.
- `npx playwright test tests/e2e/services.spec.js` passes with `1 passed (21.8s)`.

Notes:

- Runtime UI copy in `assets/js/services-filters.js` was preserved unchanged.
- No npm scripts, Playwright config, minified files, or `dist/` files were changed intentionally.
- This resolves only the services E2E QA drift item.

## 2026-05-09 — Service worker offline smoke test

Resolved scope:

- `tests/e2e/service-worker-offline.spec.js`
- service worker/offline Playwright smoke coverage

Outcome:

- Added a focused Playwright smoke test for service worker readiness and control.
- The test verifies that a cached root page remains available while offline.
- The test verifies the current offline fallback behavior for unknown navigation.
- `npx playwright test tests/e2e/service-worker-offline.spec.js` passes with `1 passed (19.4s)`.

Notes:

- Production `sw.js` was preserved unchanged.
- No npm scripts, Playwright config, minified files, or `dist/` files were changed.
- This resolves only the service worker/offline smoke-test audit item.

## 2026-05-07 — Expanded pa11y root page coverage

Resolved scope:

- `.pa11yci.json`
- `npm run qa:a11y`
- accessibility QA coverage for remaining real root-level pages

Outcome:

- `pa11y-ci` now audits the business pages, service detail page, legal pages, `404.html`, and `offline.html`.
- Existing WCAG standard, timeout, wait, and Chromium launch settings were preserved.
- `npm run qa:a11y` now passes for all 11 configured URLs.

Notes:

- No minified files or `dist/` files were edited manually.
- This resolves only the pa11y coverage P2 item.

## 2026-05-07 — Source-owned HTML QA scope and footer phone typography

Resolved scope:

- `package.json`
- `scripts/validate-source-html.js`
- `partials/footer.html`
- `templates/partials/footer.html`
- `npm run qa:html`

Outcome:

- `qa:html` now validates root source HTML pages, `partials/`, and `templates/` through a source-owned Node script instead of scanning generated, report, dependency, and third-party HTML.
- The footer phone link keeps the clean `tel:+48533537091` href while rendering the visible number with non-breaking spaces.
- `npm run qa:html` now passes as a project command.
- The full `npm run qa` pipeline now passes when Chromium is allowed to launch for `pa11y-ci`.

Notes:

- No minified files or `dist/` files were edited manually.
- This resolves only the HTML QA scope and footer phone typography P1 item.

## 2026-05-07 — Configured accessibility QA failures

Resolved scope:

- `assets/css/modules/settings.css`
- `assets/css/modules/components.css`
- `partials/footer.html`
- `templates/partials/footer.html`
- `npm run qa:a11y`

Outcome:

- Light-theme accent text now uses a darker `--color-accent-strong` value so shared UI states meet WCAG AA contrast in the configured pa11y pages.
- The home hero keeps its visual image overlay while also exposing a dark fallback background for reliable text contrast analysis.
- Footer social links now include visually hidden text labels, while their decorative icon images are hidden from assistive technology.
- `npm run qa:a11y` now passes for all five configured URLs.

Notes:

- No minified files or `dist/` files were edited manually.
- This resolves only the configured accessibility QA P1 item.

## 2026-05-07 — Service worker root page precache coverage

Resolved scope:

- `sw.js`
- service worker precache coverage for omitted root-level pages

Outcome:

- The service worker precache list now includes `service.html`, `privacy.html`, `terms.html`, and `cookies.html`.
- Existing cache naming, install/activate logic, navigation strategy, runtime asset strategy, and offline fallback behavior were unchanged.

Notes:

- No minified files or `dist/` files were edited manually.
- This resolves only the root page precache coverage P2 item.

## 2026-05-06 — Focused source HTML validation cleanup

Resolved scope:

- `.htmlvalidate.json`
- `contact.html`
- `fleet.html`
- `assets/js/lightbox.js`
- `assets/css/modules/pages.css`
- focused source HTML validation command

Outcome:

- `void-style` now matches the project's self-closing void element formatting.
- FAQ accordion panels now use native `<section>` elements while preserving IDs, classes, `hidden`, and `aria-labelledby`.
- The lightbox thumbnail container now uses a native `<ul>`, with JavaScript rendering each thumbnail inside an `<li>`.
- Focused validation for the root source pages now passes.

Notes:

- No minified files or `dist/` files were edited.
- This resolves only the focused source HTML validation cleanup.

## 2026-05-06 — Effective performance budget measurement

Resolved scope:

- `perf-budgets.json`
- `scripts/check-budgets.js`
- `npm run qa:budget`

Outcome:

- CSS budget now measures `assets/css/style.min.css`.
- JS budget now measures the static module graph loaded from `assets/js/main.min.js`.
- `npm run qa:budget` passes with realistic generated payload measurements.

Notes:

- No minified files or `dist/` files were edited manually.
- This resolves only the budget measurement accuracy issue.

## 2026-05-06 — Services filter Polish UI copy

Resolved scope:

- `assets/js/services-filters.js`
- dynamic services filter result messages

Outcome:

- The visible result counter now renders `Wyświetlono`.
- The empty-state message now renders `Brak wyników dla wybranych filtrów.`
- Filtering logic, DOM hooks, ARIA state handling, and event handling were unchanged.

Notes:

- This resolves only the dynamic services filter copy issue.

## 2026-05-06 — Asset verifier source scope

Resolved scope:

- `scripts/verify-assets.js`
- `npm run assets:verify`
- project-owned source/public HTML asset references

Outcome:

- Asset verification now scans root source HTML pages, `partials/`, `templates/`, and service worker precache URLs.
- Generated and third-party folders are excluded by path instead of hiding individual missing-asset reports.
- `npm run assets:verify` now passes for the current source set.

Notes:

- This resolves only the verifier scope issue.
- Real missing assets from project-owned source pages should still fail the verifier.

## 2026-05-06 — HTML validator lowercase doctype policy

Resolved scope:

- `.htmlvalidate.json`
- project HTML validation policy for `<!doctype html>`

Outcome:

- `doctype-style` now accepts the project's Prettier-style lowercase doctype.
- Source HTML files were not changed for this policy alignment.
- Remaining validation findings such as `void-style` and `prefer-native-element` remain separate.

Notes:

- This resolves only the doctype validator configuration mismatch.

## 2026-05-06 — Real P1 source HTML validation defects

Resolved scope:

- `contact.html`
- `fleet.html`
- `services.html`
- `service.html`
- `partials/header.html`
- `templates/partials/header.html`
- source HTML ARIA, button semantics, and static lightbox markup

Outcome:

- Invalid `aria-label` usage on generic containers was removed or converted to valid grouped semantics.
- Non-submit accordion, filter, tab, navigation, and theme buttons now declare `type="button"`.
- Static lightbox image markup no longer ships empty `src=""` values or inline aspect-ratio styles.
- Existing JavaScript hooks and dynamic lightbox image population remain intact.

Notes:

- This resolves only the real source-level P1 validation defects.
- Style/config-only validation findings such as `doctype-style`, `void-style`, and validator scan scope remain separate.

## 2026-05-05 — Legal pages public copy and anchor offset

Resolved scope:

- `terms.html`
- `privacy.html`
- `cookies.html`
- legal page public copy
- legal table-of-contents anchor scroll offset

Outcome:

- Legal pages now use production-facing TransLogix wording for a transport/logistics company.
- Public legal content no longer describes the project as demo, portfolio, showcase, or a fictional front-end project.
- Legal page metadata was cleaned where it exposed outdated demo/KP_Code authoring context.
- Legal in-page anchor targets now use a scoped CSS `scroll-margin-top` offset so headings remain visible below the sticky header.

Notes:

- This resolves only the legal-pages audit finding.
- No unrelated P1/P2 audit items are marked as resolved.

## 2026-05-05 — Source partial hosts verified against dist build

Resolved scope:

- `scripts/build-dist.js`
- root source HTML partial hosts
- generated `dist/*.html` header/footer output
- no-JS navigation/footer audit finding

Outcome:

- The active no-JS header/footer P1 finding was verified as a source/dist workflow false positive.
- Source files intentionally use `<div data-partial="header"></div>` and `<div data-partial="footer"></div>` as authoring placeholders.
- `scripts/build-dist.js` inlines `partials/header.html` and `partials/footer.html` into every generated root HTML page in `dist/`.
- Existing `dist` pages were checked and contain normal `<header>` and `<footer>` markup instead of empty partial hosts.

Notes:

- No source authoring workflow or header/footer architecture change was needed.
- Remaining audit findings are still active unless listed separately.
