# CSS Architecture (token-first)

## Warstwy i odpowiedzialności
- **tokens/** – design tokens (CSS variables), bez selektorów komponentów.
- **base/** – reset, globalne style elementów, bazowa typografia.
- **utilities/** – krótkie klasy pomocnicze `.u-*` bez kontekstu.
- **components/** – komponenty wielokrotnego użytku (np. `btn`, `card`, `form`, `tabs`).
- **sections/** – sekcje strony (np. `hero`, `services`, `materials`, `footer`).
- **pages/** – wyjątki specyficzne dla pojedynczej podstrony (tylko gdy potrzebne).

## Kolejność importów w entry
`tokens → base → utilities → components → sections → pages`

## Naming conventions
- **BEM dla komponentów:** `.component__part`, `.component--variant`.
- **Stany:** `.is-active`, `.is-open`, `.is-disabled`.
- **Utilities:** prefiks `.u-` (np. `.u-flow`).
- **Zakaz:** głębokiego zagnieżdżania typu `.header .nav .btn` (utrzymuj niską specyficzność).

## Variant rules
- Warianty tylko przez modyfikatory `--variant` lub data-attr (jeśli istnieje wzorzec).
- Nie duplikuj komponentów jako osobnych klas typu `buttonPrimary2`.

## Minimal rules for future changes
- **Nowe sekcje →** `sections/`.
- **Nowe UI reużywalne →** `components/`.
- **Krótkie helpery →** `utilities/`.
- **Nowe tokeny →** `tokens/` (z krótkim uzasadnieniem w opisie zmiany).

## Notatki praktyczne
- Projekt posiada już klasę `.container` (utilities) – traktuj ją jako aktualny helper layoutu, bez duplikowania `.u-container`.
- Utilities i komponenty powinny korzystać z tokenów (`var(--...)`) zamiast twardych wartości.
