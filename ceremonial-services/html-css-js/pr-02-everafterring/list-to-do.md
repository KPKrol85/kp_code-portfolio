1. Zredukować duplikację kodu HTML (header, nav, footer, SEO head) poprzez wprowadzenie części wspólnych lub prostego generatora statycznego, aby każda globalna zmiana była wykonywana w jednym miejscu.
2. Poprawić moduł nawigacji tak, aby `trapFocus` był aktywny wyłącznie po otwarciu menu mobilnego i był zdejmowany po jego zamknięciu.
3. Dodać testy dostępności klawiaturowej dla menu i dropdownu (Tab/Shift+Tab/Escape/Enter/Space) jako obowiązkowy smoke test przed mergem.
4. Rozszerzyć walidację formularza kontaktowego o reguły domenowe (np. data wydarzenia nie może być w przeszłości, sensowny zakres liczby gości).
5. Podłączyć formularz kontaktowy do realnego endpointu (lub mock API na etapie przejściowym) z obsługą stanów: loading, sukces, błąd sieciowy.
6. Dodać mechanizm antyspamowy formularza (np. honeypot + ograniczenie częstotliwości wysyłki po stronie serwera).
7. Uzupełnić komunikaty formularza o bardziej precyzyjne treści dla konkretnych pól, aby użytkownik od razu wiedział jak poprawić błąd.
8. Wprowadzić automatyczny linting (HTML, CSS, JS) oraz formatowanie uruchamiane lokalnie i w CI.
9. Skonfigurować pipeline CI uruchamiający minimum: lint, podstawowe testy oraz prostą kontrolę build/deploy artefaktu statycznego.
10. Przygotować checklistę jakości release (a11y, SEO, linki wewnętrzne, formularz, responsywność) i egzekwować ją przed publikacją.
11. Zastąpić placeholderowe dane kontaktowe i biznesowe (telefon, treści JSON-LD) rzeczywistymi danymi marki.
12. Dodać stronę polityki prywatności oraz obowiązkowe informacje o przetwarzaniu danych zgodne z formularzem kontaktowym.
13. Uporządkować zgodę na przetwarzanie danych w formularzu (checkbox + link do polityki), aby domknąć podstawy zgodności prawnej.
14. Wdrożyć analitykę zdarzeń dla kluczowych akcji (kliknięcia CTA, wysłanie formularza, interakcje z nawigacją).
15. Przygotować strategię optymalizacji obrazów docelowych (formaty nowej generacji, rozmiary responsywne, kompresja, lazy loading poza sekcjami krytycznymi).
16. Rozszerzyć sitemapę o metadane `lastmod` i ustalić proces aktualizacji mapy przy każdej zmianie treści.
17. Dodać spójny dokument zasad komponentów UI (warianty przycisków, kart, formularzy, stany hover/focus/error), aby łatwiej skalować projekt.
18. Ujednolicić microcopy CTA i nagłówków pod cel konwersyjny (spójne wezwania do działania i jasny język korzyści).
19. Wprowadzić podstawowe monitorowanie błędów frontendu (np. logowanie błędów JS) dla szybszego reagowania po wdrożeniu.
20. Zdefiniować plan kolejnych iteracji (backlog priorytetów P1/P2/P3 z właścicielami i terminami), aby rozwój projektu był przewidywalny i mierzalny.
