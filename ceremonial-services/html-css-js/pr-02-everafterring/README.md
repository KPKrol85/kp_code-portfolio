# EverAfter Ring – demo wedding planning

Demo wielostronicowej strony WWW dla marki **EverAfter Ring** (wedding planning & coordination). Projekt działa lokalnie, bez instalacji.

## Uruchomienie

1. Otwórz plik `index.html` w przeglądarce.
2. Przejdź do pozostałych podstron przez nawigację.

## Code Quality

1. Zainstaluj zależności: `npm install`
2. Przebuduj statyczne strony z partiali i szablonów: `npm run build:site`
3. Uruchom pełny zestaw checków: `npm run lint`
4. Uruchom formatowanie źródeł i dokumentacji: `npm run format`
5. Sprawdź format bez zapisu zmian: `npm run format:check`

Dostępne są też osobne komendy: `npm run lint:html`, `npm run lint:css`, `npm run lint:js`. `npm run check` wykonuje pełny baseline: build, lint, `format:check` i `check:static`.

## Shared HTML Workflow

Wspólne fragmenty HTML zostały przeniesione do lekkiej warstwy źródłowej:

- `src/partials/` zawiera współdzielone sekcje `head`, header, footer i wspólny skrypt wejściowy.
- `src/pages/` zawiera źródłowe szablony poszczególnych podstron z placeholderami dla części wspólnych.
- `src/pages.json` trzyma page-specific metadata, canonicale i stan aktywnej nawigacji.
- `npm run build:site` składa te źródła do deploy-ready plików `*.html` w root repo.

Przy zmianach globalnych edytuj najpierw `src/partials/` lub `src/pages.json`, a potem uruchom `npm run build:site`. Rootowe pliki `index.html`, `oferta.html`, `uslugi.html`, `realizacje.html`, `o-nas.html` i `kontakt.html` traktuj jako wynik builda gotowy do statycznego hostingu.

## CI

Repo ma minimalny workflow CI w GitHub Actions. Na `push` i `pull_request` uruchamia on `npm run check`, czyli lokalne linty, `format:check` oraz statyczny `check:static` sprawdzający kluczowe pliki deploy-ready i podstawowe lokalne referencje projektu.

## Pre-release Checklist

### Baseline

- [ ] `npm run check` przechodzi lokalnie bez błędów.
- [ ] CI jest zielone, ale ręczny przegląd releasowy został wykonany osobno.

### Accessibility

- [ ] Wykonano istniejący `Keyboard accessibility smoke test` dla nawigacji i dropdownu.
- [ ] Focus states są widoczne w kluczowych elementach interaktywnych.
- [ ] Komunikaty formularza i statusy `loading/success/error` są czytelne i logiczne.

### SEO

- [ ] Każda publikowana strona ma poprawne `title`, `meta description` i `canonical`.
- [ ] Każda publikowana strona ma tylko jeden `h1`.
- [ ] Placeholderowe dane kontaktowe i structured data zostały sprawdzone przed publikacją.

### Internal links

- [ ] Główna nawigacja i linki w stopce prowadzą do właściwych stron.
- [ ] Główne CTA prowadzą do właściwych podstron lub sekcji.
- [ ] Anchory na `uslugi.html` działają poprawnie.

### Form

- [ ] Walidacja formularza działa poprawnie dla pustych i błędnych danych.
- [ ] Formularz pokazuje poprawne stany `loading`, `success` i `error`.
- [ ] Po błędzie dane formularza zostają, a po sukcesie formularz się resetuje.
- [ ] Honeypot i cooldown nie przeszkadzają w normalnym użyciu formularza.

### Responsive

- [ ] Widok mobile działa poprawnie bez poziomego scrolla.
- [ ] Widok średni/tablet nie rozbija layoutu kluczowych sekcji.
- [ ] Widok desktop zachowuje poprawny układ headera, gridów i formularza.

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
├── scripts/
│   ├── build-site.mjs  # Składanie partiali i szablonów do root HTML
│   └── check-static.mjs # Lekki check deploy-ready statycznych plików
├── src/
│   ├── partials/       # Współdzielone sekcje HTML
│   ├── pages/          # Źródłowe szablony podstron
│   └── pages.json      # Metadata i konfiguracja stron
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
