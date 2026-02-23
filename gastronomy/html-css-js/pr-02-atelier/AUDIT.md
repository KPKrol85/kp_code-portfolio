# AUDIT.md

## 1. Executive summary
Audit wykonano na realnych plikach projektu `C:\Users\KPKro\MY FILES\active-work\pr-02-atelier` (stan na 23.02.2026). Architektura CSS jest modularna i czytelna (base/layout/components/pages/utilities, tokeny design systemu, konsekwentne nazewnictwo BEM), ale aktualny stan quality gate nie przechodzi. Krytyczne ryzyka dotyczą realnie niedostępnych zasobów obrazów oraz niezaliczonego audytu dostępności kontrastu na większości stron.





### 1) HTML validation baseline cleanup
- Reason: `npm run validate:html` zwraca 72 błędy (m.in. `doctype-style`, brak `type` na `button/input`, `tel-non-breaking`).
- Suggested improvement: Naprawić błędy systemowo na wszystkich szablonach i utrzymywać zero-error baseline w CI.





### 2) ARIA misuse na legendzie menu
- Reason: `menu.html:468` używa `aria-label` na `div`, co validator oznacza jako `aria-label-misuse`.
- Suggested improvement: Przenieść etykietowanie na semantyczny nagłówek/`aria-labelledby` albo usunąć nieprawidłowy atrybut.

### 3) Niespójne entrypointy JS między stronami
- Reason: Część stron ładuje `js/script.js`, część `js/core.js` (`cookies.html:460`, `polityka-prywatnosci.html:496`, `regulamin.html:496`, `404.html:341`).
- Suggested improvement: Ujednolicić entrypoint runtime lub jasno rozdzielić warianty z dokumentacją odpowiedzialności modułów.

### 4) Placeholder URL w sekcji mapy
- Reason: `about.html:793` zawiera link `https://maps.example.com`.
- Suggested improvement: Zastąpić placeholder produkcyjnym adresem mapy lub usunąć CTA do czasu gotowości danych.

### 5) Nierówność metadanych SEO na stronach technicznych
- Reason: `404.html` i `thank-you.html` nie mają pełnego zestawu `og:*`/canonical jak strony główne.
- Suggested improvement: Ujednolicić minimalny profil meta SEO (title + description + canonical + og:url + og:image tam, gdzie zasadne).

## 5. Future enhancements — 5 realistic ideas (exactly five)
1. Dodać automatyczny test sprawdzający istnienie wszystkich plików ze `src/srcset` (pre-commit/CI).
2. Wprowadzić wizualne testy regresji dla komponentów nawigacji i stopki.
3. Rozszerzyć `pa11y-ci` o profile testowe dla motywu jasnego i ciemnego osobno.
4. Dodać etap walidacji JSON-LD (schema lint) do pipeline quality.
5. Spiąć build assetów obrazów (`images:build`) z kontrolą brakujących wariantów wymaganych przez HTML.

## 6. Compliance checklist (pass / fail)
- headings valid: **pass**
- no broken links: **fail**
- no console.log: **pass**
- aria attributes valid: **fail**
- images have width/height: **pass**
- no-JS baseline usable: **pass**
- sitemap present (if expected): **pass**
- robots present: **pass**
- OG image exists: **fail**
- JSON-LD valid: **pass**

## 7. Architecture Score (0–10) with breakdown
- BEM consistency: **8.8/10**
- token usage: **9.1/10**
- accessibility: **6.5/10**
- performance: **7.2/10**
- maintainability: **8.0/10**

Architecture Score: **7.9/10**

## 8. Senior rating (1–10) with short professional justification
**7.8/10** — Fundament architektoniczny jest mocny i portfolio-ready na poziomie struktury, ale projekt wymaga domknięcia jakości wykonawczej (broken assets, fail a11y, błędy walidacji HTML), aby spełnić pełny standard produkcyjny.
