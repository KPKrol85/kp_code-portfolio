# Settings

## package.json

Plik `package.json` został wykryty w repozytorium.

### Skrypty npm

#### `img:build`

- Command: `node ./scripts/images/build-images.mjs`
- What it does: uruchamia skrypt Node budujący zoptymalizowane warianty obrazów. Repozytorium używa do tego zależności `sharp` i `fast-glob` (`package.json:5`, `package.json:8-10`).
- When to use it: po dodaniu nowych obrazów źródłowych albo po zmianie konfiguracji pipeline obrazu, gdy trzeba odtworzyć warianty wyjściowe.

#### `img:clean`

- Command: `node ./scripts/images/clean-images.mjs`
- What it does: uruchamia skrypt czyszczący wygenerowane obrazy z katalogu wyjściowego (`package.json:6`).
- When to use it: przed pełnym przebudowaniem obrazów albo gdy trzeba usunąć stare artefakty wygenerowane przez pipeline.

## Additional notes

- Nie wykryto skryptów `dev`, `start`, `build`, `preview` ani `test`.
- Repozytorium nie deklaruje bundlera front-endowego.
- Część wykonawcza projektu to statyczne HTML/CSS/JS; `npm` jest tu używany wyłącznie do narzędzi obrazów.
- Zależności wykryte w `package.json`: `fast-glob`, `sharp`.
