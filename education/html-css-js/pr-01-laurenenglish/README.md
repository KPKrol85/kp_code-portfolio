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
scripts/site-config.mjs                 # kanoniczny origin, trasy i metadane SEO
scripts/build-html.mjs                  # assembler i walidator HTML
css/style.css                           # kanoniczny entry CSS
css/{tokens,base,utilities,...}/        # modułowe źródła CSS
js/main.js                              # kanoniczny entry JavaScript
js/{data,modules,pages,state}/          # modułowe źródła JavaScript
scripts/content-renderers.mjs           # build-time renderery pakietów i materiałów
service-worker.template.js              # kanoniczny Service Worker
assets/{favicon,fonts,img,og,pwa}/       # statyczne zasoby źródłowe
assets/build/style.min.css               # wygenerowany bundle CSS
assets/build/main.min.js                 # wygenerowany bundle JavaScript
service-worker.js                        # wygenerowany Service Worker
```

## Build scripts

- `npm run dev` – składa wspólny shell, a następnie uruchamia watch CSS/JS i lokalny serwer.
- `npm run check:data` – sprawdza kanoniczne pakiety, materiały, dostęp i wyniki filtrów.
- `npm run check:content` – sprawdza publiczne strony pod kątem niezweryfikowanych danych, atrap prawnych, opinii i aktywnego formularza danych osobowych.
- `npm run check:css` – sprawdza kolejność warstw, semantyczne tokeny obu motywów, surowe kolory, selektory, duplikaty utilities i kontrast WCAG.
- `npm run check:seo` – sprawdza trasy, metadane, JSON-LD, raster Open Graph, sitemapę, robots i politykę 404/noindex.
- `npm run check:pwa` – sprawdza deterministyczny Service Worker, precache, manifest, ikony, hero, fonty i budżet krytycznych zasobów.
- `npm run test:e2e` – buduje produkcyjne pliki, uruchamia lokalny serwer i pełny zestaw testów Chromium w widokach desktop oraz mobile.
- `npm run build:html` – składa wspólny header, nawigację i footer w pięciu głównych stronach oraz statyczny katalog materiałów.
- `npm run check:html` – bez zapisu sprawdza aktualność regionów generowanych, semantykę, ID i lokalne linki.
- `npm run build` – pełny build produkcyjny: JavaScript, CSS i Service Worker.
- `npm run build:css` – PostCSS + `postcss-import` + cssnano; generuje `assets/build/style.min.css`.
- `npm run build:js` – esbuild; bundluje moduły od `js/main.js` do `assets/build/main.min.js`.
- `npm run build:sw` – waliduje precache i generuje `service-worker.js` z wersji pakietu oraz deterministycznego fingerprintu szablonu i zawartości cache.
- `npm run build:pwa-screenshots` – uruchamia lokalny serwer i projektowy Chromium, a następnie odtwarza screenshoty manifestu `1280 × 720` oraz `720 × 1280` z aktualnej produkcyjnej strony głównej.
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

## Browser E2E (Playwright)

Po instalacji zależności zainstaluj jedyną wymaganą przeglądarkę:

```powershell
npm install --no-package-lock
npx playwright install chromium
```

Pełna weryfikacja automatycznie wykonuje build, uruchamia istniejący serwer statyczny na `http://127.0.0.1:4173`, testuje wygenerowane strony, a następnie zatrzymuje serwer, jeżeli Playwright uruchomił go sam:

```powershell
npm run test:e2e
```

Dostępne polecenia skupione:

- `npm run test:e2e:smoke` – pięć głównych stron, współdzielone logo, wygenerowane CSS/JS, komplet lokalnych fontów wraz z MIME i diagnostyka runtime.
- `npm run test:e2e:interactions` – nawigacja, drawer, focus, accordion i tabs.
- `npm run test:e2e:theme` – light/dark, synchronizacja kontrolek i przywracanie zapisanego motywu.
- `npm run test:e2e:responsive` – szerokości 320, 390, 768, 1024 i 1440 px, oba motywy, współdzielone logo, kontrakt typografii z polskimi znakami, layout shift, overflow i containment.
- `npm run test:e2e:seo` – statusy tras i zasobów, prawdziwe 404, metadane runtime, sitemapę i robots.
- `npm run test:e2e:pwa` – instalacja i aktywacja SW, cache cleanup, manifest, skróty, ikony, screenshoty, online 404, offline, odpowiedzi niedozwolone i budżet krytycznych requestów.
- `npm run test:e2e:headed` – pełny zestaw w widocznym Chromium.
- `npm run test:e2e:ui` – interaktywny tryb Playwright UI.
- `npm run test:e2e:report` – otwiera ostatni raport HTML.

Konfiguracja używa projektów Chromium `1440 × 900` i `390 × 844`, pojedynczego workera, izolowanych kontekstów oraz domyślnie zablokowanych Service Workerów. Tylko `pwa.spec.mjs` włącza SW w świeżym kontekście i sprząta rejestracje oraz cache po teście. Screenshoty i trace są zapisywane tylko dla nieudanych testów; video jest wyłączone. `playwright-report/`, `test-results/` i `blob-report/` są lokalnymi artefaktami ignorowanymi przez Git.

Skrypty `check:*` wykonują deterministyczną walidację źródeł i danych bez przeglądarki. Playwright weryfikuje zachowanie wygenerowanych stron w prawdziwym Chromium; oba rodzaje kontroli są wymagane przed przekazaniem zmian.

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

- `service-worker.template.js` pozostaje jedynym źródłem Service Workera. `scripts/pwa-config.mjs` definiuje kontrakt assetów, a `scripts/build-service-worker.mjs` sprawdza istnienie i unikalność ścieżek przed wygenerowaniem `service-worker.js`.
- Cache używa stałego prefiksu `clean-english-v` oraz rewizji `<package version>-<12 znaków SHA-256>`. Fingerprint obejmuje szablon, konfigurację i treść każdego precachowanego pliku, więc identyczne wejścia dają identyczną nazwę, a zmiana wejścia tworzy nową.
- Instalacja kończy się dopiero po pełnym `cache.addAll`; nieudana instalacja usuwa wyłącznie niekompletny bieżący cache. Po udanej instalacji worker wywołuje `skipWaiting`, a aktywacja usuwa wyłącznie starsze cache z prefiksem Lauren English i wykonuje `clients.claim`.
- Precache obejmuje pięć głównych dokumentów, `offline.html`, produkcyjne CSS/JS, Inter 400/600/700, Literata 700, ikony instalacyjne 192/512, trzy ikony skrótów, współdzielone logo, dwa obrazy używane na homepage (hero i portret) oraz `site.webmanifest`. Nie zawiera screenshotów instalacyjnych, stron błędów, formularzy, źródłowych `css/`/`js/` ani katalogu materiałów.
- Nawigacja online jest network-first: prawdziwy `404` pozostaje `404` i nie trafia do cache. Przy awarii sieci główna znana trasa otrzymuje swoją kopię, a inna nawigacja otrzymuje `offline.html`; homepage nie jest fallbackiem ogólnym.
- Cache przyjmuje tylko pełne odpowiedzi `200` dla zamierzonych, same-origin żądań `GET` HTTP(S). Odpowiedzi przekierowane, opaque, częściowe, nieudane, cross-origin i inne metody nie są zapisywane. Statyczny runtime jest ograniczony do jawnej listy precache, a query string nie tworzy dodatkowych wpisów.
- `site.webmanifest` deklaruje pełny kontrakt instalacyjny, zweryfikowane PNG `192 × 192` i `512 × 512`, dokładnie trzy skróty do pakietów, materiałów i postępów oraz aktualne screenshoty `1280 × 720` (`wide`) i `720 × 1280` (`narrow`). Nie deklaruje `maskable`, ponieważ nie ma osobnego assetu ze zweryfikowaną strefą bezpieczną.
- Hero używa jednego JPEG `1600 × 1200`, jawnych wymiarów, `loading="eager"`, `fetchpriority="high"` i `decoding="async"`. Budżet homepage to 1 CSS, 1 JS, 4 początkowe fonty (łącznie maks. 185 kB), 1 request współdzielonego logo oraz 1 request hero (maks. 1,1 MB), bez requestów źródłowych i duplikatów.

Weryfikacja lokalna:

```powershell
npm run build
npm run build:pwa-screenshots
npm run check:pwa
npm run test:e2e:pwa
```

## SEO i routing

Kanoniczny origin wdrożenia to `https://education-pr-01-lauren-english.netlify.app`. Jedynym źródłem originu, publicznych tras i metadanych jest `scripts/site-config.mjs`.

Indeksowane trasy to:

- `/`
- `/uslugi.html`
- `/pakiety.html`
- `/materialy.html`
- `/postepy.html`

Strony `/404.html`, `/offline.html` i `/thank-you.html` są dostępne technicznie, ale mają `noindex, nofollow`, bez canonical, Open Graph, Twitter Cards i JSON-LD. Każda indeksowana strona ma jeden absolutny canonical zgodny z `og:url`, unikalny tytuł i opis oraz minimalne dane `WebSite` albo `WebPage` bez niezweryfikowanych danych firmy.

Kanonicznym zasobem grafiki społecznościowej jest istniejący raster `assets/og/og.png` o rozmiarze `1200 × 630`. Metadane Open Graph i Twitter wskazują na jego bezwzględny adres HTTPS. `npm run build:html` generuje metadane w oznaczonych regionach oraz odświeża `sitemap.xml`, `robots.txt` i `_redirects` z rejestru. Sitemapa zawiera wyłącznie pięć indeksowanych canonicali i nie publikuje niewiarygodnych dat `lastmod`.

`_redirects` nie zawiera fallbacku SPA do strony głównej. Na Netlify obecność głównego `404.html` zapewnia dedykowaną odpowiedź dla nieznanych tras z prawdziwym statusem `404`; lokalny serwer testowy zachowuje tę samą semantykę. `serve.json` wyłącza lokalne przepisywanie adresów `.html`, aby testy odwzorowywały udokumentowany styl canonical. Weryfikacja:

```powershell
npm run check:seo
npm run test:e2e:seo
```

## Uwagi

Typografia używa tokenów `--font-family-heading: "Literata", serif` dla semantycznych nagłówków oraz `--font-family-body: "Inter", sans-serif` dla treści i UI. Projekt dostarcza lokalnie Inter 400/600/700 oraz wyłącznie używaną wagę Literata 700; Inter 500 nie jest deklarowany ani requestowany. Kanoniczne deklaracje `@font-face` znajdują się w `css/base/base.css`, używają `font-display: swap` i root-relative URL. Literata pochodzi z oficjalnego repozytorium `googlefonts/literata` (commit `0c2761b727a1b3a7cffd313c37f0f5163dfc7a63`), a licencja SIL Open Font License 1.1 jest zapisana w `assets/fonts/OFL-Literata.txt`. Wygenerowany head preloaduje wyłącznie Literata 700, ponieważ ten jeden plik obsługuje krytyczne tytuły stron i pomiar wykazał przesunięcia powiązane z wymianą fontu przy węższych viewportach; pozostałe wagi nie są preloadowane.

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

## Integralność treści publicznych

Publiczne dane kontaktowe, profile społecznościowe i dokumenty prawne nie są publikowane bez potwierdzonego źródła. Formularz danych osobowych pozostaje wyłączony, a sekcja kontaktowa pokazuje stan informacyjny. Po zmianie treści publicznych uruchom `npm run check:content`.
