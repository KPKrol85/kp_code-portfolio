# AUDIT.md

## 1. Executive summary
Projekt ma dobrą bazę architektoniczną: modularny CSS (`base/layout/components/pages/utilities`), tokeny design systemu i podział JS na moduły funkcjonalne. Dostępność, SEO i performance są wdrożone szeroko, ale audyt wykazał błędy jakościowe w HTML oraz niespójności w pipeline quality/build.

## 2. P0 — Critical risks (real issues only)
Brak wykrytych pozycji P0.

## 3. Strengths
- Spójna architektura CSS i tokeny (`css/style.css`, `css/base/tokens.css`).
- BEM jest stosowany konsekwentnie w warstwie komponentów (`css/components/*.css`, `index.html`).
- Dostępność: skip links, focus-visible, obsługa klawiatury, `prefers-reduced-motion`, modal/lightbox focus trap.
- Form handling: Netlify form + honeypot + walidacja klienta (`index.html`, `js/features/form.js`).
- SEO: canonical + OG + Twitter + JSON-LD + robots + sitemap (`*.html`, `robots.txt`, `sitemap.xml`).
- Obrazy: AVIF/WebP/JPG fallback, `loading="lazy"`, `width`/`height`.

## 4. P1 — 5 improvements worth doing next

### 1) Niepoprawny tag `sourcew` w menu
- Reason: Literówka w elemencie obrazu powoduje niepoprawny HTML i pomija część pipeline responsywnych źródeł.
- Suggested improvement: Zamienić `sourcew` na `source` i ponownie uruchomić `npm run validate:html`.
- Evidence: `menu.html:675`

### 2) Niespójność runtime vs pre-cache Service Workera
- Reason: Runtime ładuje `css/style.css` i `js/script.js`, ale pre-cache SW zawiera `css/style.min.css` i `js/script.min.js`.
- Suggested improvement: Ujednolicić entrypointy (albo HTML na `.min`, albo SW na aktualnie używane pliki).
- Evidence: `index.html:97`, `index.html:813`, `sw.js:12`, `sw.js:13`

### 3) Walidacja ARIA nie przechodzi dla dropdown list
- Reason: `aria-label` na `ul.nav__dropdown` jest raportowane jako `aria-label-misuse` przez `html-validate`.
- Suggested improvement: Usunąć `aria-label` z `ul` i zastosować semantyczny nagłówek/`aria-labelledby` na kontenerze nawigacji.
- Evidence: `index.html:128`, `menu.html:381`, `about.html:166` (+ analogiczne podstrony)

### 4) Skrypt quality `check:server` jest nieprzenośny (Windows)
- Reason: Składnia `WAIT_ON_TIMEOUT=...` działa w shellach UNIX, ale nie działa w PowerShell/CMD.
- Suggested improvement: Dodać `cross-env` lub wersję skryptu platform-agnostic.
- Evidence: `package.json:34`; uruchomienie lokalne kończy się błędem `WAIT_ON_TIMEOUT is not recognized`.

### 5) Skrypt `check:links` jest niestabilny w środowisku Windows z tą konfiguracją
- Reason: `linkinator` zwraca błąd mieszania ścieżek HTTP i filesystem przy aktualnym wywołaniu.
- Suggested improvement: Uruchamiać crawl z pojedynczego URL startowego + `--recurse` albo uprościć listę argumentów przez plik konfiguracyjny.
- Evidence: `package.json:32`; błąd runtime `Paths cannot be mixed between HTTP and local filesystem paths`.

## 5. Future enhancements — 5 realistic ideas
1. Dodać fingerprinting assetów (`[hash]`) i wersjonowanie cache dla stabilniejszych deployów.
2. Rozdzielić bundle JS per template (home/menu/gallery/legal), aby zmniejszyć payload.
3. Rozszerzyć CI o automatyczne uruchamianie `validate:html`, `check:links`, `check:a11y` na PR.
4. Dodać testy regresji a11y dla kluczowych interakcji (menu mobilne, lightbox, formularz).
5. Zmniejszyć dług techniczny przez usunięcie nieużywanych/starszych entrypointów JS (`js/core.js`).

## 6. Compliance checklist (pass / fail)
- headings valid: pass
- no broken links: pass
- no console.log: pass
- aria attributes valid: fail
- images have width/height: pass
- no-JS baseline usable: pass
- sitemap present (if expected): pass
- robots present: pass
- OG image exists: pass
- JSON-LD valid: pass

## 7. Architecture Score (0–10) with breakdown
- BEM consistency: 8.7/10
- token usage: 9.2/10
- accessibility: 8.3/10
- performance: 8.1/10
- maintainability: 7.9/10

Architecture Score: **8.4/10**

## 8. Senior rating (1–10)
**8.2/10** — Projekt jest portfolio-ready pod kątem struktury i UX, ale wymaga korekt walidacyjnych i ujednolicenia pipeline quality/build, aby spełniał pełny standard production-grade.
