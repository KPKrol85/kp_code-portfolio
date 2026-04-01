# settings.md

## package.json

Detected in project root: `package.json`.

## npm Scripts

### `build:css`

- Command: `node ./scripts/build-css.mjs`
- What it does: runs the standalone CSS build entry, which delegates to the shared build utilities and writes the generated CSS bundle into `dist/css/`.
- When to use it: use when you only need to rebuild CSS output during source-layer work.

### `build:js`

- Command: `node ./scripts/build-js.mjs`
- What it does: runs the standalone JS build entry, which delegates to the shared build utilities and writes the generated JS bundle into `dist/js/`.
- When to use it: use when you only need to rebuild JavaScript output.

### `build:dist`

- Command: `node ./scripts/build-dist.mjs`
- What it does: removes the previous `dist/`, builds CSS and JS, assembles source HTML into final pages, copies assets, copies SEO files, rewrites manifest icon paths for `dist`, and verifies that generated CSS/JS output exists.
- When to use it: use for the full production-style build pipeline.

### `build`

- Command: `npm run build:dist`
- What it does: alias for the full distribution build.
- When to use it: use as the default project build command before previewing or packaging the site.

### `qa`

- Command: `npm run build && node ./scripts/qa/run-qa.mjs`
- What it does: runs a fresh build and then validates `dist` using the repository QA layer.
- When to use it: use when you want post-build confidence that generated output is structurally correct and local references resolve.

### `preview`

- Command: `node ./scripts/preview-dist.mjs`
- What it does: starts a local HTTP server for the generated `dist/` output and verifies that `dist/index.html` exists before serving.
- When to use it: use after a build when you want to inspect the final generated site locally.

### `build:preview`

- Command: `npm run build && npm run preview`
- What it does: performs a fresh build and immediately starts the local preview server.
- When to use it: use when you want a one-command build-and-preview workflow.

### `img:build`

- Command: `node ./scripts/images/build-images.mjs`
- What it does: reads `image.config.json`, scans source images, resizes them to configured widths, and writes optimized output variants to the configured output directory using `sharp`.
- When to use it: use after adding or replacing images in `assets/img/img_src/`.

### `img:clean`

- Command: `node ./scripts/images/clean-images.mjs`
- What it does: removes and recreates the configured image output directory.
- When to use it: use before regenerating optimized image assets from scratch.

## What the QA Layer Checks

### `scripts/qa/check-dist-structure.mjs`

- What it validates: required files in `dist/` such as HTML entry pages, `css/main.min.css`, `js/main.min.js`, root `robots.txt`, root `sitemap.xml`, and the generated manifest.
- Why it exists: catches incomplete or missing build output.

### `scripts/qa/check-html-assembly.mjs`

- What it validates: unresolved `@include:` placeholders, unresolved nav tokens, shared header/footer presence, and minified CSS/JS references in generated HTML.
- Why it exists: catches partial assembly failures and source-vs-output HTML mistakes.

### `scripts/qa/check-local-refs.mjs`

- What it validates: local `href`, `src`, and `srcset` targets in generated HTML resolve inside `dist/`, while ignoring external URLs, `mailto:`, `tel:`, fragment-only references, and similar non-local values.
- Why it exists: catches broken local references after build.

### `scripts/qa/run-qa.mjs`

- What it does: runs all QA checks, prints a compact pass/fail summary, and exits with a non-zero code when any check fails.
- When to use it: indirectly through `npm run qa`.

## Runtime and Tooling Notes

- Required Node version: `>=18.0.0`
- Declared runtime/tooling dependencies: `esbuild`, `fast-glob`, `lightningcss`, `sharp`
- Main build entry: `scripts/build-dist.mjs`
- Preview server default port: `4173`, overridable through `PORT`

## Build and Deployment Notes Visible in Source

- Public HTML inventory is derived from root pages plus `services/**/*.html` and `projects/**/*.html` (`scripts/build-utils.mjs:24-27`).
- Header and footer are injected from `src/partials/header.html` and `src/partials/footer.html` during HTML assembly (`scripts/build-utils.mjs:21-22`, `scripts/build-utils.mjs:146-156`).
- SEO files are copied into `dist/seo/`, while root `robots.txt` and `sitemap.xml` are also written into `dist/` (`scripts/build-utils.mjs:177-185`).
- Manifest icon paths are rewritten during build so generated manifest entries point at `/assets/icons/...` (`scripts/build-utils.mjs:188-203`).
- Service worker registration was not detected in project source.
- Deployment-specific config files such as `_headers`, `_redirects`, `netlify.toml`, and `vercel.json` were not detected in project source.
