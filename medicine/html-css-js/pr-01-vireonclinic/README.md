# Vireon Clinic — Multi-Page Static Website

## Project overview
Vireon Clinic is a premium, multi-page static website for a private aesthetic medicine, plastic surgery, and dermatology brand. It prioritizes trust, safety, and clarity with a luxury-clean visual system, semantic HTML, and accessible UX patterns.

## Features
- **UX & design:** Luxury spacing, soft elevation, clean cards, and consistent CTAs.
- **Accessibility (WCAG 2.2 AA):** Skip links, keyboard navigation, visible focus states, accessible accordion, and reduced-motion support.
- **SEO-ready:** Unique metadata, canonical tags, and JSON-LD structured data (MedicalClinic/LocalBusiness).
- **Performance:** Modular CSS, minimal JS, optimized SVG placeholders, and no heavy dependencies.

## File structure
```
pr-01-vireon-clinic/
  index.html
  treatments.html
  treatment-detail.html
  doctors.html
  doctor-detail.html
  before-after.html
  pricing.html
  faq.html
  booking.html
  contact.html
  privacy.html
  terms.html
  css/
    tokens.css
    base.css
    layout.css
    components/
      header.css
      footer.css
      buttons.css
      cards.css
      forms.css
      accordion.css
    style.css
  js/
    main.js
    modules/
      nav.js
      accordion.js
      form-validate.js
      filters.js
  assets/
    img/
      hero-suite.svg
      doctor-portrait.svg
      before-after.svg
  README.md
```

## How to run locally
1. Open the folder in your editor.
2. Run a local server from the project root:
   ```bash
   python -m http.server 8000
   ```
3. Visit `http://localhost:8000/pr-01-vireon-clinic/`.

## Accessibility notes (keyboard checklist)
- Tab through the header to ensure the skip link, navigation, and CTAs are reachable.
- Verify focus states are visible on buttons, links, and form elements.
- Test the FAQ accordion with keyboard input (Enter/Space).
- Confirm form labels are read by screen readers and validation errors are announced.

## SEO & metadata checklist
- Unique `<title>` and meta description on every page.
- Canonical tags set for each page.
- Open Graph and Twitter card metadata present.
- JSON-LD structured data on the home and contact pages.

## Performance checklist
- Modular CSS with design tokens.
- Minimal JS with `defer` and progressive enhancement.
- SVG placeholders optimized and local.
- No external dependencies or frameworks.

## Localization note
All copy is written in English and can be localized by replacing the content in each HTML file. Maintain the same semantic structure for accessibility and SEO.
