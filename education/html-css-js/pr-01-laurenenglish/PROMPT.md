You are a senior frontend tooling developer working on the Lauren English project.

PROJECT CONTEXT

You are working in the currently opened `education-pr01-laurenenglish` project.

Read the current repository state and authoritative documentation before editing, especially:

- `CONTEXT-PROJECT.md`
- `README.md`
- `INITIAL-AUDIT.md`
- `package.json`
- `scripts/shared-shell.mjs`
- `scripts/build-html.mjs`
- `scripts/site-config.mjs`
- `scripts/content-renderers.mjs`
- `scripts/pwa-config.mjs`
- `service-worker.template.js`
- `playwright.config.mjs`
- existing HTML, PWA, SEO, and browser validation scripts

All ten initial audit points are complete. Do not modify `INITIAL-AUDIT.md`.

The current runtime loads generated assets from:

- `/assets/build/style.min.css`
- `/assets/build/main.min.js`

This task intentionally replaces that temporary pre-Vite runtime contract with direct canonical source loading:

- `/css/style.css`
- `/js/main.js`

The project will migrate to Vite and a generated `dist` directory later. Do not introduce Vite during this task.

Preserve unrelated working-tree changes, including `PROMPT.md`.

TASK OBJECTIVE

Create a simple source-first development and current static-deployment workflow.

The final project must:

- load `/css/style.css` directly
- load `/js/main.js` directly as an ES module
- no longer depend on `/assets/build/style.min.css` or `/assets/build/main.min.js` at runtime
- provide a clickable Windows launcher
- run a Python development server on port `8181`
- open the browser automatically
- reload the browser when relevant project files change
- regenerate shared HTML automatically when shell, metadata, package, or material sources change
- disable Service Worker interference on the local `8181` development origin
- preserve the existing shared shell, data renderers, SEO, PWA, accessibility, and Playwright architecture
- keep Netlify compatible with publishing the repository root

IMPLEMENTATION PLAN

1. Inspect the current working tree, package scripts, HTML head generation, asset paths, CSS imports, JavaScript import graph, PWA precache, tests, and deployment configuration.

2. Confirm that `css/style.css` contains browser-compatible CSS imports and that `js/main.js` can run directly through `<script type="module">`.

3. If PostCSS-only syntax prevents direct browser loading, make only the smallest standards-compatible source correction required. Do not redesign or broadly refactor CSS.

4. Update the canonical HTML/head generation source so all eight HTML documents load:

   `<link rel="stylesheet" href="/css/style.css" />`

   `<script type="module" src="/js/main.js"></script>`

5. Regenerate HTML through the existing assembler. Do not manually maintain duplicated asset tags across generated pages.

6. Remove runtime references and validation expectations for:

   - `/assets/build/style.min.css`
   - `/assets/build/main.min.js`

7. Do not delete `assets/build/` files unless they are confirmed unused, their repository policy is understood, and deletion is necessary for a clean final contract. Report the decision explicitly.

8. Refactor package scripts so normal development and current static deployment do not require CSS or JavaScript bundling.

9. Preserve the HTML assembler, SEO route generation, sitemap, robots, manifest, screenshot tooling, and Service Worker generation.

10. Add a standard-library-only Python development server, preferably:

    `scripts/dev-server.py`

11. Add a clickable Windows launcher at the project root:

    `start-dev.bat`

12. The launcher must:

    - run from the project root regardless of where it was double-clicked
    - try `py -3` and then `python`
    - show a clear error if Python is unavailable
    - detect whether port `8181` is already occupied
    - run the required initial shared HTML assembly
    - start the Python server on `127.0.0.1:8181`
    - open the default browser at `http://127.0.0.1:8181/`
    - remain open while the server is active
    - stop cleanly with Ctrl+C

13. The Python server must:

    - serve the project root
    - use only the Python standard library
    - send development-safe no-cache headers
    - preserve correct MIME types for CSS, JS modules, fonts, SVG, PNG, WebP, JSON, and web manifest files
    - preserve useful local 404 behavior
    - provide automatic full-page reload without modifying committed HTML with development-only markup
    - avoid exposing machine-specific paths

14. Implement lightweight live reload through a focused server endpoint and runtime-injected development script, using either server-sent events or efficient polling.

15. Watch relevant source files while excluding:

    - `.git/`
    - `node_modules/`
    - `assets/build/`
    - Playwright reports and test artifacts
    - generated `service-worker.js`
    - temporary editor files

16. Directly reload the browser when regular HTML, CSS, JavaScript, image, font, or manifest files change.

17. When canonical generated-content sources change, run `npm run build:html` before browser reload.

18. At minimum, treat these areas as HTML-generation dependencies:

    - `scripts/shared-shell.mjs`
    - `scripts/site-config.mjs`
    - `scripts/content-renderers.mjs`
    - relevant package, material, access, and filter data sources

19. Prevent rebuild loops caused by generated HTML changes.

20. If HTML generation fails:

    - keep the server running
    - print the command failure clearly
    - do not reload the browser with a knowingly stale generated state
    - wait for the next source change

21. Disable Service Worker registration on `localhost` and `127.0.0.1` when using port `8181`.

22. Clean up an existing Lauren English Service Worker registration and only Lauren English project caches on the `8181` development origin when necessary.

23. Do not weaken production Service Worker registration or cache behavior.

24. Update the PWA source-of-truth configuration so offline production behavior uses the actual direct runtime asset contract.

25. Include only CSS and JavaScript source files actually requested by production pages and required for the documented offline behavior.

26. Do not blindly precache entire directories.

27. Update deterministic PWA validation, critical request budgets, and Service Worker fingerprinting for the direct CSS import and JavaScript module graphs.

28. Preserve:

    - real online 404 responses
    - exact offline primary-page behavior
    - scoped cache cleanup
    - manifest shortcuts and screenshots
    - SEO metadata
    - local fonts
    - accessible themes and interactions

29. Update permanent checks and Playwright expectations so they assert:

    - `/css/style.css` returns `200`
    - `/js/main.js` returns `200` as a module
    - all required imported CSS and JavaScript modules return `200`
    - no page requests `/assets/build/style.min.css`
    - no page requests `/assets/build/main.min.js`
    - there are no missing module or MIME errors
    - no remote runtime dependency is introduced

30. Add a focused deterministic development-workflow check if useful, without creating a large test framework.

31. Verify the Python server on port `8181`:

    - starts from `start-dev.bat`
    - serves all primary pages
    - serves source CSS and JavaScript correctly
    - sends no-cache headers
    - exposes a working live-reload connection
    - reloads after a normal source change
    - runs HTML assembly before reload after a shared-shell or data-source change

32. Inspect any repository-owned Netlify configuration.

33. Ensure the intended deployment contract is documented as:

    - repository root published directly
    - runtime CSS at `/css/style.css`
    - runtime JavaScript at `/js/main.js`
    - no `dist` directory before the future Vite migration

34. Do not guess or claim control over Netlify dashboard settings that are not stored in the repository. Document the required dashboard values when applicable.

35. Update `README.md` and `docs/runtime-checklist.md` with:

    - how to start development by double-clicking `start-dev.bat`
    - the `8181` URL
    - automatic reload behavior
    - which changes trigger HTML regeneration
    - Service Worker behavior during local development
    - the direct source runtime contract
    - current Netlify publish settings
    - the distinction between the present workflow and the future Vite `dist` workflow

36. Keep current static validation commands and project-local Playwright coverage working.

37. Run all relevant verification, including:

    - HTML assembly and idempotence
    - data checks
    - content checks
    - HTML checks
    - CSS checks
    - SEO checks
    - PWA checks
    - JavaScript syntax checks
    - focused source-runtime browser checks
    - complete Playwright E2E suite
    - relevant Prettier checks
    - `git diff --check`

38. Do not modify `INITIAL-AUDIT.md`.

CONSTRAINTS

- Do not introduce Vite.
- Do not create a `dist` directory.
- Do not add a Node development-server dependency.
- Do not add a Python package dependency.
- Use only the Python standard library for the new server.
- Do not redesign the website.
- Do not change public content.
- Do not change fonts, colors, layout, navigation, or component behavior.
- Do not remove the shared shell or canonical data architecture.
- Do not replace the existing HTML assembler.
- Do not duplicate shared header, footer, metadata, package, or material content.
- Do not allow Service Worker caching to interfere with local development.
- Do not disable the production PWA.
- Do not use global `overflow` or unrelated CSS workarounds.
- Do not manually edit minified output or generated `service-worker.js`.
- Do not create machine-specific absolute paths.
- Do not create temporary test harnesses outside the project.
- Do not modify completed audit states.
- Preserve unrelated working-tree changes.
- Keep the diff focused and review-friendly.

TECHNICAL RULES

- `css/style.css` remains the canonical CSS entry.
- `js/main.js` remains the canonical JavaScript entry.
- Load `js/main.js` with `type="module"`.
- Use root-relative runtime asset paths.
- Keep CSS imports and JavaScript module imports browser-valid.
- Use no-cache development response headers.
- Keep live reload development-only.
- Do not commit injected live-reload markup into HTML.
- Avoid rebuild loops.
- Run shared HTML generation only for relevant dependencies.
- Keep server logging concise and useful.
- Preserve correct local MIME types.
- Preserve semantic HTML, accessibility, progressive enhancement, responsive behavior, SEO, and PWA guarantees.
- Use existing project-local Playwright infrastructure.
- Report only verification actually performed.

OUTPUT EXPECTATION

Return a concise summary with:

- files and scripts inspected
- previous runtime asset contract
- final runtime asset contract
- HTML/head generation changes
- package script changes
- Python server file created
- Windows launcher created
- port and browser-opening behavior
- live-reload implementation
- watched and excluded paths
- shared-shell and data regeneration behavior
- Service Worker development isolation
- PWA precache and request-budget changes
- Netlify repository configuration or required dashboard settings
- validators and Playwright tests updated
- files changed
- generated files rebuilt
- static checks executed
- Python `8181` verification result
- full E2E result
- confirmation that no `/assets/build` runtime requests remain
- confirmation that `INITIAL-AUDIT.md` was unchanged
- confirmation that unrelated changes were preserved
- any blocker encountered

Do not include unrelated recommendations.
