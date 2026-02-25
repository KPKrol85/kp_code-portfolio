# Front-End Audit - Atelier No.02

## 1. Executive summary
Projekt ma dojrzałą strukturę front-endową (modułowe CSS, podział JS na feature modules, spójna semantyka stron), ale obecnie nie przechodzi wymagań WCAG AA z powodu powtarzalnych błędów kontrastu. Strategia assetów minifikowanych (`.min.css`, `.min.js`) została potraktowana jako świadoma decyzja build/deploy i nie została zaklasyfikowana jako błąd krytyczny w środowisku deweloperskim.

## 2. P0 - Critical risks

### P0.1 - Niezgodność kontrastu WCAG AA na kluczowych podstronach
- Impact:
  - realna bariera dostępności (WCAG2AA fail),
  - ryzyko odrzutu audytów accessibility,
  - pogorszona czytelność treści stopki i elementów dekoracyjnych.
- Evidence:
  - `npm run check:a11y` (pa11y-ci) -> fail na 8/10 URL: `/`, `/about.html`, `/menu.html`, `/gallery.html`, `/cookies.html`, `/polityka-prywatnosci.html`, `/regulamin.html`, `/thank-you.html`.
  - `css/base/tokens.css:134` -> `--footer-text: #000000;` (dark theme)
  - `css/layout/footer.css:4` -> `color: var(--footer-text);`
  - dodatkowo niskokontrastowe ikony gwiazdek w sekcji awards (`about.html`, raport pa11y).
- Fix:
  - podnieść kontrast tokenów tekstu dla dark theme (np. jasny `--footer-text`),
  - skorygować kolor elementów `awards__icon` i zweryfikować wszystkie kombinacje tekst/tło,
  - utrzymać pa11y jako quality gate przed publikacją.
- Effort: `M`

## 3. Strengths
- Czytelna architektura CSS: `base/`, `layout/`, `components/`, `pages/`.
- Design tokens są centralnie utrzymywane w `css/base/tokens.css`.
- JS ma modularny podział (`js/app`, `js/features`, `js/core`) i inicjalizację per-page (`js/app/init.js`).
- Formularz kontaktowy ma poprawną strukturę (label/controls), walidację klienta, honeypot i fallback no-JS.
- SEO baseline jest wdrożony konsekwentnie: canonical, OG, robots meta, JSON-LD (tam gdzie użyte), `robots.txt`, `sitemap.xml`.
- Link/anchor scan lokalny: brak uszkodzonych relatywnych ścieżek i anchorów po wyłączeniu intencjonalnych referencji `.min`.

## 4. P1 - 5 improvements worth doing next

### 1. Dostosować walidację HTML do przyjętego standardu DOCTYPE
- Reason:
  - `html-validate` failuje na `index.html:1` (`DOCTYPE should be uppercase`).
- Suggested improvement:
  - zmienić `<!doctype html>` na `<!DOCTYPE html>` albo świadomie skorygować regułę `doctype-style` w konfiguracji walidatora.

### 2. Uzupełnić `sitemap.xml` o indeksowalne strony
- Reason:
  - `contact.html` jest indexable (`contact.html:12` -> `index,follow`), ale nie występuje w `sitemap.xml`.
- Suggested improvement:
  - dodać `https://gastronomy-project-02.netlify.app/contact.html` do mapy witryny i utrzymywać sitemapę automatycznie w release process.

### 3. Naprawić niespójność tokenów kolorów (`--c-accent`, `--c-muted`)
- Reason:
  - użycie niezdefiniowanych tokenów obniża przewidywalność stylów i utrudnia utrzymanie.
  - dowody: `css/pages/home.css:152`, `css/pages/home.css:299`, `css/layout/footer.css:225`.
- Suggested improvement:
  - zdefiniować tokeny w `tokens.css` albo zastąpić je istniejącymi zmiennymi (`--burgundy`, `--text-muted`, `--c-ink`).

### 4. Usunąć duplikację stylów animacji reveal
- Reason:
  - reguły `.reveal` są obecne jednocześnie w `css/components/animations.css` i `css/pages/home.css`, co zwiększa ryzyko regresji.
- Suggested improvement:
  - pozostawić jeden canonical source (komponentowy), a duplikat w `home.css` usunąć.

### 5. Urealnić skrypt link check pod strategię non-min dev
- Reason:
  - obecny `check:links` raportuje false-positive w dev przez referencje `.min`, mimo że strategia zakłada ich deploy-stage obecność.
- Suggested improvement:
  - dodać osobny wariant link-check dla dev (ignorujący `.min`) i produkcyjny wariant uruchamiany po `npm run build`.

## 5. P2 - Minor refinements
- Ujednolicić język komunikatów no-JS (część stron ma komunikat po polsku, `contact.html` używa komunikatu po angielsku).
- Dodać krótkie komentarze techniczne przy bardziej złożonych blokach JS (np. focus trap w `nav.js`) dla szybszego onboardingu.
- Rozważyć uporządkowanie drobnych redundancji deklaracji stylów linków w `nav.css`/`footer.css`.

## 6. Future enhancements - 5 realistic ideas
1. Dodać CI workflow (GitHub Actions) uruchamiający `npm run check` na PR.
2. Włączyć automatyczny audyt Lighthouse CI z budżetami wydajności.
3. Dodać e2e testy klawiaturowe (menu mobilne, lightbox, modal legalny) w Playwright.
4. Wygenerować sitemapę i robots z jednego źródła danych przy buildzie.
5. Rozszerzyć monitorowanie jakości o snapshoty wizualne (light/dark + breakpoints).

## 7. Compliance checklist (pass/fail)
- headings valid: **PASS**
- no broken links (excluding intentional .min strategy): **PASS**
- no console.log: **PASS**
- aria attributes valid: **PASS**
- images have width/height: **PASS**
- no-JS baseline usable: **PASS**
- sitemap present (if expected): **PASS**
- robots present: **PASS**
- OG image exists: **PASS**
- JSON-LD valid: **PASS**

## 8. Architecture Score (0-10)
- BEM consistency: `8.2/10`
- token usage: `7.2/10`
- accessibility: `5.4/10`
- performance: `7.4/10`
- maintainability: `7.8/10`

**Overall Architecture Score: `7.2/10`**

## 9. Senior rating (1-10)
**Senior rating: `7.3/10`**

Architektura i implementacja są na poziomie solidnego projektu portfolio produkcyjnego, ale aktualnie końcową ocenę obniża krytyczny obszar dostępności (kontrast WCAG AA) oraz kilka istotnych niespójności utrzymaniowych.
