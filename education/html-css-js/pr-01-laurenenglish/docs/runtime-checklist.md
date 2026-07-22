# Runtime checklist (prod)

## Build

- Zainstaluj zadeklarowane zależności: `npm install`.
- Uruchom pełny build: `npm run build`.
- Sprawdź parity i semantykę wspólnego shellu: `npm run check:html`.
- Sprawdź integralność publicznych treści i destinations: `npm run check:content`.
- Sprawdź tokeny, selektory i kontrast obu motywów: `npm run check:css`.
- Sprawdź routing, indeksowanie, metadane, JSON-LD, sitemapę i robots: `npm run check:seo`.
- Sprawdź lifecycle PWA, manifest, precache i krytyczne zasoby: `npm run check:pwa`.
- Sprawdź lokalny serwer, live reload i rebuild HTML: `npm run check:dev`.
- Po celowej zmianie UI odtwórz aktualne screenshoty manifestu: `npm run build:pwa-screenshots`.
- Potwierdź, że powstały:
  - `service-worker.js`
  - `assets/pwa/screenshots/home-desktop-1280x720.png`
  - `assets/pwa/screenshots/home-mobile-720x1280.png`
- Sprawdź, czy `service-worker.js` nie zawiera placeholderów, a rewizja cache ma postać `<version z package.json>-<12 znaków fingerprintu>`.
- Potwierdź, że `npm run build` składa HTML i Service Worker bez tworzenia `dist/` oraz bez aktualizowania zachowanych outputów legacy w `assets/build/`.

## Runtime assets

- Otwórz każdą stronę (`index.html`, `uslugi.html`, `pakiety.html`, `materialy.html`, `postepy.html`, `thank-you.html`, `offline.html`, `404.html`) i w DevTools → Network upewnij się, że:
  - `/css/style.css` zwraca HTTP 200 z MIME `text/css`.
  - `/js/main.js` zwraca HTTP 200 z MIME JavaScript i jest ładowane jako moduł.
  - Dokładny lokalny graf 27 plików CSS i 20 modułów JavaScript ładuje się bez 404, duplikatów i requestów zewnętrznych.
  - Nie ma requestów do `/assets/build/style.min.css` ani `/assets/build/main.min.js`.
  - `/assets/img/logo/logo.svg` zwraca HTTP 200 z MIME `image/svg+xml` i jest pobierane tylko raz mimo użycia w headerze i footerze.
  - Fonty Inter 400/600/700 i Literata 700 ładują się z `/assets/fonts/` jako `font/woff2`, bez odpowiedzi 404, duplikatów i zewnętrznych requestów; Inter 500 nie jest requestowany, a jedyny preload wskazuje Literata 700.
  - Konsola nie zawiera błędów modułów ani błędów ładowania zasobów.

## Lokalny development

- Uruchom `start-dev.bat` dwuklikiem w Windows albo użyj `npm run dev`; wymagany jest Python 3, a serwer działa wyłącznie na `http://127.0.0.1:8181/`.
- Potwierdź, że launcher zgłasza zajęty port czytelnym błędem, składa HTML przed startem, pozostaje w foreground i zatrzymuje się po `Ctrl+C`.
- Potwierdź automatyczne otwarcie przeglądarki, nagłówki `no-store`, poprawne MIME oraz projektowy `404.html` z prawdziwym statusem `404`.
- Zmień zwykłe źródło CSS/JS i potwierdź pojedynczy reload. Następnie zmień zależność assemblera (`scripts/shared-shell.mjs`, konfigurację strony, renderer lub kanoniczne dane) i potwierdź, że `npm run build:html` kończy się przed reloadem.
- Wymuś błąd assemblera wyłącznie w kontrolowanej lokalnej próbie: konsola ma pokazać błąd, reload ma zostać wstrzymany, a kolejna poprawna zmiana ma przywrócić workflow. Nie zostawiaj uszkodzonych źródeł.
- Potwierdź brak pętli po outputach: watcher pomija `.git/`, `.codex/`, `.agents/`, `node_modules/`, raporty testowe, `assets/build/`, `service-worker.js` i pliki tymczasowe edytora.
- Na porcie `8181` potwierdź wyrejestrowanie wyłącznie `/service-worker.js` oraz usunięcie wyłącznie cache `lauren-english-v*`; obce rejestracje i cache muszą pozostać.

## Responsive smoke test

- Sprawdź osiem stron przy szerokości desktopowej i mobilnej.
- Potwierdź, że przy szerokościach 320, 390, 768, 1024 i 1440 px nagłówki Literata z polskimi znakami nie powodują nowych przesunięć, nakładania treści ani poziomego overflow.
- Na pierwszej wizycie strony indeksowanej potwierdź informacyjny Project Disclosure Modal, fokus wewnątrz natywnego `dialog`, blokadę tła oraz zamknięcie wyłącznie przez „Przejdź do strony”. Strony prawne i techniczne nie mogą go automatycznie otwierać.

## Playwright E2E

- Zainstaluj zależności bez lockfile: `npm install --no-package-lock`.
- Zainstaluj Chromium: `npx playwright install chromium`.
- Uruchom kompletny build i browser E2E: `npm run test:e2e`.
- W razie potrzeby uruchom osobno: `test:e2e:smoke`, `test:e2e:interactions`, `test:e2e:theme` lub `test:e2e:responsive`; testy smoke i responsive chronią kontrakty współdzielonego logo, lokalnych fontów, MIME, rodzin typograficznych i polskich znaków.
- Routing i metadane uruchom osobno przez `npm run test:e2e:seo`; pięć tras indeksowanych i wymagane zasoby muszą zwracać `200`, a nieznane ścieżki muszą zwracać projektowy dokument z HTTP `404`.
- Lifecycle i offline uruchom osobno przez `npm run test:e2e:pwa`; tylko ten plik testowy włącza Service Workery, sprawdza skróty i wszystkie assety manifestu oraz sprząta stan.
- Widoki bazowe to Chromium desktop `1440 × 900` oraz mobile `390 × 844`; responsive suite dodatkowo sprawdza szerokości 320, 768 i 1024 px.
- Raport HTML otwórz przez `npm run test:e2e:report`; lokalne `playwright-report/`, `test-results/` i `blob-report/` pozostają poza Git.
- Zwykłe E2E używa izolowanych kontekstów i blokuje Service Workery, aby nie korzystać ze starego cache ani zapisanego stanu. `pwa.spec.mjs` jawnie używa `serviceWorkers: "allow"`.

## SEO i routing

- Potwierdź origin `https://education-pr-01-lauren-english.netlify.app` w `scripts/site-config.mjs`.
- Potwierdź, że canonical i `og:url` są identyczne na pięciu stronach indeksowanych.
- Potwierdź kanoniczny raster `assets/og/og.png` (`image/png`, `1200 × 630`) oraz odpowiedź HTTP `200`.
- Potwierdź `noindex, nofollow` i brak canonical na `404.html`, `offline.html` i `thank-you.html`.
- Potwierdź, że `sitemap.xml` zawiera tylko pięć tras indeksowanych, bez niezweryfikowanych `lastmod`.
- Potwierdź pojedynczy wpis `Sitemap:` w `robots.txt` i brak catch-all rewrite do `index.html` w `_redirects`.

## Service Worker i offline

- `npm run build:sw` musi najpierw potwierdzić, że wszystkie ścieżki precache istnieją, są znormalizowane i unikalne, zawierają dokładny skonfigurowany graf 27 plików CSS i 20 modułów JavaScript oraz nie wskazują na `assets/build/`.
- Oczekuj jednego bieżącego cache `lauren-english-v<version>-<fingerprint>`. Identyczne wejścia nie zmieniają rewizji; zmiana szablonu, konfiguracji lub treści precache zmienia fingerprint.
- Instalacja jest atomowa z perspektywy aktywnego workera: `skipWaiting` następuje dopiero po pełnym precache, a błąd usuwa niekompletny nowy cache. Aktywacja przejmuje klientów i usuwa wyłącznie starsze cache zaczynające się od `lauren-english-v`; inne cache originu muszą pozostać.
- Online pięć głównych tras działa network-first. Tylko pełna, nieprzekierowana odpowiedź HTML `200` znanej trasy może odświeżyć jej wpis. Nieznana trasa online pozostaje realnym `404` i nie jest zapisywana.
- Offline znana główna trasa korzysta ze swojej kopii precache. Inna nawigacja pokazuje `offline.html`; nie używaj homepage jako fallbacku.
- Statyczne cache-first dotyczy wyłącznie jawnych assetów precache, w tym bezpośrednich źródeł CSS/JS, ikon instalacyjnych i trzech ikon skrótów, współdzielonego logo oraz fallbacków JPEG i wariantów AVIF/WebP obrazów treści wymaganych do kompletnych głównych stron offline. Screenshoty manifestu, katalog materiałów i outputy `assets/build/` nie są precachowane. Zapisywane są tylko same-origin żądania `GET` HTTP(S) z pełną odpowiedzią `200`; query string jest normalizowany do jednej ścieżki. Nie zapisuj `206`, 4xx/5xx, redirectów, opaque, cross-origin ani innych metod.

## Manifest i krytyczne zasoby

- `/site.webmanifest` musi zwrócić `application/manifest+json`, zawierać komplet wymaganych pól, dokładnie trzy unikalne skróty do `/pakiety.html`, `/materialy.html` i `/postepy.html`, instalacyjne PNG `192 × 192` i `512 × 512` oraz screenshoty `1280 × 720` (`wide`) i `720 × 1280` (`narrow`). Wszystkie trasy i assety muszą zwracać `200`, a rozmiary i MIME muszą odpowiadać deklaracjom.
- Nie deklaruj `maskable`, dopóki osobna ikona nie ma zweryfikowanej strefy bezpiecznej.
- Hero ma używać `<picture>` z kolejnością AVIF, WebP i fallbackiem JPEG `/assets/img/hero/hero-01.jpg`; przeglądarka ma pobrać dokładnie jeden obsługiwany wariant o wymiarach `1600 × 1200`, z `loading="eager"`, `fetchpriority="high"` i bez przesunięcia layoutu.
- Budżet krytyczny homepage: dokładnie 27 lokalnych requestów CSS, 20 lokalnych requestów JavaScript, 4 fonty (Inter 400/600/700 i Literata 700, razem maks. 185 kB), 1 współdzielone logo, 1 hero (maks. 1,1 MB), zero requestów `assets/build/`, zewnętrznych fontów i duplikatów.

## Netlify

- Obecny build nie tworzy `dist/`. W panelu Netlify ustaw base directory na root repozytorium, build command na `npm run build`, a publish directory na `.`.
- Repozytorium nie ma `netlify.toml`; nie zakładaj, że ustawienia panelu zostały zweryfikowane lokalnie.
- Potwierdź, że publikowany root zawiera osiem samodzielnych stron, katalogi `css/`, `js/`, `assets/`, wygenerowany `service-worker.js`, manifest, sitemapę, robots i wygenerowany `_redirects`.
- Nie przełączaj publish directory na `dist/` przed osobną, ukończoną migracją do Vite.

## Manualna kontrola po wdrożeniu

- W bezpiecznym kontekście HTTPS otwórz DevTools → Application → Service Workers i potwierdź aktywny `/service-worker.js`, właściwy scope `/` oraz kontrolę strony po odświeżeniu.
- Kliknij **Update**, odśwież i potwierdź, że po aktywacji pozostaje jeden cache `lauren-english-v*`; cache o innej nazwie testowej nie może zostać usunięty.
- Przy połączeniu online potwierdź `200` pięciu tras i prawdziwy `404` dla nieznanej trasy. Następnie włącz Offline i sprawdź pięć tras oraz osobny fallback nieznanej trasy.
- W Network potwierdź budżet krytycznych zasobów, brak `inter-500.woff2`, brak requestów `/assets/build/` oraz brak błędów konsoli, strony i zasobów.
- Nie deklaruj zweryfikowanego browser install prompt na podstawie samych testów localhost; lokalnie potwierdzane są manifest, ikony, bezpieczny kontekst, rejestracja, aktywacja, kontrola i cache.
