# VitaFlex Rehabilitacja

Wielostronicowa strona WWW (Vanilla HTML/CSS/JS) dla centrum fizjoterapii i rehabilitacji.

## Struktura
- `index.html`, `uslugi.html`, `zespol.html`, `cennik.html`, `nfz.html`, `faq.html`, `kontakt.html`
- `css/` (tokeny, baza, layout, komponenty, style stron)
- `js/` (moduły: nawigacja, formularz, akordeon, reveal)
- `assets/` (lokalne SVG)
- `robots.txt`, `sitemap.xml`

## Uruchomienie
1. Otwórz folder `pr-02-vitaflex/`.
2. Otwórz `index.html` w przeglądarce.

## Funkcje
- Responsywny, dostępny layout mobile-first.
- Sticky header + dostępne menu mobilne (ESC, focus trap, return focus).
- Akordeon FAQ z obsługą klawiatury.
- Walidacja formularza kontaktowego z komunikatami inline.
- JSON-LD Organization/WebSite oraz FAQPage tylko na FAQ.

## QA checklist
- [x] Jedno `h1` i jedno `main` na stronę.
- [x] `aria-current` na aktywnej stronie.
- [x] Brak `href="#"`, brak inline JS.
- [x] Lokalne assety z `width`/`height` i `loading="lazy"`.
- [x] Poprawne metadane SEO + robots + sitemap.
