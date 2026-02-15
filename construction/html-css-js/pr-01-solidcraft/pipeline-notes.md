# Pipeline Notes

## Detected Entrypoints
- CSS entrypoint: `css/style.css`
- JS entrypoint: `js/script.js`

## Final Script List
- `build:css`: `postcss css/style.css --no-map -o css/style.min.css && node scripts/verify-css-build.js`
- `build:js`: `esbuild js/script.js --bundle --minify --target=es2018 --format=iife --outfile=js/script.min.js && node scripts/verify-js-build.js`
- `build`: `npm run build:css && npm run build:js`
- `watch:css`: `postcss css/style.css --watch --no-map -o css/style.min.css`
- `watch:js`: `esbuild js/script.js --bundle --minify --target=es2018 --format=iife --outfile=js/script.min.js --watch=forever`
- `build:dist`: `node scripts/build-dist.js`

## Files Modified (paths only)
- `package.json`
- `package-lock.json`
- `postcss.config.js`
- `scripts/verify-css-build.js`
- `scripts/verify-js-build.js`
- `pipeline-notes.md`
- `css/style.min.css`
- `js/script.min.js`
