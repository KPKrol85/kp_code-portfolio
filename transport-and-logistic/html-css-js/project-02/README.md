# FleetOps — transport-02

FleetOps is a **conceptual frontend-only SaaS dashboard** for transport and fleet operations management.
The project is part of a larger professional portfolio and focuses on **application architecture, UI state management, and SaaS-style navigation patterns**, rather than backend implementation.

The application combines a marketing landing page with an authenticated, app-like dashboard inspired by modern B2B tools, Notion, or internal operations panels.

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
- CSS3 (custom design system, no frameworks)
- Vanilla JavaScript (no React, no libraries)

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

### File Structure (Simplified)

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

FleetOps is an **active learning project** and will continue to evolve with:

- UI polish and branding
- improved UX details
- additional SaaS interaction patterns

---

## Author

Kamil Król
Created by **KP_Code**
Frontend developer focused on clean architecture, UI state management, and SaaS-style web applications.

---

## License

This project is provided for portfolio and educational purposes.
