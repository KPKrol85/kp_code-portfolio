# Lauren – Clean English

Profesjonalna, wielostronicowa strona edukacyjna dla nauczycielki języka angielskiego. Projekt łączy spójny UX, dostępność, katalog materiałów, śledzenie postępów oraz produkcyjne podstawy SEO i PWA.

## Funkcje JS

- Reveal on scroll (IntersectionObserver).
- Sticky header z efektem blur i shrink.
- Mobile nav (drawer) z trapem focusu, zamknięciem ESC i obsługą ARIA.
- Scrollspy dla aktywnej sekcji w nawigacji.
- FAQ accordion z obsługą klawiatury.
- Filtrowanie materiałów w sekcji Resources/Shop.
- Progress tracker demo z przełączaniem stanu.
- Prosty przełącznik motywu (light/dark).
- Rejestracja Service Worker (PWA).

## Architektura źródeł i build

```
index.html + pozostałe pliki HTML       # samodzielne, złożone strony
scripts/shared-shell.mjs                # kanoniczny header/nav/footer
scripts/build-html.mjs                  # assembler i walidator HTML
css/style.css                           # kanoniczny entry CSS
css/{tokens,base,utilities,...}/        # modułowe źródła CSS
js/main.js                              # kanoniczny entry JavaScript
js/{data,modules,pages,state}/          # modułowe źródła JavaScript
scripts/content-renderers.mjs           # build-time renderery pakietów i materiałów
service-worker.template.js              # kanoniczny Service Worker
assets/{fonts,icons,img,og}/             # statyczne zasoby źródłowe
assets/build/style.min.css               # wygenerowany bundle CSS
assets/build/main.min.js                 # wygenerowany bundle JavaScript
service-worker.js                        # wygenerowany Service Worker
```

## Build scripts

- `npm run dev` – składa wspólny shell, a następnie uruchamia watch CSS/JS i lokalny serwer.
- `npm run check:data` – sprawdza kanoniczne pakiety, materiały, dostęp i wyniki filtrów.
- `npm run build:html` – składa wspólny header, nawigację i footer w pięciu głównych stronach oraz statyczny katalog materiałów.
- `npm run check:html` – bez zapisu sprawdza aktualność regionów generowanych, semantykę, ID i lokalne linki.
- `npm run build` – pełny build produkcyjny: JavaScript, CSS i Service Worker.
- `npm run build:css` – PostCSS + `postcss-import` + cssnano; generuje `assets/build/style.min.css`.
- `npm run build:js` – esbuild; bundluje moduły od `js/main.js` do `assets/build/main.min.js`.
- `npm run build:sw` – generuje `service-worker.js` z `service-worker.template.js` i ustawia wersję cache zgodną z `package.json`.
- `npm run images` – optymalizacja obrazów (webp/avif).
- `npm run lint:js` – ESLint.
- `npm run format` – Prettier.

Przed pierwszym buildem zainstaluj zadeklarowane zależności przez `npm install`, a następnie uruchom:

```powershell
npm run build
```

Każdy skrypt CSS/JS tworzy `assets/build/`, jeżeli katalog nie istnieje. Wszystkie strony produkcyjne ładują wyłącznie:

- `/assets/build/style.min.css`
- `/assets/build/main.min.js`

Pliki w `assets/build/` oraz `service-worker.js` są wygenerowane i śledzone na potrzeby statycznego wdrożenia. Nie edytuj ich ręcznie — po zmianie źródeł uruchom odpowiedni build. Stary bundle `css/style.min.css` został usunięty i nie należy już do kontraktu produkcyjnego.

## Wspólny shell HTML

`scripts/shared-shell.mjs` jest jedynym źródłem wspólnego skip linku, headera, głównej nawigacji, CTA i footera dla:

- `index.html`
- `uslugi.html`
- `pakiety.html`
- `materialy.html`
- `postepy.html`

Każdy z tych plików pozostaje samodzielnym dokumentem HTML. Jego `<head>` i `<main>` są treścią specyficzną dla strony, natomiast regiony między komentarzami `shared-shell:*:start` i `shared-shell:*:end` są składane automatycznie i nie powinny być edytowane ręcznie.

W `materialy.html` region między komentarzami `materials-catalog:start` i `materials-catalog:end` jest generowany z `js/data/materials.js`. Zmieniaj dane źródłowe, nie gotowe karty w tym regionie.

Regiony `package-cards:*`, `package-link:*` oraz `materials-home:*` są generowane z `js/data/packages.js` i `js/data/materials.js`. Dane handlowe, linki pakietów i treść kart nie powinny być utrzymywane ręcznie w HTML.

Po zmianie wspólnego shellu uruchom:

```powershell
npm run build:html
npm run check:html
```

Assembler korzysta z jawnych markerów, zachowuje wartości specyficzne dla stron i przerywa pracę przy nieaktualnym shellu, błędnej liczbie `h1`/`main`, duplikatach ID, niepoprawnym `aria-current="page"`, brakującym celu skip linku lub niedziałającym lokalnym linku shellu.

Każda strona ma dokładnie jeden stan `aria-current="page"`: na stronie głównej otrzymuje go link logo do `/index.html`, a na pozostałych stronach odpowiedni link głównej nawigacji.

## A11y checklist (WCAG AA+)

- Skip link do treści.
- Semantyczne sekcje i poprawna hierarchia nagłówków.
- Wyraźne focus states (`:focus-visible`).
- Dostępne komponenty interaktywne (menu mobilne, accordion, filtry).
- Obsługa klawiatury (Tab/Shift+Tab/ESC).
- `prefers-reduced-motion` dla animacji.
- Kontrast zgodny z AA.

## PWA

- Manifest i ikony w `/assets/icons/`.
- Service worker z cache app shell i offline fallback (`offline.html`).
- `robots.txt`, `sitemap.xml`, `_redirects`.

## Uwagi

Typografia używa lokalnych plików Inter z `assets/fonts/`. Kanoniczne deklaracje `@font-face` znajdują się w `css/base/base.css` i korzystają z root-relative URL, dzięki czemu zachowują poprawne ścieżki po wygenerowaniu CSS do `assets/build/`.

## Materiały (katalog)

- Dane: `js/data/materials.js` – lista obiektów z polami opisującymi materiały.
- Dostęp i CTA: `js/data/materialAccess.js` – wspólne reguły dla linku, pakietu, kontaktu i stanu niedostępnego.
- Filtrowanie: `js/data/materialFilters.js` – czysta logika kategorii, poziomu, formatu i dostępu.
- Dodanie nowego materiału: dopisz rekord z metadanymi, `access` i jawnym `action`; materiały premium wymagają obsługiwanego `packageKey`.
- Po zmianie danych uruchom `npm run build:html`, aby odświeżyć dostępny bez JavaScriptu katalog w `materialy.html`.

## Pakiety

- Dane: `js/data/packages.js` – rekordy `start`, `regular` i `intensive` wraz z opisami, korzyściami, linkami i CTA.
- Homepage i `pakiety.html` są generowane z tych samych rekordów.
- Brak zatwierdzonej ceny jest zapisany jako `priceLabel: null`; renderer nie tworzy wtedy publicznej ceny.
