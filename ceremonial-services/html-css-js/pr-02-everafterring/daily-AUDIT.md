# Codzienny Audyt — EverAfter Ring

## 1. Krótka ocena ogólna
Projekt jest dobrze uporządkowanym statycznym front-endem z czytelnym modelem stron, modularną organizacją CSS/JS oraz własnym pipeline'em builda, który składa produkcyjny HTML ze współdzielonych partiali. Najmocniejsze strony obecnej implementacji to semantyczna struktura, podstawowe metadane oraz organizacja źródeł. Główne braki są funkcjonalne, a nie architektoniczne: formularz kontaktowy nigdzie nie wysyła danych, a animacja hero sterowana JavaScriptem nie respektuje preferencji ograniczenia ruchu.

## 2. Mocne strony
- Semantyczna struktura stron jest spójna w całym zbiorze plików źródłowych: na każdej stronie obecne są skip link, `header`, `main` i `footer` (`index.html:33-34`, `oferta.html:33-34`, `uslugi.html:33-34`, `realizacje.html:33-34`, `o-nas.html:33-34`, `kontakt.html:33-34`).
- Hierarchia nagłówków jest czysta i przewidywalna: jedna sekcja `h1` na stronę, a `h2` i `h3` są używane zgodnie z poziomami treści sekcyjnej i kart (`index.html:41`, `oferta.html:41`, `uslugi.html:41`, `realizacje.html:41`, `o-nas.html:41`, `kontakt.html:41`).
- W kodzie widać realną pracę nad dostępnością: skip link, `aria-expanded`, `aria-controls`, `aria-current`, `aria-live`, poprawnie powiązane etykiety pól oraz widoczne style `:focus-visible` są faktycznie zaimplementowane (`partials/header.html:5,22`, `kontakt.html:55-122`, `css/base.css:49-54,76-92`, `js/modules/nav.js:46-161`, `js/modules/partials.js:11-21`).
- Pokrycie metadanych jest solidne jak na statyczną stronę: każda podstrona ma `title`, opis, canonical, faviconę oraz JSON-LD; dodatkowo obecne są `robots.txt` i `sitemap.xml` (`index.html:6-23`, `oferta.html:6-23`, `uslugi.html:6-23`, `realizacje.html:6-23`, `o-nas.html:6-23`, `kontakt.html:6-23`, `robots.txt:1-3`, `sitemap.xml:1-20`).
- Podstawy wydajności są zaadresowane sensownie: obrazy mają jawne wymiary, grafiki portfolio używają `loading="lazy"`, fonty są lokalnymi assetami WOFF2, a skrypt builda minifikuje CSS i JS (`index.html:45,218-238`, `realizacje.html:59-147`, `scripts/build.mjs:37-60,113-115`).
- Organizacja kodu źródłowego jest utrzymywalna: CSS jest warstwowany przez `css/main.css`, logika interakcji jest podzielona na wyspecjalizowane moduły, a skrypt builda jest czytelny i deterministyczny (`css/main.css:1-15`, `js/app.js:1-10`, `scripts/build.mjs:1-160`).
- Nie wykryto sekretów w projekcie. Nie wykryto też `TODO`, `FIXME`, `console.log` ani `debugger` w audytowanym zestawie źródeł.

## 3. P0 — Ryzyka krytyczne
- none detected

## 4. P1 — Istotne problemy warte naprawy w następnej kolejności
- Formularz kontaktowy nie jest funkcjonalnie podłączony do żadnej ścieżki wysyłki. Formularz źródłowy nie ma `action` ani `method` (`kontakt.html:55`), a handler submitu zawsze wykonuje `event.preventDefault()`, waliduje dane lokalnie, następnie wyświetla komunikat sukcesu i resetuje formularz bez jakiegokolwiek żądania sieciowego (`js/modules/form.js:56-75`). Dla produkcyjnej strony kontaktowej jest to realna awaria przechwytywania leadów.

- Rozwiązane: efekt hero respektuje teraz `prefers-reduced-motion: reduce` również w JavaScript; ruch sterowany wskaźnikiem i pętla animacji są wyłączane, gdy preferencja ograniczenia ruchu jest aktywna (`js/modules/hero.js`).

## 5. P2 — Drobne dopracowania
- Strony źródłowe nie są samowystarczalne bez JavaScriptu, ponieważ współdzielony layout jest ładowany do pustych hostów `header` i `footer` przez `fetch()` w runtime (`index.html:34,265`, `oferta.html:34,128`, `uslugi.html:34,206`, `realizacje.html:34,172`, `o-nas.html:34,124`, `kontakt.html:34,152`, `js/modules/partials.js:37-58`). Jest to częściowo zneutralizowane przez build, który osadza partiale bezpośrednio w produkcyjnym HTML (`scripts/build.mjs:89-116`). To oznacza lukę progressive enhancement w trybie źródłowym, a nie blokadę produkcyjną, o ile wdrażanym artefaktem jest `dist/`.
- `js/modules/nav.js` zawiera drobny dług porządkowy: `trapFocus` jest importowane, ale nieużywane (`js/modules/nav.js:1`), `primaryNav` jest przypisane, ale nieużywane (`js/modules/nav.js:7`), a zwracana funkcja cleanup usuwa nowy anonimowy handler kliknięcia zamiast tego faktycznie zarejestrowanego (`js/modules/nav.js:167-169`). Nie powoduje to obecnie awarii runtime, ale obniża klarowność kodu.

## 6. Dodatkowe usprawnienia jakościowe
- Metadane Open Graph i Twitter Card nie zostały wykryte w projekcie. Ich dodanie poprawiłoby podgląd linków dla publicznej strony.
- Web App Manifest: not detected in project.
- Rejestracja service workera: not detected in project.
- Niewielki fallback `noscript` dla podstawowej nawigacji zmniejszyłby różnicę między zachowaniem podglądu źródeł a oczekiwaniami progressive enhancement.

## 7. Ocena seniorska (1–10)
**7/10** — Projekt pokazuje solidną strukturę front-endową, dobrą dyscyplinę semantyczną oraz sensowny własny pipeline builda. Ocena spada głównie przez jeden realny problem produktowy (formularz kontaktowy niczego nie wysyła) i jedną lukę dostępnościową (reduced motion jest wdrożone tylko częściowo, bo animacja JS nadal działa).
