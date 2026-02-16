# FRONTEND AUDIT — Ambre (pr-01-ambre)

## 1. Executive summary
Projekt ma dojrzałą bazę front-endową: modularny CSS z tokenami, semantyczny HTML, wielostronicową strukturę, elementy PWA i zestaw skryptów QA/build. Największe ryzyka produkcyjne dotyczą integralności ścieżek oraz jakości danych kontaktowych (linkowanie + schema). Dodatkowo, część interakcji nie ma pełnego fallbacku bez JavaScript, co osłabia progressive enhancement.

## 2. P0 — Critical risks

### P0-1. Błędny `href` arkusza CSS w `404.html`
- **Impact:** Strona 404 nie ładuje stylów, co obniża jakość UX i wiarygodność strony błędu w produkcji.
- **Evidence:** `404.html:50` → `href=/css/style.min.css"` (niedomknięty/nieprawidłowy atrybut). Potwierdzone przez skrypt: `npm run qa:links` (`Missing file "/css/style.min.css""`).
- **Fix:** Zmienić na poprawny zapis: `<link rel="stylesheet" href="/css/style.min.css" />`.
- **Effort:** S

### P0-2. Nieprawidłowy adres e-mail w `mailto:` i JSON-LD
- **Impact:** Kontakt e-mail jest funkcjonalnie błędny (kliknięcie `mailto:` nie tworzy poprawnego odbiorcy), a dane strukturalne zawierają nieprawidłowe pole `email`.
- **Evidence:** `index.html:79`, `menu.html:76`, `galeria.html:75`, `cookies.html:77`, `polityka-prywatnosci.html:75`, `regulamin.html:77` (`"email": "kontakt-kp-code.pl"` bez `@`), oraz wielokrotne `mailto:kontakt-kp-code.pl` (np. `index.html:775`).
- **Fix:** Ustalić prawidłowy adres i zunifikować: `mailto:adres@domena.tld` oraz `"email": "adres@domena.tld"` we wszystkich stronach.
- **Effort:** S

## 3. Strengths
- Spójna organizacja CSS (`base/layout/components/pages`) oraz centralne tokeny (`css/base/tokens.css`).
- Dobra baza a11y: skip link, `:focus-visible`, logiczna hierarchia nagłówków, `aria-current` i `aria-expanded`.
- Użycie nowoczesnych formatów obrazów (AVIF/WebP) z fallbackami JPEG i lazy loadingiem.
- Rozsądny zestaw metadanych SEO: canonical, OpenGraph, Twitter Card, sitemap, robots.
- Praktyczne skrypty QA i build (`qa-links`, linting, bundling CSS/JS).

## 4. P1 — 5 improvements worth doing next

### P1-1. Progressive enhancement formularza rezerwacji
- **Reason:** Formularz działa wyłącznie JS (`event.preventDefault()`), bez `action` i bez fallbacku serwerowego.
- **Suggested improvement:** Dodać `action` + endpoint (lub Netlify Forms) i pozostawić JS jako warstwę ulepszenia UX.

### P1-2. Usunięcie produkcyjnego `console.log` w lightboxie
- **Reason:** `js/modules/lightbox.js` zawiera jawny log debugowy.
- **Suggested improvement:** Usunąć `console.log("lightbox ready ✨", ...)` lub opakować przez warunek debug.

### P1-3. Poprawa obsługi reduced motion w `scrollIntoView`
- **Reason:** `initScrollTargets()` wymusza `behavior: "smooth"` bez sprawdzenia `prefers-reduced-motion`.
- **Suggested improvement:** Ustalić `behavior` analogicznie jak w `initScrollButtons()` (`auto` dla reduce).

### P1-4. Ujednolicenie relacji zewnętrznych linków
- **Reason:** Część linków z `target="_blank"` używa `noopener`, ale nie wszędzie `noreferrer`.
- **Suggested improvement:** Standaryzować na `rel="noopener noreferrer"` dla wszystkich linków otwieranych w nowej karcie.

### P1-5. Dopracowanie spójności nazewnictwa klas
- **Reason:** Architektura deklaruje BEM, ale w kodzie współistnieją klasy utility/legacy i niespójne konwencje.
- **Suggested improvement:** Wprowadzić reguły lint/konwencję nazewnictwa (np. stylelint selector pattern) i stopniową normalizację.

## 5. Future enhancements — 5 realistic ideas
1. Dodać testy automatyczne dostępności (np. axe) do pipeline QA.
2. Włączyć automatyczną walidację JSON-LD i metadanych w CI.
3. Rozbudować politykę cache SW o strategię aktualizacji assets z wersjonowaniem builda.
4. Dodać obraz OG w nowoczesnych formatach z fallbackiem + walidację wymiarów przy buildzie.
5. Przygotować i opublikować changelog/release notes dla wersji portfolio.

## 6. Compliance checklist (pass / fail)
- **headings valid:** PASS
- **no broken links:** FAIL
- **no console.log:** FAIL
- **aria attributes valid:** PASS
- **images have width/height:** FAIL
- **no-JS baseline usable:** FAIL
- **sitemap present (if expected):** PASS
- **robots present:** PASS
- **OG image exists:** PASS
- **JSON-LD valid:** FAIL

## 7. Architecture Score (0–10)
- **BEM consistency:** 7/10
- **token usage:** 9/10
- **accessibility:** 7/10
- **performance:** 8/10
- **maintainability:** 8/10

**Total architecture score:** **7.8/10**

## 8. Senior rating (1–10)
**8/10** — Projekt jest technicznie solidny i czytelnie zorganizowany, z dobrą bazą jakościową pod portfolio produkcyjne. Ocena jest obniżona przez krytyczny błąd ścieżki w 404, niespójność danych kontaktowych oraz niepełny fallback bez JavaScript.
