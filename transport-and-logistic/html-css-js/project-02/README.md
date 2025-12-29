# 🇬🇧 English version below | 🇵🇱 Wersja polska na dole

# 🇬🇧 English version

# FleetOps — transport-02

FleetOps is a modern, app-like **frontend-only SaaS dashboard** for transport and fleet operations management, created as a professional portfolio project.
The application focuses on clean UI architecture, predictable state management, and real-world SaaS navigation patterns — without backend integration.

🔗 **Live demo:** *(add Netlify URL after deploy)*

This project is part of a larger professional portfolio aimed at demonstrating
production-ready frontend structure, performance awareness,
and scalable application design using **Vanilla JavaScript**.

---

## Project Goals

This project was created to practice and demonstrate:

- SaaS-style frontend architecture (app shell + views)
- UI state management without frameworks
- Auth-aware routing and navigation flows
- Session persistence and UX patterns used in real-world SaaS products
- Clean separation between layout, views, components, and state
- Portfolio-level frontend engineering using **Vanilla JavaScript**

There is **no backend by design**. All data and authentication are mocked to keep the focus on frontend logic and structure.

---

## Core Features

### Landing & Marketing

- Marketing landing page with hero, features, pricing, FAQ, testimonials
- Dark / light theme support
- Accessible structure (skip link, semantic markup)

### Authentication (Mock)

- Email/password mock login
- Demo login mode
- Auth state persisted in `localStorage`
- Auth-aware route guarding for `/app/*`

### SaaS Dashboard

- App-like UI with sidebar and top navigation
- Dashboard overview with KPIs and activity feed
- Orders management with:
  - Table view
  - Filters and status badges
  - Details modal
  - CSV export
- Fleet and Drivers sections with filters and modals
- Reports view with basic charts and summary tables
- Settings panel:
  - Theme toggle (light/dark)
  - Compact mode
  - Demo data reset

### Navigation & UX Logic

- Hash-based routing (`#/...`) with refresh-safe navigation
- Protected application routes (`/app/*`)
- Redirect back to intended route after login
- Persisted last visited app view (restored on refresh or fresh load)
- User preferences and UI state stored in `localStorage`

### Legal & Info Pages

- About
- Contact
- Privacy Policy
- Terms of Service
- Cookies information

---

## Technical Overview

### Stack

- HTML5
- CSS3 (custom design system, modular architecture)
- Vanilla JavaScript (ES6)
- Service Worker (offline-ready app shell)
- Netlify (hosting & production configuration)

### Architecture Highlights

- Centralized state store (`store.js`)
- Stateless UI components (modals, tables, dropdowns, toasts)
- Clear separation of:
  - layout
  - views
  - components
  - state
  - routing
- Predictable app bootstrap and session restore flow

### Build & Tooling

- PostCSS + cssnano for production CSS minification
- Optional Terser-based JavaScript minification (no bundling, no mangling)
- Dist-based build structure (`styles/dist`, `js/dist`)
- Netlify configuration:
  - `_headers`
  - `_redirects`
  - `robots.txt`
  - `sitemap.xml`
  - custom `404.html`

---

## File Structure (Simplified)

scripts/
├── utils/ # storage, DOM helpers, formatting
├── state/ # global store and UI state
├── data/ # mock seed data
├── ui/
│ ├── components/ # modal, toast, table, dropdown, etc.
│ ├── views/ # dashboard, orders, fleet, drivers, reports, settings
│ └── layouts/ # landing and app shell layouts
├── router.js # hash router and route guards
└── main.js # application bootstrap


---

## Running the Project Locally

1. Open the `transport-02` directory in your editor.
2. Start any static server, for example:
   - **VS Code Live Server**
   - or:
     ```
     python -m http.server 3000
     ```
3. Open `index.html` in the browser.

Routing is hash-based, so no additional server configuration is required.

---

## Available Routes

### Public

- `#/` — landing page
- `#/login` — login
- `#/about`
- `#/contact`
- `#/privacy`
- `#/terms`
- `#/cookies`

### Application (requires mock authentication)

- `#/app` — dashboard overview
- `#/app/orders`
- `#/app/fleet`
- `#/app/drivers`
- `#/app/reports`
- `#/app/settings`

---

## Notes

- This project intentionally has **no backend**.
- All data and authentication are stored locally using `localStorage`.
- The **Reset demo** option in Settings clears all stored state.
- The codebase is designed to be extended later with a real API or framework if needed.

---

## Status

✔ Completed (v1)

Possible future improvements:

- UI polish and branding refinements
- UX micro-interactions
- Extended accessibility (a11y)
- Optional backend or mock API integration
- Further performance fine-tuning

---

## Disclaimer

FleetOps is a fictional demo project created solely for portfolio and educational purposes.
All names, data, branding, and UI elements are illustrative and do not represent a real transport or logistics company.

---

## Author

Kamil Król
**KP_Code**
Front-End Developer
Portfolio project — 2025

---

## License

This project is provided for portfolio and educational purposes only.

---

---

# 🇵🇱 Wersja polska

# FleetOps — transport-02

FleetOps to nowoczesny, aplikacyjny **frontend-only dashboard typu SaaS** do zarządzania transportem i flotą, stworzony jako profesjonalny projekt portfolio.
Aplikacja skupia się na czystej architekturze interfejsu, przewidywalnym zarządzaniu stanem oraz wzorcach nawigacji znanych z realnych systemów SaaS — bez integracji backendowej.

🔗 **Demo online:** *(uzupełnij po wdrożeniu na Netlify)*

Projekt jest częścią większego, profesjonalnego portfolio, którego celem jest pokazanie
struktury frontendu gotowej do produkcji, świadomości wydajnościowej
oraz skalowalnego projektowania aplikacji przy użyciu **czystego JavaScriptu (Vanilla JS)**.

---

## Cel projektu

Projekt został stworzony w celu ćwiczenia i zaprezentowania:

- architektury frontendu w stylu SaaS (app shell + widoki)
- zarządzania stanem interfejsu bez użycia frameworków
- routingu i nawigacji świadomej stanu autoryzacji
- mechanizmów sesji i wzorców UX spotykanych w realnych produktach SaaS
- wyraźnego podziału na layout, widoki, komponenty i stan
- inżynierii frontendu na poziomie portfolio z użyciem **Vanilla JavaScript**

Projekt **celowo nie posiada backendu**. Dane oraz autoryzacja są mockowane,
aby cała uwaga była skupiona na logice i strukturze frontendu.

---

## Główne funkcjonalności

### Landing & marketing

- Landing marketingowy z sekcjami: hero, funkcje, cennik, FAQ, referencje
- Obsługa trybu jasnego i ciemnego
- Dostępna struktura (skip link, semantyczny HTML)

### Autoryzacja (mock)

- Logowanie email/hasło (mock)
- Tryb logowania demo
- Stan autoryzacji zapisywany w `localStorage`
- Ochrona tras aplikacyjnych `/app/*` w zależności od stanu logowania

### Dashboard SaaS

- Interfejs aplikacyjny z bocznym menu i górną nawigacją
- Widok główny z KPI oraz feedem aktywności
- Zarządzanie zamówieniami:
  - widok tabelaryczny
  - filtry i statusy
  - modal ze szczegółami
  - eksport do CSV
- Sekcje Flota i Kierowcy z filtrami i modalami
- Widok raportów z prostymi wykresami i tabelami podsumowującymi
- Panel ustawień:
  - przełącznik motywu (jasny/ciemny)
  - tryb kompaktowy
  - reset danych demo

### Nawigacja i logika UX

- Routing oparty o hash (`#/...`) odporny na odświeżenie strony
- Chronione trasy aplikacyjne (`/app/*`)
- Przekierowanie do pierwotnej trasy po zalogowaniu
- Zapamiętywanie ostatniego widoku aplikacji
- Preferencje użytkownika i stan UI zapisywane w `localStorage`

### Strony informacyjne i prawne

- O projekcie
- Kontakt
- Polityka prywatności
- Regulamin
- Informacja o cookies

---

## Przegląd techniczny

### Stack technologiczny

- HTML5
- CSS3 (własny system projektowy, architektura modularna)
- JavaScript (ES6, vanilla)
- Service Worker (app shell gotowy do pracy offline)
- Netlify (hosting i konfiguracja produkcyjna)

### Architektura

- Centralny store stanu (`store.js`)
- Bezstanowe komponenty UI (modale, tabele, dropdowny, toasty)
- Wyraźny podział na:
  - layout
  - widoki
  - komponenty
  - stan
  - routing
- Przewidywalny proces inicjalizacji aplikacji i odtwarzania sesji

### Build & tooling

- PostCSS + cssnano do produkcyjnej minifikacji CSS
- Opcjonalna minifikacja JavaScriptu oparta o Terser (bez bundlingu i manglingu)
- Struktura build oparta o katalogi `dist` (`styles/dist`, `js/dist`)
- Konfiguracja Netlify:
  - `_headers`
  - `_redirects`
  - `robots.txt`
  - `sitemap.xml`
  - własna strona `404.html`

---

## Struktura plików (uproszczona)

scripts/
├── utils/ # storage, helpery DOM, formatowanie
├── state/ # globalny store i stan UI
├── data/ # mockowane dane startowe
├── ui/
│ ├── components/ # modale, toasty, tabele, dropdowny itd.
│ ├── views/ # dashboard, orders, fleet, drivers, reports, settings
│ └── layouts/ # layout landingowy i app shell
├── router.js # routing hash + ochrona tras
└── main.js # bootstrap aplikacji

---

## Uruchomienie lokalne

1. Otwórz katalog `transport-02` w edytorze.
2. Uruchom dowolny serwer statyczny, np.:
   - **VS Code Live Server**
   - lub:
     ```
     python -m http.server 3000
     ```
3. Otwórz `index.html` w przeglądarce.

Routing oparty o hash nie wymaga dodatkowej konfiguracji serwera.

---

## Dostępne trasy

### Publiczne

- `#/` — landing
- `#/login` — logowanie
- `#/about`
- `#/contact`
- `#/privacy`
- `#/terms`
- `#/cookies`

### Aplikacja (wymaga mockowanej autoryzacji)

- `#/app` — dashboard główny
- `#/app/orders`
- `#/app/fleet`
- `#/app/drivers`
- `#/app/reports`
- `#/app/settings`

---

## Uwagi

- Projekt **celowo nie posiada backendu**.
- Wszystkie dane i autoryzacja są przechowywane lokalnie w `localStorage`.
- Opcja **Reset demo** w ustawieniach czyści cały zapisany stan.
- Kod jest przygotowany pod przyszłą integrację z API lub frameworkiem.

---

## Status

✔ Zakończony (v1)

Możliwe dalsze usprawnienia:

- dopracowanie UI i brandingu
- mikro-interakcje UX
- rozszerzona dostępność (a11y)
- opcjonalna integracja backendowa lub mock API
- dalsze optymalizacje wydajności

---

## Informacja prawna

FleetOps jest fikcyjnym projektem demonstracyjnym stworzonym wyłącznie
w celach portfolio i edukacyjnych.
Wszystkie nazwy, dane, branding i elementy interfejsu mają charakter przykładowy
i nie odnoszą się do rzeczywistej firmy transportowej.

---

## Autor

Kamil Król
**KP_Code**
Front-End Developer
Projekt portfolio — 2025

---

## Licencja

Projekt udostępniony wyłącznie w celach portfolio i edukacyjnych.
