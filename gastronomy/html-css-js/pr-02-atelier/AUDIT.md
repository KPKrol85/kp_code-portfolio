# AUDIT.md — Atelier No.02

## 1. Executive summary
Projekt jest dobrze zorganizowany architektonicznie: modułowy CSS (base/layout/components/pages/utilities), tokeny design systemu i podział JS na moduły funkcjonalne. Implementacja dostępności i SEO jest szeroka jak na portfolio statyczne. W tym przeglądzie nie wykryto ryzyk klasy P0.

## 2. P0 — Critical risks (real issues only)
Nie wykryto krytycznych ryzyk P0 w analizowanych plikach.

## 3. Strengths
- Spójna architektura CSS z centralnymi tokenami i czytelną separacją warstw (`style.css` + importy modułów).
- Implementacja nawigacji mobilnej zawiera kontrolę ARIA, `inert`, focus trap i obsługę klawisza ESC.
- Obsługa preferencji ruchu (`prefers-reduced-motion`) jest zaadresowana po stronie JS i CSS.
- Warstwa obrazów jest zoptymalizowana: `picture` + AVIF/WebP/JPG fallback, `loading="lazy"`, `width`/`height`.
- Warstwa SEO jest kompletna na głównych podstronach (canonical, OG, Twitter, JSON-LD).
- Wdrożone artefakty deploy/PWA: `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `sw.js`.

## 4. P1 — 5 improvements worth doing next

### 1) Niespójność entrypointów runtime vs cache SW
- **Reason:** HTML ładuje niezminifikowane pliki (`css/style.css`, `js/script.js`), a pre-cache SW opiera się na `style.min.css` i `script.min.js`.
- **Suggested improvement:** Albo przełączyć HTML na pliki `.min`, albo zmienić listę pre-cache na rzeczywiście używane entrypointy.

### 2) Zależność od ścieżek absolutnych ogranicza deploy poza root domeny
- **Reason:** W kodzie są liczne odwołania absolutne (`/about.html`, `/#contact`, rejestracja `/sw.js`, `start_url: "/"`), co utrudnia hostowanie pod subpath.
- **Suggested improvement:** Ujednolicić routing/assety do ścieżek relatywnych lub jawnie dodać konfigurację base path.

### 3) Canonical w 404 nie jest kanonicznym adresem absolutnym
- **Reason:** `404.html` używa `href="/"`, co wskazuje stronę główną zamiast URL strony błędu i utrudnia jednoznaczną interpretację sygnału kanonicznego.
- **Suggested improvement:** Dla 404 zostawić `noindex` i ustawić absolutny canonical do `/404.html` lub usunąć canonical z 404.

### 4) Globalny bootstrap JS inicjuje wszystkie feature moduły na każdej stronie
- **Reason:** `initApp()` uruchamia pełną listę inicjalizatorów niezależnie od typu podstrony; moduły same się wyłączają po braku targetów.
- **Suggested improvement:** Wprowadzić selektywne ładowanie/entry per template (home/menu/gallery/legal), żeby uprościć utrzymanie i ograniczyć koszt runtime.

### 5) Brak skryptów jakościowych (lint/test/link-check) w npm scripts
- **Reason:** `package.json` definiuje tylko build/dev/image pipeline; brak skryptów automatycznej walidacji jakości.
- **Suggested improvement:** Dodać skrypty `lint`, `check:links`, `check:a11y`, `validate:html` i spiąć je z CI.

## 5. Future enhancements — 5 realistic ideas
1. Dodać fingerprinting assetów (`style.[hash].css`, `script.[hash].js`) i dostosować politykę cache.
2. Dodać automatyczny crawl linków i anchorów jako krok CI.
3. Rozszerzyć testy dostępności o automatyczne audyty axe/pa11y.
4. Wdrożyć monitoring Core Web Vitals dla produkcji (LCP/CLS/INP).
5. Wydzielić policy/legal bundle jako osobny, lżejszy entry JS.

## 6. Compliance checklist (pass / fail)
- **headings valid:** pass
- **no broken links:** pass
- **no console.log:** pass
- **aria attributes valid:** pass
- **images have width/height:** pass
- **no-JS baseline usable:** pass
- **sitemap present (if expected):** pass
- **robots present:** pass
- **OG image exists:** pass
- **JSON-LD valid:** pass

## 7. Architecture Score (0–10)
- **BEM consistency:** 8.8/10
- **token usage:** 9.2/10
- **accessibility:** 8.9/10
- **performance:** 8.6/10
- **maintainability:** 8.4/10

**Overall Architecture Score:** **8.8/10**

## 8. Senior rating (1–10)
**8.7/10** — Projekt ma poziom portfolio produkcyjnego, z dobrą jakością struktury i dostępności. Największy potencjał poprawy to spójność strategii build/runtime oraz gotowość do automatycznych kontroli jakości.

---

## Evidence map (file references)
- Runtime assets: `index.html` (`css/style.css`, `js/script.js`) oraz analogicznie podstrony. (`index.html`: linie 97, 814)
- SW pre-cache minified assets: `sw.js` linie 12–13.
- Ścieżki absolutne: `index.html` linie 180–181, `404.html` linie 189–193, `js/bootstrap.js` linia 30, `manifest.webmanifest` linie 7–8.
- Canonical 404: `404.html` linia 8.
- Globalna inicjalizacja feature modułów: `js/app/init.js` linie 14–31.
- Brak skryptów jakościowych: `package.json` linie 24–30.
