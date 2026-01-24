# Audit remediation verification (P0/P1/P2)

Źródło: `docs/frontend-audit.md` + weryfikacja w kodzie i historii Git.

## Status per punkt

### P0
- **P0.1 — DONE**
  - `cartService.mergeGuestCartIntoUserCart(userId)` scala koszyk gościa z koszykiem usera i usuwa `kp_cart_guest`.
  - Merge jest wywoływany w `authService.onAuthChange` w `app.js` po zalogowaniu.

### P1
- **P1.1 — DONE**
  - Dodano `patchUi(partialUi)` i `actions.ui.setTheme(theme)` używa merge zamiast nadpisania całej gałęzi `ui`.
  - Jest regresyjny test node: `actions.ui.setTheme preserves existing ui fields`.

- **P1.2 — DONE**
  - Dodano globalny init `initReducedMotionPreference()` i wywołanie go przed routingiem w `app.js`.
  - Mechanizm uwzględnia `kp_reduced_motion` oraz fallback do `prefers-reduced-motion`.

- **P1.3 — PARTIAL**
  - Synchronizacja filtrów w `products.js` nadal korzysta z `history.replaceState`, ale po replace wykonywany jest natychmiastowy `syncFiltersFromUrl({ replaceUrl: true })` oraz warunkowy render.
  - To usuwa część edge-case'ów, ale nadal nie opiera się wyłącznie na `hashchange` (zgodnie z rekomendacją audytu).

- **P1.4 — DONE**
  - Modal ma `tabindex="-1"` i focus na kontenerze dialogu (`modal.focus({ preventScroll: true })`) po mount.

- **P1.5 — DONE**
  - Kluczowe stringi PL zostały poprawione i scentralizowane w `content/pl.js` (np. „Imię musi mieć…”, „Zamówienia”, „Niedostępne pozycje”).

### P2
- **P2.1 — DONE**
  - Wprowadzono normalizację kontraktów danych przez `normalizeProduct/normalizeProducts`.
  - Normalizacja jest stosowana na granicy store w `actions.data.setProductsReady`.

- **P2.2 — DONE**
  - Wydzielono centralne efekty zmiany trasy: `onRouteChange({ pathname, queryParams, source })`.
  - Router wywołuje `onRouteChange` po renderze trasy.

- **P2.3 — DONE**
  - Dodano zero-dependency node runner: `tests/run-tests.mjs` i skrypt `npm run test:node`.
  - Pokryto krytyczne usługi: `authService`, `cartService`, `purchasesService`, `storeActions`.

## Powiązane commity (najlepsze dopasowanie)
- `c081a8b` — fix: merge guest cart into user cart on login to prevent checkout data loss
- `8f5acf7` — fix: prevent ui state from being overwritten by shallow store patches
- `5bb030a` — fix: initialize reduced motion preference globally at app startup
- `a3b0cb1` — fix: align products filters URL sync with hash router navigation
- `42ae741` — refactor: align products filters URL sync with hash router navigation
- `39e58a4` — fix: improve dialog accessibility by focusing modal container on open
- `14e58e2` — chore: polish UI microcopy and centralize Polish strings
- `71bca60` — chore: normalize product data contracts for safer rendering
- `445cbea` — chore: normalize product data contracts at store boundary
- `6f32745` — refactor: centralize route change side effects for consistent focus and scroll
- `20f550e` — test: add zero-dependency regression suite for core services
- `abe8320` — test: add zero-dependency regression suite for core services
