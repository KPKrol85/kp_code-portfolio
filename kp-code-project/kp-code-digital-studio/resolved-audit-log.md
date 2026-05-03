# Resolved Audit Log

This file tracks audit findings that were confirmed as resolved and removed from the active `daily-AUDIT.md` queue.

## 2026-04-29

### Outland Gear responsive WebP candidate

- **Previous severity:** P1
- **Source:** `AUDIT.md`
- **Status:** resolved
- **Issue:** the `Outland Gear` project card previously referenced a broken 1024w WebP candidate with an invalid filename pattern.
- **Risk:** browsers selecting that `srcset` candidate could receive a missing image response and fall back to a less optimal path.
- **Resolution evidence:** `projects.html` now references `outland-gear-480.webp`, `outland-gear-768.webp`, and `outland-gear-1024.webp`; matching files exist in `assets/img/img_optimized/selected-work/`.
- **Current state:** the responsive WebP candidate path is aligned with the generated asset names.

### Outland Gear placeholder details link

- **Previous severity:** P2
- **Source:** `AUDIT.md`
- **Status:** resolved
- **Issue:** the visible `Szczegóły` CTA on the `Outland Gear` card previously used a placeholder `href="#"`.
- **Risk:** users and assistive technology received an interactive link affordance that did not navigate to a meaningful destination.
- **Resolution evidence:** `projects.html` now links the CTA to `./projects/outland-gear.html`; `scripts/qa/check-source-placeholder-links.mjs` checks source HTML for empty or `#` links.
- **Current state:** the card has a real details-page destination, and placeholder links are covered by a source-level QA check.

### Outland Gear accessible text and copy cleanup

- **Previous severity:** P2
- **Source:** `AUDIT.md`
- **Status:** resolved
- **Issue:** the `Outland Gear` card previously had inaccurate alternative text referencing `Volt Garage` and a typo in the visible description.
- **Risk:** accessible naming and visible content quality were inconsistent with the represented project.
- **Resolution evidence:** `projects.html` now uses `alt="Outland Gear — sklep e-commerce ze sprzętem turystycznym"` and no longer contains the previous `turstycznym` typo.
- **Current state:** the card text matches the `Outland Gear` project and uses corrected copy.

### Repository README documentation

- **Previous severity:** extra quality improvement
- **Source:** `AUDIT.md`
- **Status:** resolved
- **Issue:** repository-level documentation for local development, production build behavior, source-vs-dist conventions, and PHP/contact setup was previously insufficient.
- **Risk:** onboarding and maintenance required reading implementation files instead of relying on a concise repository overview.
- **Resolution evidence:** `README.md` documents project overview, key features, stack, structure, setup, local development, production build, deployment context, accessibility, SEO, performance, maintenance, and license.
- **Current state:** the repository has a bilingual production-facing README based on current implementation evidence.

### Source placeholder link QA guardrail

- **Previous severity:** extra quality improvement
- **Source:** `AUDIT.md`
- **Status:** resolved
- **Issue:** placeholder links such as `href="#"` could previously return without a dedicated source-level guardrail.
- **Risk:** non-functional links could re-enter marketing or project cards without being caught by the existing dist/reference checks.
- **Resolution evidence:** `scripts/qa/check-source-placeholder-links.mjs` scans expected source HTML outputs for empty or `#` href values, and `scripts/qa/run-qa.mjs` includes this check.
- **Current state:** placeholder links are part of the automated QA suite.

### Source preview service worker registration

- **Previous severity:** P1
- **Source:** `daily-AUDIT.md` from 2026-04-21
- **Status:** resolved
- **Issue:** `preview:source` could serve the raw root `service-worker.js` template containing `__CACHE_NAME__` and `__SHELL_ASSETS__`, while the front-end runtime attempted service worker registration in source preview.
- **Risk:** local source preview could produce a service worker registration error and differ from the built `dist/` behavior.
- **Resolution evidence:** `scripts/preview-source.mjs` injects `<meta name="kp-code-runtime" content="source-preview" />` into assembled HTML, and `js/modules/service-worker.js` skips service worker registration when that marker is present.
- **Current state:** source preview no longer registers the unprocessed service worker template; the generated worker remains a build-time artifact created by `scripts/build-utils.mjs`.
