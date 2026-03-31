# Project settings

## Environment
- Project name: `volt-garage`
- Required Node.js version: `>=18`
- Package manager: `npm`
- Main source entrypoints:
  - HTML: [index.html](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/index.html)
  - CSS: [css/main.css](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/css/main.css)
  - JS: [js/main.js](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/js/main.js)
- Build output: [dist/](/C:/Users/KPKro/MY%20FILES/codex-playground/pr-01-voltgarage/dist)

## NPM scripts

| Script | Command | What it does | When to use it |
| --- | --- | --- | --- |
| `img:opt` | `node tools/image-optimizer/optimize-images.mjs --only=jpg` | Generates optimized image variants for JPG sources. | Use when updating JPG source assets and refreshing optimized outputs. |
| `img:opt:png` | `node tools/image-optimizer/optimize-images.mjs --only=png` | Generates optimized image variants for PNG sources. | Use when updating PNG source assets. |
| `img:opt:all` | `node tools/image-optimizer/optimize-images.mjs --only=all` | Runs the optimizer for all configured image source types. | Use for a full asset refresh. |
| `img:opt:out` | `node tools/image-optimizer/optimize-images.mjs --mode=output --out=tools/image-optimizer/output --only=all` | Writes optimized images to the tool output folder instead of the default asset targets. | Use when you want a non-destructive export or to inspect generated output before replacing assets. |
| `img:opt:dry` | `node tools/image-optimizer/optimize-images.mjs --dry-run --only=all` | Performs a dry run of image optimization without writing files. | Use before a bulk image update to inspect expected work. |
| `build:css` | `postcss css/main.css -o css/main.min.css --no-map -u postcss-import cssnano` | Bundles imported CSS partials and minifies them into `css/main.min.css`. | Use when preparing production CSS. |
| `build:js` | `esbuild js/main.js --bundle --minify --format=esm --platform=browser --target=es2022 --outfile=js/main.min.js` | Bundles and minifies the source JS into `js/main.min.js`. | Use when preparing production JS. |
| `build:assets` | `npm run build:css && npm run build:js` | Runs both CSS and JS production asset builds. | Use when only asset bundles need to be regenerated. |
| `build:dist` | `node scripts/build-dist.js` | Rebuilds `dist/`, copies required files/directories, assembles HTML partials, and rewrites source asset references to minified bundles. | Use when preparing the deployable package. |
| `build` | `npm run build:assets && npm run build:dist` | Produces minified assets and a full deployable `dist/` package. | Use for a complete production build. |
| `preview` | `node scripts/preview-dist.js` | Starts a local preview server for the built `dist/` package. | Use after `build` to review the deployable output locally. |
| `preview:dist` | `npm run preview` | Alias for the dist preview server. | Use if you prefer a more explicit preview script name. |
| `build:preview` | `npm run build && npm run preview` | Builds the project and immediately starts the local dist preview server. | Use for a full build-and-preview cycle. |
| `qa` | `npm run qa:html && npm run validate:jsonld && npm run qa:links && npm run qa:js && npm run qa:css` | Runs the main validation suite for HTML, JSON-LD, internal links, JS, and CSS. | Use before release or before merging substantive changes. |
| `qa:format` | `npm run format:check` | Alias for formatting verification. | Use in CI or before committing if you want a formatting-only check. |
| `qa:html` | `html-validate --config htmlvalidate.json index.html 404.html offline.html thank-you.html pages/cart.html pages/checkout.html pages/collections.html pages/contact.html pages/cookies.html pages/new-arrivals.html pages/polityka-prywatnosci.html pages/product.html pages/promotions.html pages/regulamin.html pages/shop.html` | Runs `html-validate` on the listed source pages. | Use for HTML validation; note that the page list currently contains stale filenames and should be aligned with the current route set. |
| `qa:js` | `eslint --max-warnings 0 "js/**/*.js" "scripts/**/*.js" "tools/**/*.mjs" --ignore-pattern "js/**/*.min.js"` | Lints source JS, scripts, and tool modules while excluding minified bundles. | Use after JS changes or before release. |
| `qa:css` | `stylelint --max-warnings 0 "css/**/*.css" --ignore-pattern "css/**/*.min.css"` | Lints source CSS while excluding minified bundles. | Use after CSS changes or before release. |
| `format` | `prettier . --write` | Formats the repository in place using Prettier. | Use when you want to normalize formatting across the project. |
| `format:html-tight` | `prettier --write "index.html" "404.html" "offline.html" "thank-you.html" "pages/**/*.html" && node scripts/format-html-tight.js` | Formats HTML files with Prettier and then tightens head spacing using the custom post-pass script. | Use after larger HTML edits if the project wants its established tighter head formatting. |
| `format:check` | `prettier . --check` | Verifies whether repository files already match Prettier formatting. | Use in CI or before commit without rewriting files. |
| `validate:jsonld` | `node scripts/validate-jsonld.js` | Parses JSON-LD blocks and checks template-specific schema expectations. | Use after changing metadata, schema output, or product structured-data logic. |
| `qa:links` | `node scripts/validate-internal-links.js` | Validates internal `href` targets across HTML source files. | Use after adding or renaming pages and links. |
| `qa:smoke` | `node scripts/qa-smoke-lighthouse.js` | Runs Lighthouse smoke checks in baseline/report mode. | Use for performance/accessibility/SEO smoke verification without strict failure gating. |
| `qa:smoke:enforce` | `node scripts/qa-smoke-lighthouse.js --enforce` | Runs the Lighthouse smoke check in enforcing mode. | Use in stricter QA contexts when you want threshold failures to break the run. |

## Operational notes
- `dist/` is a generated deployment package and should be treated separately from source review.
- The source HTML uses partial include comments such as `<!-- @include src/partials/header.html -->`; these are resolved only during `build:dist`.
- The deploy package expects minified assets `css/main.min.css` and `js/main.min.js` to exist before `build:dist` runs.
- Route inventory is not fully centralized yet; keep `package.json`, `sitemap.xml`, and `site.webmanifest` synchronized when pages are renamed.
