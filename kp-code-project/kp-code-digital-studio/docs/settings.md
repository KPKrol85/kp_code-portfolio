# settings.md

## package.json

Detected in project root: `package.json`.

## Scripts

### `build:css`

- Command: `node ./scripts/build-css.mjs`
- What it does: runs the standalone CSS build entry, which delegates to the shared build utilities.
- When to use it: use when you want to regenerate CSS output without running the full site build.

### `build:js`

- Command: `node ./scripts/build-js.mjs`
- What it does: runs the standalone JavaScript build entry, which delegates to the shared build utilities.
- When to use it: use when you only need to rebuild JavaScript output.

### `build:dist`

- Command: `node ./scripts/build-dist.mjs`
- What it does: removes the existing `dist/`, builds CSS and JS, copies HTML and assets, copies SEO files, fixes manifest icon paths in `dist/`, and verifies the generated CSS/JS files exist.
- When to use it: use for the full production build pipeline.

### `build`

- Command: `npm run build:dist`
- What it does: alias for the full distribution build.
- When to use it: use as the default build command for local production preparation or deployment packaging.

### `preview`

- Command: `node ./scripts/preview-dist.mjs`
- What it does: starts a local HTTP server that serves the generated `dist/` folder, after verifying that `dist/index.html` exists.
- When to use it: use after a build when you want to inspect the generated output locally.

### `build:preview`

- Command: `npm run build && npm run preview`
- What it does: runs the full build and then immediately starts the preview server.
- When to use it: use when you want a one-command build-and-check workflow.

### `img:build`

- Command: `node ./scripts/images/build-images.mjs`
- What it does: runs the image optimization pipeline for source images.
- When to use it: use after adding or replacing image assets that need optimized output variants.

### `img:clean`

- Command: `node ./scripts/images/clean-images.mjs`
- What it does: removes generated image outputs from the image build pipeline target directory.
- When to use it: use before regenerating image assets from scratch or when cleaning outdated optimized files.

## Runtime and tooling notes

- Required Node version: `>=18.0.0`
- Declared dependencies: `esbuild`, `fast-glob`, `lightningcss`, `sharp`
- Main build entry: `scripts/build-dist.mjs`
- Preview server default port: `4173` unless overridden by `PORT`

## Deployment-related behavior visible in scripts

- SEO files are copied into both `dist/seo/` and the root of `dist/` as `robots.txt` and `sitemap.xml` (`scripts/build-utils.mjs:118-127`).
- Manifest icon paths are rewritten during build so the generated `dist/assets/icons/site.webmanifest` points at `/assets/icons/...` (`scripts/build-utils.mjs:129-145`).
