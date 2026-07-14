# Lauren English — Project Context

## 1. Project identity

**Lauren English** is a professional, multi-page educational website created for an English-language teacher offering lessons, courses, e-books, downloadable materials, learning packages, and progress-oriented support.

The project belongs to the **KP_Code Digital Studio** portfolio and should represent the quality of a real commercial website prepared for an independent teacher or small educational brand.

It is not a simple landing page. It is a structured frontend product with reusable components, data-driven content, accessibility support, SEO foundations, PWA features, and a maintainable source architecture.

## 2. Product positioning

The website must feel like a real, trustworthy educational service.

Its interface and content should communicate professionalism, clarity, warmth, credibility, accessibility, modern teaching, and practical learning outcomes.

Do not use public-facing labels such as:

- `demo`
- `mockup`
- `fake`
- `sample project`
- `test website`
- `portfolio simulation`

Portfolio information belongs in repository documentation and in the KP_Code Digital Studio portfolio, not in the customer-facing interface.

Unavailable features must not be presented as operational. They should be disabled safely, redirected to a valid contact path, or explained honestly in relevant service or legal content.

Legal and operational limitations should be handled in appropriate documents such as privacy policy, terms, cookies policy, purchase information, and consent notices.

## 3. Main project goal

The goal is to build a polished, portfolio-ready educational website that could realistically be adapted and deployed for a professional English teacher.

The project should demonstrate:

- strong product thinking
- clear content structure
- consistent visual design
- reusable frontend architecture
- accessible interactions
- responsive multi-page layouts
- structured materials and packages
- production-style SEO and PWA foundations
- maintainable HTML, CSS, and JavaScript

Every change should support this goal.

## 4. Technology baseline

The project uses:

- semantic HTML
- token-first CSS
- Vanilla JavaScript
- modular JavaScript files
- PostCSS, cssnano and esbuild for explicit legacy asset tasks only
- ESLint and Prettier
- progressive enhancement
- Service Worker and Web App Manifest

Frameworks and heavy dependencies should not be introduced unless explicitly approved.

Source files are canonical. Generated and minified assets must not be edited manually.

## 5. Architecture rules

The codebase must remain modular, predictable, readable, scalable, easy to audit, and safe to extend.

Before editing a feature, identify its source of truth.

Examples:

- material data belongs in the materials data module
- package data and links belong in the packages data module
- shared UI belongs in reusable components
- page-specific exceptions belong in page-level styles only when necessary
- shared behavior belongs in focused JavaScript modules
- generated assets come from source files

Avoid broad rewrites, duplicated data or logic, unnecessary abstractions, hidden coupling, styling through JavaScript, fragile selectors, and unrelated refactors.

Use the smallest safe implementation path.

## 6. CSS standard

CSS follows this layer order:

```text
tokens → base → utilities → components → sections → pages
```

Use existing design tokens, BEM-style naming, low-specificity selectors, mobile-first rules, local component changes, reusable modifiers, and state classes such as `.is-active`, `.is-open`, and `.is-disabled`.

Preferred naming:

```css
.component {
}
.component__element {
}
.component--modifier {
}
```

Avoid:

- styling by IDs
- deep descendant selectors
- vague class names
- duplicated component variants
- unnecessary `!important`
- arbitrary new breakpoints
- hardcoded values when an existing token fits

Responsive layouts must work from narrow mobile widths upward, avoid horizontal scrolling, preserve readable line length, keep controls usable, and prevent clipping or overlap.

Reuse existing project breakpoints and layout patterns.

## 7. HTML and accessibility

The project targets **WCAG 2.2 AA** where applicable.

Use semantic HTML before custom ARIA.

Required rules:

- one clear page-level `h1`
- logical heading hierarchy
- buttons for actions and links for navigation
- labels for form controls
- meaningful link text
- valid nesting and unique IDs
- no clickable `div` or `span`
- no important information conveyed only by icons

All interactive elements must support keyboard navigation, visible `:focus-visible` states, logical tab order, Escape where appropriate, correct focus return, and no keyboard traps.

Use ARIA only when needed and keep dynamic state accurate.

Respect:

```css
@media (prefers-reduced-motion: reduce);
```

Progressive enhancements must fail safely so content remains accessible without JavaScript.

Maintain WCAG AA contrast and readable typography.

## 8. JavaScript standard

JavaScript should remain modular, defensive, and dependency-free unless explicitly approved otherwise.

Use focused modules, guarded DOM queries, progressive enhancement, existing utilities, clear event handling, event delegation when useful, and predictable state handling.

Avoid unnecessary global state, inline handlers, duplicated logic, style manipulation that belongs in CSS, assumptions that a component exists on every page, silent runtime failures, and framework-style complexity.

Each module should safely exit when its target markup is absent.

Interactive components must preserve keyboard behavior, focus behavior, ARIA state, and reduced-motion preferences.

## 9. Content, materials, and packages

Public copy should be realistic, clear, natural, concise, grammatically correct, helpful, consistent, and free from developer terminology.

Avoid placeholder text, exaggerated claims, artificial urgency, conflicting package information, and misleading calls to action.

The materials catalogue must remain data-driven.

Material metadata belongs in the existing materials data source.

Premium materials use these package keys:

```text
start
regular
intensive
```

Package links must come from the package data source.

Access rules should remain centralized so future payment or authentication logic can be added without rewriting the catalogue UI.

## 10. SEO, performance, and PWA

Each public page should have a unique title and meta description, correct language metadata, one canonical URL, meaningful headings, descriptive internal links, accurate sitemap inclusion, correct robots directives, and valid Open Graph metadata where used.

Do not add fake reviews, fabricated ratings, false business details, or unsupported structured data.

Prefer optimized local assets, responsive images, explicit image dimensions, lazy loading below the fold, minimal JavaScript, efficient CSS, limited font variants, and no unnecessary third-party scripts.

Until the planned Vite migration, production pages load the canonical source entrypoints `/css/style.css` and `/js/main.js` directly. Browser-valid CSS imports and JavaScript modules form the runtime graph; preserved legacy outputs under `assets/build/` are not part of the current runtime contract.

PWA-related changes must consider:

- service worker cache versioning
- precache entries
- offline fallback
- stale cache cleanup
- correct production asset paths
- installability metadata

Do not change cache behavior casually.

## 11. Security and privacy

Do not expose secrets, credentials, private keys, production tokens, or unsafe user-controlled HTML.

Do not inject raw user input into the DOM.

Forms must validate accessibly and must not imply data processing or storage that has not been implemented.

Consent and legal copy must match the actual technical behavior of the website.

## 12. Build and generated files

Development changes must be made in source files.

Do not manually edit minified CSS, minified JavaScript, generated build assets, generated image output, or cache-busted production files. The current normal build assembles standalone HTML and generates `service-worker.js`; direct CSS and JavaScript sources remain canonical runtime files.

Use project scripts to regenerate production assets.

Run only the checks relevant to the task, such as linting, formatting, CSS and JavaScript builds, local runtime verification, responsive checks, accessibility checks, and service worker checks.

Do not claim verification that was not performed.

## 13. Development workflow

For each task:

1. inspect the relevant files and existing patterns
2. identify the source of truth
3. choose the smallest safe implementation path
4. edit source files only
5. preserve behavior outside the task scope
6. verify the result
7. update documentation only when necessary
8. prepare one logical commit

Do not combine unrelated changes in one task or commit.

Avoid broad cleanup unless it is required for the requested implementation.

## 14. CODEX rules

When CODEX works on this project, it should:

- inspect the current implementation before editing
- treat this file as the primary project context
- consult detailed documentation only when relevant
- preserve the established architecture
- avoid inventing files, tools, or components without need
- keep diffs minimal and review-friendly
- avoid unrelated redesigns and refactors
- preserve accessibility, responsive behavior, SEO, performance, and PWA behavior
- report files inspected and changed
- report verification actually performed
- mention limitations honestly
- avoid unrelated recommendations

Roadmap or checklist items may be marked complete only when implementation and verification are genuinely complete.

## 15. Quality gate

A task is complete only when all applicable conditions are satisfied:

- the requested behavior is implemented
- the implementation matches project architecture
- semantic HTML is preserved
- BEM and token rules are respected
- keyboard and focus behavior remain correct
- WCAG AA contrast is preserved
- responsive layouts remain stable
- JavaScript fails safely
- no unrelated behavior is changed
- generated assets are rebuilt when required
- relevant checks pass
- documentation is updated when needed
- the final diff remains focused and review-friendly

Visual completion alone is not enough.

## 16. Definition of project success

Lauren English should look and behave like a credible commercial website prepared for a real English teacher.

The final result should demonstrate that **KP_Code Digital Studio** can deliver product thinking, visual consistency, frontend architecture, accessibility, responsive design, educational UX, production discipline, maintainable implementation, and professional documentation.

The website should feel cohesive, intentional, trustworthy, and ready to be presented as one of the stronger educational projects in the KP_Code portfolio.
