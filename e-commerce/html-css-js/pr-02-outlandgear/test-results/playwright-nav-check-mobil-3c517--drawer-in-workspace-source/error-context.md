# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright-nav-check.spec.js >> mobile nav toggle opens drawer in workspace source
- Location: playwright-nav-check.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-nav-toggle]')
    - locator resolved to <button type="button" class="nav-toggle" data-nav-toggle="" aria-expanded="false" aria-label="Otwórz menu" aria-controls="mobile-drawer">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div data-legal-close="" class="outland-legal-modal__backdrop"></div> from <footer class="site-footer" aria-label="Stopka Outland Gear" data-partial-src="partials/footer.html">…</footer> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div data-legal-close="" class="outland-legal-modal__backdrop"></div> from <footer class="site-footer" aria-label="Stopka Outland Gear" data-partial-src="partials/footer.html">…</footer> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    53 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div data-legal-close="" class="outland-legal-modal__backdrop"></div> from <footer class="site-footer" aria-label="Stopka Outland Gear" data-partial-src="partials/footer.html">…</footer> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - link "Przejdź do treści" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e3]:
    - generic [ref=e5]:
      - link "Outland Gear" [ref=e6] [cursor=pointer]:
        - /url: index.html
      - button "Otwórz wyszukiwanie" [ref=e7] [cursor=pointer]:
        - img [ref=e9]
        - generic [ref=e11]: Otwórz wyszukiwanie
      - button "Otwórz menu" [ref=e12] [cursor=pointer]:
        - generic [ref=e17]: Otwórz menu
      - link "( 0 )" [ref=e19] [cursor=pointer]:
        - /url: koszyk.html
        - img [ref=e20]
        - text: (
        - generic [ref=e22]: "0"
        - text: )
  - main [ref=e23]:
    - generic [ref=e25]:
      - generic [ref=e26]:
        - paragraph [ref=e27]: Nowy sezon 2024
        - heading "Outdoor i travel gear gotowe na każdy road trip." [level=1] [ref=e28]
        - paragraph [ref=e29]: Odkryj plecaki, termikę i sprzęt kempingowy wybrany przez ekspertów Outland Gear.
        - generic [ref=e30]:
          - link "Przeglądaj produkty" [ref=e31] [cursor=pointer]:
            - /url: kategoria.html
          - link "Poznaj markę" [ref=e32] [cursor=pointer]:
            - /url: o-nas.html
      - img "Namiot i sprzęt outdoorowy na tle górskiego krajobrazu" [ref=e35]
    - generic [ref=e37]:
      - generic [ref=e38]:
        - generic [ref=e39]:
          - paragraph [ref=e40]: Start zakupów
          - heading "Kategorie sezonu" [level=2] [ref=e41]
          - paragraph [ref=e42]: "Trzy kierunki zakupowe na początek: szybkie wejście w sprzęt, który najczęściej ląduje w koszyku przed weekendowym wyjazdem."
        - link "Zobacz wszystkie" [ref=e43] [cursor=pointer]:
          - /url: kategoria.html
      - generic [ref=e44]:
        - article [ref=e45]:
          - paragraph [ref=e46]: Plecaki
          - heading "Plecaki trekkingowe i miejskie" [level=3] [ref=e47]
          - paragraph [ref=e48]: Modele na jednodniowe wypady, dojazdy do pracy i dłuższe trasy z pełnym pakunkiem.
          - generic [ref=e49]:
            - generic [ref=e50]: Najczęściej wybierane
            - generic [ref=e51]: od 129 PLN
          - list "Popularne typy plecaków" [ref=e52]:
            - listitem [ref=e53]: do 20L na miasto
            - listitem [ref=e54]: 35–45L na trekking
            - listitem [ref=e55]: organizery i torby podróżne
          - link "Przejdź do plecaków →" [ref=e56] [cursor=pointer]:
            - /url: kategoria.html
        - article [ref=e57]:
          - paragraph [ref=e58]: Kemping
          - heading "Sprzęt biwakowy" [level=3] [ref=e59]
          - paragraph [ref=e60]: Kompaktowe wyposażenie pod szybki biwak, road trip i nocleg poza utartym szlakiem.
          - generic [ref=e61]:
            - generic [ref=e62]: Outdoor essentials
            - generic [ref=e63]: lekki setup
          - list "Popularne grupy sprzętu kempingowego" [ref=e64]:
            - listitem [ref=e65]: namioty i tarp
            - listitem [ref=e66]: maty, hamaki, śpiwory
            - listitem [ref=e67]: kuchenki i gotowanie w trasie
          - link "Zobacz biwakowy setup →" [ref=e68] [cursor=pointer]:
            - /url: kategoria.html
        - article [ref=e69]:
          - paragraph [ref=e70]: Termika
          - heading "Termosy i kubki" [level=3] [ref=e71]
          - paragraph [ref=e72]: Rzeczy do codziennego użycia i długich przejazdów, kiedy liczy się temperatura i szczelność.
          - generic [ref=e73]:
            - generic [ref=e74]: Bestsellery
            - generic [ref=e75]: na cały rok
          - list "Popularne grupy produktów termicznych" [ref=e76]:
            - listitem [ref=e77]: kubki do samochodu
            - listitem [ref=e78]: termosy na szlak
            - listitem [ref=e79]: butelki filtrujące i bidony
          - link "Sprawdź termikę →" [ref=e80] [cursor=pointer]:
            - /url: kategoria.html
    - generic [ref=e83]:
      - generic [ref=e84]:
        - paragraph [ref=e85]: Zakupy bez tarcia
        - heading "Marketplace experience" [level=2] [ref=e86]
        - paragraph [ref=e87]: Outland Gear jest zbudowany tak, żeby szybko przejść od inspiracji do dobrze dobranego zestawu. Mniej szukania, więcej konkretu przed wyjazdem.
        - generic [ref=e88]:
          - generic [ref=e89]: Gotowy setup szybciej
          - paragraph [ref=e90]: "Selekcja oparta na praktyce: czytelne badge, jasne parametry i krótsza droga do decyzji zakupowej."
        - generic "Najważniejsze korzyści zakupowe" [ref=e91]:
          - generic [ref=e92]: czytelne porównanie
          - generic [ref=e93]: sprawne uzupełnienie koszyka
          - generic [ref=e94]: pomoc przed zakupem
      - generic [ref=e95]:
        - article [ref=e96]:
          - paragraph [ref=e97]: Odkrywanie
          - heading "Szybkie filtrowanie" [level=3] [ref=e98]
          - paragraph [ref=e99]: Sortuj po cenie, ocenach i badge, żeby od razu zawęzić listę do sensownych opcji.
        - article [ref=e100]:
          - paragraph [ref=e101]: Logistyka
          - heading "Dostawa w 24h" [level=3] [ref=e102]
          - paragraph [ref=e103]: Zamówienia złożone do 15:00 wysyłamy tego samego dnia, gdy liczy się termin przed wyjazdem.
        - article [ref=e104]:
          - paragraph [ref=e105]: Bezpieczeństwo
          - heading "Zwroty do 30 dni" [level=3] [ref=e106]
          - paragraph [ref=e107]: Masz czas, żeby sprawdzić dopasowanie i wygodę bez presji szybkiej decyzji po odbiorze.
        - article [ref=e108]:
          - paragraph [ref=e109]: Doradztwo
          - heading "Wsparcie ekspertów" [level=3] [ref=e110]
          - paragraph [ref=e111]: Pomagamy dobrać sprzęt pod trasę, pogodę i styl pakowania, zamiast zostawiać Cię z samą specyfikacją.
        - article [ref=e112]:
          - paragraph [ref=e113]: Jakość wyboru
          - heading "Wybrane bestsellery" [level=3] [ref=e114]
          - paragraph [ref=e115]: Na starcie pokazujemy rzeczy najczęściej polecane i najczęściej wracające do koszyka klientów.
    - generic [ref=e117]:
      - generic [ref=e118]:
        - generic [ref=e119]:
          - paragraph [ref=e120]: Najczęściej wybierane
          - heading "Bestsellery gotowe na wyjazd" [level=2] [ref=e121]
          - paragraph [ref=e122]: Sprzęt, od którego najczęściej zaczyna się kompletowanie zestawu na weekend, road trip i dłuższy trekking.
        - link "Przejdź do katalogu" [ref=e123] [cursor=pointer]:
          - /url: kategoria.html
      - generic [ref=e124]:
        - article [ref=e125]:
          - generic [ref=e126]:
            - img "Termos Outland Thermal Core 0.75L" [ref=e127]
            - generic [ref=e128]: Bestseller
          - generic [ref=e129]:
            - paragraph [ref=e130]: Termika i napoje
            - heading "Outland Thermal Core 0.75L" [level=3] [ref=e131]
            - paragraph [ref=e132]: Termos próżniowy na trasę, do auta i na szybkie postoje bez utraty temperatury.
            - generic [ref=e133]: 139 PLN 169 PLN
            - paragraph [ref=e134]: Ocena 4.8 • 202 opinie
            - generic [ref=e135]:
              - link "Zobacz" [ref=e136] [cursor=pointer]:
                - /url: produkt.html?slug=outland-thermal-core-075l
              - link "Kup teraz" [ref=e137] [cursor=pointer]:
                - /url: kategoria.html
        - article [ref=e138]:
          - generic [ref=e139]:
            - img "Namiot Outland Summit 2P" [ref=e140]
            - generic [ref=e141]: Bestseller
          - generic [ref=e142]:
            - paragraph [ref=e143]: Kemping
            - heading "Outland Summit 2P" [level=3] [ref=e144]
            - paragraph [ref=e145]: Lekki namiot 2-osobowy z szybkim rozkładaniem, kiedy liczy się sprawny setup po dojeździe.
            - generic [ref=e146]: 899 PLN
            - paragraph [ref=e147]: Ocena 4.7 • 140 opinii
            - generic [ref=e148]:
              - link "Zobacz" [ref=e149] [cursor=pointer]:
                - /url: produkt.html?slug=outland-summit-2p
              - link "Do zestawu" [ref=e150] [cursor=pointer]:
                - /url: kategoria.html
        - article [ref=e151]:
          - generic [ref=e152]:
            - img "Plecak Outland Trek Pro 55L" [ref=e153]
            - generic [ref=e154]: Bestseller
          - generic [ref=e155]:
            - paragraph [ref=e156]: Plecaki i torby
            - heading "Outland Trek Pro 55L" [level=3] [ref=e157]
            - paragraph [ref=e158]: Duży plecak wyprawowy z pokrowcem i systemem airflow na wielodniowe przejścia.
            - generic [ref=e159]: 749 PLN
            - paragraph [ref=e160]: Ocena 4.8 • 164 opinie
            - generic [ref=e161]:
              - link "Zobacz" [ref=e162] [cursor=pointer]:
                - /url: produkt.html?slug=outland-trek-pro-55l
              - link "Sprawdź kategorię" [ref=e163] [cursor=pointer]:
                - /url: kategoria.html
        - article [ref=e164]:
          - generic [ref=e165]:
            - img "Apteczka Outland Med Kit Pro" [ref=e166]
            - generic [ref=e167]: Bestseller
          - generic [ref=e168]:
            - paragraph [ref=e169]: Akcesoria
            - heading "Outland Med Kit Pro" [level=3] [ref=e170]
            - paragraph [ref=e171]: Rozszerzona apteczka na dłuższe wypady, z modułami gotowymi do szybkiego dostępu.
            - generic [ref=e172]: 159 PLN
            - paragraph [ref=e173]: Ocena 4.6 • 84 opinie
            - generic [ref=e174]:
              - link "Zobacz" [ref=e175] [cursor=pointer]:
                - /url: produkt.html?slug=outland-med-kit-pro
              - link "Dodaj do listy" [ref=e176] [cursor=pointer]:
                - /url: kategoria.html
    - generic [ref=e178]:
      - generic [ref=e179]:
        - generic [ref=e180]:
          - paragraph [ref=e181]: Gotowe scenariusze
          - heading "Zestawy na trasę, które ułatwiają start" [level=2] [ref=e182]
          - paragraph [ref=e183]: Trzy kierunki zakupowe zbudowane wokół realnych wyjazdów. Mniej przypadkowych wyborów, więcej sprzętu, który pracuje razem w jednym setupie.
        - link "Buduj własny zestaw" [ref=e184] [cursor=pointer]:
          - /url: kategoria.html
      - generic [ref=e185]:
        - article [ref=e186]:
          - generic [ref=e187]:
            - generic [ref=e188]: Weekend w górach
            - generic [ref=e189]: 2–3 dni
          - heading "Setup na szybki trekking z noclegiem" [level=3] [ref=e190]
          - paragraph [ref=e191]: Lekki zestaw na wyjazd, w którym liczy się wygoda noszenia, szybkie rozstawienie obozu i sprawdzone rzeczy do gotowania w trasie.
          - list "Elementy zestawu weekend w górach" [ref=e192]:
            - listitem [ref=e193]: plecak 45–55L
            - listitem [ref=e194]: namiot 2P lub tarp
            - listitem [ref=e195]: kuchenka i termos
          - generic [ref=e196]:
            - generic [ref=e197]: • najczęściej wybierany start
            - generic [ref=e198]: • od 129 PLN
          - link "Zobacz zestaw trekkingowy →" [ref=e199] [cursor=pointer]:
            - /url: kategoria.html
        - article [ref=e200]:
          - generic [ref=e201]:
            - generic [ref=e202]: Road trip
            - generic [ref=e203]: auto + camp
          - heading "Komfortowy zestaw na trasę i postoje" [level=3] [ref=e204]
          - paragraph [ref=e205]: Dla osób, które łączą jazdę, krótkie postoje i noclegi w drodze. Więcej organizacji, szybszy dostęp do sprzętu i rzeczy gotowych od razu po otwarciu bagażnika.
          - list "Elementy zestawu road trip" [ref=e206]:
            - listitem [ref=e207]: duffel lub organizer travel
            - listitem [ref=e208]: kubek termiczny i filtracja
            - listitem [ref=e209]: latarnia, powerbank, apteczka
          - generic [ref=e210]:
            - generic [ref=e211]: • łatwy do rozbudowy
            - generic [ref=e212]: • pod wieloetapowy wyjazd
          - link "Przejdź do road trip essentials →" [ref=e213] [cursor=pointer]:
            - /url: kategoria.html
        - article [ref=e214]:
          - generic [ref=e215]:
            - generic [ref=e216]: Daily carry
            - generic [ref=e217]: miasto + weekend
          - heading "Miejski zestaw gotowy na spontaniczny wyjazd" [level=3] [ref=e218]
          - paragraph [ref=e219]: Kompaktowy komplet dla tych, którzy chcą mieć jeden setup do pracy, krótkiego wypadu i codziennego przemieszczania się bez przepakowywania połowy rzeczy.
          - list "Elementy zestawu daily carry" [ref=e220]:
            - listitem [ref=e221]: plecak 20–32L
            - listitem [ref=e222]: saszetka lub organizer tech
            - listitem [ref=e223]: kubek, powerbank, akcesoria
          - generic [ref=e224]:
            - generic [ref=e225]: • na co dzień i na weekend
            - generic [ref=e226]: • szybki upgrade EDC
          - link "Odkryj daily carry →" [ref=e227] [cursor=pointer]:
            - /url: kategoria.html
    - generic [ref=e230]:
      - generic [ref=e231]:
        - paragraph [ref=e232]: Gotowy na kolejny krok
        - heading "Zbuduj swój setup na trasę" [level=2] [ref=e233]
        - paragraph [ref=e234]: Przejdź do katalogu i wybierz sprzęt dopasowany do stylu podróży, długości wyjazdu i tempa pakowania. Jeśli wolisz zacząć od sprawdzonych wyborów, zobacz rzeczy, które najczęściej trafiają do koszyka.
        - generic [ref=e235]:
          - link "Przeglądaj produkty" [ref=e236] [cursor=pointer]:
            - /url: kategoria.html
          - link "Zobacz bestseller" [ref=e237] [cursor=pointer]:
            - /url: produkt.html?slug=outland-thermal-core-075l
      - generic "Korzyści zakupowe Outland Gear" [ref=e238]:
        - generic [ref=e239]: szybkie filtrowanie
        - generic [ref=e240]: dostawa w 24h
        - generic [ref=e241]: zwroty do 30 dni
  - contentinfo "Stopka Outland Gear" [ref=e242]:
    - generic [ref=e243]:
      - generic [ref=e244]:
        - generic [ref=e245]:
          - paragraph [ref=e246]: Outland Club
          - heading "Dołącz do społeczności podróżników" [level=2] [ref=e247]
          - paragraph [ref=e248]: Poradniki, premiery sprzętu i oferty specjalne raz w tygodniu.
        - generic [ref=e249]:
          - generic [ref=e250]: Adres e-mail
          - textbox "Adres e-mail" [ref=e251]:
            - /placeholder: twoj@email.pl
          - button "Zapisz się" [ref=e252] [cursor=pointer]
      - generic [ref=e253]:
        - generic [ref=e254]:
          - link "Outland Gear" [ref=e255] [cursor=pointer]:
            - /url: index.html
          - paragraph [ref=e256]: Techniczny sprzęt outdoor i travel gear dla osób, które traktują każdą wyprawę serio.
          - list "Kanały społecznościowe" [ref=e257]:
            - listitem [ref=e258]:
              - link "Instagram" [ref=e259] [cursor=pointer]:
                - /url: https://www.instagram.com/
            - listitem [ref=e260]:
              - link "YouTube" [ref=e261] [cursor=pointer]:
                - /url: https://www.youtube.com/
            - listitem [ref=e262]:
              - link "Facebook" [ref=e263] [cursor=pointer]:
                - /url: https://www.facebook.com/
        - generic [ref=e264]:
          - heading "Zakupy" [level=3] [ref=e265]
          - list [ref=e266]:
            - listitem [ref=e267]:
              - link "Kategorie" [ref=e268] [cursor=pointer]:
                - /url: kategoria.html
            - listitem [ref=e269]:
              - link "Nowości" [ref=e270] [cursor=pointer]:
                - /url: kategoria.html
            - listitem [ref=e271]:
              - link "Bestsellery" [ref=e272] [cursor=pointer]:
                - /url: produkt.html
            - listitem [ref=e273]:
              - link "Koszyk" [ref=e274] [cursor=pointer]:
                - /url: koszyk.html
        - generic [ref=e275]:
          - heading "Wsparcie" [level=3] [ref=e276]
          - list [ref=e277]:
            - listitem [ref=e278]:
              - link "Obsługa klienta" [ref=e279] [cursor=pointer]:
                - /url: kontakt.html
            - listitem [ref=e280]:
              - link "Dostawa i zwroty" [ref=e281] [cursor=pointer]:
                - /url: o-nas.html
            - listitem [ref=e282]:
              - link "FAQ" [ref=e283] [cursor=pointer]:
                - /url: kontakt.html
            - listitem [ref=e284]:
              - link "Metody płatności" [ref=e285] [cursor=pointer]:
                - /url: checkout.html
        - generic [ref=e286]:
          - heading "Firma" [level=3] [ref=e287]
          - list [ref=e288]:
            - listitem [ref=e289]:
              - link "O Outland Gear" [ref=e290] [cursor=pointer]:
                - /url: o-nas.html
            - listitem [ref=e291]:
              - button "Informacja o projekcie" [ref=e292] [cursor=pointer]
            - listitem [ref=e293]:
              - link "Polityka prywatności" [ref=e294] [cursor=pointer]:
                - /url: polityka-prywatnosci.html
            - listitem [ref=e295]:
              - link "Regulamin" [ref=e296] [cursor=pointer]:
                - /url: regulamin.html
      - generic [ref=e297]:
        - paragraph [ref=e298]: © 2026 KP_Code Digital Studio | Wszelkie prawa zastrzeżone.
        - paragraph [ref=e299]: Designed for long miles and wild weather.
    - dialog "Informacja o projekcie" [ref=e302]:
      - paragraph [ref=e303]: Outland Gear • Demo Experience
      - heading "Informacja o projekcie" [level=2] [ref=e304]
      - paragraph [ref=e305]:
        - text: Serwis „Outland Gear” ma charakter demonstracyjny i został przygotowany przez
        - link "KP_Code Digital Studio" [active] [ref=e306] [cursor=pointer]:
          - /url: https://www.kp-code.pl
        - text: jako przykładowy sklep internetowy z wyposażeniem outdoorowym i travel gear. Treści, opinie oraz dane produktów mają charakter poglądowy. Korzystając z serwisu akceptujesz
        - link "Regulamin" [ref=e307] [cursor=pointer]:
          - /url: regulamin.html
        - text: .
      - generic [ref=e308]:
        - link "Polityka prywatności" [ref=e309] [cursor=pointer]:
          - /url: polityka-prywatnosci.html
        - link "Kontakt" [ref=e310] [cursor=pointer]:
          - /url: kontakt.html
      - generic [ref=e311]:
        - button "Akceptuję" [ref=e312] [cursor=pointer]
        - button "Zamknij" [ref=e313] [cursor=pointer]
  - status [ref=e314]
```

# Test source

```ts
  1  | const { test, expect } = require("playwright/test");
  2  | 
  3  | test("mobile nav toggle opens drawer in workspace source", async ({ page }) => {
  4  |   await page.setViewportSize({ width: 390, height: 844 });
  5  |   await page.goto("http://127.0.0.1:8123/index.html", { waitUntil: "networkidle" });
  6  |   await page.waitForTimeout(1200);
  7  | 
  8  |   const navToggle = page.locator("[data-nav-toggle]");
  9  |   const drawer = page.locator("[data-nav-drawer]");
  10 | 
  11 |   await expect(navToggle).toHaveAttribute("aria-expanded", "false");
  12 |   await expect(drawer).toHaveAttribute("aria-hidden", "true");
  13 | 
> 14 |   await navToggle.click();
     |                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  15 | 
  16 |   await expect(navToggle).toHaveAttribute("aria-expanded", "true");
  17 |   await expect(drawer).toHaveAttribute("aria-hidden", "false");
  18 | });
  19 | 
```