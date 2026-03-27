# AUDIT — VOLT GARAGE (static repository audit)

## 1. Executive summary
Audit wykonano wyłącznie na podstawie implementacji w katalogu `audit-pr/pr-01-voltgarage`, bez założeń poza kodem. Projekt jest dobrze uporządkowany, ma modularny JS, przewidziane QA i solidne podstawy SEO/PWA. Największe ryzyka dotyczą baseline no-JS dla katalogu produktów, polityki CSP (`unsafe-inline`) oraz drobnych niespójności semantyczno-wydajnościowych (np. brak wymiarów części obrazów w 404).  

Zakres potwierdzony repo:
- MPA HTML + moduły ES (`js/main.js`). Evidence: `js/main.js:1-214`.
- PWA stack (manifest + SW + offline). Evidence: `site.webmanifest:1-75`, `sw.js:1-120`, `offline.html:1-456`.
- QA automations (links + JSON-LD) i działające lokalnie walidacje. Evidence: `scripts/validate-internal-links.js:1-159`, `scripts/validate-jsonld.js:1-199`.

---

## 2. P0 — Critical risks
Brak potwierdzonych P0 na podstawie statycznej analizy repo.

---

## 3. Strengths
1. **Modularna architektura front-end** (core/ui/features/services) i centralny bootstrap aplikacji. Evidence: `js/main.js:1-214`.
2. **Dobra obsługa dostępności w nawigacji i modalu** (aria-expanded, focus trap, klawiatura, skip-link). Evidence: `index.html:138-205`, `js/ui/header.js:75-179`, `js/ui/focus-trap.js:1-54`, `js/ui/demo-modal.js:26-77`.
3. **PWA i offline readiness** (cache versioning, offline fallback, update UX). Evidence: `sw.js:1-120`, `js/ui/pwa-prompts.js:67-147`, `offline.html:1-456`.
4. **SEO fundamentals obecne** (canonical, OG/Twitter, JSON-LD, robots, sitemap). Evidence: `index.html:29-103`, `robots.txt:1-4`, `sitemap.xml:1-63`.
5. **Token-driven theming i font strategy** (`font-display: swap`, light/dark token sets). Evidence: `css/partials/themes.css:2-173`, `js/ui/theme.js:33-60`.
6. **Wbudowane kontrole jakości** i możliwość egzekwowania spójności linków/JSON-LD. Evidence: `package.json:30-40`, `scripts/validate-internal-links.js:134-153`, `scripts/validate-jsonld.js:161-193`.

---

## 4. P1 — Improvements worth doing next (exactly 5)
1. **No-JS baseline katalogu jest ograniczony funkcjonalnie** — listy produktów w kluczowych widokach są ładowane dynamicznie, a bez JS pozostaje tylko komunikat fallback (brak realnego katalogu do przeglądania). Evidence: `index.html:342-344`, `pages/shop.html:299-301`, `js/features/products.js:129-160`.  
2. **CSP dopuszcza `unsafe-inline` dla script/style** — to osłabia ochronę XSS i utrudnia dalsze hardening/security reviews. Evidence: `_headers:6`.  
3. **Niespójne width/height obrazów między stronami** — np. w `404.html` logo w header/footer nie ma wymiarów, podczas gdy w głównych stronach zwykle są obecne; może to zwiększać ryzyko CLS. Evidence: `404.html:111`, `404.html:249`, `index.html:146-147`, `index.html:291-292`.  
4. **CSS entry oparty o `@import` chain** — może wydłużać render path względem pojedynczego zbundlowanego arkusza. Evidence: `css/main.css:2-5`.  
5. **Konfiguracja `_redirects` jest minimalna (tylko 404)** — brak deklaracji dla potencjalnych wariantów URL (np. slash/no-slash) nie jest błędem runtime, ale ogranicza kontrolę routingową i spójność canonical behavior. Evidence: `_redirects:1`.

---

## 5. P2 — Minor refinements
1. W `products.js` zostały komentarze techniczne `<!-- CHANGED: img -> picture -->` wewnątrz template strings; warto oczyścić dla czytelności kodu produkcyjnego. Evidence: `js/features/products.js:53-54`, `js/features/products.js:73-74`.
2. Brak meta robots per-page (jest tylko `robots.txt`), co jest akceptowalne, ale można dodać jawne polityki dla stron typu 404/offline. Evidence: `404.html:1-85`, `offline.html:1-85`, `robots.txt:1-4`.
3. `SearchAction` w JSON-LD wskazuje endpoint `/search`, którego nie wykryto jako wdrożonego widoku; nie jest blocker, ale semantyka może być myląca. Evidence: `offline.html:78-82`, `404.html:78-82`.

---

## 6. Future enhancements (exactly 5)
1. Dodać statyczny SSR-like fallback listy produktów dla `shop` i `featured`, aby baseline bez JS był użyteczny.
2. Wprowadzić CSP nonce/hash i ograniczyć inline scripts (szczególnie theme preload).
3. Dodać CI pipeline uruchamiający `npm run qa`, `npm run qa:links`, `npm run validate:jsonld` na każdym PR.
4. Rozważyć budowanie jednego pliku CSS bez runtime `@import`.
5. Uzupełnić monitoring jakości (np. automatyczny raport Lighthouse smoke z trendem metryk).

---

## 7. Compliance checklist
- **Headings valid:** **PASS** — obecna logiczna hierarchia `h1` + sekcyjne `h2/h3` na stronach głównych i podstronach. Evidence: `index.html:301-397`, `pages/contact.html:261-299`.
- **No broken links (excluding intentional minification strategy):** **PASS** — walidator linków przechodzi dla 14 plików HTML. Evidence: `scripts/validate-internal-links.js:134-153` + wynik uruchomienia `node scripts/validate-internal-links.js`.
- **No console.log:** **PASS** — nie wykryto `console.log` w źródłach; występuje `console.error` (observability). Evidence: wyszukiwanie `rg -n "console\.log"` w projekcie (brak trafień), `js/main.js:171-204`.
- **Aria attributes valid:** **PASS** (statycznie) — poprawne użycie `aria-expanded`, `aria-controls`, `aria-modal`, `aria-current` ustawiane także runtime. Evidence: `index.html:156-253`, `js/ui/header.js:33-131`, `js/ui/demo-modal.js:26-70`.
- **Images have width/height:** **FAIL** — część obrazów nie ma jawnych atrybutów wymiarów (np. 404 logo). Evidence: `404.html:111`, `404.html:249`.
- **No-JS baseline usable:** **FAIL (partial baseline only)** — w kluczowych listingach produktów bez JS pozostaje komunikat, nie pełna treść katalogu. Evidence: `index.html:342-344`, `pages/shop.html:299-301`, `js/features/products.js:129-160`.
- **Sitemap present if expected:** **PASS** — sitemap istnieje i obejmuje główne URL. Evidence: `sitemap.xml:1-63`.
- **Robots present:** **PASS** — `robots.txt` obecny. Evidence: `robots.txt:1-4`.
- **OG image exists:** **PASS** — wskazany asset istnieje i jest referencjonowany w meta OG. Evidence: `index.html:38-40`, `assets/images/og/og-1200x630.jpg`.
- **JSON-LD valid:** **PASS** — skrypt walidacyjny przechodzi dla 14 HTML + asercje template-specific. Evidence: `scripts/validate-jsonld.js:161-193` + wynik `node scripts/validate-jsonld.js`.

---

## 8. Architecture score (0–10)
**Overall: 8.1 / 10**

Breakdown:
- **BEM consistency: 8.2/10** — klasy komponentowe i modyfikatory są stosowane spójnie (`card`, `card--skeleton`, `footer-col--newsletter`). Evidence: `css/partials/components.css:422-423`, `pages/contact.html:421-422`.
- **Token usage: 9.0/10** — szerokie użycie custom properties dla typografii, spacingu, kolorów i theme variants. Evidence: `css/partials/themes.css:45-173`.
- **Accessibility: 8.0/10** — dobre fundamenty (focus, keyboard nav, reduced motion, aria), ale no-JS baseline katalogu ograniczony. Evidence: `css/partials/base.css:62-126`, `js/ui/header.js:138-172`, `js/ui/reveal.js:5-8`.
- **Performance: 7.8/10** — nowoczesne formaty obrazów i lazy loading plus SW cache; do poprawy m.in. `@import` chain i pełna spójność wymiarów obrazów. Evidence: `index.html:265-296`, `js/features/products.js:24-48`, `css/main.css:2-5`, `404.html:111`.
- **Maintainability: 7.5/10** — modułowa struktura i QA scripts są mocne; nadal warto domknąć CI enforcement i security hardening CSP. Evidence: `package.json:30-40`, `_headers:6`.

---

## 9. Senior rating (1–10)
**8.0 / 10**

Techniczne uzasadnienie: repo przedstawia dojrzałą organizację kodu front-end z realnym naciskiem na jakość (linting/walidacje), PWA i dostępność runtime. Brak P0, ale kilka istotnych elementów P1 (no-JS baseline produktu, CSP `unsafe-inline`, drobne niespójności CLS/caching strategy) obniża ocenę do poziomu „production-near, requires targeted hardening”.
