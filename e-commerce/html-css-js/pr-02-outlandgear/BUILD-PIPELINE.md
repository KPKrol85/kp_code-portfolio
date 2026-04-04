# Outland Gear build pipeline notes

## Detected source entrypoints
- CSS source entrypoint: `css/main.css`
- JavaScript source entrypoint: `js/app.js`
- Public source pages: root-level `.html` files
- Shared source partials: `partials/header.html`, `partials/footer.html`

## Installed tooling reused in the pipeline
- `postcss-cli`
- `postcss-import`
- `cssnano`
- `esbuild`
- Node.js scripts in `scripts/`

## Dist build workflow
- `npm run build` → creates a clean deploy-ready `dist/`
- `npm run build:css` → outputs minified CSS to `dist/css/main.min.css`
- `npm run build:js` → outputs bundled/minified JS to `dist/js/app.min.js`
- `npm run build:html` → copies/transforms HTML into `dist/`
- `npm run build:assets` → copies deployable static assets/data into `dist/`
- `npm run build:preview` → builds `dist/` and serves it locally

## Generated production outputs
- `dist/css/main.min.css`
- `dist/js/app.min.js`
- copied public HTML pages in `dist/`
- copied `assets/`, `data/`, `robots.txt`, `sitemap.xml`

## HTML handling in dist
- Built HTML references `css/main.min.css` and `js/app.min.js`
- Header/footer partials are inlined into built HTML
- Built pages do not depend on runtime `partials/*.html` fetches

## Development workflow
- Source files remain the editable baseline
- `watch:css` and `watch:js` write minified output to `dist/`, not source folders
- `css/main.min.css` and `js/app.min.js` in source are legacy artifacts, not deployment targets
