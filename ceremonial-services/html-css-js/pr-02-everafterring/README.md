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

## Keyboard accessibility smoke test

Powtarzaj ten smoke test przed merge, po każdej zmianie w `js/modules/nav.js`, znacznikach headera lub stylach nawigacji.

### Setup
1. Uruchom projekt lokalnie i otwórz dowolną stronę z główną nawigacją.
2. Przygotuj dwa viewporty:
   - mobile: szerokość `860px` lub mniej,
   - desktop: szerokość powyżej `860px`.
3. Test wykonuj wyłącznie klawiaturą.

### Mobile menu
1. Ustaw viewport mobilny i naciśnij `Tab`, aż fokus trafi na przycisk `Menu`.
2. Naciśnij `Enter`.
   Oczekiwane: panel nawigacji otwiera się, `aria-expanded` na przycisku menu zmienia się na `true`, a fokus przechodzi do pierwszego linku lub przycisku w panelu.
3. Naciskaj `Tab`, aż dojdziesz do ostatniego fokusowalnego elementu w panelu.
   Oczekiwane: kolejny `Tab` przenosi fokus z powrotem na pierwszy element panelu.
4. Naciskaj `Shift+Tab` od pierwszego fokusowalnego elementu.
   Oczekiwane: fokus wraca na ostatni fokusowalny element panelu.
5. Gdy fokus jest na przycisku `Usługi`, naciśnij `Enter`.
   Oczekiwane: dropdown otwiera się i fokus przechodzi do pierwszego linku w dropdownie.
6. Zamknij dropdown klawiszem `Escape`.
   Oczekiwane: dropdown zamyka się, a fokus wraca na przycisk `Usługi`.
7. Na przycisku `Usługi` naciśnij `Space`.
   Oczekiwane: dropdown otwiera się lub zamyka tak samo jak po `Enter`, bez przewijania strony.
8. Naciśnij `Escape`, gdy otwarte jest menu mobilne.
   Oczekiwane: menu zamyka się, `aria-expanded` na przycisku menu wraca do `false`, fokus wraca na przycisk `Menu`, a kolejny `Tab` przechodzi dalej po stronie bez uwięzienia w panelu.

### Desktop dropdown
1. Ustaw viewport desktopowy i przejdź klawiszem `Tab` do przycisku `Usługi`.
2. Naciśnij `Enter`.
   Oczekiwane: dropdown otwiera się, `aria-expanded` zmienia się na `true`, fokus przechodzi do pierwszego linku w dropdownie.
3. Powtórz test z klawiszem `Space`.
   Oczekiwane: zachowanie jest identyczne jak dla `Enter`.
4. Naciśnij `Escape` z poziomu linku w dropdownie.
   Oczekiwane: dropdown zamyka się, a fokus wraca na przycisk `Usługi`.
5. Kontynuuj `Tab` i `Shift+Tab`.
   Oczekiwane: kolejność fokusu pozostaje logiczna, dropdown nie przejmuje fokusu po zamknięciu, a reszta strony pozostaje osiągalna z klawiatury.

### Pass criteria
- Menu mobilne otwiera się z klawiatury i trap focus działa tylko wtedy, gdy menu jest otwarte.
- `Tab` i `Shift+Tab` zachowują się przewidywalnie zarówno w menu mobilnym, jak i po jego zamknięciu.
- `Enter` i `Space` aktywują przyciski menu oraz dropdownu bez ubocznych efektów.
- `Escape` zamyka otwarte warstwy i zwraca fokus do logicznego kontrolera.
- Po zamknięciu menu lub dropdownu nie zostaje żaden „stale active” stan fokusu.
