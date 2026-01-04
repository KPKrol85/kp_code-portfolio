# VOLT GARAGE — Frontend E-commerce (In Progress)

**VOLT GARAGE** is a modern frontend e-commerce demo project built as part of a professional portfolio.
The project focuses on clean architecture, accessibility, performance, and a production-ready UI.

> ⚠️ **Status:** In progress
> This project is actively developed and refined. Features, UI, and structure may evolve.

---

## Tech Stack

- HTML5 (semantic, accessible)
- CSS3 (custom properties, layout system, themes)
- Vanilla JavaScript (ES Modules)
- LocalStorage (state & cart persistence)
- No frameworks, no libraries

---

## Current Features

- Sticky header with scroll behavior
- Dark / Light mode with persisted preference
- Accessible navigation (keyboard & ARIA)
- Scroll reveal animations (motion-safe)
- Product listing powered by JSON data
- Filtering and sorting logic
- Product cards and product detail pages
- Shopping cart with localStorage persistence
- Modular JS architecture

---

## Project Goals

- Build a **portfolio-level frontend storefront**
- Practice **real-world UI architecture**
- Focus on **accessibility and UX details**
- Prepare the project for **future backend / API integration**

---

## Roadmap (Planned)

- Final UI polish and layout refinements
- Legal pages (privacy policy, cookies, terms)
- Performance optimizations
- Lighthouse & accessibility audits
- Optional backend / API connection
- Deployment (Netlify)

---

## Quality & Build

This project includes a lightweight quality toolchain for HTML/CSS/JS and a simple minify step.

- `npm run qa` - runs HTML validation, ESLint, and Stylelint
- `npm run build` - generates `css/main.min.css` and `js/main.min.js`
- `npm run watch:css` - watches `css/main.css` and rebuilds `css/main.min.css`
- `npm run minify:css` - minifies `css/main.css` into `css/main.min.css`
- `npm run minify:js` - minifies `js/main.js` into `js/main.min.js`

Notes:

- HTML validation uses `htmlvalidate.json`
- JS lint runs on `js/**/*.js` and `tools/**/*.mjs`
- CSS lint runs on `css/**/*.css`

---

## Disclaimer

This is a **demo project** created for educational and portfolio purposes.
It does not represent a live commercial store.

---

© 2025 Kamil Król — KP_Code
