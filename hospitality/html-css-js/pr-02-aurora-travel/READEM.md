# Aurora Travel — Tourism Project 02
A fully optimized, production-ready multi-page demo website for a luxury travel agency, built with modern, accessible, and high-performance front-end architecture. This project is part of the KP_Code Professional Learning Plan and represents an advanced evolution beyond Tourism Project 01.

---

## 🔗 Live Demo
https://tourism-project-02.netlify.app/

---

## 🗂 Overview
Aurora Travel is a complete professional-grade website demonstrating:

- Multi-page scalable architecture
- Perfect Lighthouse scores (100 / 100 / 100 / 100)
- Zero flash during theme switching (light/dark flash fix)
- Robust accessibility (semantic HTML, ARIA, keyboard UX)
- PWA with Service Worker, caching strategies, offline page
- High-quality responsive UI with animations and interactive components
- Full SEO + structured data integration
- Performance-first engineering with clean modular JS

The project is engineered to match real commercial production standards.

---

## ✨ Key Features

### ⭐ Lighthouse: **100 / 100 / 100 / 100**
- Performance: **100**
- Accessibility: **100**
- Best Practices: **100**
- SEO: **100**

### 🌗 Light / Dark Theme — No Flash
- Instant theme initialization inside `<head>`
- Respects user preference + system `prefers-color-scheme`
- Background color applied inline to eliminate flicker

### 🧭 Modern Navigation
- Sticky header with compact mode
- Active link indicator via `aria-current="page"`
- Completely transparent desktop navigation in dark mode
- Accessible mobile menu with focus management

### 🖼 Advanced UI
- Fullscreen lightbox gallery
- Smooth reveal-on-scroll animations
- Dropdowns, filters, and custom interactive elements

### 📨 Contact Form
- HTML + JS validation
- ARIA live feedback
- Honeypot anti-spam
- Lightweight success confirmation

### 🔍 SEO + Social Sharing
- Full Open Graph + Twitter Cards
- Canonical links on all pages
- JSON-LD: `TravelAgency` + `WebPage` schemas
- Optimized meta for every subpage

### 🔥 PWA & Offline Support
- `site.webmanifest` with 192/512/96 icons
- Shortcuts for key pages
- Offline fallback page
- Service Worker with cache-first / network-first strategies
- Netlify `_headers` for CSP, caching, and security

### 📱 Responsive & Modern Styling
- Mobile-first layout
- Fluid typography
- CSS custom properties, radius system, spacing system
- High-quality images and optimized assets

### 🛠 Clean, Modular JavaScript
- Small feature modules in `js/features/`
- Safe initialization + automatic boot sequence
- No unnecessary scripting

---

## 🧪 Performance & Accessibility

All metrics meet or exceed Core Web Vitals:

| Metric | Result |
|--------|--------|
| First Contentful Paint | 0.3 s |
| Largest Contentful Paint | 0.5 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 0.3 s |

---

## 📸 Screenshots (Lighthouse)

Add these files inside:
`/assets/readme/`

### Lighthouse Report
![Lighthouse Report](assets/readme/lighthouse-full.png)

### Lighthouse Scoring Calculator
![Lighthouse Calculator](assets/readme/lighthouse-calculator.png)

---

## 📁 Folder Structure

tourism-project-02/
├── assets/
│ ├── img/
│ ├── shortcuts/
│ ├── logo/
│ └── svg-icons/
├── css/
│ ├── style.css
│ └── style.min.css
├── js/
│ ├── features/
│ ├── script.js
│ └── script.min.js
├── index.html
├── tours.html
├── tour.html
├── about.html
├── gallery.html
├── contact.html
├── cookies.html
├── regulamin.html
├── polityka-prywatnosci.html
├── offline.html
├── service-worker.js
├── site.webmanifest
├── robots.txt
└── _headers

---

## 🚀 Tech Stack
- HTML5, CSS3, JavaScript (ES6)
- Netlify (hosting, deploy, CSP, caching)
- CSSNano — CSS optimization
- Terser — JS minification
- Google Lighthouse, Chrome DevTools
- VS Code + GitHub

---

## ✍ Author
**KP_Code**
Front-End Developer focused on accessibility, performance, and clean UI engineering.

© 2025 KP_Code — For educational and portfolio use only.
