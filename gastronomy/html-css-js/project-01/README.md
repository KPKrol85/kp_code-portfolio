# Gastronomy 01 — Restaurant Demo Website

**Author:** KP_Code
**Type:** Front-end project (HTML, CSS, JavaScript)
**Status:** Completed ✅
**Live demo:** [https://gastronomy-project-01.netlify.app/](https://gastronomy-project-01.netlify.app/)

---

## 📖 Overview

**Gastronomy 01** is a fully responsive demo website for a modern restaurant.
The project showcases semantic HTML5, accessible components (ARIA, keyboard navigation), and optimized performance (Lighthouse 100/100/100/100).
It was built as part of the **KP_Code Professional Learning Plan**, focusing on professional front-end development workflow and clean, production-ready code.

---

## ✨ Features

- **Responsive design (RWD):** built with flexbox, grid, and fluid typography
- **Accessibility (a11y):** ARIA roles, focus states, and keyboard navigation for tabs and modals
- **Optimized assets:** AVIF/WebP images with fallbacks, lazy loading, and `fetchpriority` for LCP
- **Local fonts:** `Poppins` and `Source Sans 3` served locally (no external requests)
- **Lightbox gallery:** accessible modal with keyboard support and focus trap
- **Menu filtering system:** interactive tabs with ARIA synchronization
- **Contact form:** HTML5 validation, honeypot anti-spam field, live feedback messages
- **Dark / light theme switcher** with saved preference in `localStorage`
- **SEO ready:** meta tags, Open Graph, JSON-LD schema (`Restaurant`, `AggregateRating`),
  plus complete `robots.txt` and `sitemap.xml`
- **Performance ready:** minified CSS/JS with `postcss` + `cssnano` and `terser`
- **Clean Git setup:** `.gitignore`, modular file structure, NPM workflow

---

## 🧩 File Structure

```

project-01/
│
├── assets/              # images, icons, fonts
├── css/
│   ├── style.css        # main stylesheet
│   └── style.min.css    # production version
├── js/
│   ├── script.js        # main JS file
│   └── script.min.js    # production version
├── index.html           # home page
├── menu.html            # full menu page
├── galeria.html         # gallery page
├── cookies.html         # cookie policy
├── polityka-prywatnosci.html  # privacy policy
├── sitemap.xml
├── robots.txt
├── package.json
├── .gitignore
└── README.md

```

---

## ⚙️ Build & Minification

### CSS

```bash
npm run minify:css
```

Uses `postcss` + `cssnano` to generate `style.min.css`.

### JavaScript

```bash
npm run minify:js
```

Uses `terser` to generate `script.min.js`.

---

## 💡 Accessibility Highlights

- Fully semantic HTML5 structure (`header`, `main`, `section`, `figure`, `footer`)
- Proper focus management in navigation and modals
- ARIA-labeled elements for dynamic sections
- `aria-live` regions for form feedback
- `prefers-reduced-motion` support for reduced animations

---

## 🧠 Learning Goals

This project was part of **Stage 1** in the “KP_Code Professional Learning Plan”:
building production-grade HTML/CSS/JS websites before moving to **Tailwind**, **React**, and **Next.js**.

Key learning outcomes:

- mastering semantic structure and accessibility
- creating modular CSS architecture
- understanding performance and Core Web Vitals
- developing local build scripts and workflow automation

---

## 🚀 Deployment

Deployed on **Netlify**
Every push to `main` triggers an automatic redeploy to
[`https://gastronomy-project-01.netlify.app/`](https://gastronomy-project-01.netlify.app/)

---

## 🧾 License

MIT License © 2025 **KP_Code**
Feel free to use this project as an educational reference or template (with attribution).

---

## 📈 Lighthouse Score

| Category       | Score  |
| -------------- | :----: |
| Performance    |  100   |
| Accessibility  |  100   |
| Best Practices | 96–100 |
| SEO            |  100   |

---

## 🗓️ Last Updated

**October 2025**

