# npm scripts — usage guide

Źródło: `package.json`

## 1) `build:css`
- **Command:** `postcss css/style.css -o css/style.min.css --no-map`
- **What it does:**
  - składa modułowe importy CSS do jednego pliku,
  - uruchamia pipeline PostCSS,
  - generuje wynikowy plik produkcyjny `css/style.min.css` bez source map.
- **When to use:**
  - po zmianach w plikach `css/**`,
  - przed publikacją lub testem finalnego bundle CSS.

## 2) `build:js`
- **Command:** `esbuild js/script.js --bundle --minify --outfile=js/script.min.js --target=es2018`
- **What it does:**
  - bundluje moduły JavaScript z punktu wejścia `js/script.js`,
  - minifikuje output,
  - zapisuje produkcyjny plik `js/script.min.js`,
  - targetuje kompatybilność `es2018`.
- **When to use:**
  - po zmianach w `js/**`,
  - przed wdrożeniem.

## 3) `build`
- **Command:** `npm run build:css && npm run build:js`
- **What it does:**
  - wykonuje pełny build frontendu (najpierw CSS, potem JS).
- **When to use:**
  - jako standardowy krok release,
  - lokalnie do szybkiej weryfikacji artefaktów produkcyjnych.

## 4) `images:build`
- **Command:** `node scripts/images/build-images.js`
- **What it does:**
  - uruchamia skrypt optymalizacji/generowania obrazów,
  - przygotowuje warianty formatów i rozdzielczości używane przez `picture/srcset`.
- **When to use:**
  - po dodaniu nowych obrazów źródłowych,
  - gdy zmienia się strategia formatów lub rozmiarów assetów.

## 5) `dev:server`
- **Command:** `http-server -p 5173 -c-1`
- **What it does:**
  - uruchamia statyczny serwer developerski na porcie `5173`,
  - wyłącza cache (`-c-1`) dla wygodniejszego debugowania zmian.
- **When to use:**
  - podczas lokalnego podglądu i ręcznych testów UI,
  - do szybkiej walidacji builda bez pełnego środowiska CI/CD.
