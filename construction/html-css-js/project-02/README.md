# Construction Project 02 — Advanced Responsive Demo Website

A fully optimized and production-ready demo website for a construction and renovation company, built with clean, accessible, and high-performance front-end code using HTML, CSS, and JavaScript.

🔗 **Live Demo:** [construction-project-02.netlify.app](https://construction-project-02.netlify.app)

---

## Overview

This project is part of the _KP_Code Professional Learning Plan_ and represents the next step after Construction Project 01 — expanding from a single-page layout to a **multi-page professional website**.
It demonstrates **scalable architecture**, **advanced accessibility**, **structured SEO**, and **progressive enhancement**.
All code follows modern web standards and achieves perfect Lighthouse results.

---

## Features

- **100 / 100 / 100 / 100 Lighthouse score** (Performance / Accessibility / Best Practices / SEO)
- **Multi-page layout** with consistent header/footer across all subpages
- **Semantic structure** with proper heading hierarchy and ARIA roles
- **Scrollspy** with `aria-current="page"` for active navigation
- **Light / Dark mode** with `prefers-color-scheme` and custom accent themes
- **Fully responsive** (mobile-first + fluid typography + section padding system)
- **Accessible forms** with ARIA validation, honeypot field, and success state
- **SEO-ready** meta, canonical, and structured JSON-LD (`Organization`, `ContactPoint`)
- **Local WOFF2 fonts** and optimized images in AVIF/WebP formats
- **Auto-save** message content to `localStorage` for better UX
- **PWA manifest** with full KP_Code standard icon set and offline 404
- **Netlify deployment** with `_headers`, `_redirects`, and `robots.txt`
- **Clean modular JavaScript** with individual initialization functions (`boot()` sequence)
- **Accessibility polish:** skip link, focus states, reduced motion, aria-summary

---

## Tech Stack

- **HTML5**, **CSS3**, **JavaScript (ES6)**
- **Netlify** — hosting and continuous deployment
- **CSSNano** — CSS minification
- **Terser** — JS minification
- **Google Lighthouse**, **DevTools**, **VS Code**, **WSL (Ubuntu)** — testing and optimization

---

## Folder Structure

```text
construction-project-02/
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
├── oferta/
│   ├── budowa-domow.html
│   ├── remonty-mieszkan.html
│   ├── instalacje-elektryczne.html
│   ├── instalacje-sanitarne.html
│   └── adaptacje-poddaszy.html
├── legal/
│   ├── polityka-prywatnosci.html
│   ├── regulamin.html
│   ├── cookies.html
│   ├── certyfikaty.html
│   └── kariera.html
├── index.html
├── 404.html
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── _headers
└── _redirects
```
---

## Performance & Accessibility

**Lighthouse Score:**
Performance: **100** | Accessibility: **100** | Best Practices: **100** | SEO: **100**

| Metric                   | Result |
| ------------------------ | ------ |
| First Contentful Paint   | 0.4 s  |
| Largest Contentful Paint | 0.6 s  |
| Total Blocking Time      | 0 ms   |
| Cumulative Layout Shift  | 0      |
| Speed Index              | 0.7 s  |

Every metric meets or exceeds Core Web Vitals thresholds, ensuring top-tier UX and performance.

---

## SEO & PWA

- **Open Graph** and **Twitter Cards** with unified KP_Code metadata
- **JSON-LD** (`Organization` + `ContactPoint`) for structured search results
- **Web App Manifest** with 192×192, 512×512, and 1024×1024 icons
- **Screenshots**: 1280×720 (desktop) and 720×1280 (mobile)
- **Shortcuts**: Menu / Gallery / Contact (96×96 icons)
- **Netlify caching + security headers** (`HSTS`, `X-Frame-Options`, etc.)
- **Offline 404 page** and PWA installable on all platforms

---

## Author

**KP_Code**

Front-End Developer focused on accessibility, performance, and clean UI engineering.

© 2025 KP_Code — For educational and portfolio use only.
