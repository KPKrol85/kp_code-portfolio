# settings.md

## Project Settings Overview

- Project type: static multi-page front-end website
- Main package file: `package.json`
- Package manager: npm
- Build stack from repository evidence: PostCSS, esbuild, Sharp, Playwright, axe-core
- Deployment evidence: Netlify headers and redirects

## npm Scripts

| Script name | Command | What it does | When to use it |
|---|---|---|---|
| `build:css` | `postcss ./css/style.css -o ./css/style.min.css && node ./scripts/verify-build.mjs css ./css/style.min.css` | Builds the main CSS entry with PostCSS into `css/style.min.css`, then runs the local verification script against the generated file. | Use after editing source CSS modules or before preparing a production build. |
| `build:js` | `esbuild ./js/script.js --bundle --minify --target=es2018 --format=iife --outfile=./js/script.min.js && node ./scripts/verify-build.mjs js ./js/script.min.js` | Bundles and minifies the main JS entry into `js/script.min.js`, then verifies the generated bundle. | Use after editing JS modules or before creating production output. |
| `build` | `npm run build:css && npm run build:js && npm run build:dist` | Runs the CSS build, JS build, and then the `dist` build. In the current repository state, this script produces both minified source assets and the deployable `dist/` folder. | Use for the standard full build workflow before deployment or final QA. |
| `dist:clean` | `node ./scripts/build-dist.mjs --clean` | Removes the generated `dist/` folder. | Use when you want to reset deployment output before a fresh dist build. |
| `build:dist` | `node ./scripts/build-dist.mjs` | Generates the `dist/` folder from repository sources, rewrites copied HTML for production assets, and copies deployable files only. | Use when you need a static deployment package. |
| `watch:css` | `postcss ./css/style.css -o ./css/style.min.css -w` | Watches the CSS entry and rebuilds the minified stylesheet on change. | Use during CSS development. |
| `watch:js` | `esbuild ./js/script.js --bundle --minify --target=es2018 --format=iife --outfile=./js/script.min.js --watch` | Watches the JS entry and rebuilds the minified bundle on change. | Use during JavaScript development. |
| `img:opt` | `node scripts/optimize-images.mjs` | Runs the image optimization pipeline defined in `scripts/optimize-images.mjs`. | Use after adding or updating source images. |
| `img:clean` | `node scripts/optimize-images.mjs --clean` | Removes optimized-image output managed by the image pipeline. | Use before regenerating optimized images from scratch. |
| `img:watch` | `node scripts/optimize-images.mjs --watch` | Watches image sources and reruns optimization when files change. | Use while actively working on image assets. |
| `test` | `echo "Error: no test specified" && exit 1` | Placeholder script that intentionally exits with an error. It does not run project tests. | Do not use as a QA signal in the current repository state; replace only if the testing strategy changes. |
| `check:links` | `node scripts/check-link-integrity.mjs` | Scans root HTML files and `sitemap.xml` for missing local references. | Use before release, after renaming files, or after editing page links and asset references. |
| `test:a11y` | `npm exec --yes --package=playwright@1.54.2 --package=axe-core@4.10.3 node scripts/a11y-axe.mjs` | Starts the local accessibility scenario runner with Playwright and axe-core, testing selected pages and UI states. | Use for accessibility regression checks before deployment or after editing templates and interactive components. |

## Operational Notes

- `build` now includes `build:dist`, so a normal build also regenerates the deployment folder.
- Source HTML currently references `css/style.css` and `js/script.js`; the dedicated dist builder handles production rewrites for deployment output.
- `test:a11y` relies on Playwright and axe-core resolution through `npm exec`, even though related packages are also present in `devDependencies`.
- The repository contains additional documentation under `doc/`, but the active npm workflow is defined by the root `package.json`.
