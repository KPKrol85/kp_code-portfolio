# Front-end audit — KP_Code Digital Vault (SPA)

## Executive summary
Projekt prezentuje wysoki poziom jak na Vanilla JS SPA: ma czytelną strukturę folderów, własny router z lazy-loadem, centralny store i spójne tokeny designu. Architektura jest już „produkcyjnie myśląca” — widać guardy tras, boundary błędów, skeletony, aria-live i obsługę reduced motion. Szczególnie mocne są: jakość UX w krytycznych widokach (katalog, koszyk), a11y w nawigacji oraz podejście do stabilności UI (debounce, retry, loading states). Kod jest w dużej mierze modułowy i utrzymywany w stylu, który skaluje się lepiej niż typowy „projekt demo”.

Najpoważniejszy problem dotyczy spójności stanu koszyka przy logowaniu: koszyk gościa nie jest scalany z koszykiem użytkownika, co psuje kluczowy flow checkoutu. Druga istotna obserwacja: store robi płytkie merge’e, przez co łatwo w przyszłości nadpisać całe gałęzie stanu (np. `ui`). Warstwa routingu i lazy-loadu jest solidna, ale warto dodać drobne usprawnienia pod edge cases i przyszłe SSR/backendowe API.

Zastrzeżenie profesjonalne: to aplikacja frontend-only, więc część decyzji (auth, role, zakupy, storage) musi być traktowana jako „demo mode”. To nie jest wada sama w sobie — ważne, by jasno oddzielić „ergonomię FE” od „gwarancji bezpieczeństwa i integralności danych”, które będą możliwe dopiero po backendzie.

---

## Mocne strony
1. **Router z lazy-loadem i cache’owaniem modułów** — ładowanie widoków przez `loader()` + `routeModuleCache` ogranicza koszt ponownych wejść na trasę i upraszcza podział kodu.  
2. **Guardy tras z czytelną semantyką powodów** (`unauthenticated`, `forbidden`, `admin-disabled`) oraz sensowny UX dla stanów „brak uprawnień”.  
3. **Dobrze rozwiązany focus management po zmianie trasy** — fokus przenoszony na nagłówek lub `main`, bez layout jumpów dzięki `preventScroll`.  
4. **Systemowe podejście do stanów danych** (`idle/loading/ready/error`) oraz reużywalne helpery (`renderDataState`, skeletony, retry button).  
5. **Katalog produktów zaprojektowany „po seniorsku”**: debouncing, synchronizacja filtrów z URL, optymalizacja renderu gridu i incremental rendering (`show more`).  
6. **Nawigacja i menu mobilne z a11y** — focus trap, ESC, inert/scroll lock, obsługa klawiatury w dropdownach, aria-current.  
7. **Przemyślana warstwa tokenów i theme** — design tokens w `tokens.css`, osobna warstwa theme’ów i wsparcie `prefers-color-scheme` oraz `prefers-reduced-motion`.  
8. **Error boundary na poziomie globalnym** — `error` i `unhandledrejection` są przechwytywane, a UI ma czytelny fallback.  
9. **Dobre praktyki wydajnościowe w wielu miejscach**: debounce na resize i inputach, `requestAnimationFrame` przy scroll/resize, `DocumentFragment` w gridzie, responsywne obrazy.  
10. **Czytelny podział odpowiedzialności**: `services/` (dane), `store/` (stan), `pages/` (widoki), `components/` (UI), `utils/` (narzędzia).

---

## Usprawnienia w priorytetach (P0 / P1 / P2)

### P0 — ryzyka dla kluczowych flow / regresje

#### P0.1 — Utrata koszyka gościa po logowaniu (blokuje checkout)
- **Symptom:** użytkownik dodaje produkty jako gość, loguje się i widzi pusty koszyk / nie może przejść do checkoutu.  
- **Root cause:** koszyk jest trzymany per-user, ale brak scalenia koszyka gościa przy zmianie sesji. `cartService.getCart()` wybiera tylko koszyk aktualnego usera, a po logowaniu `actions.cart.setCart(cartService.getCart())` nadpisuje stan koszyka.  
- **Fix plan (konkretnie):**
  1) W `cartService` dodać `mergeGuestCartIntoUserCart(userId)` wywoływane przy logowaniu.  
  2) Scalić `kp_cart_guest` z `kp_cart_<userId>` wykorzystując istniejące `mergeCarts()` i `normalizeCart()`.  
  3) Po udanym merge usunąć `kp_cart_guest`.  
  4) Wywołać merge w reakcji na zmianę auth (np. w `authService.signIn` lub w subskrypcji `onAuthChange`).  
- **Risk / trade-off:** po merge mogą wzrosnąć ilości pozycji (sumowanie ilości). To zwykle pożądane, ale warto to świadomie zaakceptować.  
- **Test manualny:**
  1) Jako gość dodaj produkt do koszyka.  
  2) Przejdź do logowania i zaloguj się.  
  3) Wejdź w `#/cart` i `#/checkout` — produkt powinien pozostać, a formularz checkoutu być widoczny.  

---

### P1 — ważne jakościowo (stabilność, a11y, maintainability, performance)

#### P1.1 — Płytki merge w store może nadpisywać całe gałęzie stanu
- **Symptom:** w przyszłości łatwo przypadkowo „zgubić” pola w `ui` lub innych zagnieżdżonych obiektach.  
- **Root cause:** `store.setState` robi płytkie `{ ...state, ...partial }`, a `actions.ui.setTheme` ustawia `ui: { theme }` zamiast merge’ować istniejące `ui`.  
- **Fix plan:**
  1) W `actions.ui.setTheme` zastosować merge: `patch({ ui: { ...store.getState().ui, theme } })`.  
  2) Alternatywnie: wprowadzić prosty helper `patchUi(partialUi)` lub „mini-reducer” per gałąź.  
  3) Dodać testy jednostkowe store (nawet w Vanilla JS można to zrobić w Vitest).  
- **Risk / trade-off:** minimalny; zmiana jest wstecznie kompatybilna.  
- **Test manualny:**
  1) Dodaj tymczasowo w devtools `store.setState({ ui: { theme: 'light', density: 'compact' } })`.  
  2) Przełącz theme w UI.  
  3) Sprawdź czy `density` nadal istnieje.  

#### P1.2 — Reduced motion zapisywany w koncie, ale nie inicjalizowany globalnie przy starcie
- **Symptom:** preferencja reduced motion działa dopiero po wejściu w ustawienia konta.  
- **Root cause:** `kp_reduced_motion` jest odczytywane i aplikowane w `renderSettingsContent`, a nie w globalnym init (np. analogicznie do theme-init).  
- **Fix plan:**
  1) Dodać lekki init reduced motion (np. `js/reduced-motion-init.js`) ładowany w `index.html` przed stylami lub w `app.js` przed routingiem.  
  2) Przy inicjalizacji odczytać `kp_reduced_motion` i ustawić `data-reduced-motion` na `documentElement`.  
  3) (Opcjonalnie) uzupełnić o fallback do `prefers-reduced-motion`.  
- **Risk / trade-off:** praktycznie brak; poprawa spójności UX.  
- **Test manualny:**
  1) Ustaw reduced motion w koncie.  
  2) Odśwież stronę będąc na innej trasie niż konto.  
  3) Sprawdź, czy animacje są ograniczone od razu po starcie.  

#### P1.3 — Produkty: synchronizacja URL przez `history.pushState/replaceState` w hash-routerze utrudnia spójne zdarzenia routingu
- **Symptom:** filtrowanie w katalogu zmienia URL, ale nie emituje `hashchange`; trzeba pamiętać o dodatkowych listenerach (`popstate`) i ręcznym renderze.  
- **Root cause:** w `updateUrlFromFilters` używany jest `history.pushState/replaceState`, podczas gdy router opiera się na `hashchange`.  
- **Fix plan:**
  1) Uprościć: w hash-routerze preferować `window.location.hash = nextHash` + ewentualny `markProgrammaticNav()` (jeśli potrzeba).  
  2) Jeśli koniecznie chcesz zachować `pushState`, rozważ spójny event-bus (np. `window.dispatchEvent(new CustomEvent('route:before'))`).  
  3) Utrzymać jedną konwencję: „routing = hashchange”.  
- **Risk / trade-off:** drobna zmiana zachowania historii (replace vs push), ale łatwiejsza przewidywalność.  
- **Test manualny:**
  1) Ustaw kilka filtrów.  
  2) Klikaj Back/Forward.  
  3) Sprawdź, czy UI filtrów i grid są zawsze zgodne z URL.  

#### P1.4 — Spójność a11y dla dialogów: brak jawnego focusa na kontener dialogu
- **Symptom:** fokus trafia na pierwszy focusowalny element, ale SR/klawiatura nie zawsze „czuje” wejście w dialog.  
- **Root cause:** modal nie ustawia focusa na kontenerze dialogu (np. z `tabindex="-1"`) przed przejściem do pierwszego controla.  
- **Fix plan:**
  1) Dodać `tabindex="-1"` na `.modal`.  
  2) Po mount: `modal.focus({ preventScroll: true })`, a dopiero potem przenieść fokus w głąb jeśli to potrzebne.  
  3) Rozważyć `aria-live` dla krytycznych komunikatów w modalu (opcjonalnie).  
- **Risk / trade-off:** niewielki — trzeba tylko uważać, by nie „ukraść” focusa w specyficznych flow.  
- **Test manualny:**
  1) Otwórz modal z klawiatury.  
  2) Sprawdź, czy SR ogłasza dialog i czy TAB nie wychodzi poza modal.  

#### P1.5 — Microcopy/PL: miejscami brak polskich znaków i literówek obniża wiarygodność UI
- **Symptom:** w UI pojawiają się teksty typu „Niedostepne pozycje”, „Zamowienia”, „Imie musi miec…”.  
- **Root cause:** stringi wpisane inline w wielu modułach, bez jednolitej korekty językowej i bez pełnej centralizacji w `content/pl.js`.  
- **Fix plan:**
  1) Przenieść większość inline stringów do `content/pl.js`.  
  2) Zrobić jednorazowy proofreading PL (diakrytyki + spójność tonu).  
  3) Wprowadzić zasadę: „teksty UI tylko w `content/`”.  
- **Risk / trade-off:** lekki koszt refaktoru, ale duży zysk w jakości i i18n-readiness.  
- **Test manualny:**
  1) Przejdź krytyczne flow (katalog → koszyk → auth → konto).  
  2) Wypisz wszystkie komunikaty i sprawdź diakrytyki oraz spójność tonu.  

---

### P2 — polish i usprawnienia „nice to have”

#### P2.1 — Wzmocnić kontrakty danych na wejściu do komponentów
- **Symptom:** komponenty zakładają poprawność struktury danych (np. `product.tags.forEach`, `bundleContents.forEach`).  
- **Root cause:** brak lekkiej warstwy normalizacji „na granicy” (np. w `mockApi` lub `actions.data.setProductsReady`).  
- **Fix plan:**
  1) Dodać `normalizeProduct(product)` i zastosować przy ładowaniu danych.  
  2) Zapewnić bezpieczne defaulty (`tags: []`, `bundleContents: []`, `downloadables: []`).  
- **Risk / trade-off:** minimalny; poprawia odporność na przyszły backend/API.  
- **Test manualny:**
  1) W devtools podmień jeden produkt na niekompletny.  
  2) Sprawdź, czy UI dalej się renderuje i pokazuje sensowne fallbacki.  

#### P2.2 — Rozważyć wydzielenie „route state” i „app state”
- **Symptom:** część logiki filtrów, scrollowania i focusa opiera się na globalnych flagach i listenerach.  
- **Root cause:** brak jednej warstwy, która agreguje „zmianę trasy” i jej skutki uboczne.  
- **Fix plan:**
  1) Wprowadzić centralny hook/event `onRouteChange({ pathname, queryParams, source })`.  
  2) Przenieść tam scroll reset, focus main i ewentualne analityki.  
- **Risk / trade-off:** lekki refaktor, ale lepsza przewidywalność.  
- **Test manualny:**
  1) Przechodź między trasami z różnych miejsc (link, navigateHash, back).  
  2) Sprawdź, czy scroll i focus są zawsze spójne.  

#### P2.3 — DX: dodać minimalne testy regresji dla krytycznych usług
- **Symptom:** kluczowe moduły (cart/auth/purchases/store) nie są chronione testami, a są fundamentem dla przyszłego backendu.  
- **Root cause:** brak testów jednostkowych dla logiki stanu i storage.  
- **Fix plan:**
  1) Dodać testy dla `cartService` (normalizacja, merge, migracje).  
  2) Dodać testy dla `authService` (sesja, expiry, returnTo).  
  3) Dodać testy dla `store/actions` (czy nie gubią pól).  
- **Risk / trade-off:** koszt czasu, ale bardzo wysoki ROI.  
- **Test manualny:**
  1) Uruchomić `npm test` i upewnić się, że chroni krytyczne scenariusze.  

---

## Checklist smoke testów przed deployem (manual)
1. Wejście na `#/` → brak błędów w konsoli, header i footer renderują się poprawnie.  
2. `#/products` → skeletony → dane gotowe → grid i licznik wyników.  
3. Filtry w katalogu: search + sort + kategoria → URL aktualizuje się i UI jest spójny.  
4. Back/Forward na filtrach → kontrolki i grid wracają do poprzedniego stanu.  
5. Wejście w szczegóły produktu (`#/products/:id`) → meta title + galeria działa z klawiatury.  
6. Dodanie do koszyka z karty i z detali → toast + licznik koszyka aktualny.  
7. `#/cart` → stepper ilości, ręczna edycja inputa, usuwanie pozycji.  
8. Próba wejścia na `#/checkout` jako gość → redirect do `#/auth?next=...`.  
9. Rejestracja + logowanie → redirect do `next` lub `#/account`.  
10. Po zalogowaniu koszyk i checkout zachowują stan (szczególnie scenariusz gość → login).  
11. Checkout: walidacja pól, stany błędów, blokada przy processing.  
12. Po checkout: koszyk pusty, toast sukcesu, `#/library` dostępne.  
13. `#/account` + subtrasy (`orders/downloads/settings`) → nawigacja i aria-current.  
14. Ustawienia: theme + reduced motion → działają po odświeżeniu i na innych trasach.  
15. Trasy specjalne: `#/admin` (blocked UX) i nieistniejąca trasa → 404 + poprawny focus.

---

## Proponowane next steps (max 5)
1. **Naprawić merge koszyka gościa przy logowaniu (P0)** — to największy realny problem produktowy.  
2. **Uodpornić store na nadpisywanie gałęzi stanu (P1)** — przygotowanie pod dalszy rozwój UI i backend.  
3. **Zainicjalizować reduced motion globalnie przy starcie (P1)** — szybka poprawa UX/a11y.  
4. **Ujednolicić routing konwencyjnie pod hashchange (P1)** — mniej edge cases i łatwiejsze debugowanie.  
5. **Zacząć budować „backend readiness layer”**: normalizacja danych + testy usług + kontrakty DTO (P2→P1 w kolejnych iteracjach).

---

## Kluczowe pliki/obszary do audytu (najważniejsze)
- `index.html`
- `js/app.js`
- `js/router/router.js`
- `js/router/routes.js`
- `js/utils/navigation.js`
- `js/utils/permissions.js`
- `js/store/store.js`
- `js/store/actions.js`
- `js/services/auth.js`
- `js/services/cart.js`
- `js/services/purchases.js`
- `js/pages/products.js`
- `js/components/productsGrid.js`
- `js/pages/cart.js`
- `js/pages/checkout.js`

## Komendy uruchomienia / weryfikacji (jeśli dostępne)
Z `active-project/`:
- `npm run serve`
- `npm test`
- `npm run lint`
- (fallback lokalny bez zależności) `python -m http.server 4173`
