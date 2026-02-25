# AUDIT — pr-01-vista

## 1) Executive summary
Projekt prezentuje dojrzałą bazę front-endową: modularny CSS (tokens + warstwy), konsekwentny podział JS na funkcje domenowe, poprawne użycie semantyki HTML i szerokie pokrycie meta SEO/OG/canonical. Warstwa dostępności jest wdrożona praktycznie (skip link, focus visible, aria-current, aria-expanded, keyboard support w nav/tabs/lightbox). Wydajność opiera się o nowoczesne formaty obrazów, lazy loading i lokalne fonty WOFF2.

W trakcie audytu wykryto i skorygowano 2 ryzyka krytyczne (P0): brakujący fallback obrazu `deluxe` (JPEG) oraz błędny wpis w sitemap wskazujący nieistniejącą podstronę.

## 2) P0 — Critical risks (real issues)

### P0-1: Nieistniejący fallback JPEG dla pokoju Deluxe (naprawione)
- **Impact:** W przeglądarkach/scenariuszach bez AVIF/WebP obraz Deluxe mógł się nie załadować (degradacja UX i jakości sekcji ofertowej).
- **Evidence:** `index.html` i `rooms.html` odwoływały się do `assets/img/src/rooms/deluxe-1280x853.jpg`, podczas gdy w repo obecny jest `assets/img/src/rooms/deluxe-1208x853.jpg`.
- **Fix:** Zmieniono `src` i `srcset` na istniejący plik `deluxe-1208x853.jpg` oraz poprawiono descriptor szerokości do `1208w`.
- **Effort:** S

### P0-2: Sitemap zawierał nieistniejącą stronę `social.html` (naprawione)
- **Impact:** Crawler otrzymywał URL bez zasobu, co pogarsza jakość indeksacji i sygnały jakości technicznej.
- **Evidence:** `sitemap.xml` zawierał wpis `https://hospitality-pr-01-vista.netlify.app/social.html`, a plik `social.html` nie występuje w projekcie.
- **Fix:** Usunięto błędny wpis z `sitemap.xml`.
- **Effort:** S

## 3) Strengths
- Spójna, modularna architektura CSS z tokenami i jasnym podziałem odpowiedzialności.
- Dobra dyscyplina semantyczna HTML na podstronach (landmarki, czytelna hierarchia nagłówków).
- Dostępność interakcji: keyboard handling i focus management w nawigacji mobilnej, tabach i lightboxie.
- Dobrze pokryte SEO on-page: canonical + og:url alignment, opisy, robots, OpenGraph/Twitter.
- Poprawna konfiguracja bazowa PWA + `offline.html`, manifest i rejestracja SW.

## 4) P1 — 5 improvements worth doing next

1. **Ujednolicenie polityki `console.*` w runtime**
   - **Reason:** W `js/script.js` pozostają logi SW (nawet jeśli częściowo warunkowe), co nie spełnia rygoru „clean runtime console” dla portfolio produkcyjnego.
   - **Suggested improvement:** Wprowadzić centralny logger sterowany flagą build/runtime i usunąć bezpośrednie `console.log/error` z kodu uruchamianego w przeglądarce.

2. **Stabilizacja preload LCP pod kątem finalnych ścieżek produkcyjnych**
   - **Reason:** Preload hero na stronie głównej wskazuje zasoby z `assets/img/src/...`; warto domknąć strategię pod finalne warianty deploymentowe.
   - **Suggested improvement:** Ustalić jednoznaczną politykę: preload dla finalnego assetu produkcyjnego (z hash/versioning), spójnie z rzeczywistym `srcset`.

3. **Doprecyzowanie strategii SW dla aktualizacji zasobów statycznych**
   - **Reason:** SW cache’uje lokalne zasoby dynamicznie; bez jasnej polityki invalidacji może to wydłużać propagację zmian UI.
   - **Suggested improvement:** Wprowadzić wersjonowanie asset manifestu lub precyzyjny whitelist/fingerprint dla krytycznych plików.

4. **Automatyzacja walidacji linków i sitemap w CI**
   - **Reason:** Błąd `social.html` w sitemap pokazał, że brakuje automatycznej kontroli spójności URL.
   - **Suggested improvement:** Dodać skrypt CI sprawdzający istnienie wszystkich lokalnych ścieżek (`href/src`) i wpisów sitemap.

5. **Dodatkowa kontrola semantyki ARIA w testach statycznych**
   - **Reason:** Projekt ma dużo interaktywnych elementów (tabs/lightbox/nav), więc manualna kontrola może być niewystarczająca przy dalszym rozwoju.
   - **Suggested improvement:** Dodać automatyczny test a11y (np. axe-core) dla kluczowych podstron i stanów UI.

## 5) Future enhancements — 5 realistic ideas
1. Dodać wielojęzyczność (PL/EN) z dedykowanymi `hreflang` i osobnymi canonical dla wariantów językowych.
2. Rozbudować formularz o antyspam oparty o limit czasowy + prosty challenge behawioralny (poza honeypotem).
3. Wdrożyć automatyczne generowanie `sitemap.xml` z jednego źródła tras, by wyeliminować ręczne rozjazdy.
4. Rozszerzyć monitoring wydajności o cykliczne raporty Lighthouse CI dla kluczowych URL.
5. Dodać fallback statyczny mapy (obraz + link) dla scenariuszy z blokadą iframe lub restrykcjami prywatności.

## 6) Compliance checklist (pass/fail)
- **headings valid:** PASS
- **no broken links:** PASS (po poprawkach)
- **no console.log:** FAIL (`js/script.js`)
- **aria attributes valid:** PASS
- **images have width/height:** PASS (obrazy contentowe; lightbox image jest dynamiczny)
- **no-JS baseline usable:** PASS
- **sitemap present (if expected):** PASS
- **robots present:** PASS
- **OG image exists:** PASS
- **JSON-LD valid:** PASS

## 7) Architecture Score (0–10)
- **BEM consistency:** 8.8/10
- **token usage:** 9.0/10
- **accessibility:** 8.6/10
- **performance:** 8.3/10
- **maintainability:** 8.7/10

**Architecture Score (weighted): 8.7/10**

## 8) Senior rating (1–10)
**8.6/10** — Projekt jest wiarygodnym, produkcyjnie zorientowanym portfolio front-end. Fundament architektury i jakość implementacji są dobre; dalszy wzrost oceny wymaga automatyzacji kontroli jakości (CI/a11y/link integrity) i domknięcia polityk runtime (logowanie, cache invalidation).
