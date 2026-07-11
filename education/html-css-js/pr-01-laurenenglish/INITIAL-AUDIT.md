# Lauren English — Initial Project Audit

**Audit date:** 2026-07-10

## Current-state assessment

Lauren English has a promising early-stage frontend foundation: the intended product is multi-page, the source CSS and JavaScript are already split into focused areas, and the repository contains useful accessibility, SEO, data, and PWA scaffolding. The checked-in site is not currently production-runnable, however. Browser verification showed that the secondary pages load without their CSS or JavaScript because the expected build directory is absent, while the homepage loads the JavaScript module entry as a classic script and consequently leaves most reveal-marked content invisible.

The intended source-only UI is more complete than the current runtime suggests. When the canonical CSS and JavaScript sources were loaded through a temporary audit preview, the main desktop layouts, catalogue rendering, progress tracker, and homepage accordion worked. That preview also exposed systemic mobile-navigation overflow, inaccessible hidden navigation links, a non-functional package accordion, inconsistent dark-theme surfaces, duplicated content sources, and public-facing credibility risks. The project therefore needs architectural stabilization before visual polish or feature expansion.

## Main strengths already present

- `CONTEXT-PROJECT.md` defines a clear product direction, architecture, accessibility target, and source-first workflow.
- All eight HTML documents contain exactly one `h1`; no duplicate HTML IDs were found, and the five principal content pages include titles, descriptions, and canonical links.
- The primary pages use semantic landmarks, skip links, native buttons and links, labelled form controls, visible `:focus-visible` styling, and explicit image dimensions.
- `css/style.css` follows the documented `tokens → base → utilities → components → sections → pages` import order and the source uses mostly recognizable BEM-style component classes.
- JavaScript is divided into focused modules with guarded initializers. Materials, packages, progress definitions, and progress persistence have dedicated data/state modules.
- The homepage accordion supports ARIA state changes, the mobile navigation implements Escape and focus return once loaded, and the reveal module checks reduced-motion preference.
- The materials source preview rendered all 15 catalogue items, and the progress source preview rendered all three configured learning tracks without JavaScript syntax errors.
- The repository already includes local fonts, explicit image dimensions, page metadata, a sitemap, robots directives, a manifest, a service-worker template, an offline page, and a runtime checklist.

## Main risks and weaknesses

- The production asset contract is broken and inconsistent across pages, so the checked-in site is substantially unstyled and non-interactive.
- Progressive enhancement is inverted: reveal content is hidden by CSS until JavaScript succeeds, which made most homepage content visually disappear when the module failed.
- Navigation and accordion states do not yet form one reliable keyboard, focus, and ARIA contract across breakpoints and pages.
- Repeated header, navigation, footer, package, and material content has drifted between files and data modules.
- Public copy contains prohibited “demo” language, unsupported-looking testimonials and business details, generic social destinations, and legal links that lead to the offline page.
- The token system is incomplete for component dimensions and theme surfaces; the dark theme produces near-white hero text over a fixed light gradient.
- Mobile browser verification found a 702px document width at a 390px viewport because the closed off-canvas navigation remains in the overflow and focus model.
- SEO, routing, service-worker cache handling, and generated-file documentation do not yet describe or produce one trustworthy deployment state.
- `README.md` describes an older one-page architecture and obsolete build locations. `COMMIT-STANDARD.md` and `PROMPT-CODEX.md` are not present.
- Dependency-backed build, lint, formatting, accessibility, and production service-worker checks could not be run because `node_modules` and `assets/build` are absent and this audit did not install dependencies.

## 10-point improvement roadmap

1. [x] **Restore one canonical production asset pipeline**

   - **Priority:** Critical
   - **Affected area:** Build tooling, generated assets, every HTML page, fonts, runtime documentation
   - **Current evidence:** `package.json`, `docs/runtime-checklist.md`, and both service-worker files expect `/assets/build/style.min.css` and `/assets/build/main.min.js`, but `assets/build/` is absent. The secondary and status pages returned 404 for those assets in desktop and mobile browser checks. `index.html` instead loads legacy `css/style.min.css` and loads `js/main.js` without `type="module"`, producing `Cannot use import statement outside a module`. `README.md` still documents older output locations and Terser although the current script uses esbuild. Font URL resolution also depends on the final CSS output location and is not currently verified.
   - **Why it matters:** No other runtime, accessibility, UI, or PWA result can be trusted while pages load different or missing artifacts. The current homepage hides most content and the remaining pages render largely as unstyled HTML.
   - **Focused recommended implementation scope:** Keep `css/style.css`, the modular CSS files, `js/main.js`, and JavaScript modules as canonical sources. Make the existing build generate the two documented files in `assets/build/`, correct asset URL rebasing, align every HTML page to the same generated paths, and define the tracked/ignored status of legacy `css/style.min.css`. Keep `service-worker.template.js` as the service-worker source and regenerate `service-worker.js` through the build.
   - **Expected result:** A clean build produces one deterministic set of deployable CSS, JavaScript, and service-worker assets consumed consistently by all pages.
   - **Verification or acceptance criteria:** From a dependency-ready clean checkout, the documented build succeeds; all eight HTML pages return their CSS and JavaScript with 200 responses; no page serves canonical source modules in production; there are no asset-related browser console errors; font files load from valid paths; the generated service-worker version matches the build version.
   - **Likely source files or areas:** `package.json`, `postcss.config.cjs`, `css/style.css`, `css/base/base.css`, all HTML files, `service-worker.template.js`, generated-file rules, `README.md`, `docs/runtime-checklist.md`

2. [x] **Normalize the shared multi-page HTML shell and navigation model**

   - **Priority:** High
   - **Affected area:** HTML architecture, shared header/footer, navigation, semantic page consistency
   - **Current evidence:** The same large header, nine-link navigation, theme action, CTA, footer, social links, legal links, and copyright block are copied through `index.html`, `uslugi.html`, `pakiety.html`, `materialy.html`, and `postepy.html`. Page-relative links and logo targets already differ, active-page state is not communicated with `aria-current`, and shared content has drifted with the public “Postępy (demo)” label repeated across every copy.
   - **Why it matters:** Manual shell duplication makes small navigation, content, accessibility, and SEO changes high-risk and encourages cross-page inconsistencies. It also conflicts with the documented requirement for modular HTML and reusable shared UI.
   - **Focused recommended implementation scope:** Define one explicit source-of-truth pattern for the shared shell within the existing static/Node workflow, normalize landmark and heading semantics, centralize shared navigation/footer content, preserve page-specific URLs, and generate or verify consistent page variants without introducing a framework.
   - **Expected result:** Every public page presents the same trustworthy site shell while retaining correct current-page state and page-relative navigation.
   - **Verification or acceptance criteria:** Header/footer parity is mechanically checkable; every page retains one `h1`, unique IDs, a valid `main`, correct skip-link target where applicable, valid local destinations, and exactly one appropriate `aria-current="page"`; no shared-content edit requires independent hand changes across five pages.
   - **Likely source files or areas:** `index.html`, `uslugi.html`, `pakiety.html`, `materialy.html`, `postepy.html`, any approved HTML assembly source, shared-shell verification tooling

3. [x] **Repair keyboard, focus, and ARIA contracts for interactive components**

   - **Priority:** Critical
   - **Affected area:** Mobile navigation, accordions, tabs, theme control, progress controls, accessibility
   - **Current evidence:** Browser checks could focus a link inside the closed mobile drawer while the drawer had `aria-hidden="true"`; at desktop width the visible drawer still retained `aria-hidden="true"`. Escape and focus return worked only after the source module loaded. The package-page accordion uses `data-accordion-trigger` and `data-accordion-panel`, while `js/modules/accordion.js` initializes only `[data-accordion-item]`; clicking a package question left the panel at `display: none` with no `aria-expanded` value. Several progress-looking buttons on secondary-page hero cards are not inside the module's `[data-progress-item]` hook and therefore present inactive controls.
   - **Why it matters:** Users can tab into visually hidden content, receive contradictory accessibility-tree state, or encounter controls that do nothing. These are direct WCAG 2.2 AA and product-trust risks.
   - **Focused recommended implementation scope:** Establish one component contract per interaction: remove closed navigation content from sequential focus and the accessibility tree, synchronize desktop/mobile state, retain Escape and focus return, use one accordion markup/API with IDs and accurate ARIA, and either implement or replace inactive progress controls with non-interactive presentation. Give tabs and the theme control complete keyboard and state semantics.
   - **Expected result:** Interactive components communicate the same state visually, to the keyboard, and to assistive technology on every page and breakpoint.
   - **Verification or acceptance criteria:** Keyboard-only tests confirm logical tab order, no hidden drawer focus, no trap, Escape close, focus return, visible focus, and correct arrow-key behavior where applicable; accordion, tab, theme, and pressed states update their ARIA values; all controls have an observable action; desktop navigation is not marked hidden.
   - **Likely source files or areas:** Shared navigation HTML, `pakiety.html`, `index.html`, secondary-page hero markup, `js/modules/mobileNav.js`, `js/modules/accordion.js`, `js/modules/resourcesFilter.js`, `js/modules/progressTracker.js`, related component CSS

4. [x] **Make progressive enhancement and JavaScript failure handling genuinely safe**

   - **Priority:** High
   - **Affected area:** Content visibility, feature detection, browser storage, runtime resilience, reduced motion
   - **Current evidence:** `css/sections/reveal.css` hides every `[data-reveal]` element by default. Because the homepage module did not execute, Playwright measured the first reveal element at `opacity: 0`, and the full-page screenshot contained large blank regions. `initReveal` and `initScrollSpy` assume `IntersectionObserver` exists. Theme initialization reads and writes `localStorage` without a guard, while progress state catches reads but not all writes/removals. Mobile navigation writes scroll-lock styling directly to `document.body.style`.
   - **Why it matters:** A missing bundle, blocked storage, older browser API, or isolated module error can remove essential content or stop later features. That contradicts the documented progressive-enhancement requirement.
   - **Focused recommended implementation scope:** Make HTML content visible and usable by default; apply reveal-only initial states after a small enhancement marker is present; feature-detect observers and storage; contain failures per module; use CSS state classes for scroll locking; preserve reduced-motion behavior without depending on animation success.
   - **Expected result:** Core content, navigation, catalogue information, and forms remain usable without JavaScript, while supported browsers receive enhancements without cascading failures.
   - **Verification or acceptance criteria:** With JavaScript disabled, all essential content is visible, links and the form remain usable, and no control falsely implies unavailable behavior; with storage denied or observers unavailable, initialization completes without uncaught errors; reduced-motion mode removes non-essential motion; normal mode has no console errors.
   - **Likely source files or areas:** `css/sections/reveal.css`, `css/base/base.css`, `js/main.js`, `js/modules/reveal.js`, `js/modules/scrollSpy.js`, `js/modules/mobileNav.js`, `js/state/storage.js`, pages using `data-reveal`

5. [ ] **Unify package, material, and access information behind canonical data**

   - **Priority:** High
   - **Affected area:** Content architecture, catalogue UI, package CTAs, data modules, feature availability
   - **Current evidence:** `js/data/packages.js` and `pakiety.html` use Start, Regular, and Intensive, while the homepage hardcodes Start, Regular, and Pro with separate prices and benefits. The homepage hardcodes material cards and repeats each card across tab panels instead of using `js/data/materials.js`. Free material records use `url: '#'`, while visible “Pobierz” and “Zobacz” CTAs imply operational destinations. Homepage material buttons also have no implemented action. Premium access routing is centralized only inside `materialsCatalog.js`.
   - **Why it matters:** Users see conflicting offers and non-operational actions, while future package, payment, or authentication work would require coordinated edits in several places.
   - **Focused recommended implementation scope:** Make package keys, labels, links, and supported commercial details come from one package source; render or derive all catalogue summaries from the materials source; keep access decisions centralized; replace unavailable destinations with an honest disabled, informational, or valid contact path consistent with `CONTEXT-PROJECT.md`.
   - **Expected result:** Package and material information remains consistent across the homepage, package page, catalogue, and CTAs, with no misleading action state.
   - **Verification or acceptance criteria:** The same three package keys and labels appear everywhere; each material has a valid, intentionally disabled, or clearly explained CTA; category/level/free filters return the expected data; no material card content is duplicated manually across tab panels; access rules remain centralized and unit-testable.
   - **Likely source files or areas:** `index.html`, `pakiety.html`, `materialy.html`, `js/data/packages.js`, `js/data/materials.js`, `js/modules/materialsCatalog.js`, `js/modules/resourcesFilter.js`, `docs/pakiety.md`

6. [ ] **Replace unsupported public claims and legal placeholders with verified content**

   - **Priority:** Critical
   - **Affected area:** Brand credibility, public copy, testimonials, business identity, forms, legal and social destinations
   - **Current evidence:** Public navigation, headings, metadata, and copy repeatedly use “demo”, which `CONTEXT-PROJECT.md` explicitly forbids. The homepage labels testimonials as real and displays three five-star ratings without repository evidence of provenance. JSON-LD and contact content publish an email, `+48 600 000 123`, opening hours, WhatsApp, and business claims that are not supported by project documentation. Social links point to platform homepages. Privacy-policy and terms links point to `offline.html`, while the Netlify form collects personal data without a real linked policy.
   - **Why it matters:** Unsupported identity, review, availability, price, and legal claims undermine the portfolio's commercial credibility and can mislead visitors about the site's operator and data processing.
   - **Focused recommended implementation scope:** Obtain verified client/business inputs or remove unsupported fields and claims; replace prohibited portfolio/demo language with customer-facing product language; remove or clearly withhold unverified testimonials and ratings; route social and legal links only to real destinations; align form disclosure and consent copy with actual Netlify processing.
   - **Expected result:** Every public statement and destination is accurate, defensible, and consistent with the site's real technical behavior.
   - **Verification or acceptance criteria:** Repository-wide searches find no prohibited public labels; testimonials, ratings, business details, prices, opening hours, and structured data each have an approved source or are absent; no legal link leads to an unrelated page; form disclosure names actual processing behavior and links to applicable policy content; generic social links are removed or replaced with verified profiles.
   - **Likely source files or areas:** All public HTML files, homepage JSON-LD and contact section, shared footer/navigation content, form copy, any approved legal documents, `CONTEXT-PROJECT.md` content rules

7. [ ] **Complete the token-first CSS system and make both themes accessible**

   - **Priority:** High
   - **Affected area:** Design tokens, CSS layers, component reuse, dark theme, contrast, maintainability
   - **Current evidence:** The layer order is correct, but component files still contain repeated raw dimensions, radii, spacing, white values, and feature colors. The hero and progress hero use fixed light `#f6f7f9`/`#eef7f4` gradients and translucent white cards; the source preview then switched hero text to near-white in dark mode, producing an unreadable theme combination. `.sr-only`/`.u-visually-hidden` and `.skip-link`/`.u-skip-link` duplicate utilities. `typography.css` and `tabs.css` are placeholders, and contextual selectors such as `.services .card--service` couple components to sections.
   - **Why it matters:** Incomplete tokens and duplicated primitives make theme changes inconsistent, increase CSS drift, and prevent reliable WCAG AA contrast verification.
   - **Focused recommended implementation scope:** Add only the semantic tokens needed by current components, bind hero/card/status/access colors and control dimensions to them, provide explicit dark-theme surface values, consolidate duplicate utilities, clarify empty layer files, and replace contextual coupling with existing BEM modifiers where appropriate.
   - **Expected result:** The existing visual identity remains recognizable, but component styling becomes predictable, reusable, and safe in light and dark themes.
   - **Verification or acceptance criteria:** Light and dark theme screenshots show readable hero, card, navigation, form, badge, and focus states; applicable text and control states meet WCAG AA contrast; raw colors outside the token layer are documented exceptions; no ID selectors or unnecessary `!important` are introduced; layer order and low specificity remain intact.
   - **Likely source files or areas:** `css/tokens/tokens.css`, `css/base/*`, `css/utilities/utilities.css`, `css/components/*`, `css/sections/hero.css`, `css/sections/resources.css`, `css/pages/pages.css`, `css/style.css`

8. [ ] **Stabilize responsive layout and refine the educational UI hierarchy**

   - **Priority:** Medium
   - **Affected area:** Mobile layout, header/navigation density, typography, spacing, cards, CTA hierarchy, visual cohesion
   - **Current evidence:** At 390px, both the current page and source-only preview measured a 702px document width. Focusing a closed drawer link shifted the viewport horizontally, and the fixed drawer remained outside the viewport. The desktop source preview is coherent but the nine-item header is crowded, with labels wrapping at common desktop widths. The homepage is long and repeats catalogue cards, CTA treatments, and similarly weighted card sections, reducing hierarchy. Secondary/status pages currently have no shared visual baseline because their build assets fail.
   - **Why it matters:** Horizontal scrolling, dense navigation, and weak prioritization damage mobile usability and make the product feel like an assembled template rather than a deliberate educational service.
   - **Focused recommended implementation scope:** After the shell and token work is stable, correct off-canvas containment, choose a breakpoint/navigation composition that fits real labels, refine type and spacing rhythm, normalize card and button hierarchy, reduce redundant homepage content, and preserve the established warm green educational direction rather than redesigning the brand.
   - **Expected result:** The site has a clear learning-oriented hierarchy, consistent components, and stable layouts from narrow phones through large desktops.
   - **Verification or acceptance criteria:** At 320, 390, 768, 1024, and 1440px there is no document-level horizontal overflow, clipping, unintended overlap, or inaccessible off-screen focus; navigation labels and CTAs remain readable and usable; touch targets and line lengths are appropriate; page-level visual regression screenshots show consistent spacing, typography, and component states.
   - **Likely source files or areas:** Shared header/navigation HTML, homepage section structure, `css/tokens/tokens.css`, `css/components/navigation.css`, `css/components/buttons.css`, `css/components/cards.css`, `css/utilities/utilities.css`, section/page CSS

9. [ ] **Correct routing, metadata, and structured-data foundations**

   - **Priority:** High
   - **Affected area:** SEO, canonical URLs, 404 behavior, redirects, sitemap, robots, Open Graph, structured data
   - **Current evidence:** The five primary pages have descriptions and canonical links, but `404.html`, `offline.html`, and `thank-you.html` reuse the homepage canonical and have no explicit indexing policy. `_redirects` rewrites every unmatched path to `index.html` with status 200, which conflicts with the dedicated 404 page and can create soft-404 responses. `sitemap.xml` uses the same `2024-06-01` date for every entry. Homepage JSON-LD contains unverified business data, and social-preview metadata has not been runtime-validated.
   - **Why it matters:** Search engines and users cannot reliably distinguish real content, utility pages, and missing routes, and unsupported structured data can damage trust rather than improve discovery.
   - **Focused recommended implementation scope:** Define real static-route and 404 behavior, give indexable pages unique verified metadata, mark utility/error pages appropriately, retain only supported structured data, synchronize canonical/OG URLs, and regenerate sitemap/robots content from the actual public route set.
   - **Expected result:** Each public URL has intentional indexing and sharing behavior, while unknown routes return an actual 404 response.
   - **Verification or acceptance criteria:** Known routes return 200 and unknown routes return 404; canonical URLs are self-consistent where appropriate; utility pages have deliberate index/noindex behavior; sitemap entries and dates reflect real content; robots points to the deployed sitemap; structured-data and social-preview validators report no unsupported or conflicting fields.
   - **Likely source files or areas:** All HTML `<head>` sections, `_redirects`, `404.html`, `offline.html`, `thank-you.html`, `sitemap.xml`, `robots.txt`, `assets/og/og-default.svg`, verified business/content source

10. [ ] **Harden PWA lifecycle, offline behavior, and performance-critical assets**

   - **Priority:** High
   - **Affected area:** Service worker, cache safety, offline navigation, manifest/installability, images, fonts, performance verification
   - **Current evidence:** The current precache requires missing `/assets/build/` files, so `cache.addAll` cannot complete against the checked-in runtime. Activation deletes every cache on the origin except the current name rather than only old Lauren English caches. Navigation and static fetch handlers cache responses without checking status or suitability. Generated `service-worker.js` contains version `1.0.1` while `package.json` is `1.0.0`. The above-the-fold hero image is marked `loading="lazy"`, four font weights are shipped, and manifest/installability behavior could not be verified without a successful production build.
   - **Why it matters:** A failed install or unsafe cache cleanup can break offline behavior and affect unrelated origin caches, while inefficient critical assets reduce perceived quality on mobile connections.
   - **Focused recommended implementation scope:** Repair the service-worker template after the asset contract is stable; scope cache cleanup by project prefix; cache only successful intended responses; define navigation fallback and update behavior; generate cache versioning from the build; verify manifest icons/installability; prioritize the LCP image and load only justified font assets.
   - **Expected result:** The PWA installs and updates predictably, serves intentional offline fallbacks, preserves unrelated caches, and loads critical UI assets efficiently.
   - **Verification or acceptance criteria:** A production build installs one active project cache; primary routes work online and through the documented offline fallback; an update removes only older Lauren English caches; failed responses are not cached; manifest/installability checks pass; the hero/LCP image is not deferred; font and asset requests match an agreed performance budget; `docs/runtime-checklist.md` reflects the verified process.
   - **Likely source files or areas:** `service-worker.template.js`, generated `service-worker.js`, `package.json`, `manifest.webmanifest`, `offline.html`, `index.html`, `assets/img/*`, `assets/fonts/*`, `docs/runtime-checklist.md`
