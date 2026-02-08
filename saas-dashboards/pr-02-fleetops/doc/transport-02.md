# transport-02 - Frontend SaaS Demo

## Czym jest projekt

transport-02 to frontendowy projekt typu SaaS (dashboard B2B) zbudowany w czystym HTML, CSS i Vanilla JS. Projekt symuluje zachowanie aplikacji SPA bez backendu i frameworków.

## Architektura UI

- Jeden `index.html` jako app shell (`#app`)
- Routing oparty o hash (`#/app/*`)
- Oddzielne layouty:
  - landing / login / info pages
  - app shell (sidebar + topbar + content)

## Stan aplikacji

Globalny store (`FleetStore`) przechowuje:

- auth (mock login)
- preferences (theme, compact)
- filters per widok (orders, fleet, drivers)

Routing jest źródłem prawdy dla każdego aktywnego widoku.
Active nav wyliczany z aktualnego path + `aria-current`.

## Założenia projektowe

- frontend-only O(brak backendu)
- nacisk na "app-like UI", nie landing page
- architektura skalowalna pod przyszłe ficzery
