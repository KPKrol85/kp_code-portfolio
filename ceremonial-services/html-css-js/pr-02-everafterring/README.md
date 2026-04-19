# EverAfter Ring – demo wedding planning

Demo wielostronicowej strony WWW dla marki **EverAfter Ring** (wedding planning & coordination). Edytowalny kod źródłowy pozostaje w katalogach głównych projektu, a produkcyjny artefakt jest generowany do `dist/`.

## Uruchomienie
### Podgląd źródła
1. Uruchom `start-local-preview.bat` albo `python -m http.server 8181`.
2. Otwórz `http://localhost:8181/`.

Uwaga: podgląd źródła powinien działać przez HTTP, ponieważ współdzielone partiale są ładowane z użyciem `fetch()`.

### Build produkcyjny
1. Zainstaluj zależności: `npm install`
2. Wygeneruj produkcyjny build: `npm run build`
3. Wdróż lub podejrzyj zawartość katalogu `dist/`

## Struktura projektu
```
ceremonial-services-pr02-everafter-ring/
├── dist/              # Generowany build produkcyjny (po npm run build)
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
├── partials/          # Źródłowe fragmenty header/footer dla authoringu
├── scripts/           # Skrypty builda source -> dist
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

## Workflow source / dist
- Edytowalne źródła HTML/CSS/JS pozostają poza `dist/`.
- `partials/header.html` i `partials/footer.html` są używane tylko na etapie authoringu oraz builda.
- `npm run build`:
  - minifikuje CSS do `dist/css/main.min.css`
  - bundluje i minifikuje JS do `dist/js/app.min.js`
  - generuje finalne strony HTML do `dist/` z wbudowanym headerem i footerem
  - kopiuje tylko produkcyjne assety potrzebne do wdrożenia

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
