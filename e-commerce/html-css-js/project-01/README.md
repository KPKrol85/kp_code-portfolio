# VOLT GARAGE - Frontend E-commerce

Profesjonalny, portfolio-level projekt frontendowy sklepu z akcesoriami samochodowymi. Zbudowany w czystym HTML, CSS i Vanilla JS (ES Modules) z naciskiem na dostepnosc, performance i nowoczesny UI.

## Funkcjonalnosci
- Sticky header z efektem zmniejszania i nawigacja dostepna z klawiatury
- Dark / Light mode z zapisem w localStorage
- Animacje reveal respektujace prefers-reduced-motion
- Lista produktow z JSON, filtrowanie i sortowanie
- Strona produktu z galeria i dodawaniem do koszyka
- Koszyk oparty o localStorage (ilosci, suma, usuwanie, aria-live)
- Checkout i formularz kontaktowy z walidacja JS

## Struktura projektu
```
/e-commerce-01
|-- index.html
|-- pages/
|   |-- shop.html
|   |-- product.html
|   |-- cart.html
|   |-- checkout.html
|   |-- contact.html
|-- assets/
|   |-- images/
|   |-- icons/
|-- css/
|   |-- base.css
|   |-- layout.css
|   |-- components.css
|   |-- themes.css
|-- js/
|   |-- main.js
|   |-- modules/
|   |   |-- header.js
|   |   |-- theme.js
|   |   |-- reveal.js
|   |   |-- cart.js
|   |   |-- products.js
|   |   |-- filters.js
|   |   |-- accessibility.js
|-- data/
|   |-- products.json
|-- README.md
```

## Uruchomienie
1. Otworz `index.html` w przegladarce.
2. Przegladaj podstrony i testuj funkcjonalnosci.

## Dostepnosc i UX
- Semantyczny HTML, aria-labels, aria-live, aria-current
- Focus-visible i brak pulapek focusa
- Formularze z walidacja i czytelnymi komunikatami

## Rozwoj
- Rozszerz `data/products.json` o nowe kategorie
- Dodaj realne zdjecia w `assets/images`
- Podepnij backend lub API do koszyka i checkout
