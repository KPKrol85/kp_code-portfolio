LEVEL-UP (1–2 tygodnie)

Pociąć CSS/JS na moduły (np. /css/components/*.css, /js/modules/*.js) i dodać bundler (Vite/Rollup) z tree-shakingiem i autoprefixerem; utrzymać źródła vs. minified w CI.

Rozszerzyć SW o cache-first dla obrazów + offline fallback (placeholder) i strategię stale-while-revalidate dla CSS/JS z versioningiem; dodać komunikat „offline mode”.

Wdrożyć realną obsługę formularza (API endpoint, walidacja serwerowa, rate limiting, e-mail/SMS hook), obsługę błędów i stanów (pending/success/fail).

Dodać strukturalne dane FAQPage i AggregateRating na stronach, urealnić liczby opinii z backendu lub usunąć, by uniknąć wprowadzania w błąd.

Przygotować system danych dla menu/galerii (JSON + renderowanie z szablonu), aby łatwo dodawać pozycje bez edycji HTML.

ENTERPRISE-LIKE (opcjonalne)

Staging/preview z meta robots=noindex + automatyczny switch na produkcję; CI job do walidacji linków i Lighthouse budżetów.

Headless CMS (Contentful/Strapi/Sanity) dla treści menu/galerii/FAQ, z generacją statyczną (Next.js/Nuxt) i i18n.

Integracja z zewnętrznym systemem rezerwacji (Calendly/Booksy/ResDiary) z kalendarzem dostępności i płatnością zaliczki.

Monitorowanie i observability frontu: Sentry dla błędów JS, SpeedCurve/Calibre dla Web Vitals, logi SW (updates/push).

Podsumowanie gotowości
Projekt jest solidnym demem (a11y, PWA, performance) i może być „portfolio-ready” po dopięciu SEO (robots/sitemap), poprawieniu linków i formularza.

Dla realnego klienta kluczowe jest urealnienie danych kontaktowych/recenzji, bezpieczeństwo (CSP), obsługa rezerwacji oraz skalowalna architektura zasobów.
