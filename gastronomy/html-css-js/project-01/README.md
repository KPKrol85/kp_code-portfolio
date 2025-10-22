# Gastronomy Project 01 — Responsive Restaurant Demo Website

A fully responsive and accessible demo website for a modern restaurant, built to demonstrate professional front-end practices in HTML, CSS, and JavaScript.

🔗 **Live Demo:** [https://gastronomy-project-01.netlify.app](https://gastronomy-project-01.netlify.app)

---

## Overview

This project was created as part of the *KP_Code Professional Learning Plan* and showcases a complete, production-ready front-end workflow.  
It focuses on **performance**, **accessibility**, and **visual polish**, implementing semantic HTML5 structure, local fonts, responsive layouts, and interactive components without relying on frameworks.  
The site includes multiple pages and is fully optimized for SEO and Lighthouse performance.

---

## Features

- **100 / 100 / 100 / 100 Lighthouse score** (Performance / Accessibility / Best Practices / SEO)
- Fully **responsive layout** built with Flexbox, Grid, and fluid typography
- **Accessible navigation** with keyboard support, focus states, and ARIA roles
- **Dark / Light theme switcher** with persistent preference (localStorage)
- Local **WOFF2 fonts** (Poppins, Source Sans 3) with `font-display: swap`
- Optimized **WebP/AVIF images** with lazy loading and `fetchpriority="high"` for LCP
- **Gallery Lightbox** with keyboard navigation and focus trap
- **Menu filtering system** with ARIA synchronization and animated transitions
- **Contact form**:
  - Native HTML5 validation
  - Honeypot anti-spam protection
  - aria-live feedback messages
  - Netlify-compatible submission
- **SEO-ready** meta tags, JSON-LD Restaurant schema, and AggregateRating data
- **PWA manifest**, offline 404 page, and structured `robots.txt` + `sitemap.xml`
- **Minified CSS/JS** via PostCSS + CSSNano and Terser
- Accessibility extras: skip link, `prefers-reduced-motion`, and visible focus outlines
- Fully deployable via **Netlify**, with `_headers` and `_redirects` configured

---

## Tech Stack

- **HTML5**, **CSS3**, **JavaScript (ES6)**
- **PostCSS + CSSNano** — CSS minification
- **Terser** — JS minification
- **Netlify** — hosting and deployment
- **VS Code / DevTools / Lighthouse** — development and testing

---

## Folder Structure

```text
gastronomy-project-01/
├── assets/
│   ├── img/
│   ├── fonts/
│   └── icons/
├── css/
│   ├── style.css
│   └── style.min.css
├── js/
│   ├── script.js
│   └── script.min.js
├── index.html
├── menu.html
├── galeria.html
├── cookies.html
├── polityka-prywatnosci.html
├── sitemap.xml
├── robots.txt
├── site.webmanifest
├── _headers
├── _redirects
├── package.json
├── .gitignore
└── README.md
````

---

## Performance & Accessibility

**Lighthouse Score:**
Performance: **100** | Accessibility: **100** | Best Practices: **100** | SEO: **100**

| Metric                   | Result |
| ------------------------ | ------ |
| First Contentful Paint   | 0.3 s  |
| Largest Contentful Paint | 0.5 s  |
| Total Blocking Time      | 0 ms   |
| Cumulative Layout Shift  | 0      |
| Speed Index              | 0.6 s  |

The website meets Core Web Vitals thresholds and adheres to progressive enhancement principles.

---

## SEO & PWA

* **Meta tags** for Open Graph, Twitter Cards, and structured data
* **robots.txt**, **sitemap.xml**, and canonical URLs
* **JSON-LD Restaurant schema** with menu, location, and rating info
* **Web App Manifest** with adaptive icons and app name
* **Offline 404** for PWA support
* **Netlify headers** for caching and security

---

## Getting Started

1. Clone or download the project folder.
2. Open `index.html` in your browser, or serve locally using:

   ```bash
   npx serve .
   ```
3. For Netlify Forms support, ensure form attributes match the original markup.

---

## Author

**KP_Code**
Front-End Developer focused on clean code, accessibility, and performance.

© 2025 KP_Code — For educational and portfolio use only.

```
