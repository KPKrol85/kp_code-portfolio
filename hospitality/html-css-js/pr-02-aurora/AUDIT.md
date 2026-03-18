# AUDIT

## 1. Podsumowanie wykonawcze
Zakres audytu objął wyłącznie źródłowe pliki repozytorium. Wygenerowany output w `dist/`, zminifikowane bundlowane pliki i artefakty builda zostały wyłączone z przeglądu implementacji, poza przypadkami, w których wyjaśniają intencję deploymentową.

To uporządkowany projekt statycznego front-endu z czytelnym podziałem na źródła i build, modularnym CSS, modularnym Vanilla JS, solidnym bazowym SEO w `<head>` oraz ponadprzeciętną dbałością o zachowanie klawiatury w nawigacji, formularzu i lightboxie. Na podstawie obecnego stanu źródeł nie wykryto problemów klasy P0, które blokowałyby runtime lub wdrożenie.

Najważniejsze obszary do poprawy dotyczą obecnie progressive enhancement i spójności:
- dwie strony krytyczne treściowo zależą od renderowania po stronie klienta,
- pokrycie wymiarami obrazów nie jest spójne,
- zasady indeksacji i sitemap nie są w pełni dopasowane do zachowania stron,
- utwardzenie deploymentu w `_headers` istnieje, ale nie jest aktywne,
- jedna mapa na stronie kontaktowej nie odpowiada widocznemu adresowi.

Zgodności kontrastu nie da się potwierdzić bez analizy stylów wyliczonych w przeglądarce.

## 2. P0 — Krytyczne ryzyka
Nie wykryto problemów P0 w obecnej implementacji źródłowej.

## 3. Mocne strony
- Architektura CSS jest realnie modularna, a nie tylko nazwana w ten sposób. Główny plik źródłowy importuje osobne moduły dla tokenów, bazy, layoutu, komponentów, sekcji, fontów, podstron i utilities. Dowód: `css/style.css:1-8`.
- Tokeny projektowe są używane centralnie przez `:root`, nadpisania dla motywu ciemnego i konsumpcję po stronie komponentów, zamiast rozproszonego hardcodowania stylów. Dowód: `css/modules/tokens.css:1-99`.
- Obsługa klawiatury i fokusu jest wyraźnie lepsza niż przeciętnie w statycznym serwisie. Nawigacja mobilna zamyka fokus w obrębie menu i przywraca go po zamknięciu, a lightbox wspiera wejście z klawiatury, strzałki, `Escape` i przywracanie fokusu. Dowód: `js/features/nav.js:11-83`, `js/features/lightbox.js:21-178`.
- Formularz kontaktowy zachowuje model progressive enhancement po stronie transportu. JS dodaje `novalidate` dopiero po załadowaniu, waliduje pola i blokuje submit wyłącznie dla niepoprawnych danych. Dowód: `js/features/form.js:7-62`, `contact.html:252-317`.
- Pokrycie SEO w `<head>` jest szerokie i spójne na stronach publicznych: meta description, canonical, Open Graph, robots i inline JSON-LD są obecne w źródłach. Dowód: `index.html:9-65`, `about.html:9-55`, `contact.html:9-55`, `gallery.html:9-55`, `tours.html:9-55`, `tour.html:9-65`.
- Breadcrumb structured data zostało ograniczone do statycznych stron z widoczną ścieżką okruszkową, zamiast być dodane wszędzie. Dowód: `about.html:38-55`, `contact.html:38-55`, `gallery.html:38-55`, `tours.html:38-55`, `polityka-prywatnosci.html:65-79`, `regulamin.html:65-79`, `cookies.html:66-80`.
- Ładowanie fontów jest relatywnie bezpieczne jak na statyczny projekt: lokalne variable fonts są zadeklarowane z `font-display: swap`. Dowód: `css/modules/fonts.css:1-11`.
- Obsługa reduced motion istnieje w źródłowym CSS. Dowód: `css/modules/base.css:67`, `css/modules/layout.css:264`.
- Style do druku zostały jawnie przygotowane dla treści prawnych. Dowód: `css/modules/utilities.css:3-34`.
- Deployment i higiena assetów są wspierane przez narzędzia repozytorium: service worker, manifest, redirecty i skrypty sprawdzające integralność assetów są obecne. Dowód: `service-worker.js:1-82`, `_redirects:1`, `site.webmanifest:1-73`, `package.json:8-18`.

## 4. P1 — Ulepszenia warte wykonania w następnym kroku
1. `gallery.html` zależy od JavaScript dla swojej głównej treści, więc bez JS strona jest w praktyce pusta.
   Wpływ: słabszy baseline bez JS, słabsza odporność na crawlery i mniejsza stabilność przy błędzie pobrania JSON.
   Dowód: `gallery.html:197` renderuje pusty `<div class="container gallery-grid" data-gallery aria-live="polite"></div>`, a `js/features/gallery.js:9-22` pobiera `assets/data/gallery-data.json` i czyści kontener przy błędzie.

2. `tour.html` udostępnia indeksowalny stan generyczny zanim zostanie rozwiązany prawidłowy parametr query i payload JSON.
   Wpływ: strona może zostać zaindeksowana w stanie, który nie reprezentuje realnej oferty, co osłabia zarówno UX, jak i jakość SEO.
   Dowód: `tour.html:11-12` ustawia `index,follow` i canonical URL; `tour.html:149` pokazuje `Brak wybranej oferty`; `tour.html:162` pokazuje `Nie znaleziono lub nie wybrano oferty`; `js/features/tour-detail.js:4-21` kończy działanie wcześniej, gdy brak `id`, i wypełnia treść dopiero po `fetch("assets/data/tours.json")`.

3. Pokrycie wymiarami obrazów jest niespójne pomiędzy szablonami źródłowymi a obrazami generowanymi przez JS.
   Wpływ: większe ryzyko layout shift i mniej przewidywalny rendering, szczególnie na stronach z kartami ofert i w galerii.
   Dowód: `contact.html:206-217` zawiera responsywny obraz treści bez jawnych `width`/`height`; `tours.html:246-470` powiela obrazy kart ofert bez jawnych wymiarów; `js/features/gallery.js:62-72` ustawia `src`, `srcset`, `sizes`, `loading` i `tabIndex`, ale nigdy nie ustawia `width` ani `height`. Dla kontrastu silniejszy wzorzec jest już użyty w `index.html:205-210` i `about.html:239-246`.

4. Osadzona mapa na stronie kontaktowej nie odpowiada widocznemu zapisowi adresu.
   Wpływ: problem z wiarygodnością i precyzją na kluczowej stronie konwersyjnej.
   Dowód: widoczny adres używa `ul. Marynarki Wojennej 12` w `contact.html:231-234`, ale query w iframe używa `Marynarki+Wojennej+12/31` w `contact.html:243`.

5. Nagłówki bezpieczeństwa są obecne w `_headers`, ale znajdują się w bloku komentarza, więc na podstawie repozytorium utwardzenie nie jest aktywne.
   Wpływ: postawa bezpieczeństwa deploymentu jest słabsza, niż sugeruje zawartość repozytorium.
   Dowód: `_headers` zawiera dyrektywy nagłówków wewnątrz bloku komentarza rozpoczynającego się w `_headers:1`, w tym `Content-Security-Policy` w `_headers:2` i `X-Content-Type-Options` w `_headers:4`.

## 5. P2 — Drobne dopracowania
- Logowanie do konsoli nadal występuje w narzędziach buildowych. Nie jest to problem runtime, ale uniemożliwia ścisłe zaliczenie punktu „no console.log in repo”. Dowód: `scripts/clean-dist.js:8`, `scripts/build-dist.js:80-81`, `scripts/check-asset-integrity.js:282`.

## 6. Przyszłe rozszerzenia
1. Dodać niezależny od JS fallback treści lub `<noscript>` dla galerii, aby strona pozostawała znacząca bez JavaScript.
2. Zastąpić generyczną powierzchnię indeksacji `tour.html` albo statycznie generowanymi stronami szczegółów, albo jawnie nieindeksowanym flow szablonowym.
3. Ujednolicić jawne wymiary obrazów we wszystkich szablonach źródłowych i rendererach JS.
4. Aktywować `_headers` po zweryfikowaniu CSP oraz wymagań map/embedów względem obecnego modelu deploymentowego.
5. Dodać lekki krok CI łączący kontrolę integralności assetów, parsowanie JSON-LD i accessibility smoke check.

## 7. Checklista zgodności
| Check | Status | Dowód |
|---|---|---|
| Hierarchia nagłówków poprawna | Pass | Reprezentatywne strony utrzymują stabilną strukturę `h1` -> `h2` -> `h3` bez oczywistych nadużyć semantycznych w źródłach. Dowód: `index.html:412-428`, `about.html:245-275`, `contact.html:176-317`, `tour.html:162-180`. |
| Brak błędnych linków z wyłączeniem intencjonalnej strategii minifikacji | Pass | Skrypt sprawdzający integralność assetów istnieje w `package.json:17`, a kontrola repozytorium zwróciła `Asset integrity check passed (12 HTML files scanned).` |
| Brak `console.log` | Fail | `console.log` występuje w narzędziach buildowych: `scripts/clean-dist.js:8`, `scripts/build-dist.js:80-81`, `scripts/verify-built-css.js:24`, `scripts/verify-built-js.js:19`, `scripts/check-css-assets.js:93`, `scripts/check-asset-integrity.js:282`. |
| Atrybuty ARIA poprawne | Pass | Nawigacja, tabs, formularz i breadcrumbs używają spójnych statycznych wzorców ARIA. Dowód: `contact.html:120-144`, `contact.html:252-317`, `index.html:412-428`, `js/features/nav.js:25-44`, `js/features/form.js:74-127`. |
| Obrazy mają `width`/`height` | Fail | Część obrazów ma wymiary jawne, ale wiele obrazów treści nadal ich nie ma. Dowód: pozytywne przykłady `index.html:205-210`, `about.html:239-246`; przykłady braków `contact.html:206-217`, `tours.html:246-470`, `js/features/gallery.js:62-72`. |
| Baseline bez JS używalny | Fail | Główne strony `gallery.html` i `tour.html` zależą od ładowania danych przez JS dla swojej podstawowej treści. Dowód: `gallery.html:197`, `js/features/gallery.js:9-22`, `tour.html:149-180`, `js/features/tour-detail.js:4-21`. |
| Sitemap obecny tam, gdzie oczekiwany | Pass | `robots.txt:4` wskazuje `sitemap.xml`, a `sitemap.xml:1-31` istnieje. |
| Robots obecny | Pass | Meta robots występuje na stronach indeksowalnych i narzędziowych. Dowód: `index.html:11`, `about.html:11`, `contact.html:11`, `404.html:11`, `offline.html:11`, `dziekuje.html:11`. |
| OG image istnieje | Pass | Strony referują wspólny obraz OG, a plik istnieje w repozytorium. Dowód: `index.html:30`, `about.html:30`, `contact.html:30`, plus `assets/img/og-cover.svg`. |
| JSON-LD poprawny | Pass | Źródłowe strony HTML z blokami JSON-LD zostały poprawnie sparsowane w trakcie audytu; strony narzędziowe celowo nie zawierają JSON-LD po wcześniejszym cleanupie. Dowód: `index.html:65`, `about.html:38-55`, `contact.html:38-55`, `gallery.html:38-55`, `tours.html:38-55`, `tour.html:65`, `polityka-prywatnosci.html:65-79`, `regulamin.html:65-79`, `cookies.html:66-80`. |

## 8. Ocena architektury (0–10)
- Spójność BEM: `8.5/10`
  Uzasadnienie: nazewnictwo jest w dużej mierze spójne pomiędzy layoutem, komponentami i klasami stanów.
- Użycie tokenów: `8.5/10`
  Uzasadnienie: tokeny są scentralizowane i wielokrotnie używane, z nadpisaniami motywu i modularnymi importami.
- Dostępność: `7.5/10`
  Uzasadnienie: nawigacja, lightbox, skip links, semantyka formularza i obsługa reduced motion są mocne; luki w treści bez JS nadal obniżają ocenę.
- Wydajność: `7.0/10`
  Uzasadnienie: pomagają responsywne formaty, lazy loading, variable fonts, minifikowane assety i service worker; brakujące wymiary obrazów i treści zależne od JS obniżają wynik.
- Maintainability: `8.0/10`
  Uzasadnienie: modularny CSS/JS i skrypty repozytorium są dobre; pozostaje kilka problemów spójności w headers, strategii sitemap/indexacji oraz duplikacji tokenów.

**Łączna ocena architektury: 7.9/10**

## 9. Ocena seniorska (1–10)
**8/10**

Uzasadnienie techniczne: to repozytorium pokazuje realną dyscyplinę front-end engineering. Podział na źródła i build jest czytelny, system CSS jest uporządkowany, moduły JS są dobrze wydzielone, a dostępność i SEO nie zostały potraktowane jako dodatek na końcu. Wyższy wynik ogranicza głównie fakt, że dwie strony user-facing nadal zależą od renderowania po stronie klienta dla kluczowej treści, rozmiary obrazów nie są jeszcze stosowane systemowo, a spójność deployment/security nie została domknięta w source control.
