# Runtime checklist (prod)

## Build
- Zainstaluj zadeklarowane zależności: `npm install`.
- Uruchom pełny build: `npm run build`.
- Sprawdź parity i semantykę wspólnego shellu: `npm run check:html`.
- Potwierdź, że powstały:
  - `assets/build/style.min.css`
  - `assets/build/main.min.js`
  - `service-worker.js`
- Sprawdź, czy `BUILD_VERSION` w `service-worker.js` jest identyczny z `version` w `package.json`.

## Build assets
- Otwórz każdą stronę (`index.html`, `uslugi.html`, `pakiety.html`, `materialy.html`, `postepy.html`, `thank-you.html`, `offline.html`, `404.html`) i w DevTools → Network upewnij się, że:
  - `/assets/build/style.min.css` zwraca HTTP 200.
  - `/assets/build/main.min.js` zwraca HTTP 200.
  - Nie ma requestów do kanonicznych plików `css/` ani `js/`.
  - Fonty Inter ładują się z `/assets/fonts/` bez odpowiedzi 404.
  - Konsola nie zawiera błędów modułów ani błędów ładowania zasobów.

## Responsive smoke test
- Sprawdź osiem stron przy szerokości desktopowej i mobilnej.
- Potwierdź, że po zmianie ścieżek assetów nie pojawiły się nowe przesunięcia, nakładanie treści ani poziomy overflow względem stanu źródłowego.

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
