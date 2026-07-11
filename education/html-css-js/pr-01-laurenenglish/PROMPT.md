PROJECT CONTEXT

You are a senior frontend architect completing roadmap point 5 in the Lauren English project.

You are working in the currently opened `education-pr01-laurenenglish` project.

Read and follow the existing project documentation before continuing, especially:

* `CONTEXT-PROJECT.md`
* `INITIAL-AUDIT.md`
* `README.md`
* `docs/pakiety.md`
* `docs/runtime-checklist.md`
* relevant package, material, access, and HTML assembly documentation

Treat `CONTEXT-PROJECT.md` as the authoritative project context.

Roadmap point 5 has already been implemented at the canonical source and assembled HTML level.

The current implementation includes:

* canonical package records using:

  * `start`
  * `regular`
  * `intensive`
* generated homepage and package-page package views
* canonical material actions
* centralized material access resolution
* pure material filtering
* generated homepage material panels
* generated full materials catalogue
* removal of operational-looking `href="#"`
* focused package, material, access, filter, and HTML validation
* updated documentation

Completed verification already includes:

* `npm run check:data`
* `npm run check:html`
* changed-source JavaScript syntax checks
* `git diff --check`

The data checks confirmed:

* 15 total materials
* 6 free materials
* 9 premium materials
* 4 featured materials
* expected category, level, access, and combined-filter results

Roadmap point 5 remains unchecked only because the production build and browser verification were blocked by missing installed dependencies and sandbox approval restrictions.

An unrelated `PROMPT.md` change exists in the working tree. Preserve it exactly, do not modify it, and do not include it in roadmap point 5 verification or change claims.

The following actions are explicitly approved:

1. Run `npm install --no-package-lock` using only dependencies already declared in `package.json`.
2. Run the installed Playwright verification workflow outside the repository sandbox when required for local browser execution.

Do not modify dependency manifests and do not create a lockfile.

TASK OBJECTIVE

Continue roadmap point 5 from the exact current working-tree state and complete all remaining production-build, runtime, no-JavaScript, accessibility, filtering, link, and browser verification.

Do not restart, redesign, or broadly refactor the existing implementation.

If verification reveals a defect directly related to roadmap point 5, apply the smallest safe canonical source-level correction, regenerate affected outputs, and rerun every relevant check.

Mark only roadmap point 5 as completed in `INITIAL-AUDIT.md` after every applicable acceptance criterion passes.

IMPLEMENTATION PLAN

1. Inspect the complete current working-tree diff before making any changes.

2. Identify:

   * canonical package data
   * canonical material data
   * centralized access-resolution logic
   * filtering logic
   * homepage package generation
   * package-page generation
   * homepage material-panel generation
   * full catalogue generation
   * documentation changes
   * generated outputs

3. Confirm that the existing implementation preserves:

   * package keys `start`, `regular`, and `intensive`
   * consistent public labels Start, Regular, and Intensive
   * no independently maintained Pro package
   * centralized package details
   * centralized material details
   * centralized access and CTA rules
   * build-time package and material rendering
   * no-JavaScript catalogue availability
   * accessible tab and filter behavior from previous roadmap points

4. Preserve the unrelated `PROMPT.md` change without modification.

5. Install only existing declared dependencies using:

   `npm install --no-package-lock`

6. Confirm:

   * `package.json` remains unchanged
   * no lockfile is created
   * no dependency versions are intentionally changed

7. Run the complete canonical verification sequence:

   * `npm run check:data`
   * `npm run build:html`
   * `npm run check:html`
   * `npm run build`
   * JavaScript syntax checks for canonical source files
   * JavaScript syntax checks for generated bundles
   * focused package-data checks
   * focused material-data checks
   * focused access-resolution checks
   * focused filter checks
   * relevant Prettier checks
   * `git diff --check`

8. Verify build reproducibility:

   * run HTML assembly more than once
   * confirm generated package and material regions remain idempotent
   * confirm repeated assembly does not duplicate content

9. Start the project using the documented local verification server.

10. Use fresh Playwright Chromium contexts.

11. Clear or isolate:

    * service workers
    * Cache Storage
    * local storage
    * session storage
    * stale generated-page state

12. Test these pages:

    * `index.html`
    * `pakiety.html`
    * `materialy.html`

13. Test at minimum:

    * desktop: `1440 × 900`
    * mobile: `390 × 844`

14. Verify the homepage package section:

    * exactly the intended canonical packages appear
    * Start, Regular, and Intensive labels are consistent
    * package descriptions, benefits, prices, emphasis states, and CTA destinations match canonical data
    * no Pro package remains

15. Verify the package page:

    * all package cards are derived from canonical package data
    * package keys and labels match the homepage
    * package CTA links resolve correctly
    * no duplicated or conflicting commercial information remains

16. Verify homepage materials:

    * content is derived from canonical material data
    * tab panels contain expected records
    * material content is not independently duplicated manually
    * accessible manual-activation tab behavior remains intact

17. Verify the full materials catalogue:

    * all 15 records are present
    * category filters return expected records
    * level filters return expected records
    * access filters return expected records
    * combined filters return expected records
    * filter reset behavior remains correct

18. Verify CTA and access states:

    * real destinations use valid links
    * premium materials route through the centralized package/access contract
    * unavailable materials use honest informational or disabled states
    * no operational-looking action uses `href="#"`
    * no button or link appears actionable without an observable result
    * accessible names and explanations remain clear

19. Test with JavaScript disabled:

    * package information remains visible
    * homepage material information remains visible
    * full catalogue information remains visible
    * links remain usable
    * unavailable actions remain honest
    * essential content does not depend on runtime rendering

20. Test normal JavaScript-enhanced operation:

    * tabs work
    * filters work
    * package links work
    * material actions work according to their access state
    * no duplicated generated content appears

21. Verify:

    * no console errors
    * no uncaught page errors
    * no failed requests
    * no unexpected HTTP error responses
    * no broken local links
    * no accessibility-state contradictions

22. Confirm previous roadmap guarantees remain intact:

    * keyboard behavior
    * focus behavior
    * ARIA state
    * progressive enhancement
    * fail-open content
    * no hidden essential content

23. If a task-specific defect is found:

    * edit only the canonical source of truth
    * do not patch generated HTML or minified assets manually
    * rebuild all affected outputs
    * rerun every affected static and browser check

24. Attempt `npm run lint:js` only to confirm the existing ESLint 9 missing-configuration blocker.

25. Do not repair or expand the ESLint configuration during this task.

26. After every applicable acceptance criterion passes:

    * change only roadmap point 5 in `INITIAL-AUDIT.md` from `[ ]` to `[x]`
    * confirm roadmap points 6–10 remain unchecked

27. Stop the local verification server after testing.

CONSTRAINTS

* Do not restart roadmap point 5 from scratch.
* Do not redesign package cards, material cards, tabs, filters, or page layouts.
* Do not introduce Vite.
* Do not introduce frameworks, template engines, APIs, databases, authentication, payment systems, or backend logic.
* Do not introduce new dependencies.
* Do not modify dependency versions.
* Do not change `package.json`.
* Do not create `package-lock.json` or another lockfile.
* Do not invent package prices, benefits, URLs, downloads, or commercial claims.
* Do not add fake downloadable files.
* Do not restore `href="#"` actions.
* Do not move essential package or material content to JavaScript-only rendering.
* Do not duplicate canonical package or material records.
* Do not duplicate access-resolution rules across renderers or modules.
* Do not manually edit assembled HTML, minified CSS, minified JavaScript, or generated service-worker output.
* Do not modify the unrelated `PROMPT.md` change.
* Do not perform unrelated legal, SEO, PWA, theme, token, responsive, or visual-polish work.
* Do not repair the known ESLint 9 configuration blocker.
* Do not mark roadmap point 5 complete if production build or browser verification remains blocked.
* Do not mark any other roadmap point complete.
* Keep any required correction minimal, canonical, and review-friendly.

TECHNICAL RULES

* Canonical package keys must remain:

  * `start`
  * `regular`
  * `intensive`
* Public package labels must remain consistent across all views.
* Package commercial content must have one source of truth.
* Material metadata must remain centralized in `js/data/materials.js`.
* Material access and CTA decisions must remain centralized and deterministic.
* Build-time rendering must consume canonical data.
* Runtime JavaScript must enhance existing content rather than provide the only content source.
* No-JavaScript output must remain meaningful and usable.
* Real navigation must use links.
* Real actions must use buttons.
* Informational availability states must not be exposed as fake actions.
* Disabled states must have understandable accessible explanations.
* Access-resolution logic must remain independently testable where practical.
* Filters must operate against canonical data.
* Generated HTML must be reproducible and idempotent.
* Existing BEM naming, semantic HTML, CSS layers, keyboard behavior, focus behavior, and ARIA contracts must remain intact.
* Browser tests must use the latest generated HTML and production assets.
* Report only checks that were actually performed.

Acceptance criteria:

* production dependencies install without manifest or lockfile changes
* `npm run build` succeeds
* canonical production assets are regenerated successfully
* package keys are consistent everywhere
* Start, Regular, and Intensive are the only intended package labels
* no homepage Pro package remains
* homepage package cards derive from canonical package data
* package-page cards derive from canonical package data
* homepage material panels derive from canonical material data
* full catalogue derives from canonical material data
* no material content is independently duplicated across tab panels
* all 15 material records render correctly
* filter counts match expected canonical-data results
* combined filters match expected results
* every material CTA has a valid, disabled, or clearly explained state
* no operational-looking CTA uses `href="#"`
* premium materials reference valid package keys
* access rules remain centralized
* no-JavaScript package and material content remains visible and usable
* normal enhanced tabs and filters remain functional
* all tested pages load without console errors, page errors, failed requests, broken links, or unexpected HTTP responses
* generated output remains idempotent
* only roadmap point 5 is marked complete

OUTPUT EXPECTATION

Return a concise completion report with:

* current diff inspected
* canonical package, material, access, filtering, and rendering files identified
* unrelated `PROMPT.md` change preserved
* dependency installation command and result
* confirmation that manifests remained unchanged
* confirmation that no lockfile was created
* files changed during final correction, if any
* production build result
* HTML assembly and idempotence result
* final canonical package data contract
* final canonical material data contract
* centralized access-rule result
* package consistency results
* material catalogue results
* category, level, access, and combined-filter results
* CTA and `href="#"` results
* no-JavaScript result
* browser tooling used
* pages and viewport sizes tested
* keyboard, focus, ARIA, and progressive-enhancement regression results
* console, page-error, network, HTTP, and link results
* generated assets rebuilt
* ESLint blocker status
* confirmation that roadmap point 5 was marked complete, if all checks passed
* confirmation that roadmap points 6–10 remain unchecked
* any remaining blocker if completion was not possible

Do not include unrelated recommendations.
