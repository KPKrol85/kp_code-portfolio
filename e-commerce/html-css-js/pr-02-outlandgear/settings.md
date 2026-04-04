# Outland Gear — Build Settings

## Overview
This project uses a static front-end build pipeline designed around a `dist/`-only production output.

Source files remain the editable development baseline:
- HTML pages in the project root
- `css/main.css`
- `js/app.js`
- shared partials in `partials/`

Production assets are generated only into `dist/`, which is the sole deploy-ready output.

## Tooling
The current build pipeline defined in `package.json` uses:
- `postcss-cli`
- `postcss-import`
- `cssnano`
- `esbuild`
- `sharp`
- local Node.js scripts from `scripts/`

## Source Entrypoints
- CSS source entrypoint: `css/main.css`
- JavaScript source entrypoint: `js/app.js`
- Public HTML source pages: root-level `.html` files
- Shared layout partials: `partials/header.html`, `partials/footer.html`

## NPM Scripts

### `npm run clean:dist`
Removes the generated `dist/` directory.

### `npm run build:prepare`
Creates the base `dist/` structure required by build and watch commands.

### `npm run build:css`
Builds and minifies the main stylesheet from `css/main.css` into:
- `dist/css/main.min.css`

### `npm run build:js`
Bundles and minifies the application JavaScript from `js/app.js` into:
- `dist/js/app.min.js`

### `npm run build:images`
Builds production-ready images from `assets/img-src/` into:
- `dist/assets/img/`

Raster files are optimized for deployment, while `.svg` files from the image-source area are copied through without rasterization.

### `npm run build:html`
Builds the HTML layer into `dist/` by:
- copying public HTML pages
- switching HTML references from source assets to production assets
- inlining `partials/header.html`
- inlining `partials/footer.html`

The generated HTML in `dist/` does not depend on runtime partial fetching.

### `npm run build:assets`
Copies deployable static files into `dist/`, including:
- `assets/` except source image folders reserved for the image pipeline
- `data/`
- `robots.txt`
- `sitemap.xml`

### `npm run build`
Runs the full production build and creates a clean, deploy-ready `dist/`.

This is the main release command for the project.

### `npm run build:preview`
Builds the project and starts a local static preview server for `dist/` only.

This command is intended for realistic pre-deployment verification of the production build.

### `npm run watch:css`
Watches CSS source files and writes minified output to:
- `dist/css/main.min.css`

This command does not write minified output into source folders.

### `npm run watch:js`
Watches JavaScript source files and writes bundled/minified output to:
- `dist/js/app.min.js`

This command does not write minified output into source folders.

## Production Output Contract
The `dist/` directory is the only deployment target.

Expected production output includes:
- built HTML pages in `dist/`
- `dist/css/main.min.css`
- `dist/js/app.min.js`
- copied `assets/`
- generated `dist/assets/img/`
- copied `data/`
- copied `robots.txt`
- copied `sitemap.xml`

## Operational Notes
- Source files are not the production artifact.
- `assets/img-src/` is the editable source area for deployment images.
- Optimized deployment images are generated only into `dist/assets/img/`.
- Legacy minified files in source directories are not part of the target deployment workflow.
- Production preview must always serve `dist/`, not the source project.
- Any future build changes should preserve the same contract: editable source, deployable `dist/`.
