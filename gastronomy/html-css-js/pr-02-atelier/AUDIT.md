# Front-End Audit - Atelier No.02

## 1. Executive summary
Projekt ma solidną bazę architektoniczną (modułowe CSS, podział JS na feature modules, dobre podstawy semantyki i SEO), ale posiada dwa problemy klasy krytycznej: niespójność assetów minifikowanych wpływającą na offline/PWA oraz błędy kontrastu WCAG2AA wykryte na większości stron. Link checking i a11y pipeline zostały uruchomione lokalnie na `2026-02-25`.

## 2. P0 - Critical risks

### P0.1 - Offline i Service Worker odwołują się do nieistniejącego `css/style.min.css`
- Impact: broken offline UX i ryzyko niedziałającej instalacji SW (precache `cache.addAll` może się wywrócić przy 404), co obniża stabilność produkcyjną PWA.
- Evidence:
  - `offline.html:17` - `<link rel="stylesheet" href="/css/style.min.css" />`
  - `sw.js:12` - `"/css/style.min.css",`
  - `npm run check:server` -> linkinator: `[404] http://127.0.0.1:5173/css/style.min.css`
  - lokalnie: `Test-Path css/style.min.css` -> `False`
- Fix: ujednolicić strategię assetów.
  - Opcja A: generować i deployować `css/style.min.css` zawsze przed publikacją.
  - Opcja B: zmienić referencje w `offline.html` i `sw.js` na istniejące `css/style.css`.
  - Dodatkowo: versionować `CACHE_NAME` po każdej zmianie listy plików.
- Effort: `S`

### P0.2 - Krytyczne błędy kontrastu (WCAG2AA) na wielu stronach
- Impact: realny blocker dostępności (WCAG AA fail), ryzyko odrzutu audytów accessibility i obniżona czytelność kluczowych treści stopki.
- Evidence:
  - `npm run check:a11y` (`pa11y-ci`): fail na 8/10 URL (m.in. `/`, `/about.html`, `/menu.html`, `/gallery.html`, `/cookies.html`, `/polityka-prywatnosci.html`, `/regulamin.html`, `/thank-you.html`)
  - tokeny dark mode: `css/base/tokens.css:134` -> `--footer-text: #000000;`
  - stopka używa koloru tekstu: `css/layout/footer.css:4` -> `color: var(--footer-text);`
  - dodatkowy fail kontrastu ikon gwiazdek w sekcji awards (`about.html`, raport pa11y)
- Fix:
  - podnieść kontrast tokenów dark mode (np. jasny `--footer-text` na ciemnym tle),
  - zweryfikować kontrast wszystkich elementów dekoracyjnych/tekstowych w `about` i stopce,
  - dodać automatyczny kontrast gate w CI (np. pa11y jako required check).
- Effort: `M`

## 3. Strengths
- Modułowa architektura CSS jest czytelna i rozdziela `base/layout/components/pages`.
- Tokeny design system są centralnie utrzymane (`css/base/tokens.css`).
- JS ma sensowny podział na `app`, `features`, `core` oraz inicjalizację per-page (`js/app/init.js`).
- Formularz ma sensowną walidację, `aria-live`, honeypot i fallback no-JS (`contact.html`).
- Link validation i HTML/A11y tooling są obecne w skryptach npm (`check`, `check:links`, `check:a11y`).

## 4. P1 - 5 improvements worth doing next

### 1. Uzupełnić `sitemap.xml` o indeksowalną stronę kontaktu
- Reason: `contact.html` ma `robots index,follow` i canonical, ale nie występuje w `sitemap.xml`.
- Suggested improvement: dodać `<loc>https://gastronomy-project-02.netlify.app/contact.html</loc>` i utrzymywać sitemapę automatycznie przy release.

### 2. Usunąć duplikację definicji `.reveal`
- Reason: reguły animacji są zdefiniowane równolegle w `css/components/animations.css` i `css/pages/home.css`, co zwiększa ryzyko regresji.
- Suggested improvement: zostawić jeden canonical source w `components/animations.css`, a z `home.css` usunąć duplikat (`css/pages/home.css:157`, `:162`).

### 3. Naprawić nieistniejące tokeny `--c-accent` i `--c-muted`
- Reason: tokeny są używane, ale nie są zdefiniowane w `tokens.css` (`home.css:152`, `home.css:299`, `footer.css:225`).
- Suggested improvement: albo dodać tokeny do `:root`, albo podmienić na istniejące (`--burgundy`, `--text-muted`, `--c-ink`).

### 4. Ujednolicić wejście runtime vs build output
- Reason: większość stron ładuje `css/style.css` i `js/script.js`, podczas gdy offline/SW używa assetów minifikowanych; to tworzy dwie ścieżki utrzymania.
- Suggested improvement: przyjąć jeden wariant per środowisko (dev/prod) i spiąć to w jednym procesie build/deploy.

### 5. Domknąć zgodność HTML validatora
- Reason: `html-validate` failuje na `index.html:1` (wymagane uppercase `DOCTYPE`).
- Suggested improvement: zmienić `<!doctype html>` na `<!DOCTYPE html>` lub dostosować regułę walidatora do uzgodnionego standardu.

## 5. Future enhancements - 5 realistic ideas
1. Dodać CI workflow (GitHub Actions) uruchamiający `npm run check` na PR.
2. Wygenerować sitemapę i robots z jednego źródła (build step), żeby uniknąć driftu.
3. Dodać budżety wydajności (Lighthouse CI) dla LCP/CLS/TBT.
4. Rozszerzyć structured data o `WebSite` + `SearchAction` (jeśli wyszukiwarka w menu ma być publiczną funkcją serwisu).
5. Dodać wizualne testy regresyjne (np. Playwright snapshots) dla motywów light/dark i breakpointów.

## 6. Compliance checklist (pass/fail)
- headings valid: **PASS**
- no broken links: **FAIL** (`/css/style.min.css` 404)
- no console.log: **PASS** (not detected in project)
- aria attributes valid: **PASS**
- images have width/height: **PASS**
- no-JS baseline usable: **PASS**
- sitemap present (if expected): **PASS**
- robots present: **PASS**
- OG image exists: **PASS** (`assets/img-optimized/og-img/og-img-1200x630.jpg`)
- JSON-LD valid: **PASS** (JSON-LD not detected in project for `404.html`, `offline.html`, `thank-you.html`)

## 7. Architecture Score (0-10)
- BEM consistency: `8.0/10`
- token usage: `7.0/10`
- accessibility: `5.0/10`
- performance: `6.5/10`
- maintainability: `7.5/10`

**Overall Architecture Score: `6.8/10`**

## 8. Senior rating (1-10)
**Senior rating: `6.9/10`**

Projekt jest technicznie dojrzały pod kątem struktury i modularności, ale aktualnie nie spełnia profesjonalnego poziomu produkcyjnego przez dwa krytyczne problemy: failujący offline/PWA asset path oraz powtarzalne błędy kontrastu WCAG AA.
