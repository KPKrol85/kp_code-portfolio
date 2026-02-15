# settings.md

## npm scripts (`package.json`)

### `start`
- **Command:** `npm run dev`
- **What it does:** Runs the local dev server (alias for `dev`)
- **When to use it:** Default local entrypoint

### `dev`
- **Command:** `live-server --port=15500 --open=index.html --quiet`
- **What it does:** Starts a static dev server on port `15500` and opens `index.html`
- **When to use it:** Local development for HTML/CSS/JS

### `build:css`
- **Command:** `postcss css/style.css --no-map -o css/style.min.css && node scripts/verify-css-build.js`
- **What it does:** Builds `css/style.min.css` via PostCSS (no sourcemaps) and fails if `@import` remains in the output
- **When to use it:** CSS production build verification

### `build:js`
- **Command:** `esbuild js/script.js --bundle --minify --target=es2018 --format=iife --outfile=js/script.min.js && node scripts/verify-js-build.js`
- **What it does:** Bundles + minifies JS to `js/script.min.js` (ES2018, IIFE) and fails if `import`/`export` remains in the output
- **When to use it:** JS production build verification

### `build`
- **Command:** `npm run build:css && npm run build:js`
- **What it does:** Runs the baseline KP_Code pipeline (CSS + JS) with post-build verification
- **When to use it:** Standard production build before deployment

### `watch:css`
- **Command:** `postcss css/style.css --watch --no-map -o css/style.min.css`
- **What it does:** Watches CSS entry and rebuilds `css/style.min.css` on change (no sourcemaps)
- **When to use it:** Fast CSS iteration during development

### `watch:js`
- **Command:** `esbuild js/script.js --bundle --minify --target=es2018 --format=iife --outfile=js/script.min.js --watch=forever`
- **What it does:** Watches JS entry and rebuilds `js/script.min.js` on change
- **When to use it:** Fast JS iteration during development

### `build:dist`
- **Command:** `node scripts/build-dist.js`
- **What it does:** Creates `dist`, copies project files (excluding `.git`, `node_modules`, `dist`), and rewrites HTML to use minified assets
- **When to use it:** Preparing the final distributable build artifact

### `format`
- **Command:** `prettier -w "**/*.{html,css,js,json,md}"`
- **What it does:** Formats files in-place using Prettier
- **When to use it:** Before committing to keep consistent formatting

### `format:check`
- **Command:** `prettier -c "**/*.{html,css,js,json,md}"`
- **What it does:** Checks formatting without writing changes
- **When to use it:** CI checks or pre-push validation

### `images:build`
- **Command:** `node scripts/images.js build`
- **What it does:** Generates production images in `assets/img` from sources in `assets/img-src` (sizes + formats)
- **When to use it:** After adding or updating source images

### `images:clean`
- **Command:** `node scripts/images.js clean`
- **What it does:** Removes generated image artifacts from the image pipeline
- **When to use it:** Full cleanup before regenerating images
