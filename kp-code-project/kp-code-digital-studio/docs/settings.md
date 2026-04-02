# settings.md

## package.json

Detected in project root: `package.json`.

## npm scripts

### `build:css`

- Command: `node ./scripts/build-css.mjs`
- What it does: runs the standalone CSS build entry and writes the bundled stylesheet to `dist/css/main.min.css` through the shared build utilities.
- When to use it: when only CSS output needs rebuilding.

### `build:js`

- Command: `node ./scripts/build-js.mjs`
- What it does: runs the standalone JS build entry and writes the bundled script to `dist/js/main.min.js`.
- When to use it: when only JavaScript output needs rebuilding.

### `build:dist`

- Command: `node ./scripts/build-dist.mjs`
- What it does: removes `dist/`, builds CSS and JS, assembles HTML from shared partials, copies assets, copies SEO files, rewrites manifest icon paths for `dist`, and asserts that the bundled CSS and JS files exist.
- When to use it: for the full production-style build pipeline.

### `build`

- Command: `npm run build:dist`
- What it does: alias for the full distribution build.
- When to use it: as the default build command before preview or QA.

### `format`

- Command: `prettier . --write`
- What it does: formats repository files in place using Prettier and the configured plugins.
- When to use it: after source edits when you want repo-wide formatting applied.

### `format:check`

- Command: `prettier . --check`
- What it does: checks whether files match Prettier formatting without changing them.
- When to use it: before review or CI-style verification.

### `qa`

- Command: `npm run build && node ./scripts/qa/run-qa.mjs`
- What it does: performs a fresh build and then runs the repository QA checks against generated output.
- When to use it: when you want validation that `dist/` is assembled correctly and local references resolve.

### `preview`

- Command: `node ./scripts/preview-dist.mjs`
- What it does: starts a local HTTP server for the generated `dist/` output.
- When to use it: after building, when you want to inspect the final site locally.

### `build:preview`

- Command: `npm run build && npm run preview`
- What it does: performs a fresh build and then starts the preview server.
- When to use it: when you want a one-command build-and-preview workflow.

### `img:build`

- Command: `node ./scripts/images/build-images.mjs`
- What it does: reads `image.config.json`, processes source images with `sharp`, and writes optimized output variants.
- When to use it: after adding or updating images in the source image directories.

### `img:clean`

- Command: `node ./scripts/images/clean-images.mjs`
- What it does: removes and recreates the configured optimized-image output directory.
- When to use it: before regenerating image derivatives from scratch.

## QA layer

### `scripts/qa/check-dist-structure.mjs`

- What it checks: required files in `dist/`, including generated HTML pages, minified CSS/JS, and generated SEO files.
- Why it matters: catches incomplete or missing build output.

### `scripts/qa/check-html-assembly.mjs`

- What it checks: unresolved `@include:` placeholders, unresolved nav tokens, shared header/footer presence, and correct minified asset references in generated HTML.
- Why it matters: catches broken HTML assembly during build.

### `scripts/qa/check-local-refs.mjs`

- What it checks: local `href`, `src`, and `srcset` references in generated HTML resolve inside `dist/`.
- Why it matters: catches broken local asset and page references after build.

### `scripts/qa/run-qa.mjs`

- What it does: runs all QA checks, prints pass/fail output, and exits non-zero on failure.
- When to use it: indirectly through `npm run qa`.

## Build notes visible in source

- HTML build inventory comes from `*.html`, `services/**/*.html`, and `projects/**/*.html` (`scripts/build-utils.mjs:24`, `scripts/build-utils.mjs:64-69`).
- Shared header/footer assembly happens in `scripts/build-utils.mjs:140-167`.
- SEO files are copied to `dist/seo/`, while root `robots.txt` and `sitemap.xml` are also emitted into `dist/` (`scripts/build-utils.mjs:173-181`).
- Manifest icon paths are rewritten for `dist` in `scripts/build-utils.mjs:184-200`.
- Service worker registration was not detected in project source.
