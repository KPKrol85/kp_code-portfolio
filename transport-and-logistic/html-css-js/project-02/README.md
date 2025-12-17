# FleetOps — transport-02

FleetOps to koncepcyjny SaaS (frontend-only) do zarządzania transportem i flotą. Projekt zawiera landing marketingowy, mock logowanie i aplikację dashboard w stylu Linear (sidebar + topbar). Dane i auth są mockowane w przeglądarce (localStorage + tablice JS).

## Funkcje
- Landing (hero, features, pricing, FAQ, testimonials) + tryb dark/light.
- Logowanie mock (email/hasło) + tryb demo, stan auth w localStorage.
- Dashboard: KPI, feed aktywności, alerty.
- Orders: tabela z filtrami, status badge, modal szczegółów, eksport CSV.
- Fleet / Drivers: listy z filtrami i modalami.
- Reports: prosty wykres słupkowy i tabela podsumowań, eksport JSON.
- Settings: przełącznik motywu, compact mode, reset demo danych.
- Legal/Info: About, Contact, Privacy, Terms, Cookies.
- Hash routing, auth guard, zapis preferencji w localStorage.

## Uruchomienie
1. Otwórz folder `transport-02` w edytorze lub terminalu.
2. Uruchom dowolny statyczny serwer (np. VS Code Live Server) i otwórz `index.html`.
   - Alternatywa: `python -m http.server 3000` i odwiedź `http://localhost:3000/transport-02/` (dostosuj ścieżkę do swojej lokalizacji).
3. Routing oparty o hash (`#/`, `#/login`, `#/app/...`), więc refresh działa bez dodatkowej konfiguracji.

## Nawigacja
- `#/` landing, `#/login` logowanie.
- Aplikacja (wymaga mock auth): `#/app`, `#/app/orders`, `#/app/fleet`, `#/app/drivers`, `#/app/reports`, `#/app/settings`.
- Legal/Info: `#/about`, `#/contact`, `#/privacy`, `#/terms`, `#/cookies`.

## Notatki
- Brak backendu; wszystkie dane to mocki w `scripts/data/seed.js`.
- Preferencje motywu i compact mode zapisują się w `localStorage`.
- Jeśli coś się “psuje”, użyj w Settings przycisku **Reset demo**.
