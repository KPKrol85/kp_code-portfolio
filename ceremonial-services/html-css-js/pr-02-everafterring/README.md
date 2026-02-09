# EverAfter Ring – demo wedding planning

Demo wielostronicowej strony WWW dla marki **EverAfter Ring** (wedding planning & coordination). Projekt działa lokalnie, bez instalacji.

## Uruchomienie
1. Otwórz plik `index.html` w przeglądarce.
2. Przejdź do pozostałych podstron przez nawigację.

## Struktura projektu
```
ceremonial-services-pr02-everafter-ring/
├── assets/            # SVG placeholdery i favicon
├── css/
│   ├── components/    # Komponenty (nav, cards, buttons, forms, footer)
│   ├── pages/         # Style specyficzne dla podstron
│   ├── base.css        # Reset + typografia
│   ├── layout.css      # Siatki i sekcje
│   ├── main.css        # Sekcje wspólne
│   └── tokens.css      # Tokeny kolorów, typografia, spacing
├── js/
│   ├── modules/       # Moduły: nav, form, dom
│   ├── app.js          # Entry point
│   ├── config.js       # Selektory
│   └── utils.js        # Helpery
├── index.html
├── oferta.html
├── uslugi.html
├── realizacje.html
├── o-nas.html
├── kontakt.html
├── robots.txt
└── sitemap.xml
```

## Moduły CSS
- **tokens.css** – paleta kolorów wedding, typografia, spacing i promienie.
- **base.css** – reset, typografia bazowa, focus-visible.
- **layout.css** – kontenery, gridy, układ sekcji, sticky header.
- **main.css** – hero, sekcje kroków, callout, meta.
- **components/** – BEM dla nawigacji, kart, przycisków, formularzy.

## Moduły JS
- **nav.js** – dostępne menu mobilne i dropdown (ESC, click outside, focus management).
- **form.js** – walidacja UX z komunikatami pod polami i statusem aria-live.
- **dom.js** – bezpieczny init po DOMContentLoaded.

## SEO / a11y checklist
- [x] Unikalne `title` i `description` na każdej stronie.
- [x] Canonical i JSON-LD (LocalBusiness + WebSite).
- [x] Jeden `h1` na stronę.
- [x] Semantyczny układ: header/nav/main/footer.
- [x] Skip link i focus-visible.
- [x] Opisowe `alt` oraz `loading="lazy"` dla obrazów poza hero.
- [x] Menu mobilne i dropdown z `aria-expanded` i obsługą klawiatury.

## QA checklist
- [ ] Lighthouse (Performance/SEO/Accessibility).
- [ ] Klawiatura: Tab/Shift+Tab oraz ESC w menu.
- [ ] W3C HTML Validator – brak krytycznych błędów.
- [ ] Kontrast tekstu względem tła.
- [ ] Formularz: walidacja pól i komunikat sukcesu.
