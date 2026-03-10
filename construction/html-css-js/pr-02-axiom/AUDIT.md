# AUDIT — pr-02-axiom

## 1. Executive summary
Projekt ma dojrzałą bazę dla statycznego serwisu produkcyjnego: modularną strukturę CSS/JS, szerokie pokrycie SEO, formularz z progressive enhancement i warstwę PWA. Największe ryzyka dotyczą utrzymania i operacyjnej spójności deploymentu, a nie krytycznej stabilności runtime.

## 2. P0 — Critical risks
Brak potwierdzonych problemów P0 w analizie statycznej (brak dowodu na runtime breakage, blocker a11y lub blocker deploymentu).

## 3. Strengths
- Semantyczna struktura dokumentu i nawigacji (skip link, `header/nav/main/footer`, logiczne sekcje). Dowód: `index.html:263-317`, `index.html:1222-1230`.
- Formularz kontaktowy ma no-JS baseline, walidację klienta, statusy `aria-live`, podsumowanie błędów i focus management. Dowód: `index.html:1143-1217`, `js/components/forms.js:45-50`, `js/components/forms.js:128-145`.
- Obsługa `prefers-reduced-motion` w CSS i JS. Dowód: `css/base/base.css:165-180`, `js/components/scroll-top.js:36-37`.
- Obrazy są dostarczane responsywnie (`picture`, AVIF/WebP/JPEG, `srcset/sizes`) i z wymiarami. Dowód: `index.html:320-350`, `index.html:449-458`, `services/budowa-domow.html:156-167`.
- SEO i crawlability są obecne: canonical, OG/Twitter, robots, sitemap, JSON-LD. Dowód: `index.html:11-33`, `robots.txt:4-17`, `sitemap.xml:5-78`, `index.html:56-257`.

## 4. P1 — Improvements worth doing next
1. Reguły przekierowań produkcyjnych pozostają na etapie przygotowania, więc warstwa canonical/HTTPS nie jest jeszcze finalnie skonfigurowana.
   Dowód: _redirects:1-4 (same komentarze, brak mapowań).
2. Structured data jest utrzymywane częściowo inline w HTML i częściowo w pomocniczych plikach JSON, co jest akceptowalne w obecnym projekcie portfolio, ale pozostawia lekko rozproszone miejsce zarządzania danymi schema.
   Dowód: inline bloki np. index.html:56-257; równoległe pliki js/structured-data/index.json, js/structured-data/service-budowa-domow.json.
3. Łańcuch @import w css/main.css dotyczy wyłącznie warstwy source/dev i jest zgodny z obecną organizacją projektu, choć przed buildem pozostaje mniej optymalny niż pojedynczy arkusz wynikowy.
   Dowód: css/main.css:1-19 (19 importów warstw CSS).
4. Logowanie w skryptach build/QA opiera się na prostych console.log, co jest funkcjonalne w obecnym workflow, ale nie stanowi jeszcze w pełni uporządkowanego standardu outputu pipeline.
   Dowód: tools/images/build-images.mjs:56, tools/release/build-dist.mjs:104, tools/sw/build-sw.mjs:74, tools/qa/run-pa11y.mjs:62.

## 5. P2 — Minor refinements
- Wyrównać strategię cache dla `manifest.webmanifest` (`immutable` + krótki max-age bywa operacyjnie mylący przy częstych zmianach ikon). Dowód: `_headers:27-29`.
- Rozważyć ograniczenie liczby preloadów fontów do faktycznie krytycznych wariantów na każdej podstronie. Dowód: `index.html:49-50`, `services/budowa-domow.html:49-50`.

## 6. Future enhancements
1. Dodać automatyczny checker linków lokalnych i kotwic do domyślnego CI.
2. Dodać automatyczny test zgodności SEO: `canonical` ↔ `og:url` ↔ `sitemap.xml`.
3. Zautomatyzować walidację JSON-LD per strona w QA build.
4. Dodać smoke-testy klawiaturowe dla menu mobilnego, lightboxa i modala.
5. Dodać raport pokrycia obrazów (`loading`, `width/height`, formaty) jako quality gate.

## 7. Compliance checklist
- **Headings valid:** **PASS** — na 15 stronach HTML wykryto po jednym `h1` (skrypt walidacyjny).
- **No broken links excluding intentional minification strategy:** **PASS** — skan lokalnych `href/src` nie wykrył brakujących plików.
- **No console.log:** **FAIL** — `console.log` występuje w narzędziach (`tools/images/build-images.mjs:56`, `tools/release/clean-dist.mjs:10`, `tools/sw/build-sw.mjs:74`).
- **ARIA attributes valid:** **PASS (statycznie)** — `aria-controls` ma odpowiadające cele, a `aria-expanded` jest zarządzane w kodzie. Dowód: `index.html:283-307`, `js/components/navigation.js:33-37`, `js/components/navigation.js:66-70`.
- **Images have width/height:** **PASS (przegląd stron głównych i reprezentatywnych podstron)**. Dowód: `index.html:346-347`, `index.html:453-454`, `services/budowa-domow.html:162-163`.
- **No-JS baseline usable:** **PASS** — nawigacja jest widoczna bez klasy `js`, formularz ma fallback bez JS. Dowód: `css/layout/layout.css:202-207`, `index.html:1213-1215`.
- **Sitemap present if expected:** **PASS** — `sitemap.xml` obecny i wskazany w `robots.txt`. Dowód: `sitemap.xml:1-80`, `robots.txt:17`.
- **Robots present:** **PASS** — `robots.txt` istnieje oraz meta robots obecne w HTML. Dowód: `robots.txt:4-17`, `index.html:12`.
- **OG image exists:** **PASS** — wskazany obraz OG ma plik w repozytorium. Dowód: `index.html:20`, `assets/img/og/og-1200x630.jpg`.
- **JSON-LD valid:** **PASS (statyczny parse)** — 15 bloków JSON-LD parsuje się poprawnie (skrypt walidacyjny Python).

## 8. Architecture score (0–10)
**8.3 / 10**
- **BEM consistency: 8.4/10** — dominują spójne klasy `block__element` w layout/components (`site-nav__*`, `footer__*`, `project-modal__*`).
- **Token usage: 8.7/10** — silna warstwa tokenów i motywów light/dark. Dowód: `css/tokens/tokens.css:1-124`.
- **Accessibility: 8.5/10** — dobra semantyka, focus, no-JS baseline, reduced-motion; bez pełnej walidacji kontrastu runtime.
- **Performance: 8.1/10** — nowoczesna strategia obrazów, lazy loading, SW, preload fontów; do poprawy źródłowe `@import` chain.
- **Maintainability: 7.8/10** — dobra modularność, ale są sygnały martwego kodu i rozproszonego source-of-truth.

## 9. Senior rating (1–10)
**8.2 / 10**  
To solidna implementacja front-endowa z dobrym poziomem inżynierii dla statycznego serwisu (SEO + A11y + PWA + modularność). Ocena obniżona głównie za kwestie utrzymaniowo-operacyjne (redirect policy, spójność danych strukturalnych, porządek pipeline), nie za krytyczne błędy użytkowe.
