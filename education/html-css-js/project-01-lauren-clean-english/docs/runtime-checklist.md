# Runtime checklist (prod)

## Build assets
- Otwórz dowolną stronę i w DevTools → Network upewnij się, że:
  - `style.min.css` i `main.min.js` ładują się z `/assets/build/`.
  - Nie ma requestów do `css/` ani `js/` źródłowych plików.

## Service Worker (aktualizacja cache)
- W DevTools → Application → Service Workers:
  - Sprawdź, czy SW jest aktywny i kontroluje stronę.
  - Kliknij **Update** i odśwież stronę.
  - W **Cache Storage** upewnij się, że pozostaje tylko jeden cache `clean-english-v*`.

## Wykrywanie starego cache
- W DevTools → Application → Cache Storage:
  - Jeśli widzisz więcej niż jeden cache `clean-english-v*`, usuń stare i odśwież.
  - Wejdź w nowe podstrony (np. `/uslugi.html`, `/pakiety.html`, `/materialy.html`) i sprawdź,
    czy w offline mode wciąż działają (Navigation fallback + cache).
