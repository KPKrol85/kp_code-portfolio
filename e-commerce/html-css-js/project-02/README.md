# KP_Code Digital Vault

Frontend‑only portfolio project presenting a digital products store UI built with Vanilla JS (ES Modules), HTML, and CSS.

## Project Overview

KP_Code Digital Vault is a static, frontend‑only demo of a digital marketplace. It showcases catalog browsing, a mock checkout flow, and a user library built entirely in the browser with mocked data and client‑side state.

## Key features

- Hash‑based routing with route‑level meta configuration and 404 handling.
- Product catalog with filtering, search, and sorting.
- Cart and mock checkout flow with form validation and success screen.
- Account area with registration/login and purchase history.
- User library with downloadable assets and license views.
- Dark/light theme with persisted preference.
- Accessibility: skip link, focus management, aria‑live toasts, and semantic markup.
- Service Worker for offline shell caching and data caching.

## Tech stack / Architecture

**Stack**
- HTML, CSS (design tokens + component styles), Vanilla JS (ES Modules).
- Static JSON data (`data/*.json`) and client‑side storage (localStorage).
- Service Worker for offline support and caching.

**Architecture**
```
active-project/
├── assets/           # graphics, icons, fonts
├── data/             # mock API data (products, licenses)
├── js/
│   ├── components/   # UI components (toast, modal, header)
│   ├── pages/        # route views
│   ├── router/       # hash router
│   ├── services/     # mock API, auth, cart, storage
│   ├── store/        # state management (pub/sub)
│   └── utils/        # helpers (formatting, validators)
├── legal/            # demo legal documents
├── styles/           # tokens and component styles
├── index.html
└── README.md
```

## Strengths

- Clear separation of concerns: routing, state, services, and UI components.
- Production‑like UX in a static environment (toasts, modals, keyboard support).
- Offline‑friendly app shell and cached JSON for resilience.
- Consistent UI theming and reusable components.

## Known limitations / Work in progress

**Demo constraints (explicit):**
- Authentication and permissions are **frontend‑only**.
- Purchase/download gating is **based on localStorage**.
- SEO is **limited by hash routing** (no server‑side rendering or real URLs).

Additional limitations:
- No real payments or backend validation (mock checkout only).
- Demo data only (products, licenses, orders).

## Next steps

**P0 (critical)**
- Replace frontend‑only auth with a real backend session/token flow.
- Add secure server‑side purchase validation and gated downloads.

**P1 (important)**
- Migrate from hash routing to history API with server support for real URLs.
- Add server‑driven product search, filtering, and pagination.

**P2 (nice to have)**
- Internationalization (PL/EN) and content management.
- Analytics and error monitoring for production usage.

## Local setup

To avoid `file://` fetch limitations, run a static server:

```bash
cd active-project
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Data & demo storage

- Product and license data live in `data/*.json`.
- localStorage stores cart, users, session, purchases, and theme.
- Passwords are hashed with a simple demo helper (not production‑grade security).

## Security / CSP notes

- Early theme initialization via `js/theme-init.js` (no inline `<script>`).
- No `eval` usage.
- Data rendered via `textContent` and `createElement`.
- `sanitizeText` is a minimal helper (not a replacement for production sanitizers).

## Company data

- Brand: KP_Code Digital Vault
- Owner: Kamil Król
- Address: ul. Marynarki Wojennej 12/31, 33-100 Tarnów, Poland
- Phone: +48 533 537 091
- Email: kontakt@kp-code.pl
