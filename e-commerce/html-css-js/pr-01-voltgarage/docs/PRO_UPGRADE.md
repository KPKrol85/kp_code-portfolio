# PRO UPGRADE — Volt Garage

## Zaimplementowane (P0)

- Naprawa markupów stron (usunięcie zbędnych zamknięć, breadcrumbs wewnątrz `<main>`).
- Refaktoryzacja struktury JS: core/services/ui/features, wspólny event bus i bezpieczny storage.
- Odporność na błędy: obsługa wyjątków przy ładowaniu produktów, globalny handler błędów.
- UI states dla list/produktów i koszyka (loading/empty/error) + logowanie błędów.
- Usprawniona dostępność: dropdowny z klawiaturą i aria-controls, modal z focus trap i ESC, formularze z walidacją pól, aria-live i fokus na pierwsze błędne pole.
- Poprawione atrybuty obrazów (width/height, decoding/lazy) w kartach i koszyku.

## Co zostało na P1/P2

- Performance: critical CSS dla above-the-fold, srcset/sizes dla kart i sekcji, dalsza optymalizacja obrazów.
- SSR-lite/hydracja list (build step generujący HTML z `data/products.json`), lekki bundling (esbuild) + minifikacja HTML.
- Bezpieczeństwo: dalsze utwardzanie CSP/headers (usunięcie `unsafe-inline` gdy będzie możliwe) i ewentualne raportowanie błędów (feature flag).
- PWA polish: ewentualne dalsze usprawnienia UX offline/instalacji po kolejnych testach Lighthouse.

## P2 (zrealizowane)

- PWA UX: CTA instalacji (beforeinstallprompt) z możliwością zamknięcia, toast aktualizacji SW z akcją „Odśwież”, komunikat o trybie offline w UI.
- Structured data: automatyczne BreadcrumbList JSON-LD oraz Product schema na stronie produktu; dynamiczny canonical/title/description w szczegółach produktu.
- Bezpieczeństwo: delikatne utwardzenie nagłówków (`form-action 'self'`, `worker-src 'self'`, `connect-src 'self' data:`) z zachowaniem inline preloadów; dalsze usuwanie `unsafe-inline` wymaga build-stepu/nonce (follow-up).

## Jak uruchomić

- Instalacja: `npm install`
- Jakość: `npm run qa:js` (ESLint). Pełne QA: `npm run qa`
- Budowa minifikatów: `npm run build`
- Podgląd statyczny: otwórz `index.html` w przeglądarce lub serwuj katalog (np. `npx serve .`)

## Next steps

- Dodać build step z prerenderem list produktów + hydracja filtrów, zintegrować esbuild (code-splitting core/shop/cart).
- Uzupełnić SEO/OG/LD+JSON (Organization, Product, BreadcrumbList) i meta per strona.
- Rozszerzyć PWA (beforeinstallprompt CTA, SW update toast, offline messaging) i doprecyzować CSP bez `unsafe-inline`.
