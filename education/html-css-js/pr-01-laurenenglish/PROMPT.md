You are a senior frontend developer working on the Lauren English project.

PROJECT CONTEXT

The project uses a canonical shared shell generated from:

* `scripts/shared-shell.mjs`
* `scripts/build-html.mjs`
* existing footer CSS and layout tokens

The current footer uses a four-column grid but only two columns are populated.

The footer must become a complete professional site footer without changing unrelated page content or the established visual identity.

Approved public contact details:

* phone: `+48 533 537 091`
* telephone URI: `tel:+48533537091`
* email: `kontakt@kp-code.pl`
* email URI: `mailto:kontakt@kp-code.pl`
* address: `ul. Marynarki Wojennej 12/31, 33-100 Tarnów, Polska`

Approved social profiles:

* GitHub: `https://github.com/KPKrol85`
* Facebook: `https://www.facebook.com/kpkrol85`
* X: `https://x.com/KP_Code_85`
* LinkedIn: `https://www.linkedin.com/in/kp-code/`
* Instagram: `https://www.instagram.com/kp_code_/`

Required copyright:

`© 2026 KP_Code Digital Studio | Wszelkie prawa zastrzeżone.`

TASK OBJECTIVE

Implement a professional responsive footer with:

1. four primary columns
2. one full-width social-media row below them
3. one final copyright bar

Use this information architecture:

* Brand
* Oferta
* Kontakt
* Informacje
* KP_Code Digital Studio social links
* Copyright

IMPLEMENTATION PLAN

1. Inspect the current canonical footer renderer, footer CSS, route registry, legal-page state, contact route, HTML validator, and relevant focused tests.

2. Update the canonical shared footer instead of editing generated HTML pages manually.

3. Build the first column as the brand section:

   * existing Lauren logo
   * `Lauren – Clean English`
   * short description:
     `Profesjonalny angielski w spokojnym rytmie.`

4. Build the second column with heading:

   `Oferta`

   Include:

   * Usługi
   * Pakiety
   * Materiały
   * Postępy
   * FAQ

5. Build the third column with heading:

   `Kontakt`

   Include:

   * clickable telephone
   * clickable email
   * semantic postal address
   * quiet text link to `/kontakt.html`

6. Build the fourth column with heading:

   `Informacje`

   Include:

   * O Lauren
   * Kontakt
   * Polityka prywatności
   * Regulamin
   * Polityka cookies

7. Inspect whether the three legal routes already exist.

8. If they do not exist, create minimal factual utility pages:

   * `/polityka-prywatnosci.html`
   * `/regulamin.html`
   * `/cookies.html`

9. Legal pages must:

   * describe only verified project behavior
   * explain the portfolio/project nature transparently
   * reflect the real Netlify contact form, localStorage, theme, progress storage, and actual cookie behavior
   * avoid invented legal claims, company registration data, analytics, advertising, payment processing, or third-party services
   * use `noindex, nofollow`
   * use the shared shell
   * contain one `h1`
   * provide navigation back to the site
   * not be added to the sitemap or primary PWA precache

10. Add a separate full-width social section below the four columns.

11. Use a clear heading such as:

`KP_Code Digital Studio w sieci`

12. Display the five social links horizontally on desktop and with clean wrapping on smaller screens.

13. Social links must:

* use the exact approved URLs
* have clear accessible names
* open in a new tab
* use `rel="noopener noreferrer"`
* not imply that these are Lauren’s personal profiles

14. Use existing local social icons only if suitable assets already exist.

15. Do not add an external icon library or remote runtime assets.

16. If suitable local icons do not exist, use professional text links and keep the structure ready for future icons.

17. Replace the current footer-bottom text with exactly:

`© 2026 KP_Code Digital Studio | Wszelkie prawa zastrzeżone.`

18. Implement responsive behavior:

* mobile: one column
* tablet: two-column grid
* desktop: four-column grid
* social row spans the full footer width
* copyright row spans the full footer width

19. Refine footer spacing, headings, link rhythm, hover/focus states, separators, and theme surfaces using existing tokens and BEM conventions.

20. Keep the footer visually calm:

* no cards
* no heavy borders
* no oversized CTA buttons
* no decorative clutter

21. Update the HTML assembler validation so the canonical footer structure, legal destinations, contact details, social URLs, and copyright remain mechanically protected.

22. Regenerate all affected HTML pages through the existing assembler.

23. Add or update one focused footer Playwright test covering:

* four primary footer columns
* contact links and address
* legal links returning `200`
* five social links and security attributes
* responsive one/two/four-column behavior
* exact copyright text
* light and dark theme readability

EXECUTION BUDGET

* Inspect only files directly related to the footer and required legal destinations.
* Make one implementation pass.
* Run each focused verification command once.
* Diagnose at most one unexpected issue.
* Apply at most one minimal correction and rerun only the affected focused check once.
* Do not run the full E2E suite.
* Do not perform repeated debugging or temporary instrumentation.
* Report unrelated failures and stop.

CONSTRAINTS

* Do not redesign the header, navigation, homepage, contact page, or other sections.
* Do not change approved contact details or social URLs.
* Do not invent social profiles, legal claims, analytics, cookies, payments, or business information.
* Do not add external icon libraries or remote assets.
* Do not manually edit generated shared footer regions.
* Do not add legal utility pages to the sitemap or primary PWA precache.
* Do not modify `INITIAL-AUDIT.md`.
* Preserve unrelated working-tree changes.
* Keep the diff focused and review-friendly.

TECHNICAL RULES

* Use semantic footer headings, lists, links, and `<address>`.
* Keep telephone and email as native links.
* Use accessible link names.
* Preserve visible `:focus-visible` states.
* Preserve light/dark theme contrast.
* Use existing tokens and BEM naming.
* Keep CSS mobile-first.
* Preserve shared-shell generation and HTML idempotence.
* Use source files as canonical.
* Do not edit generated Service Worker output manually.

Run only:

* `npm run build:html`
* `npm run check:html`
* `npm run check:content`
* `npm run check:seo`
* one focused footer Playwright test
* focused Prettier validation for changed canonical source files
* `git diff --check`

OUTPUT EXPECTATION

Return a concise summary with:

* canonical footer files changed
* final four-column structure
* contact information implemented
* legal routes created or reused
* social row and exact URLs
* responsive footer behavior
* exact copyright text
* generated pages refreshed
* validator and focused browser results
* any limitation
* confirmation that no unsupported claims were added
* confirmation that `INITIAL-AUDIT.md` and unrelated changes were preserved

Do not include unrelated recommendations.
