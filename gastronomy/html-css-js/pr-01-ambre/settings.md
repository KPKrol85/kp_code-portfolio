# npm scripts — opis projektu `pr-01-ambre`

Źródło: `package.json`.

## `build:css`
- **Command:** `postcss css/style.css -o css/style.min.css --no-map && node -e "..."`
- **Co robi:** Bundluje i minifikuje CSS do `css/style.min.css`, a następnie sprawdza, czy wynik nie zawiera `@import`.
- **Kiedy używać:** Przed commitem/release, po zmianach w plikach CSS.

## `build:js`
- **Command:** `esbuild js/script.js --bundle --minify --target=es2018 --outfile=js/script.min.js --log-level=warning && node -e "..."`
- **Co robi:** Bundluje moduły JS i minifikuje je do `js/script.min.js`; dodatkowo waliduje, że w pliku wynikowym nie została składnia `import`.
- **Kiedy używać:** Przed commitem/release, po zmianach w JS.

## `build`
- **Command:** `npm run build:css && npm run build:js`
- **Co robi:** Wykonuje pełny build front-endu (CSS + JS).
- **Kiedy używać:** Standardowy krok przygotowania artefaktów produkcyjnych.

## `watch:css`
- **Command:** `postcss css/style.css -o css/style.min.css --watch --no-map`
- **Co robi:** Obserwuje zmiany w CSS i na bieżąco przebudowuje `style.min.css`.
- **Kiedy używać:** Podczas aktywnej pracy nad stylami.

## `watch:js`
- **Command:** `esbuild js/script.js --bundle --minify --target=es2018 --outfile=js/script.min.js --watch`
- **Co robi:** Obserwuje zmiany w JS i na bieżąco przebudowuje bundel.
- **Kiedy używać:** Podczas aktywnej pracy nad logiką JS.

## `img:opt`
- **Command:** `node scripts/optimize-images.mjs`
- **Co robi:** Uruchamia pipeline optymalizacji obrazów zgodnie z logiką skryptu.
- **Kiedy używać:** Po dodaniu/zmianie obrazów źródłowych.

## `img:webp`
- **Command:** `node scripts/optimize-images.mjs --webp`
- **Co robi:** Generuje obrazy zoptymalizowane w formacie WebP.
- **Kiedy używać:** Gdy potrzebne są tylko artefakty WebP.

## `img:avif`
- **Command:** `node scripts/optimize-images.mjs --avif`
- **Co robi:** Generuje obrazy zoptymalizowane w formacie AVIF.
- **Kiedy używać:** Gdy potrzebne są tylko artefakty AVIF.

## `img:clean`
- **Command:** `node -e "require('fs').rmSync('assets/img/_optimized', { recursive: true, force: true })"`
- **Co robi:** Czyści katalog z wygenerowanymi obrazami `assets/img/_optimized`.
- **Kiedy używać:** Przed pełną regeneracją obrazów lub po błędnym buildzie assets.

## `img:verify`
- **Command:** `node scripts/img-verify.mjs`
- **Co robi:** Weryfikuje stan katalogu z obrazami zoptymalizowanymi.
- **Kiedy używać:** Kontrola jakości po optymalizacji obrazów.

## `qa`
- **Command:** `npm run qa:links && npm run qa:html && npm run qa:js && npm run qa:css`
- **Co robi:** Uruchamia pełen zestaw kontroli jakości: linki, HTML, JS, CSS.
- **Kiedy używać:** Przed mergem/release.

## `qa:links`
- **Command:** `node scripts/qa-links.mjs`
- **Co robi:** Waliduje linki, zasoby i anchory (`href`, `src`, `srcset`) na zdefiniowanych stronach HTML.
- **Kiedy używać:** Po zmianach w nawigacji, ścieżkach lub obrazach.

## `qa:html`
- **Command:** `html-validate index.html menu.html galeria.html cookies.html polityka-prywatnosci.html regulamin.html 404.html offline.html`
- **Co robi:** Waliduje HTML wskazanych stron.
- **Kiedy używać:** Po zmianach w strukturze i semantyce HTML.

## `qa:js`
- **Command:** `eslint --max-warnings 0 "js/**/*.js" "scripts/**/*.mjs"`
- **Co robi:** Lintuje JS i skrypty narzędziowe; ostrzeżenia traktuje jak błąd.
- **Kiedy używać:** Po każdej zmianie JS.

## `qa:css`
- **Command:** `stylelint --max-warnings 0 "css/**/*.css"`
- **Co robi:** Lintuje wszystkie pliki CSS; ostrzeżenia traktuje jak błąd.
- **Kiedy używać:** Po każdej zmianie stylów.
