# Front-end Audit — pr-01-vista

## 1) Executive summary
Projekt jest spójną implementacją statycznego serwisu hotelowego z modularnym CSS/JS, poprawną bazą SEO (canonical + OG + robots + sitemap), wdrożoną warstwą PWA i konfiguracją Netlify. Nie wykryto krytycznych błędów blokujących runtime (P0). Główne ryzyka dotyczą jakości produkcyjnej CSS, spójności danych strukturalnych oraz drobnych kwestii wydajnościowych w lightboxie.

Najważniejsze fakty potwierdzone w repozytorium:
- Strony mają canonical/OG/robots i JSON-LD fallback. (np. `index.html:48-59`, `index.html:11`, `index.html:15-47`)
- Istnieją `robots.txt` i `sitemap.xml`. (`robots.txt:1-4`, `sitemap.xml:1-30`)
- Wdrożono skip-link i focus-visible. (`index.html:87`, `css/modules/base.css:55-70`, `css/modules/base.css:83-87`)
- Nawigacja mobilna obsługuje focus trap oraz Escape. (`js/features/nav.js:74-98`)
- Service worker i offline fallback są obecne. (`js/script.js:21-31`, `pwa/service-worker.js:45-79`)

## 2) P0 — Critical risks
Brak wykrytych P0 na podstawie audytu statycznego repozytorium.

## 3) Strengths
- Dobra struktura semantyczna i nawigacyjna: pojedynczy `h1` na każdej kluczowej stronie oraz skip-link do `<main>`. (np. `index.html:87`, `index.html:125`, `rooms.html:77`)
- Dostępność interakcji mobilnych i modalnych (obsługa klawiatury, aria-expanded, aria-hidden, focus return). (`js/features/nav.js:27-45`, `js/features/nav.js:74-98`, `js/features/lightbox.js:64-76`)
- Rozsądny baseline no-JS (klasa `no-js` i odpowiednie style). (`index.html:2`, `js/script.js:1`, `css/modules/layout.css:144-153`)
- Responsywne obrazy z AVIF/WebP i `srcset`. (`index.html:131-142`)
- Obecna konfiguracja deploymentu (security headers, redirects, manifest content-type). (`netlify/_headers:11-43`, `netlify/_redirects:1-2`)

## 4) P1 — Improvements worth doing next (exactly 5)
1. **Niepoprawna składnia CSS w `font-size`**  
   `font-size: var(--fs-btn) * 0.9;` nie jest prawidłowym wyrażeniem CSS (powinno być `calc(...)`), więc deklaracja może być ignorowana.  
   **Evidence:** `css/modules/layout.css:33`.

2. **Łańcuch `@import` w pliku podłączanym bezpośrednio w HTML**  
   Strony ładują `css/style.css`, który zawiera serię `@import`, co może zwiększać koszt render-blocking przy produkcyjnym użyciu bez bundlingu.  
   **Evidence:** `index.html:72`, `css/style.css:2-10`.

3. **Niespójność JSON-LD: nieistniejący asset `logo`**  
   Pliki `assets/seo/*.json` wskazują `assets/img/ui/icon-192.png`, którego nie ma w repozytorium, co obniża jakość danych strukturalnych.  
   **Evidence:** `assets/seo/ld-index.json:7` (analogicznie w pozostałych `ld-*.json`), brak pliku `assets/img/ui/icon-192.png`.

4. **Dublowanie strategii JSON-LD (inline fallback + fetch z pliku)**  
   Każda strona zawiera JSON-LD inline, a następnie JS ponownie pobiera payload z `meta[name="ld-json"]`; to podnosi złożoność utrzymania i ryzyko driftu danych.  
   **Evidence:** `index.html:14-47`, `js/features/seo-jsonld.js:2-47`.

5. **Lightbox usuwa `width/height`, zwiększając ryzyko CLS**  
   W module lightboxa po podmianie obrazu usuwane są atrybuty rozmiaru, co może destabilizować layout podczas ładowania pełnych grafik.  
   **Evidence:** `js/features/lightbox.js:34-37`.

## 5) P2 — Minor refinements
- Rozważyć ujednolicenie referencji do produkcyjnych assetów (`style.min.css`) względem obecnego użycia `style.css`.
- Ujednolicić nazewnictwo komentarzy (PL/EN) w plikach konfiguracyjnych dla spójności maintainability.
- Rozważyć dodanie `lastmod` w `sitemap.xml` dla lepszego sygnału crawl freshness.

## 6) Future enhancements (exactly 5)
1. Dodać CI job uruchamiający `check:links` przy każdym PR.
2. Dodać lokalny, deterministyczny test a11y bez dynamicznego `npm exec --package`.
3. Dodać automatyczną walidację schematów JSON-LD i kontrolę istnienia wskazanych assetów.
4. Rozszerzyć monitoring Web Vitals (LCP/CLS/INP) i raportować trend w pipeline.
5. Rozważyć cache strategy per-asset-type w service workerze (np. stale-while-revalidate dla obrazów).

## 7) Compliance checklist
- **Headings valid:** **PASS** (statycznie: po 1x `h1` na przejrzanych stronach).
- **No broken links (excluding intentional minification strategy):** **PASS** (`Link integrity check passed`).
- **No console.log:** **PASS** dla kodu runtime (`js/**`), **N/A** dla skryptów developerskich (`scripts/**`).
- **ARIA attributes valid:** **PASS (static review)** — poprawne użycia `aria-expanded`, `aria-current`, `aria-hidden` i komunikatów `aria-live`.
- **Images have width/height:** **FAIL (partial)** — wyjątek lightboxa (`index.html` + dynamiczne usuwanie w JS).
- **No-JS baseline usable:** **PASS** (fallback `.no-js` i brak hard dependency na JS dla podstawowej nawigacji treści).
- **Sitemap present if expected:** **PASS** (`sitemap.xml` obecny i podany w `robots.txt`).
- **Robots present:** **PASS** (`robots.txt` + meta robots w stronach).
- **OG image exists:** **PASS** (`assets/img/og/og-1200x630.jpg` obecny).
- **JSON-LD valid:** **FAIL (asset consistency)** — niespójny URL `logo` w plikach `assets/seo/*.json`.

## 8) Architecture score (0–10)
- **BEM consistency:** 8.5/10  
- **Token usage:** 8.5/10  
- **Accessibility:** 8.0/10  
- **Performance:** 7.5/10  
- **Maintainability:** 7.5/10  

**Final architecture score:** **8.0/10**

## 9) Senior rating (1–10)
**8.1/10** — solidna baza produkcyjna MPA z dobrą semantyką, SEO i dostępnością, ale z kilkoma ważnymi poprawkami jakościowymi (CSS build strategy, JSON-LD asset consistency, CLS w lightboxie), które warto wykonać w najbliższej iteracji.
