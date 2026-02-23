# settings.md — npm scripts (`pr-01-ambre`)

Źródło: `package.json`.

## `build:css`
- **script name:** `build:css`
- **command:** `postcss css/style.css -o css/style.min.css --no-map && node -e "..."`
- **what it does:** Bundluje i minifikuje CSS do `css/style.min.css`, następnie sprawdza, czy wynik nie zawiera `@import`.
- **when to use it:** Po zmianach w CSS, przed releasem.

## `build:js`
- **script name:** `build:js`
- **command:** `esbuild js/script.js --bundle --minify --target=es2018 --outfile=js/script.min.js --log-level=warning && node -e "..."`
- **what it does:** Bundluje i minifikuje JS do `js/script.min.js`, a potem waliduje brak składni `import` w bundle.
- **when to use it:** Po zmianach w JS, przed releasem.

## `build`
- **script name:** `build`
- **command:** `npm run build:css && npm run build:js`
- **what it does:** Wykonuje pełny build assetów (CSS + JS).
- **when to use it:** Standardowy build release.

## `watch:css`
- **script name:** `watch:css`
- **command:** `postcss css/style.css -o css/style.min.css --watch --no-map`
- **what it does:** Obserwuje pliki CSS i automatycznie przebudowuje bundle CSS.
- **when to use it:** Podczas pracy nad stylami.

## `watch:js`
- **script name:** `watch:js`
- **command:** `esbuild js/script.js --bundle --minify --target=es2018 --outfile=js/script.min.js --watch`
- **what it does:** Obserwuje pliki JS i automatycznie przebudowuje bundle JS.
- **when to use it:** Podczas pracy nad logiką JS.

## `img:opt`
- **script name:** `img:opt`
- **command:** `node scripts/optimize-images.mjs`
- **what it does:** Uruchamia optymalizację obrazów wg konfiguracji skryptu.
- **when to use it:** Po dodaniu/zmianie obrazów.

## `img:webp`
- **script name:** `img:webp`
- **command:** `node scripts/optimize-images.mjs --webp`
- **what it does:** Generuje zoptymalizowane warianty WebP.
- **when to use it:** Gdy potrzebujesz tylko WebP.

## `img:avif`
- **script name:** `img:avif`
- **command:** `node scripts/optimize-images.mjs --avif`
- **what it does:** Generuje zoptymalizowane warianty AVIF.
- **when to use it:** Gdy potrzebujesz tylko AVIF.

## `img:clean`
- **script name:** `img:clean`
- **command:** `node -e "require('fs').rmSync('assets/img/_optimized', { recursive: true, force: true })"`
- **what it does:** Usuwa katalog `assets/img/_optimized`.
- **when to use it:** Przed pełną regeneracją obrazów.

## `img:verify`
- **script name:** `img:verify`
- **command:** `node scripts/img-verify.mjs`
- **what it does:** Weryfikuje obecność i strukturę plików w `assets/img/_optimized`.
- **when to use it:** Po optymalizacji obrazów i przed audytem wydajności.

## `qa`
- **script name:** `qa`
- **command:** `npm run qa:links && npm run qa:seo && npm run qa:a11y && npm run qa:lighthouse && npm run qa:html && npm run qa:js && npm run qa:css`
- **what it does:** Uruchamia pełny pakiet kontroli jakości.
- **when to use it:** Przed merge/release.

## `qa:links`
- **script name:** `qa:links`
- **command:** `node scripts/qa-links.mjs`
- **what it does:** Sprawdza linki wewnętrzne/zewnętrzne, anchory i ścieżki assetów.
- **when to use it:** Po zmianach w HTML, nawigacji i zasobach.

## `qa:seo`
- **script name:** `qa:seo`
- **command:** `node scripts/qa-seo.mjs`
- **what it does:** Waliduje kluczowe elementy SEO technicznego (meta, canonical, OG, robots/sitemap, itp.).
- **when to use it:** Po zmianach w `<head>`, treściach SEO i konfiguracji indeksowania.

## `qa:html`
- **script name:** `qa:html`
- **command:** `html-validate index.html menu.html galeria.html cookies.html polityka-prywatnosci.html regulamin.html 404.html offline.html`
- **what it does:** Waliduje poprawność i semantykę HTML wskazanych stron.
- **when to use it:** Po zmianach w strukturze HTML.

## `qa:js`
- **script name:** `qa:js`
- **command:** `eslint --max-warnings 0 "js/**/*.js" "scripts/**/*.mjs"`
- **what it does:** Lintuje JS i skrypty narzędziowe; ostrzeżenia traktowane są jako błąd.
- **when to use it:** Po każdej zmianie JS.

## `qa:css`
- **script name:** `qa:css`
- **command:** `stylelint --max-warnings 0 "css/**/*.css"`
- **what it does:** Lintuje CSS; ostrzeżenia traktowane są jako błąd.
- **when to use it:** Po każdej zmianie CSS.

## `qa:a11y`
- **script name:** `qa:a11y`
- **command:** `node scripts/qa-a11y.mjs`
- **what it does:** Uruchamia automatyczny skan dostępności (Playwright + axe) dla stron projektu.
- **when to use it:** Po zmianach w komponentach interaktywnych i semantyce.

## `qa:lighthouse`
- **script name:** `qa:lighthouse`
- **command:** `lhci autorun --config=./lighthouserc.json`
- **what it does:** Uruchamia Lighthouse CI wg konfiguracji `lighthouserc.json`.
- **when to use it:** Przed releasem lub przy optymalizacji performance/SEO/best practices.
