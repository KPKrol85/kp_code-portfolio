# KP_Code Digital Vault

Profesjonalny frontend sklepu z produktami cyfrowymi (frontend-only) przygotowany jako portfolio‑level UI. Projekt wykorzystuje HTML, CSS oraz Vanilla JS (ES Modules) bez frameworków i backendu.

## Najważniejsze funkcje

- Routing hash (`#/...`) z dynamicznymi meta tagami i obsługą 404.
- Katalog produktów z filtrowaniem, wyszukiwaniem i sortowaniem.
- Koszyk + checkout (mock) z walidacjami i ekranem sukcesu.
- Konto użytkownika (rejestracja/logowanie) + biblioteka zakupów i licencje.
- Dark/Light mode z zapisem preferencji.
- A11y: skip link, focus management, aria-live dla toastów, semantyka.

## Dlaczego routing hash?

Aplikacja jest statyczna i działa bez backendu. Hash routing (`#/...`) pozwala na poprawne przełączanie widoków również po otwarciu `index.html` bez potrzeby konfiguracji serwera. Przy wdrożeniu z backendem można łatwo przejść na `history.pushState`.

## Architektura

```
active-project/
├── assets/           # grafiki i placeholdery
├── data/             # mock API (products, licenses)
├── js/
│   ├── components/   # UI components (toast, modal, header)
│   ├── pages/        # strony/route’y
│   ├── router/       # prosty router
│   ├── services/     # mock API, auth, storage
│   ├── store/        # state management (pub/sub)
│   └── utils/        # helpery (format, validators, sanitize)
├── legal/            # demonstracyjne dokumenty prawne
├── styles/           # tokeny i style komponentów
├── index.html
└── README.md
```

## Uruchomienie

Aby uniknąć ograniczeń fetch w `file://`, uruchom prosty serwer statyczny:

```bash
cd active-project
python -m http.server 8080
```

Następnie otwórz `http://localhost:8080`.

## Dane i pseudo‑backend

- Produkty i licencje są w `data/*.json`.
- LocalStorage przechowuje: koszyk, użytkowników, sesję, zakupy, motyw.
- Hasła są haszowane prostą funkcją `simpleHash` (tylko demonstracja, bez realnego bezpieczeństwa).

## Bezpieczeństwo / CSP

- Brak inline `<script>`.
- Brak `eval`.
- Dane są renderowane przez `textContent` i `createElement`.
- `sanitizeText` to prosty helper pokazujący, jak czyścić tekst (nie zastępuje biblioteki sanitization dla produkcji).

## Ograniczenia

- Brak backendu i prawdziwych płatności (mock).
- Hash routing zamiast history API.
- Dane i „pobieranie” plików są demonstracyjne.

## Dane firmy

- Brand: KP_Code Digital Vault
- Właściciel: Kamil Król
- Adres: ul. Marynarki Wojennej 12/31, 33-100 Tarnów, Polska
- Telefon: +48 533 537 091
- Email: kontakt@kp-code.pl
