# FRONTEND AUDIT — Ambre (`pr-01-ambre`)

## 1. Executive summary
Projekt spełnia standard portfolio produkcyjnego dla statycznego front-endu: ma spójną modularną architekturę CSS, sensowny podział funkcji JS, poprawną bazę SEO technicznego, konfigurację PWA oraz deployment pod Netlify. W aktualnym przeglądzie statycznym nie wykryto błędów klasy P0.

Najważniejsze dalsze prace dotyczą standaryzacji (jedna polityka assetów produkcyjnych), uproszczenia części logiki nawigacji i rozszerzenia automatycznej walidacji jakości.

## 2. P0 — Critical risks (real issues only)
W aktualnym stanie kodu **nie wykryto problemów P0**.

- Zakres sprawdzony statycznie: linki/anchory/asset paths, meta SEO i sitemap/robots, podstawowe reguły a11y, konfiguracja SW/manifest/Netlify, hygiene (`TODO/FIXME`, `console.log` w kodzie aplikacyjnym).
- Dowody: `node scripts/qa-links.mjs` → PASS, `node scripts/qa-seo.mjs` → PASS.

## 3. Strengths
- Dobra separacja warstw CSS (`base`, `layout`, `components`, `pages`) i centralizacja tokenów (kolory, spacing, typography, motion, radius). 
- A11y: skip link, spójna hierarchia nagłówków, focus trap w nawigacji mobilnej, obsługa `Escape`, `aria-expanded`, `aria-current` oraz fallback no-JS.
- Performance: obrazy AVIF/WebP/JPG przez `picture`, `srcset`, `loading="lazy"`, preload fontów WOFF2 i `font-display: swap`.
- SEO: canonical + OG + Twitter + JSON-LD + robots + sitemap.
- Deployment/security: obecne `_headers` z CSP/politykami bezpieczeństwa oraz `_redirects` z czytelnym mapowaniem.

## 4. P1 — 5 improvements worth doing next

### P1-1. Ujednolicić strategię assetów produkcyjnych
- **Reason:** W projekcie istnieją skrypty budujące pliki minifikowane (`css/style.min.css`, `js/script.min.js`), ale strony ładują warianty źródłowe (`/css/style.css`, `/js/script.js`).
- **Suggested improvement:** Wprowadzić jeden jawny tryb release (minified albo source), opisać go w checklist release i egzekwować skryptem QA.

### P1-2. Uspójnić semantykę `aria-current` w nawigacji
- **Reason:** W kodzie nawigacji używane są dwa warianty wartości: `aria-current="location"` (scrollspy) i `aria-current="page"` (page routing), co utrudnia utrzymanie spójności.
- **Suggested improvement:** Przyjąć jednolitą konwencję dla wszystkich scenariuszy (np. `page` dla podstron, `location` dla sekcji) i opisać ją jako standard.

### P1-3. Ograniczyć duplikację logiki aktywnej nawigacji
- **Reason:** Aktywacja linków jest realizowana przez kilka funkcji (`initScrollspy`, `initAriaCurrent`, `initSmartNav`), co zwiększa ryzyko kolizji przy dalszej rozbudowie.
- **Suggested improvement:** Zrefaktoryzować do jednego modułu stanu aktywnego linku (jedno źródło prawdy, rozdzielone adaptery dla podstron i hashy).

### P1-4. Rozszerzyć QA o walidację JSON-LD i manifestu
- **Reason:** QA SEO jest obecne, ale nie ma dedykowanego kroku walidującego strukturę JSON-LD i manifest według schematów.
- **Suggested improvement:** Dodać krok CI, który sprawdza parse JSON-LD, wymagane pola schema.org oraz poprawność ikon/ścieżek manifestu.

### P1-5. Dodać formalny gate dla testów a11y w CI
- **Reason:** Skrypt `qa:a11y` istnieje, ale wymaga środowiska Playwright; bez tego etap może być pomijany lokalnie.
- **Suggested improvement:** Dodać pipeline CI z preinstalowanym Playwright i progami akceptacji (blokada merge przy regresji krytycznej).

## 5. Future enhancements — 5 realistic ideas
1. Dodać testy regresji wizualnej (np. Playwright screenshot diff) dla headera, menu i lightboxa.
2. Dodać automatyczny report Web Vitals (LCP/CLS/INP) dla deployment preview.
3. Rozszerzyć strategię cache SW o precyzyjne TTL/runtime cache invalidation dla obrazów.
4. Wprowadzić tokens documentation (living style reference) generowaną z `tokens.css`.
5. Dodać wersję EN treści stron HTML (nie tylko dokumentacji).

## 6. Compliance checklist (pass / fail)
- **headings valid:** PASS
- **no broken links:** PASS
- **no console.log:** PASS (w kodzie aplikacyjnym front-end; logi wykryte tylko w skryptach narzędziowych)
- **aria attributes valid:** PASS
- **images have width/height:** PASS
- **no-JS baseline usable:** PASS
- **sitemap present (if expected):** PASS
- **robots present:** PASS
- **OG image exists:** PASS
- **JSON-LD valid:** PASS (statyczna walidacja projektu)

## 7. Architecture Score (0–10)
- **BEM consistency:** 8.8/10
- **token usage:** 9.5/10
- **accessibility:** 8.8/10
- **performance:** 8.7/10
- **maintainability:** 8.6/10

**Total architecture score:** **8.9/10**

## 8. Senior rating (1–10) with short professional justification
**9.0/10** — Projekt jest technicznie dojrzały i gotowy jako portfolio front-end: ma stabilną strukturę, dobrze pokryte obszary SEO/a11y/performance i poprawną konfigurację deploymentową. Dalsze prace są głównie optymalizacją maintainability i standaryzacją procesu release.
