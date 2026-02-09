# Outland Gear — outdoor & travel marketplace (demo)

Front‑only demo aplikacji e‑commerce dla marki **Outland Gear**. Projekt to statyczny, wielostronicowy marketplace (HTML/CSS/JS), gotowy do uruchomienia lokalnie bez instalacji.

## Założenia
- Vanilla HTML/CSS/JS bez frameworków i build tooli.
- ES Modules, lokalne dane JSON i placeholdery SVG.
- Marketplace vibe: gęste listy, filtry, szybkie akcje.

## Struktura folderów
```
.
├── assets/svg/            # lokalne placeholdery SVG
├── css/
│   ├── components/        # komponenty UI (nav, cards, forms...)
│   ├── pages/             # style per strona
│   ├── base.css
│   ├── layout.css
│   ├── main.css
│   └── tokens.css
├── data/
│   ├── categories.json
│   └── products.json
├── js/
│   ├── modules/           # logika modułowa
│   ├── app.js
│   ├── config.js
│   └── utils.js
├── index.html
├── kategoria.html
├── produkt.html
├── koszyk.html
├── checkout.html
├── o-nas.html
├── kontakt.html
├── robots.txt
└── sitemap.xml
```

## Jak uruchomić lokalnie
1. Otwórz folder `e-commerce-pr02-outland-gear/`.
2. Uruchom prosty serwer statyczny (np. `python -m http.server`).
3. Otwórz `http://localhost:8000/index.html` w przeglądarce.

## Dane JSON (schema)
**`data/products.json`**
- `id`, `name`, `slug`
- `category`, `subcategory`
- `price`, `currency`, `oldPrice` (opcjonalnie)
- `rating`, `reviewsCount`
- `badges` (np. `Bestseller`, `New`, `Eco`)
- `shortDescription`, `highlights` (lista), `specs` (obiekt), `stockStatus`
- `images` (lokalne SVG)

**`data/categories.json`**
- `id`, `name`, `slug`, `subcategories` (lista)

## Funkcje
- Sticky header + dropdown kategorii (a11y).
- Wyszukiwarka z debounce (listing).
- Listing z filtrami (price, rating, subcategory, badges, sorting) i „Load more”.
- Karta produktu z galerią, specyfikacją i sekcją „Często kupowane razem”.
- Koszyk w `localStorage` z wersjonowaniem schematu.
- Checkout demo z walidacją i ekranem sukcesu.

## QA checklist
- [ ] Lighthouse (Performance, Accessibility, SEO)
- [ ] W3C Validator (HTML/CSS bez krytycznych błędów)
- [ ] Nawigacja klawiaturą (menu, dropdowny, formularze)
- [ ] Kontrast i focus-visible
- [ ] Formularze (label, autouzupełnianie, komunikaty)

---
Demo projektu: Outland Gear (2024)
