// Zasada: teksty UI dodajemy wyłącznie przez content/.
export const content = {
  common: {
    browseProducts: "Przeglądaj produkty",
    backToCatalog: "Wróć do katalogu",
    goToLibrary: "Przejdź do biblioteki",
    goToCheckout: "Przejdź do checkout",
    processing: "Przetwarzanie...",
    retry: "Spróbuj ponownie",
    screenshotSoon: "Screenshot wkrótce",
    summaryTitle: "Podsumowanie",
    skipLink: "Przejdź do treści głównej",
    fields: {
      name: "Imię i nazwisko",
      email: "E-mail",
      company: "Firma",
      companyOptional: "Firma (opcjonalnie)",
      taxIdOptional: "NIP (opcjonalnie)",
      password: "Hasło",
    },
    validation: {
      emailInvalid: "Podaj poprawny e-mail.",
      passwordMinLength: "Hasło musi mieć minimum 6 znaków.",
      nameRequired: "Podaj imię i nazwisko.",
      nameMinLength: "Imię musi mieć co najmniej 2 znaki.",
      profileNameMinLength: "Nazwa musi mieć co najmniej 2 znaki.",
    },
    demo: {
      loginCta: "Zaloguj (tryb demo)",
      loginSuccess: "Zalogowano w trybie demo.",
    },
  },
  themeToggle: {
    toLight: "Przełącz na tryb jasny",
    toDark: "Przełącz na tryb ciemny",
    title: "Zmień motyw",
  },
  header: {
    brandAriaLabel: "KP_Code Digital Vault",
    navAriaLabel: "Główna",
    nav: {
      home: "Start",
      products: "Produkty",
      productsRoot: "Wszystkie produkty",
      productsDropdown: {
        uiKits: "UI Kits & Components",
        templates: "Templates & Dashboards",
        assets: "Assets & Graphics",
        knowledge: "Knowledge & Tools",
      },
      services: "Usługi",
      servicesRoot: "Wszystkie usługi",
      servicesDropdown: {
        webDevelopment: "Web Development",
        wordpress: "WordPress Solutions",
        uiUxBranding: "UI / UX & Branding",
        consultingSupport: "Consulting & Support",
      },
      contact: "Kontakt",
    },
    accountLabel: "Konto",
    accountMenu: {
      login: "Zaloguj",
      register: "Rejestracja",
      demo: "Demo konta",
      account: "Panel konta",
      library: "Biblioteka",
      licenses: "Licencje",
      settings: "Ustawienia",
      logout: "Wyloguj",
    },
    cartLabel: "Koszyk ({count})",
    demoBadge: "Tryb demo: admin wymaga backendu",
    menuLabel: "Menu",
    menuOpenLabel: "Otwórz menu",
    menuCloseLabel: "Zamknij menu",
    langToggleTitle: "Zmień język",
    langToggleAria: "Przełącz język",
  },
  footer: {
    brandAriaLabel: "KP_Code Digital Vault",
    brandTitle: "KP_Code Digital Vault",
    brandDescription:
      "Kompaktowa biblioteka produktów cyfrowych dla twórców i zespołów. Prosty zakup i szybki dostęp.",
    newsletter: {
      title: "Newsletter",
      description: "Powiadomienia o nowych wydaniach i produktach.",
      emailLabel: "Adres e-mail",
      emailPlaceholder: "Adres e-mail",
      submitLabel: "Subskrybuj",
      soonLabel: "Wkrótce",
    },
    nav: {
      products: {
        title: "Produkty",
        ariaLabel: "Produkty",
        links: {
          browse: "Przeglądaj produkty",
          categories: "Kategorie produktów",
          pricing: "Cennik",
          updates: "Aktualizacje / Changelog",
        },
      },
      resources: {
        title: "Zasoby",
        ariaLabel: "Zasoby",
        links: {
          docs: "Dokumentacja",
          faq: "FAQ",
          support: "Wsparcie",
          contact: "Kontakt",
        },
      },
      company: {
        title: "Firma",
        ariaLabel: "Firma",
        links: {
          about: "O nas",
          roadmap: "Plan rozwoju / Roadmap",
          careers: "Kariera",
        },
      },
      account: {
        title: "Konto",
        ariaLabel: "Konto",
      },
    },
    accountLinks: {
      login: "Zaloguj się",
      register: "Utwórz konto",
      account: "Panel konta",
      library: "Moja biblioteka",
      licenses: "Licencje",
    },
    socialTitle: "Social media",
    socialAria: "KP_Code na {label}",
    legal: {
      privacy: "Polityka prywatności",
      terms: "Regulamin",
      cookies: "Cookies",
    },
    copyright: "© {year} KP_Code. Wszelkie prawa zastrzeżone.",
    backToTop: "Do góry",
  },
  placeholders: {
    fallbackLead: "W przygotowaniu.",
    detailsTitle: "Co będzie tutaj?",
    detailsFallback: "Dodamy szczegóły funkcji i treści tej sekcji.",
    defaultCtas: [
      { label: "Powrót do produktów", href: "#/products" },
      { label: "Zaloguj się", href: "#/auth", variant: "secondary" },
    ],
    bullets: {
      products: [
        "Przegląd kolekcji tematycznych i filtrów.",
        "Przykładowe podglądy i checklisty kompatybilności.",
        "Szybkie porównanie licencji i formatów plików.",
      ],
      services: [
        "Zakres i pakiety usług wraz z orientacyjnymi terminami.",
        "Case studies i przykładowe realizacje.",
        "Krótki formularz do szybkiej wyceny.",
      ],
      resources: [
        "Aktualne materiały i przewodniki dla klientów.",
        "Sekcja pytań i odpowiedzi oraz baza wiedzy.",
        "Kanały kontaktu i wsparcia technicznego.",
      ],
      company: [
        "Informacje o zespole i misji marki.",
        "Kamienie milowe oraz plan rozwoju produktu.",
        "Oferty współpracy i aktualne rekrutacje.",
      ],
      account: [
        "Ustawienia profilu i bezpieczeństwa konta.",
        "Powiadomienia oraz preferencje komunikacji.",
        "Zarządzanie danymi rozliczeniowymi.",
      ],
    },
    views: {
      careers: {
        title: "Kariera",
        lead: "W przygotowaniu.",
      },
    },
  },
  access: {
    backHomeCta: "Wróć na stronę główną",
    adminDisabled: {
      title: "Administracja niedostępna",
      message:
        "Panel administracyjny wymaga weryfikacji po stronie backendu. W trybie demo jest niedostępny.",
    },
    forbidden: {
      title: "Brak uprawnień",
      message: "Nie masz uprawnień do tej sekcji.",
    },
  },
  products: {
    count: "Pokazano {shown} z {total}",
    grid: {
      showMore: "Pokaż więcej",
    },
    categoryFallbackLabel: "Kategoria",
    categories: [
      {
        slug: "ui-kits",
        title: "UI Kits & Components",
        description:
          "Gotowe komponenty i zestawy UI do szybkiego budowania interfejsów: layouty, formularze, nawigacje i sekcje marketingowe.",
        bullets: [
          "Komponenty w spójnym stylu",
          "Tokeny i warianty",
          "Przykładowe layouty",
          "Wskazówki wdrożeniowe",
          "Pliki: Figma / HTML/CSS (w zależności od produktu)",
        ],
        faq: [
          {
            question: "Z jakimi narzędziami są kompatybilne UI kit-y?",
            answer:
              "Każdy produkt opisuje formaty w karcie — najczęściej Figma oraz gotowy HTML/CSS do wdrożenia.",
          },
          {
            question: "Jak wdrożyć komponenty do istniejącego projektu?",
            answer:
              "Importuj style bazowe, a następnie kopiuj komponenty sekcja po sekcji, dopasowując tokeny kolorów.",
          },
          {
            question: "Jaka licencja obejmuje zestawy UI?",
            answer:
              "Standardowo otrzymujesz licencję komercyjną na pojedynczy projekt — szczegóły znajdziesz w opisie.",
          },
          {
            question: "Czy mogę szybko dostosować tokeny i style?",
            answer:
              "Tak, projektujemy komponenty tak, aby zmiana kolorów i typografii była możliwa z poziomu tokenów.",
          },
          {
            question: "Czy komponenty uwzględniają dostępność?",
            answer:
              "Dbamy o semantykę i podstawy a11y, ale pełny audyt zależy od wdrożenia po Twojej stronie.",
          },
        ],
      },
      {
        slug: "templates",
        title: "Templates & Dashboards",
        description:
          "Szablony stron i dashboardów pod SaaS, e-commerce i landing pages — do edycji i wdrożenia w kilka godzin.",
        bullets: [
          "Widoki: overview, analytics, settings",
          "Struktura IA",
          "Responsywne layouty",
          "Checklisty jakości",
          "Pliki: HTML/CSS/JS lub Figma",
        ],
        faq: [
          {
            question: "Jak szybko dostosuję szablon do brandu?",
            answer:
              "Zmienisz kolory, typografię i logo w jednym miejscu dzięki tokenom i dobrze opisanej strukturze.",
          },
          {
            question: "Co dokładnie znajduje się w paczce?",
            answer:
              "Kompletne widoki, sekcje, komponenty oraz pliki źródłowe opisane w karcie produktu.",
          },
          {
            question: "Jak działają aktualizacje szablonów?",
            answer:
              "W razie aktualizacji dostajesz powiadomienie i dostęp do nowej wersji w swojej bibliotece.",
          },
          {
            question: "Czy mogę szybko podmienić treści?",
            answer:
              "Tak, szablony mają logiczną strukturę sekcji, dzięki czemu edycja treści jest szybka i bezpieczna.",
          },
          {
            question: "Ile trwa wdrożenie szablonu?",
            answer:
              "Najczęściej to kilka godzin do 1-2 dni, w zależności od zakresu zmian.",
          },
        ],
      },
      {
        slug: "assets",
        title: "Assets & Graphics",
        description:
          "Grafiki, ikony, tła, packi miniatur i zasoby marketingowe do prezentacji produktów i projektów.",
        bullets: [
          "Ikony (SVG/PNG)",
          "Miniatury, mockupy",
          "Zestawy OG/SEO",
          "Spójne style",
          "Gotowe warianty rozmiarów",
        ],
        faq: [
          {
            question: "Jakie formaty są dostępne?",
            answer:
              "W zależności od produktu otrzymujesz SVG, PNG lub pliki źródłowe — opisane w karcie produktu.",
          },
          {
            question: "Czy mogę używać grafik w PWA i manifestach?",
            answer:
              "Tak, pliki są zoptymalizowane pod web i możesz je bezpiecznie dodać do manifestów.",
          },
          {
            question: "Jak najlepiej zoptymalizować zasoby?",
            answer:
              "Skorzystaj z dostarczonych wariantów rozdzielczości i kompresji bezstratnej.",
          },
          {
            question: "Czy mogę używać assetów w social media i reklamach?",
            answer:
              "Tak, zgodnie z licencją komercyjną opisaną w karcie produktu.",
          },
          {
            question: "Czy dostaję różne rozmiary i eksporty?",
            answer:
              "Tak, często dodajemy kilka wariantów rozmiarów, aby przyspieszyć wdrożenie.",
          },
        ],
      },
      {
        slug: "knowledge",
        title: "Knowledge & Tools",
        description:
          "Checklisty, przewodniki i mini-narzędzia dla devów: procesy, standardy jakości, produktywność i automatyzacje.",
        bullets: [
          "Checklisty release",
          "A11y/performance",
          "Szablony dokumentów",
          "Skrypty/utility",
          "Materiały edukacyjne",
        ],
        faq: [
          {
            question: "Dla kogo są materiały Knowledge & Tools?",
            answer:
              "Dla devów, PM-ów i zespołów produktowych, które chcą uporządkować proces i jakość.",
          },
          {
            question: "Jak korzystać z checklist i narzędzi?",
            answer:
              "Każdy plik ma instrukcję użycia i sugerowaną kolejność wdrożenia w projekcie.",
          },
          {
            question: "Jak często są aktualizowane materiały?",
            answer:
              "Aktualizacje pojawiają się przy większych zmianach procesów lub nowych wersjach narzędzi.",
          },
          {
            question: "Czy materiały są odpowiednie dla początkujących?",
            answer:
              "Tak, większość materiałów ma poziom podstawowy lub średni i jasno opisany start.",
          },
          {
            question: "Czy mogę używać narzędzi w zespole?",
            answer:
              "Tak, licencja opisuje możliwość użycia wewnątrz zespołu i projektów.",
          },
        ],
      },
    ],
    categoryPage: {
      searchLabel: "Szukaj w kategorii",
      searchPlaceholder: "Szukaj w tej kategorii",
      sortLabel: "Sortowanie",
      sortOptions: {
        latest: "Najnowsze",
        priceAsc: "Cena: rosnąco",
        priceDesc: "Cena: malejąco",
      },
      showMore: "Pokaż więcej",
      aboutTitle: "O tej kategorii",
      faqTitle: "FAQ / Instrukcje",
      emptyTitle: "Wkrótce pojawią się pierwsze produkty",
      emptyMessage: "Wkrótce dodamy pierwsze produkty...",
      emptyCta: "Powrót do produktów",
    },
    listPage: {
      title: "Katalog produktów",
      lead: "Filtruj, sortuj i wybieraj produkty cyfrowe dopasowane do Twojego sposobu pracy.",
      searchLabel: "Szukaj produktu",
      searchPlaceholder: "Szukaj produktu",
      sortLabel: "Sortowanie",
      sortOptions: {
        latest: "Najnowsze",
        priceAsc: "Cena: rosnąco",
        priceDesc: "Cena: malejąco",
      },
      categoryLabel: "Kategoria",
      categoryAll: "Wszystkie kategorie",
      showMore: "Pokaż więcej",
      faq: {
        ariaLabel: "FAQ",
        title: "FAQ",
        lead: "Najczęstsze pytania o zakup, licencję i aktualizacje produktów cyfrowych.",
      },
    },
    faqGeneral: [
      {
        question: "Jaka licencja obowiązuje przy produktach cyfrowych?",
        answer:
          "Standardowo otrzymujesz licencję komercyjną na jeden projekt. Dokładny zakres jest opisany w karcie produktu.",
      },
      {
        question: "Jak otrzymuję aktualizacje produktów?",
        answer:
          "Nowe wersje pojawiają się w Twojej bibliotece po zakupie, a o większych zmianach informujemy komunikatem.",
      },
      {
        question: "W jakich formatach dostarczacie pliki?",
        answer:
          "To zależy od produktu: najczęściej Figma, HTML/CSS, SVG/PNG lub dodatkowe pliki źródłowe.",
      },
      {
        question: "Czy produkty cyfrowe podlegają zwrotom?",
        answer:
          "Produkty cyfrowe po pobraniu zwykle nie podlegają zwrotom, ale w razie problemów technicznych skontaktuj się z nami.",
      },
    ],
  },
  productDetails: {
    meta: {
      title: "{name} — KP_Code Digital Vault",
      fallbackDescription: "Szczegóły produktu cyfrowego.",
    },
    aria: {
      galleryThumb: "Zobacz zdjęcie {index}",
    },
    labels: {
      category: "Kategoria: {value}",
      requirements: "Wymagania: {value}",
      version: "Wersja: {value}",
      updated: "Aktualizacja: {value}",
    },
    cta: {
      addToCart: "Dodaj do koszyka",
      goToCart: "Przejdź do koszyka",
    },
    sections: {
      contents: "Zawartość paczki",
      downloads: "Pliki do pobrania",
    },
  },
  pricing: {
    seo: {
      title: "Cennik — KP_Code Digital Vault",
      description: "Przejrzysty model cenowy produktów cyfrowych i usług KP_Code Digital Vault.",
    },
    hero: {
      eyebrow: "Cennik",
      title: "Cennik",
      lead:
        "Przejrzyste ceny produktów cyfrowych i usług. Płacisz raz i otrzymujesz dostęp do panelu oraz plików zgodnie z licencją.",
      ctas: [
        { label: "Zobacz produkty", href: "#/products" },
        { label: "Kontakt", href: "#/contact", variant: "secondary" },
      ],
    },
    explanation: {
      title: "Jak działa zakup produktów",
      lead: "Krótko i konkretnie: co dostajesz po zakupie i jak wygląda dostęp.",
      items: [
        {
          title: "Dostęp i pliki",
          description:
            "Po zakupie zyskujesz dostęp do panelu klienta oraz plików do pobrania lub paczek produktowych.",
        },
        {
          title: "Licencje",
          description:
            "Dostępne warianty: Personal / Commercial. Wybór zależy od skali projektu.",
          linkLabel: "Zobacz licencje",
          linkHref: "#/licenses",
        },
        {
          title: "Aktualizacje",
          description:
            "Aktualizacje są dostępne w ramach wykupionego dostępu; szczegóły opisujemy w licencjach.",
          linkLabel: "Szczegóły aktualizacji",
          linkHref: "#/licenses",
        },
        {
          title: "Zwroty i zasady",
          description:
            "Produkty cyfrowe po pobraniu zwykle nie podlegają zwrotom, ale pomagamy w razie problemów technicznych.",
          linkLabel: "Regulamin",
          linkHref: "#/terms",
        },
      ],
    },
    products: {
      title: "Produkty cyfrowe",
      lead: "Pakiety dopasowane do różnych potrzeb — od pojedynczych zestawów po kolekcje.",
      items: [
        {
          name: "Starter Packs",
          price: "od ...",
          description: "Szybki start z kluczowymi komponentami i sekcjami.",
          features: [
            "Zestawy UI lub template'y na start",
            "Spójne tokeny i warianty",
            "Szybkie wdrożenie w krótkim czasie",
            "Licencja Personal lub Commercial",
          ],
          ctaLabel: "Zobacz produkty",
          ctaHref: "#/products",
        },
        {
          name: "Pro Packs",
          price: "od ...",
          description: "Rozszerzone pakiety dla większych projektów i zespołów.",
          features: [
            "Więcej widoków i wariantów",
            "Rozbudowane layouty i komponenty",
            "Checklisty wdrożeniowe i dokumentacja",
            "Aktualizacje zgodnie z licencją",
          ],
          ctaLabel: "Zobacz produkty",
          ctaHref: "#/products",
        },
        {
          name: "Bundles / Collections",
          price: "od ...",
          description: "Tematyczne kolekcje spójnych zasobów.",
          features: [
            "Łączone paczki w jednym stylu",
            "Spójność wizualna w większych projektach",
            "Oszczędność czasu przy wdrożeniu",
            "Licencja Commercial",
          ],
          ctaLabel: "Zobacz produkty",
          ctaHref: "#/products",
        },
        {
          name: "All-Access / Vault Pass",
          price: "od ...",
          description: "Dostęp do pełnej biblioteki w jednym pakiecie.",
          features: [
            "Pełny dostęp do katalogu",
            "Nowe wydania w trakcie dostępu",
            "Idealne dla zespołów i agencji",
            "Priorytetowy dostęp do aktualizacji",
          ],
          ctaLabel: "Zobacz produkty",
          ctaHref: "#/products",
        },
      ],
    },
    services: {
      title: "Usługi",
      lead: "Pakiety usług dla zespołów, marek i startupów, które potrzebują wsparcia.",
      items: [
        {
          name: "Landing Page",
          price: "od ...",
          description: "Szybkie wdrożenie strony sprzedażowej.",
          features: [
            "Hero, sekcje benefitów i social proof",
            "Dopracowane CTA i struktura treści",
            "Responsywność i optymalizacja web",
          ],
          ctaLabel: "Zobacz usługi",
          ctaHref: "#/services",
        },
        {
          name: "Website / Portfolio",
          price: "od ...",
          description: "Kompletny serwis pod markę lub ofertę.",
          features: [
            "Struktura informacji i plan treści",
            "Design + wdrożenie w jednym procesie",
            "Integracje i przygotowanie pod CMS",
          ],
          ctaLabel: "Zobacz usługi",
          ctaHref: "#/services",
        },
        {
          name: "UI / Frontend Implementation",
          price: "od ...",
          description: "Implementacja komponentów i design systemu.",
          features: [
            "Komponenty, tokeny i layouty",
            "Spójny UI zgodny z brandem",
            "Dostępność i baseline performance",
          ],
          ctaLabel: "Zobacz usługi",
          ctaHref: "#/services",
        },
        {
          name: "Consulting / Audit",
          price: "od ...",
          description: "Audyt i rekomendacje dla Twojego produktu.",
          features: [
            "Analiza UX/UI i front-end",
            "Rekomendacje i szybkie usprawnienia",
            "Roadmapa wdrożeń i priorytety",
          ],
          ctaLabel: "Kontakt",
          ctaHref: "#/contact",
        },
      ],
    },
    faq: {
      title: "FAQ",
      lead: "Najczęściej zadawane pytania o ceny, licencje i realizację usług.",
      items: [
        {
          question: "Dlaczego ceny są \"od ...\"?",
          answer:
            "Finalna cena zależy od zakresu pakietu, liczby widoków oraz licencji. Dzięki temu dopasowujemy ofertę do skali projektu.",
        },
        {
          question: "Czy wystawiana jest faktura?",
          answer:
            "Tak, po zakupie otrzymujesz fakturę. W przypadku usług wystawiamy fakturę zgodnie z ustaleniami.",
        },
        {
          question: "Jak działa licencja?",
          answer:
            "Licencja określa zakres użycia produktu (Personal lub Commercial). Szczegóły są dostępne w sekcji Licencje.",
        },
        {
          question: "Czy są aktualizacje?",
          answer:
            "Tak, udostępniamy aktualizacje zgodnie z zakupionym dostępem i zapisami licencyjnymi.",
        },
        {
          question: "Ile trwa realizacja usług?",
          answer:
            "Standardowo od 1 do kilku tygodni, zależnie od zakresu i priorytetów projektu.",
        },
        {
          question: "Czy mogę zamówić coś custom?",
          answer:
            "Tak, realizujemy projekty niestandardowe. Skontaktuj się, aby omówić zakres i wycenę.",
        },
      ],
    },
    cta: {
      title: "Masz pytania? Skontaktuj się",
      description:
        "Opisz potrzeby, a przygotujemy dopasowaną wycenę lub wskażemy najlepszy pakiet.",
      primaryLabel: "Kontakt",
      primaryHref: "#/contact",
      secondaryLabel: "Zobacz produkty",
    secondaryHref: "#/products",
    },
  },
  legal: {
    common: {
      updatedAt: "2026-01-17",
      updatedAtLabel: "Ostatnia aktualizacja: 2026-01-17",
      draftNotice: "Wersja robocza — do weryfikacji prawnej.",
      relatedTitle: "Powiązane dokumenty i kontakt",
      relatedLinks: [
        { label: "Polityka prywatności", href: "#/privacy" },
        { label: "Regulamin", href: "#/terms" },
        { label: "Cookies", href: "#/cookies" },
        { label: "Kontakt", href: "#/contact" },
      ],
      contactEmail: "kontakt@kp-code.pl",
      contactLine: "Kontakt w sprawach prawnych i prywatności: kontakt@kp-code.pl",
      contactCta: "Napisz do nas",
      contactSeparator: " — ",
    },
    privacy: {
      title: "Polityka prywatności",
      intro:
        "W KP_Code Digital Vault dbamy o przejrzystość. Poniżej wyjaśniamy, jakie dane zbieramy, w jakim celu i jak długo je przechowujemy, gdy korzystasz z konta, kupujesz produkty cyfrowe lub kontaktujesz się z nami.",
      sections: [
        {
          title: "Administrator danych i kontakt",
          paragraphs: [
            "Administratorem danych osobowych jest KP_Code Digital Vault. W sprawach dotyczących danych osobowych możesz skontaktować się z nami pod adresem e-mail.",
          ],
          list: ["Adres kontaktowy: kontakt@kp-code.pl"],
        },
        {
          title: "Jakie dane zbieramy",
          paragraphs: [
            "Zakres danych zależy od tego, z jakich funkcji korzystasz. Przetwarzamy dane niezbędne do utworzenia konta, realizacji zakupów i udostępniania biblioteki produktów.",
          ],
          list: [
            "dane konta (np. e-mail, identyfikator konta, historia logowań),",
            "dane zakupowe (np. lista produktów, licencje, historia transakcji),",
            "dane kontaktowe przekazywane w korespondencji z supportem,",
            "dane techniczne niezbędne do działania serwisu (np. ustawienia motywu, identyfikatory sesji).",
          ],
        },
        {
          title: "Cele przetwarzania",
          paragraphs: ["Dane przetwarzamy w jasno określonych celach:"],
          list: [
            "realizacja umowy i udostępnianie zakupionych produktów cyfrowych,",
            "obsługa konta i biblioteki użytkownika,",
            "zapewnienie bezpieczeństwa i zapobieganie nadużyciom,",
            "kontakt w sprawach związanych z obsługą klienta i wsparciem,",
            "spełnienie obowiązków prawnych, w tym księgowych.",
          ],
        },
        {
          title: "Podstawa prawna",
          paragraphs: [
            "Przetwarzamy dane na podstawie: wykonania umowy, obowiązków prawnych oraz prawnie uzasadnionego interesu (np. bezpieczeństwo usług, rozwój produktu).",
          ],
        },
        {
          title: "Okres przechowywania",
          paragraphs: [
            "Dane przechowujemy przez czas potrzebny do realizacji usług i obowiązków prawnych. Dane konta przetwarzamy do momentu jego usunięcia, a dane transakcyjne przez okres wymagany przepisami.",
          ],
        },
        {
          title: "Odbiorcy danych",
          paragraphs: [
            "Dane mogą być powierzane podmiotom wspierającym działanie serwisu. Założenie: dostawcy hostingu, narzędzi analitycznych oraz obsługi e-mail.",
          ],
        },
        {
          title: "Prawa użytkownika",
          paragraphs: ["Masz prawo do:"],
          list: [
            "dostępu do danych i uzyskania ich kopii,",
            "sprostowania danych,",
            "usunięcia danych lub ograniczenia przetwarzania,",
            "wniesienia sprzeciwu wobec przetwarzania,",
            "przenoszenia danych w zakresie przewidzianym prawem.",
          ],
        },
        {
          title: "Bezpieczeństwo danych",
          paragraphs: [
            "Stosujemy środki techniczne i organizacyjne odpowiednie do skali serwisu, w tym kontrolę dostępu i zabezpieczenia infrastruktury.",
          ],
        },
        {
          title: "Zmiany polityki",
          paragraphs: [
            "Polityka prywatności może być aktualizowana wraz z rozwojem usług. Aktualna wersja zawsze jest dostępna w serwisie.",
          ],
        },
      ],
    },
    terms: {
      title: "Regulamin",
      intro:
        "Regulamin określa zasady korzystania z KP_Code Digital Vault oraz warunki zakupu i korzystania z produktów cyfrowych dostępnych w serwisie.",
      sections: [
        {
          title: "Definicje",
          paragraphs: ["Na potrzeby regulaminu przyjmujemy następujące definicje:"],
          list: [
            "Użytkownik – osoba korzystająca z serwisu.",
            "Konto – profil użytkownika utworzony w serwisie.",
            "Produkt cyfrowy – treści dostarczane w formie cyfrowej.",
            "Biblioteka – miejsce, w którym udostępniamy zakupione produkty.",
            "Licencja – zakres dozwolonego użycia produktu cyfrowego.",
          ],
        },
        {
          title: "Zakres usług",
          paragraphs: [
            "KP_Code Digital Vault umożliwia zakup i pobieranie produktów cyfrowych. Serwis zapewnia dostęp do biblioteki zakupionych produktów.",
          ],
        },
        {
          title: "Rejestracja i konto",
          paragraphs: [
            "Konto jest wymagane do pełnego korzystania z serwisu. Użytkownik odpowiada za bezpieczeństwo danych logowania oraz aktualność danych kontaktowych.",
          ],
        },
        {
          title: "Zakup i płatność",
          paragraphs: [
            "Zakupy realizowane są w modelu płatności jednorazowej. Po złożeniu zamówienia użytkownik otrzymuje dostęp do produktu w bibliotece.",
          ],
        },
        {
          title: "Dostawa cyfrowa",
          paragraphs: [
            "Dostawa następuje drogą elektroniczną – poprzez bibliotekę lub link do pobrania. Dostęp jest utrzymywany przez okres dostępności usługi.",
          ],
        },
        {
          title: "Licencja i dozwolony użytek",
          paragraphs: ["Zakup produktu cyfrowego oznacza udzielenie licencji:"],
          list: [
            "licencja obejmuje użytek osobisty lub komercyjny zgodnie z opisem produktu,",
            "zakazane jest odsprzedawanie i udostępnianie produktów osobom trzecim,",
            "szczegółowy zakres licencji może być wskazany na stronie produktu lub w pliku licencji.",
          ],
        },
        {
          title: "Zwroty i reklamacje",
          paragraphs: [
            "W przypadku treści cyfrowych obowiązują odrębne przepisy dotyczące prawa odstąpienia. Informacje o zwrotach mają charakter roboczy i wymagają weryfikacji prawnej.",
          ],
        },
        {
          title: "Odpowiedzialność i ograniczenia",
          paragraphs: [
            "Serwis dostarcza produkty w stanie zgodnym z opisem. Odpowiedzialność za wykorzystanie produktów leży po stronie użytkownika w zakresie wynikającym z licencji.",
          ],
        },
        {
          title: "Zmiany regulaminu",
          paragraphs: [
            "Regulamin może być aktualizowany. Zmiany będą komunikowane w serwisie.",
          ],
        },
      ],
    },
    cookies: {
      title: "Cookies",
      intro:
        "Ta strona korzysta z plików cookies oraz localStorage, aby zapewnić poprawne działanie i wygodne korzystanie z usług KP_Code Digital Vault.",
      sections: [
        {
          title: "Czym są cookies i localStorage",
          paragraphs: [
            "Cookies to niewielkie pliki zapisywane w przeglądarce, które pomagają zapamiętać ustawienia. localStorage to pamięć przeglądarki przechowująca dane po stronie użytkownika.",
          ],
        },
        {
          title: "Kategorie plików",
          paragraphs: ["Stosujemy następujące kategorie:"],
          list: [
            "Niezbędne – wymagane do działania serwisu i bezpieczeństwa.",
            "Funkcjonalne – zapamiętują ustawienia użytkownika.",
            "Analityczne – założenie: używane wyłącznie po wdrożeniu narzędzi analitycznych.",
            "Marketingowe – założenie: obecnie nieużywane.",
          ],
        },
        {
          title: "Jak zarządzać cookies",
          paragraphs: [
            "Możesz samodzielnie zarządzać plikami cookies w ustawieniach swojej przeglądarki, w tym je usuwać lub blokować.",
          ],
        },
        {
          title: "Wykorzystanie localStorage",
          paragraphs: [
            "localStorage wykorzystujemy do przechowywania ustawień i danych potrzebnych do działania serwisu:",
          ],
          list: [
            "ustawienia motywu (light/dark),",
            "zawartość koszyka,",
            "sesja logowania i powrót do ostatniej ścieżki.",
          ],
        },
        {
          title: "Kontakt",
          paragraphs: [
            "W razie pytań dotyczących cookies możesz skontaktować się z nami pod adresem kontakt@kp-code.pl.",
          ],
        },
      ],
    },
  },
  breadcrumbs: {
    sections: {
      products: "Produkty",
      services: "Usługi",
      contact: "Kontakt",
      cart: "Koszyk",
      checkout: "Checkout",
      checkoutSuccess: "Sukces zamówienia",
      auth: "Logowanie",
      account: "Konto",
      accountOrders: "Zamówienia",
      accountDownloads: "Pobrane pliki",
      accountSettings: "Ustawienia konta",
      library: "Biblioteka",
      licenses: "Licencje",
      settings: "Ustawienia konta",
      legal: "Dokumenty prawne",
      privacy: "Polityka prywatności",
      terms: "Regulamin",
      cookies: "Cookies",
      admin: "Administracja",
      pricing: "Cennik",
      updates: "Aktualizacje",
      docs: "Dokumentacja",
      faq: "FAQ",
      support: "Wsparcie",
      about: "O nas",
      roadmap: "Plan rozwoju",
      careers: "Kariera",
      notFound: "Nie znaleziono strony",
    },
    services: {
      webDevelopment: "Web Development",
      wordpress: "WordPress Solutions",
      uiUxBranding: "UI / UX & Branding",
      consultingSupport: "Consulting & Support",
    },
  },
  meta: {
    routes: {
      home: {
        title: "KP_Code Digital Vault - Start",
        description: "Nowoczesny sklep z produktami cyfrowymi i biblioteką zakupów.",
      },
      products: {
        title: "Katalog produktów - KP_Code Digital Vault",
        description: "Przeglądaj produkty cyfrowe, filtry i sortowanie.",
      },
      services: {
        title: "Usługi - KP_Code Digital Vault",
        description: "Poznaj ofertę usług KP_Code: web development, WordPress, branding i consulting.",
      },
      serviceDetails: {
        title: "Usługi - KP_Code Digital Vault",
        description: "Szczegóły usługi oraz pakiety realizacji.",
      },
      productCategories: {
        uiKits: {
          title: "UI Kits & Components - KP_Code Digital Vault",
          description: "Komponenty, layouty i zestawy UI do szybkiego wdrożenia.",
        },
        templates: {
          title: "Templates & Dashboards - KP_Code Digital Vault",
          description: "Szablony stron i dashboardów dla SaaS, e-commerce i landing pages.",
        },
        assets: {
          title: "Assets & Graphics - KP_Code Digital Vault",
          description: "Grafiki, ikony i zasoby marketingowe do prezentacji produktów.",
        },
        knowledge: {
          title: "Knowledge & Tools - KP_Code Digital Vault",
          description: "Checklisty, przewodniki i narzędzia wspierające pracę devów.",
        },
      },
      productDetails: {
        title: "Szczegóły produktu - KP_Code Digital Vault",
        description: "Poznaj szczegóły produktu cyfrowego i jego zawartość.",
      },
      cart: {
        title: "Koszyk - KP_Code Digital Vault",
        description: "Sprawdź produkty w koszyku i podsumowanie zamówienia.",
      },
      checkout: {
        title: "Checkout - KP_Code Digital Vault",
        description: "Złóż zamówienie na produkty cyfrowe.",
      },
      checkoutSuccess: {
        title: "Sukces zamówienia - KP_Code Digital Vault",
        description: "Potwierdzenie złożenia zamówienia.",
      },
      auth: {
        title: "Logowanie - KP_Code Digital Vault",
        description: "Zaloguj się lub utwórz konto użytkownika.",
      },
      account: {
        title: "Konto - KP_Code Digital Vault",
        description: "Panel użytkownika i historia zamówień.",
      },
      accountOrders: {
        title: "Zamówienia - KP_Code Digital Vault",
        description: "Historia zamówień w KP_Code Digital Vault.",
      },
      accountDownloads: {
        title: "Pobrane pliki - KP_Code Digital Vault",
        description: "Pliki do pobrania po zakupie.",
      },
      accountSettings: {
        title: "Ustawienia konta - KP_Code Digital Vault",
        description: "Zarządzaj danymi profilu i preferencjami.",
      },
      library: {
        title: "Biblioteka - KP_Code Digital Vault",
        description: "Pobieraj zakupione produkty cyfrowe.",
      },
      licenses: {
        title: "Licencje - KP_Code Digital Vault",
        description: "Sprawdź typy licencji i pobierz pliki licencyjne.",
      },
      support: {
        title: "Wsparcie - KP_Code Digital Vault",
        description: "Pomoc techniczna, FAQ i informacje o wsparciu platformy.",
      },
      updates: {
        title: "Aktualizacje - KP_Code Digital Vault",
        description: "Zmiany w platformie i aktualizacje produktów.",
      },
      docs: {
        title: "Dokumentacja - KP_Code Digital Vault",
        description: "Przewodniki i informacje dotyczące korzystania z produktów oraz platformy.",
      },
      faq: {
        title: "FAQ - KP_Code Digital Vault",
        description: "Najczęściej zadawane pytania o produkty, licencje i zakupy.",
      },
      pricing: {
        title: "Cennik - KP_Code Digital Vault",
        description: "Przejrzysty model cenowy produktów cyfrowych i usług.",
      },
      privacy: {
        title: "Polityka prywatności - KP_Code Digital Vault",
        description: "Informacje o przetwarzaniu danych i prywatności w KP_Code Digital Vault.",
      },
      terms: {
        title: "Regulamin - KP_Code Digital Vault",
        description: "Zasady korzystania z KP_Code Digital Vault i zakupu produktów cyfrowych.",
      },
      cookies: {
        title: "Cookies - KP_Code Digital Vault",
        description: "Informacje o cookies i localStorage w KP_Code Digital Vault.",
      },
      admin: {
        title: "Panel administratora - KP_Code Digital Vault",
        description: "Strefa administracyjna sklepu (w budowie).",
      },
      legal: {
        title: "Dokumenty prawne - KP_Code Digital Vault",
        description: "Regulamin i polityka prywatności sklepu.",
      },
      contact: {
        title: "Kontakt - KP_Code Digital Vault",
        description: "Skontaktuj się z nami w sprawie produktów cyfrowych.",
      },
      caseStudies: {
        title: "Case studies - KP_Code Digital Vault",
        description: "Przegląd realizacji i case studies.",
      },
      caseStudyDetails: {
        title: "Case study - KP_Code Digital Vault",
        description: "Szczegóły case study i opis realizacji.",
      },
      notFound: {
        title: "404 - KP_Code Digital Vault",
        description: "Nie znaleziono strony.",
      },
      placeholders: {
        uiKits: {
          title: "UI Kits & Components — KP_Code Digital Vault",
          description: "Kategoria UI Kits & Components jest w przygotowaniu.",
        },
        templates: {
          title: "Templates & Dashboards — KP_Code Digital Vault",
          description: "Kategoria Templates & Dashboards jest w przygotowaniu.",
        },
        assets: {
          title: "Assets & Graphics — KP_Code Digital Vault",
          description: "Kategoria Assets & Graphics jest w przygotowaniu.",
        },
        knowledge: {
          title: "Knowledge & Tools — KP_Code Digital Vault",
          description: "Kategoria Knowledge & Tools jest w przygotowaniu.",
        },
        services: {
          title: "Usługi — KP_Code Digital Vault",
          description: "Sekcja usług KP_Code Digital Vault jest w przygotowaniu.",
        },
        webDevelopment: {
          title: "Web Development — KP_Code Digital Vault",
          description: "Usługa Web Development jest w przygotowaniu.",
        },
        wordpress: {
          title: "WordPress Solutions — KP_Code Digital Vault",
          description: "Usługa WordPress Solutions jest w przygotowaniu.",
        },
        uiUxBranding: {
          title: "UI / UX & Branding — KP_Code Digital Vault",
          description: "Usługa UI / UX & Branding jest w przygotowaniu.",
        },
        consultingSupport: {
          title: "Consulting & Support — KP_Code Digital Vault",
          description: "Usługa Consulting & Support jest w przygotowaniu.",
        },
        pricing: {
          title: "Cennik — KP_Code Digital Vault",
          description: "Cennik jest w przygotowaniu.",
        },
        updates: {
          title: "Aktualizacje — KP_Code Digital Vault",
          description: "Aktualizacje i changelog są w przygotowaniu.",
        },
        docs: {
          title: "Dokumentacja — KP_Code Digital Vault",
          description: "Dokumentacja jest w przygotowaniu.",
        },
        faq: {
          title: "FAQ — KP_Code Digital Vault",
          description: "FAQ jest w przygotowaniu.",
        },
        support: {
          title: "Wsparcie — KP_Code Digital Vault",
          description: "Wsparcie jest w przygotowaniu.",
        },
        about: {
          title: "O nas — KP_Code Digital Vault",
          description: "Sekcja o nas jest w przygotowaniu.",
        },
        roadmap: {
          title: "Plan rozwoju — KP_Code Digital Vault",
          description: "Plan rozwoju jest w przygotowaniu.",
        },
        careers: {
          title: "Kariera — KP_Code Digital Vault",
          description: "Sekcja kariera jest w przygotowaniu.",
        },
        settings: {
          title: "Ustawienia konta — KP_Code Digital Vault",
          description: "Ustawienia konta są w przygotowaniu.",
        },
      },
    },
  },
  states: {
    emptyFallbackTitle: "Brak danych",
    errorFallbackMessage: "Spróbuj ponownie później.",
    route: {
      loading: {
        title: "Ładowanie",
        message: "Ładowanie widoku...",
      },
      error: {
        title: "Nie udało się załadować widoku",
        message: "Nie udało się załadować widoku. Spróbuj ponownie.",
        messageWithDetails: "Nie udało się załadować widoku. Szczegóły: {details}",
      },
    },
    products: {
      loading: {
        title: "Ładowanie produktów",
        message: "Trwa pobieranie danych produktów.",
      },
      error: {
        title: "Nie udało się pobrać produktów",
        message: "Spróbuj ponownie później.",
      },
      empty: {
        title: "Brak produktów",
        message: "Brak produktów do wyświetlenia.",
      },
      filteredEmpty: {
        title: "Nie znaleziono produktów.",
        message: "Spróbuj zmienić filtry lub wyszukiwanie.",
        cta: "Wyczyść filtry",
      },
    },
    cart: {
      loading: {
        title: "Ładowanie koszyka",
        message: "Trwa pobieranie danych produktów.",
      },
      empty: {
        title: "Twój koszyk jest pusty.",
        message: "Przeglądaj produkty, aby zacząć.",
      },
      missingOnly: {
        title: "Nie możemy wyświetlić pozycji z koszyka.",
        message: "Wszystkie pozycje są niedostępne. Usuń je, aby kontynuować.",
        cta: "Wyczyść niedostępne",
      },
      missingNotice: {
        title: "Wykryto niedostępne pozycje w koszyku.",
        message: "Usuń brakujące pozycje, aby kontynuować zakupy.",
      },
      missingSection: {
        title: "Niedostępne pozycje",
        itemTitle: "Produkt niedostępny",
        itemMessage: "Ten produkt nie jest już dostępny w katalogu.",
        removeCta: "Usuń",
      },
      liveRegion: {
        totalUpdated: "Zaktualizowano sumę koszyka: {total}.",
      },
    },
    checkout: {
      empty: {
        title: "Twój koszyk jest pusty.",
        message: "Przeglądaj produkty, aby zacząć.",
      },
      missingOnly: {
        title: "Nie możemy wyświetlić pozycji z koszyka.",
        message: "Wszystkie pozycje są niedostępne. Usuń je, aby kontynuować.",
        cta: "Wyczyść niedostępne",
      },
      missingNotice: {
        title: "Wykryto niedostępne pozycje w koszyku.",
        message: "Usuń poniższe pozycje, aby kontynuować składanie zamówienia.",
        removeAllCta: "Usuń niedostępne produkty",
      },
      missingSection: {
        title: "Niedostępne pozycje",
        itemTitle: "Produkt niedostępny",
        itemMessage: "Ten produkt nie jest już dostępny w katalogu.",
        removeCta: "Usuń",
      },
    },
    library: {
      loading: {
        title: "Ładowanie biblioteki",
        message: "Trwa pobieranie danych produktów.",
      },
      empty: {
        title: "Brak zakupów",
        message: "Po zakupie produkty pojawiają się tutaj automatycznie.",
      },
    },
    licenses: {
      loading: {
        title: "Ładowanie licencji",
        message: "Trwa pobieranie danych produktów.",
      },
      empty: {
        title: "Brak licencji",
        message: "Brak licencji do wyświetlenia.",
      },
    },
    productDetails: {
      loading: {
        metaTitle: "Ładowanie produktu...",
        title: "Ładowanie produktu",
        message: "Trwa pobieranie danych produktu.",
      },
      error: {
        metaTitle: "Nie udało się pobrać produktu",
        message: "Spróbuj ponownie później.",
      },
      notFound: {
        metaTitle: "Produkt nie został znaleziony",
        metaDescription: "Sprawdź adres lub wróć do katalogu produktów.",
        title: "Produkt nie został znaleziony",
        message: "Sprawdź adres lub wróć do katalogu.",
      },
      downloadsHint: "Pliki pojawią się w bibliotece po zakończeniu zamówienia.",
    },
  },
  errors: {
    unexpectedTitle: "Coś poszło nie tak",
    unexpectedDescription: "Odśwież stronę. Jeśli problem będzie się powtarzał, wróć później.",
    retryAction: "Odśwież",
    homeAction: "Przejdź na stronę główną",
  },
  toasts: {
    dataFetchError: "Nie udało się pobrać danych.",
    addedToCart: "Dodano produkt do koszyka.",
    addedToCartDetails: "Produkt dodany do koszyka.",
    removedFromCart: "Usunięto z koszyka.",
    promoApplied: "Kod rabatowy zastosowany (demo).",
    checkoutSuccess: "Zakup zakończony sukcesem.",
    loginSuccess: "Zalogowano pomyślnie.",
    accountCreated: "Konto utworzone, możesz się zalogować.",
    logout: "Wylogowano.",
    contactSent: "Wiadomość została wysłana (demo).",
    updateAvailable: "Dostępna jest nowa wersja. Odśwież, aby zaktualizować.",
    updateCta: "Odśwież",
    connectionRestored: "Połączenie przywrócone.",
    offline: "Jesteś offline — część danych może być nieaktualna.",
  },
  auth: {
    title: "Konto użytkownika",
    tabs: {
      login: "Logowanie",
      register: "Rejestracja",
    },
    login: {
      title: "Zaloguj się",
      submit: "Zaloguj",
      loading: "Logowanie...",
    },
    register: {
      title: "Załóż konto",
      submit: "Utwórz konto",
      loading: "Rejestracja...",
    },
    errors: {
      emailExists: "Użytkownik z tym adresem e-mail już istnieje.",
      invalidCredentials: "Nieprawidłowy e-mail lub hasło.",
      invalidData: "Nieprawidłowe dane logowania.",
      noSession: "Brak aktywnej sesji.",
    },
  },
  cart: {
    title: "Twój koszyk",
    checkoutCta: "Przejdź do checkout",
  },
  checkout: {
    title: "Checkout",
    orderDetailsTitle: "Dane zamówienia",
    submit: "Złóż zamówienie",
    fields: {
      name: "Imię i nazwisko",
      email: "E-mail",
      company: "Firma",
    },
    validation: {
      nameInvalid: "Podaj imię i nazwisko (min. 2 znaki).",
      formInvalid: "Popraw zaznaczone pola.",
    },
    success: {
      metaTitle: "Dziękujemy za zakup",
      metaDescription: "Zakup zakończony. Pliki zostały dodane do Twojej biblioteki.",
      title: "Dziękujemy za zakup!",
      message: "Pliki zostały dodane do Twojej biblioteki.",
      ctaLibrary: "Przejdź do biblioteki",
      ctaCatalog: "Wróć do katalogu",
    },
  },
  library: {
    title: "Twoja biblioteka",
    emptyCta: "Przejdź do katalogu",
    ui: {
      purchasedTitle: "Twoje produkty",
      openPanel: "Otwórz panel",
      downloadPackage: "Pobierz paczkę",
      purchasedAtLabel: "Zakupiono: {date}",
      emptyMessage:
        "Brak zakupionych produktów. Po zakupie pojawią się tutaj pliki i panel.",
      demoToolsTitle: "Demo tools",
      demoToolsLead:
        "Symuluj zakup produktu bez backendu. Dane są zapisywane w localStorage.",
      demoToolsAdd: "Symuluj zakup",
      demoToolsClear: "Wyczyść zakupy",
    },
  },
  productPanels: {
    coreUi: {
      accessDenied: {
        title: "Brak dostępu do panelu",
        message: "Aktywuj dostęp demo, aby zobaczyć panel produktu.",
        action: "Aktywuj dostęp (demo)",
      },
      versionBadge: "v1.0",
      hero: {
        title: "Core UI Components Pack",
        lead: "Production-ready system UI dla prawdziwych dashboardów.",
        sublead: "Tokeny, tryby light/dark i gotowe komponenty do wdrożenia.",
      },
      heroPlaceholder: "Panel dostępu do Twojej paczki.",
      features: {
        title: "Kluczowe cechy",
        lead: "Tokeny, tryby light/dark i gotowe komponenty do wdrożenia.",
        items: [
          {
            title: "Tokenowe motywy",
            lead: "Semantyczne tokeny utrzymują spójny light i dark mode.",
          },
          {
            title: "Bez zależności",
            lead: "Tylko HTML i CSS, bez narzędzi build.",
          },
          {
            title: "Gotowe wzorce",
            lead: "Najczęstsze wzorce UI gotowe do produkcji.",
          },
        ],
      },
    },
  },
  account: {
    title: "Twoje konto",
    nav: {
      ariaLabel: "Konto",
      overview: "Przegląd",
      orders: "Zamówienia",
      downloads: "Pobrane pliki",
      licenses: "Licencje",
      settings: "Ustawienia",
      logout: "Wyloguj",
    },
    overview: {
      greeting: "Witaj!",
      greetingWithName: "Witaj, {name}!",
      accountTypeLabel: "Typ konta",
      accountTypeDemo: "Demo",
      accountTypeClient: "Klient",
      status: "Status konta: aktywne. Masz pełny dostęp do zakupionych zasobów.",
      tiles: {
        orders: {
          title: "Zamówienia",
          description: "Sprawdź historię zakupów i statusy płatności.",
          cta: "Zobacz zamówienia",
        },
        downloads: {
          title: "Pobrane pliki",
          description: "Szybki dostęp do wszystkich zakupionych plików.",
          cta: "Przejdź do pobrań",
        },
      },
    },
    orders: {
      title: "Zamówienia",
      empty: {
        title: "Brak zamówień",
        message:
          "Nie masz jeszcze żadnych zamówień. Gdy dokonasz zakupu, pojawią się tutaj.",
        cta: "Przejdź do produktów",
      },
      orderLabel: "Zamówienie #{id}",
      statusCompleted: "Zrealizowane",
      detailsCta: "Szczegóły",
      detailsToast: "Szczegóły zamówienia są w przygotowaniu.",
      dateLabel: "Data",
      totalLabel: "Suma",
    },
    downloads: {
      title: "Pobrane pliki",
      empty: {
        title: "Brak plików do pobrania",
        message:
          "Gdy dokonasz zakupu, produkty do pobrania będą dostępne w tym miejscu.",
        cta: "Zobacz produkty",
      },
      fallbackProduct: "Produkt cyfrowy",
      purchasedAtLabel: "Zakupiono",
      quantityLabel: "Ilość",
      downloadCta: "Pobierz",
      downloadToast: "Pobieranie pliku jest w przygotowaniu.",
    },
    settings: {
      title: "Ustawienia konta",
      lead: "Zarządzaj danymi profilu, preferencjami i bezpieczeństwem.",
      profile: {
        title: "Profil",
        lead: "Zaktualizuj nazwę profilu i sprawdź przypisany e-mail.",
        saveCta: "Zapisz zmiany",
        savedToast: "Zapisano zmiany profilu.",
        nameLabel: "Nazwa",
      },
      preferences: {
        title: "Preferencje",
        lead: "Dostosuj wygląd i animacje do swoich preferencji.",
        darkMode: "Tryb ciemny",
        reducedMotion: "Zredukowane animacje",
        saveCta: "Zapisz preferencje",
        savedToast: "Zapisano preferencje.",
      },
      security: {
        title: "Bezpieczeństwo",
        lead: "To środowisko demo. Zmiana hasła będzie dostępna po wdrożeniu backendu.",
        changePasswordCta: "Zmień hasło",
      },
      danger: {
        title: "Strefa zagrożenia",
        lead: "Wyloguj się z konta, jeśli korzystasz z publicznego urządzenia.",
        logoutCta: "Wyloguj",
      },
      hint: {
        title: "Wskazówka",
        message: "Ustawienia są zapisywane lokalnie i działają w trybie demo.",
      },
    },
    overviewSectionTitle: "Przegląd",
  },
  licensesPage: {
    title: "Licencje",
    lead: "Sprawdź przypisane licencje oraz poznaj typy licencji dostępne w Digital Vault.",
    nav: {
      your: "Twoje licencje",
      types: "Typy licencji",
    },
    your: {
      title: "Twoje licencje",
      lead: "Licencje przypisane do konta pojawią się tutaj po zakupie i aktywacji dostępu.",
      emptyTitle: "Brak przypisanych licencji.",
      emptyMessage: "Po zakupie licencje będą widoczne w tym miejscu.",
      emptyCta: "Przejdź do produktów",
      demoNote: "Tryb demo: dane są przykładowe.",
      statusActive: "Aktywna",
      assignedAtLabel: "Data przypisania",
      issuerLabel: "Wydawca",
      productsLabel: "Produkty objęte licencją",
      libraryLink: "Biblioteka",
    },
    types: {
      title: "Typy licencji",
      lead: "Przeczytaj warunki licencji przed zakupem.",
      audienceLabel: "Dla kogo",
      permissionsLabel: "Uprawnienia",
      limitationsLabel: "Ograniczenia",
      supportLabel: "Wsparcie",
      legalLinkLabel: "Szczegóły prawne: Regulamin",
      docsLinkLabel: "Dokumentacja licencji",
    },
  },
  home: {
    hero: {
      lead:
        "Produkty cyfrowe dla twórców i firm: szablony stron, UI kits, komponenty i mini-narzędzia — gotowe do użycia w Twoich projektach.",
      ctas: {
        primaryLabel: "Przeglądaj produkty",
        primaryHref: "#/products",
        secondaryLabel: "Zobacz demo konta",
        secondaryHref: "#/account",
      },
    },
    scrollIndicators: {
      leftAria: "Przewiń w lewo",
      rightAria: "Przewiń w prawo",
    },
    stats: {
      items: [
        { value: "6", label: "Gotowych rozwiązań cyfrowych" },
        { value: "Senior-level", label: "Jakość kodu i architektury" },
        { value: "< 24h", label: "Czas wdrożenia produktu" },
        { value: "Dożywotni dostęp", label: "Aktualizacje w cenie" },
      ],
    },
    popular: {
      title: "Popularne produkty",
    },
    info: {
      title: "Dlaczego Digital Vault?",
      lead:
        "Digital Vault to starannie wyselekcjonowane produkty cyfrowe, które pomagają szybciej tworzyć, uczyć się i rozwijać projekty. Dla twórców, zespołów oraz osób, które po prostu chcą dobrych narzędzi bez chaosu.",
      badges: ["Natychmiastowy dostęp", "Aktualizacje w cenie", "Ceny od {price}"],
    },
  },
  about: {
    hero: {
      title: "O nas",
      lead:
        "KP_Code Digital Vault to biblioteka profesjonalnych produktów cyfrowych, zaprojektowanych do realnego użycia w projektach komercyjnych.",
    },
    mission: {
      ariaLabel: "Zespół i misja",
      title: "Zespół i misja",
      lead:
        "Naszą misją jest tworzenie produktów cyfrowych, które są gotowe do użycia w projektach komercyjnych — nie jako demo, lecz jako standard.",
      cardTitle: "Dlaczego KP_Code Digital Vault?",
      cardParagraphs: [
        "KP_Code Digital Vault powstał jako odpowiedź na potrzebę uporządkowanych, wysokiej jakości produktów cyfrowych, które realnie skracają czas wdrożeń i podnoszą standard pracy zespołów produktowych.",
        "Tworzymy bibliotekę narzędzi, komponentów i zasobów projektowych, zaprojektowanych do rzeczywistego użycia w projektach komercyjnych — nie jako demonstracje, lecz jako gotowe, skalowalne rozwiązania.",
        "KP_Code Digital Vault to rosnąca platforma rozwijana iteracyjnie, z naciskiem na stabilność, dostępność, performance i spójność całego ekosystemu.",
      ],
    },
    founder: {
      name: "Kamil Król",
      role: "Founder · KP_Code",
      ariaLabel: "Zdjęcie założyciela — Kamil Król",
      imageAlt: "Kamil Król – Founder KP_Code",
      bio:
        "Projektuje i rozwija produkty cyfrowe w oparciu o realne potrzeby biznesowe. Łączy design systemy z inżynierią front-endu, koncentrując się na stabilności, dostępności i przewidywalnym rozwoju platformy.",
      values: [
        "Jakość i konsekwencja w UX",
        "Dostępność od pierwszego wdrożenia",
        "Performance jako standard, nie dodatek",
        "Prostota i klarowność rozwiązań",
      ],
      ctaLabel: "Kontakt",
    },
    progress: {
      ariaLabel: "Milestones i roadmap",
      title: "Milestones i roadmap",
      lead:
        "Budujemy KP_Code Digital Vault iteracyjnie. Kamienie milowe pokazują to, co już dowieźliśmy, a roadmapa wskazuje priorytety na kolejny etap — na bazie danych, celów biznesowych i feedbacku.",
      milestonesTitle: "Milestones",
      milestones: [
        {
          label: "Uruchomienie platformy KP_Code Digital Vault",
          description:
            "Stabilny start platformy oraz publikacja pierwszej kolekcji produktów cyfrowych.",
        },
        {
          label: "Rozszerzenie katalogu i standaryzacja ofert",
          description:
            "Nowe kategorie produktów oraz dopracowany standard kart i preview contentu.",
        },
        {
          label: "Biblioteka użytkownika i zarządzanie zakupami",
          description:
            "Pobrania, licencje, wersjonowanie produktów oraz uporządkowana historia zakupów.",
        },
      ],
      roadmapTitle: "Roadmap (żywa)",
      roadmapLead:
        "Roadmapa opisuje kluczowe kierunki rozwoju platformy i jest aktualizowana cyklicznie na podstawie danych, sprzedaży oraz feedbacku użytkowników.",
      roadmapItems: [
        "Rozwój katalogu produktów — nowe kategorie, starter collections oraz lepsza odkrywalność oferty.",
        "Biblioteka komponentów UI — spójne warianty, wyższa jakość i szybsze wdrażanie produktów.",
        "Automatyzacja wydań i QA — stabilność platformy, mniej regresji i przewidywalne releasy.",
        "Partnerstwa i afiliacje — bezpieczny program współpracy oraz integracje w ramach ekosystemu KP_Code.",
      ],
      roadmapCtaLabel: "Zobacz plan rozwoju",
    },
    collaboration: {
      ariaLabel: "Współpraca i rekrutacje",
      title: "Współpraca i rekrutacje",
      lead:
        "Budujemy KP_Code Digital Vault we współpracy z markami, twórcami i partnerami, którzy stawiają na jakość, skalowalność i długoterminowy rozwój produktów cyfrowych.",
      cards: [
        {
          title: "Współpraca produktowa",
          description:
            "Wspólne projektowanie i wdrażanie produktów cyfrowych: pakietów UI, szablonów, komponentów oraz narzędzi wspierających realne use-case’y rynkowe. Skupiamy się na jakości, spójności i wartości dla użytkownika końcowego.",
          ctaLabel: "Napisz do nas",
        },
        {
          title: "Partnerstwa brandowe",
          description:
            "Partnerstwa z markami i zespołami, które chcą rozwijać widoczność produktów poprzez wspólne premiery, integracje oraz działania oparte na wartości, a nie jednorazowej promocji.",
          ctaLabel: "Porozmawiajmy",
        },
        {
          title: "Program afiliacyjny",
          description:
            "Program dla twórców, społeczności i partnerów, którzy chcą współtworzyć dystrybucję produktów KP_Code Digital Vault w przejrzystym i długofalowym modelu współpracy.",
          ctaLabel: "Dołącz do programu",
        },
      ],
      careers: {
        title: "Rekrutacje",
        description:
          "Aktualnie nie prowadzimy otwartych rekrutacji. Jeśli jesteś zainteresowany współpracą w przyszłości, zostaw kontakt — wrócimy do rozmowy, gdy pojawi się odpowiedni moment.",
        notice:
          "Zgłoszenia traktujemy jako pulę kontaktów do dalszego rozwoju projektu.",
        ctaLabel: "Skontaktuj się",
      },
    },
  },
  docs: {
    hero: {
      eyebrow: "Dokumentacja",
      title: "Dokumentacja",
      lead:
        "Przewodniki i informacje dotyczące korzystania z produktów oraz platformy KP_Code Digital Vault.",
    },
    hub: {
      title: "Dokumentacja jako hub",
      lead: "Wybierz obszar, który najlepiej pasuje do Twojego pytania.",
    },
    search: {
      label: "Szukaj w dokumentacji",
      placeholder: "Szukaj w dokumentacji…",
    },
    noteLinkLabel: "Regulamin",
    sections: [
      {
        id: "products",
        title: "Produkty",
        description:
          "Pobieranie produktów, struktura paczek, wersjonowanie oraz aktualizacje zawartości.",
        ctaLabel: "Dokumentacja produktów",
        ctaHref: "#/docs/products",
      },
      {
        id: "ui-kits",
        title: "UI Kits & Components",
        description:
          "Jak używać komponentów, integrować HTML/CSS i bezpiecznie modyfikować zestawy.",
        ctaLabel: "Integracja komponentów",
        ctaHref: "#/docs/components",
      },
      {
        id: "licenses-practical",
        title: "Licencje (praktycznie)",
        description:
          "Różnice między licencją personal i commercial, przykłady użycia oraz zasady w praktyce.",
        ctaLabel: "Szczegóły licencji",
        ctaHref: "#/licenses",
        note: {
          text: "Szczegóły prawne znajdują się w Regulaminie.",
          linkLabel: "Regulamin",
          href: "#/terms",
        },
      },
      {
        id: "account-library",
        title: "Konto i biblioteka",
        description:
          "Jak działa konto użytkownika, gdzie znajdują się zakupy i jak pobierać aktualizacje.",
        ctaLabel: "Zarządzanie kontem",
        ctaHref: "#/account",
      },
      {
        id: "platform",
        title: "Platforma KP_Code Digital Vault",
        description:
          "Opis platformy jako całości: panel, biblioteka, dostęp oraz tryb demo i ograniczenia.",
        ctaLabel: "Poznaj platformę",
        ctaHref: "#/about",
      },
    ],
    cross: {
      title: "Dalsza pomoc",
      lead: "Dokumentacja prowadzi dalej — skorzystaj z dedykowanych kanałów.",
      ctaLabel: "Przejdź",
      items: [
        { title: "Masz pytania?", description: "Przejdź do FAQ z odpowiedziami.", href: "#/faq" },
        { title: "Problem techniczny?", description: "Zobacz centrum wsparcia.", href: "#/support" },
        {
          title: "Zmiany i nowe wersje?",
          description: "Sprawdź aktualizacje i changelog.",
          href: "#/updates",
        },
      ],
    },
    empty: {
      title: "Brak wyników",
      lead: "Spróbuj innego zapytania lub przejrzyj wszystkie sekcje dokumentacji.",
    },
  },
  faq: {
    hero: {
      eyebrow: "FAQ",
      title: "Najczęściej zadawane pytania",
      lead: "Pytania o produkty, licencje i działanie platformy.",
    },
    controls: {
      ariaLabel: "Kategorie FAQ",
      title: "Kategorie",
      lead: "Wybierz kategorię lub wyszukaj odpowiedź.",
    },
    search: {
      label: "Szukaj pytania",
      placeholder: "Szukaj pytania…",
    },
    categories: [
      { id: "general", label: "Ogólne" },
      { id: "digital-products", label: "Produkty cyfrowe" },
      { id: "licenses", label: "Licencje i użycie" },
      { id: "purchase", label: "Zakup i płatności" },
      { id: "access", label: "Dostęp i konto" },
      { id: "services", label: "Usługi" },
      { id: "support", label: "Wsparcie techniczne" },
    ],
    items: [
      {
        id: "general-01",
        category: "general",
        question: "Czym jest KP_Code Digital Vault?",
        answer:
          "To biblioteka profesjonalnych produktów cyfrowych i usług, zaprojektowanych do realnego użycia w projektach komercyjnych.",
      },
      {
        id: "general-02",
        category: "general",
        question: "Dla kogo jest ta platforma?",
        answer:
          "Dla founderów, zespołów produktowych, agencji i niezależnych twórców, którzy chcą szybciej wdrażać jakościowy UI.",
      },
      {
        id: "general-03",
        category: "general",
        question: "Jak szybko mogę zacząć korzystać?",
        answer:
          "Od razu po zakupie — dostęp do plików pojawia się w bibliotece, a linki do pobrania są aktywne.",
      },
      {
        id: "products-01",
        category: "digital-products",
        question: "Co dokładnie zawiera produkt cyfrowy?",
        answer:
          "Każdy produkt ma opis zawartości: pliki źródłowe, formaty (np. Figma, HTML/CSS) i listę komponentów.",
      },
      {
        id: "products-02",
        category: "digital-products",
        question: "Czy mogę używać produktów w kilku projektach?",
        answer:
          "Zależy od licencji. Licencja Commercial umożliwia użycie w projektach komercyjnych zgodnie z opisem licencji.",
      },
      {
        id: "products-03",
        category: "digital-products",
        question: "Czy produkty są aktualizowane?",
        answer:
          "Tak, udostępniamy aktualizacje zgodnie z wykupionym dostępem i informujemy o zmianach w bibliotece.",
      },
      {
        id: "licenses-01",
        category: "licenses",
        question: "Czym różni się Personal i Commercial?",
        answer:
          "Personal dotyczy użytku prywatnego lub testowego, a Commercial pozwala wdrażać produkty w projektach komercyjnych.",
      },
      {
        id: "licenses-02",
        category: "licenses",
        question: "Czy licencja obejmuje zespół?",
        answer:
          "Zakres zależy od produktu — w opisie znajdziesz informację, czy licencja obejmuje użycie zespołowe.",
      },
      {
        id: "licenses-03",
        category: "licenses",
        question: "Gdzie znajdę szczegóły licencji?",
        answer:
          "W sekcji Licencje oraz w kartach produktów — każda oferta ma jasno opisany zakres użycia.",
      },
      {
        id: "purchase-01",
        category: "purchase",
        question: "Jakie metody płatności są dostępne?",
        answer:
          "Aktualne metody płatności są widoczne w checkout. Jeśli potrzebujesz innej formy, skontaktuj się z nami.",
      },
      {
        id: "purchase-02",
        category: "purchase",
        question: "Czy wystawiana jest faktura?",
        answer:
          "Tak, po zakupie otrzymasz fakturę. Przy usługach fakturę wystawiamy zgodnie z ustaleniami.",
      },
      {
        id: "purchase-03",
        category: "purchase",
        question: "Czy produkty cyfrowe podlegają zwrotom?",
        answer:
          "Produkty cyfrowe po pobraniu zwykle nie podlegają zwrotom, ale w razie problemów technicznych pomagamy.",
      },
      {
        id: "access-01",
        category: "access",
        question: "Gdzie znajdę zakupione pliki?",
        answer:
          "W bibliotece użytkownika — każdy zakup pojawia się automatycznie po zakończeniu procesu płatności.",
      },
      {
        id: "access-02",
        category: "access",
        question: "Czy muszę mieć konto, aby kupić produkt?",
        answer:
          "Tak, konto jest wymagane do dostępu do biblioteki, licencji i historii zakupów.",
      },
      {
        id: "access-03",
        category: "access",
        question: "Czy mogę pobrać pliki ponownie?",
        answer:
          "Tak, pobrania są dostępne w bibliotece, dopóki produkt jest aktywny w Twoim koncie.",
      },
      {
        id: "services-01",
        category: "services",
        question: "Jak wygląda proces zamówienia usługi?",
        answer:
          "Po kontakcie przygotowujemy zakres, harmonogram i wycenę. Dopiero po akceptacji rozpoczynamy realizację.",
      },
      {
        id: "services-02",
        category: "services",
        question: "Czy mogę zamówić usługę niestandardową?",
        answer:
          "Tak, realizujemy projekty custom. Opisz potrzeby, a zaproponujemy optymalny zakres i wycenę.",
      },
      {
        id: "services-03",
        category: "services",
        question: "Ile trwa realizacja usług?",
        answer:
          "Najczęściej od 1 do kilku tygodni — zależnie od zakresu i priorytetu projektu.",
      },
      {
        id: "support-01",
        category: "support",
        question: "Gdzie zgłosić problem techniczny?",
        answer:
          "Skontaktuj się przez formularz kontaktowy — wsparcie odpowiada zwykle w ciągu 24–48 godzin.",
      },
      {
        id: "support-02",
        category: "support",
        question: "Czy pomagacie w integracji produktów?",
        answer:
          "Tak, możemy doradzić w zakresie wdrożenia lub zaproponować usługę implementacji.",
      },
      {
        id: "support-03",
        category: "support",
        question: "Czy oferujecie aktualizacje i poprawki?",
        answer:
          "Tak, nowe wersje produktów pojawiają się w bibliotece, a większe zmiany komunikujemy w aktualizacjach.",
      },
    ],
    cta: {
      ariaLabel: "Kontakt",
      title: "Nie znalazłeś odpowiedzi?",
      lead: "Napisz do nas — odpowiemy możliwie najszybciej.",
      primaryLabel: "Kontakt",
      secondaryLabel: "Aktualizacje / Changelog",
    },
    empty: {
      title: "Brak wyników",
      lead: "Spróbuj innego zapytania lub wybierz inną kategorię.",
    },
  },
  support: {
    hero: {
      eyebrow: "Wsparcie",
      title: "Wsparcie",
      lead: "Znajdź pomoc, dokumentację lub informacje dotyczące wsparcia technicznego.",
    },
    help: {
      ariaLabel: "Jak możemy pomóc",
      title: "Jak możemy pomóc?",
      lead: "Wybierz najwłaściwszą ścieżkę, aby szybko znaleźć odpowiedź.",
      cards: [
        {
          icon: "?",
          title: "FAQ / Dokumentacja",
          description: "Odpowiedzi na najczęstsze pytania o produkty, licencje i dostęp.",
          ctaLabel: "Przejdź do FAQ",
          ctaHref: "#/faq",
        },
        {
          icon: "⟳",
          title: "Aktualizacje / Changelog",
          description: "Sprawdź nowe wydania, poprawki i zmiany w produktach.",
          ctaLabel: "Zobacz aktualizacje",
          ctaHref: "#/updates",
        },
        {
          icon: "!",
          title: "Problemy techniczne",
          description: "Zgłoś błąd lub problem z działaniem produktu w uporządkowany sposób.",
          ctaLabel: "Jak zgłosić problem",
          ctaTarget: "issue-reporting",
          type: "scroll",
        },
        {
          icon: "•",
          title: "Konto i dostęp",
          description: "Zakupy, biblioteka, licencje oraz zarządzanie kontem użytkownika.",
          ctaLabel: "Panel konta",
          ctaHref: "#/account",
        },
      ],
    },
    issue: {
      ariaLabel: "Jak zgłosić problem techniczny",
      title: "Jak zgłosić problem techniczny",
      lead: "Zanim napiszesz, przygotuj podstawowe informacje — dzięki temu szybciej pomożemy.",
      stepLabel: "Krok {index}",
      steps: [
        {
          title: "Sprawdź FAQ",
          description: "Wiele odpowiedzi jest dostępnych od ręki w sekcji FAQ.",
        },
        {
          title: "Sprawdź Aktualizacje / Changelog",
          description: "Upewnij się, że problem nie został już rozwiązany w ostatniej wersji.",
        },
        {
          title: "Przygotuj informacje",
          description:
            "Nazwa produktu, wersja, przeglądarka/system oraz krótki opis problemu.",
        },
        {
          title: "Skontaktuj się z nami",
          description: "Przejdź do strony Kontakt i prześlij zgłoszenie.",
        },
      ],
      ctaPrimaryLabel: "Przejdź do FAQ",
      ctaSecondaryLabel: "Kontakt",
    },
    scope: {
      ariaLabel: "Zakres wsparcia",
      title: "Zakres wsparcia",
      lead: "Jasne zasady pomagają szybciej rozwiązać problem.",
      includedTitle: "Wsparcie obejmuje",
      excludedTitle: "Wsparcie nie obejmuje",
      included: [
        "Wyjaśnienia dotyczące zawartości produktów i licencji.",
        "Pomoc przy pobieraniu plików i dostępie do biblioteki.",
        "Weryfikację problemów technicznych związanych z produktem.",
        "Informacje o aktualizacjach i rekomendacjach wdrożeniowych.",
      ],
      excluded: [
        "Pełnych wdrożeń po stronie klienta bez zamówionej usługi.",
        "Modyfikacji produktów wykraczających poza opis licencji.",
        "Audytów bezpieczeństwa i infrastruktury hostingowej.",
        "Wdrożeń funkcji spoza zakupionego zakresu.",
      ],
    },
    response: {
      ariaLabel: "Czas odpowiedzi",
      title: "Czas odpowiedzi",
      lead:
        "Wsparcie realizujemy asynchronicznie — odpowiadamy możliwie szybko w dni robocze.",
      primary: "Orientacyjny czas odpowiedzi: 24–48 godzin roboczych.",
      secondary: "W pilnych przypadkach opisz priorytet i kontekst biznesowy w zgłoszeniu.",
    },
    cta: {
      ariaLabel: "Kontakt",
      title: "Nie znalazłeś odpowiedzi?",
      lead: "Jeśli potrzebujesz wsparcia, skontaktuj się z nami.",
      primaryLabel: "Kontakt",
    },
  },
  updates: {
    hero: {
      eyebrow: "Aktualizacje",
      title: "Aktualizacje / Changelog",
      lead: "Publikujemy tu zmiany platformy oraz aktualizacje produktów.",
    },
    controls: {
      ariaLabel: "Filtry aktualizacji",
      title: "Przegląd aktualizacji",
      lead: "Filtruj wpisy lub wyszukuj konkretne zmiany.",
    },
    search: {
      label: "Szukaj aktualizacji",
      placeholder: "Szukaj aktualizacji…",
    },
    filters: [
      { id: "all", label: "Wszystko" },
      { id: "platform", label: "Platforma" },
      { id: "products", label: "Produkty" },
      { id: "fixes", label: "Naprawy" },
      { id: "security", label: "Bezpieczeństwo" },
    ],
    entries: [
      {
        id: "update-2026-02-10",
        date: "2026-02-10",
        version: "2026.02.1",
        type: "Ulepszenia",
        scope: "platform",
        title: "Usprawniony panel biblioteki",
        summary: "Szybsze ładowanie i czytelniejsze stany pobrań.",
        details: [
          "Zoptymalizowane ładowanie listy zakupów.",
          "Lepsze komunikaty o dostępności plików.",
          "Usprawniony układ kart w bibliotece.",
        ],
        links: [{ label: "Biblioteka", href: "#/library" }],
      },
      {
        id: "update-2026-01-28",
        date: "2026-01-28",
        version: "2026.01.4",
        type: "Nowość",
        scope: "products",
        title: "Nowe starter packs dla UI Kits",
        summary: "Dodaliśmy zestawy startowe z naciskiem na szybkie wdrożenie.",
        details: [
          "Nowe sekcje hero, pricing i FAQ.",
          "Zunifikowane tokeny kolorów i typografii.",
          "Gotowe warianty responsywne.",
        ],
        links: [{ label: "Produkty UI Kits", href: "#/products/ui-kits" }],
      },
      {
        id: "update-2026-01-20",
        date: "2026-01-20",
        version: "2026.01.3",
        type: "Naprawa",
        scope: "fixes",
        title: "Naprawy w koszyku i checkout",
        summary: "Poprawiono stabilność i komunikaty w procesie zakupu.",
        details: [
          "Lepsze komunikaty o brakujących produktach.",
          "Doprecyzowane stany ładowania.",
          "Naprawa wyświetlania sumy w koszyku.",
        ],
      },
      {
        id: "update-2026-01-12",
        date: "2026-01-12",
        version: "2026.01.2",
        type: "Bezpieczeństwo",
        scope: "security",
        title: "Wzmocnione zabezpieczenia dostępu",
        summary: "Dodatkowe walidacje i lepsze logowanie zdarzeń.",
        details: [
          "Lepsza walidacja danych wejściowych.",
          "Usprawnione logowanie zdarzeń konta.",
          "Dodatkowe kontrole w warstwie routingowej.",
        ],
      },
      {
        id: "update-2026-01-05",
        date: "2026-01-05",
        version: "2026.01.1",
        type: "Ulepszenia",
        scope: "products",
        title: "Lepsze opisy produktów",
        summary: "Ujednolicone opisy i listy zawartości w kartach produktów.",
        details: [
          "Spójny układ sekcji produktu.",
          "Dodane informacje o formatach plików.",
          "Wyrównane style list i CTA.",
        ],
        links: [{ label: "Katalog produktów", href: "#/products" }],
      },
    ],
    empty: {
      title: "Brak wpisów",
      lead: "Pierwsze aktualizacje pojawią się wraz z premierą nowych paczek.",
    },
  },
  notFound: {
    title: "404",
    lead: "Nie znaleziono strony. Sprawdź adres lub wróć na stronę główną.",
    ctaLabel: "Powrót",
  },
  servicesUi: {
    stepLabel: "Krok {index}",
    schema: {
      itemListName: "Usługi KP_Code",
    },
    galleryActions: [
      { label: "Demo", disabled: true },
      { label: "Szczegóły", disabled: true },
    ],
    index: {
      sections: {
        cards: {
          title: "Wszystkie usługi",
          lead: "Wybierz obszar, w którym potrzebujesz wsparcia.",
          ctaLabel: "Zobacz szczegóły",
        },
        collaboration: {
          title: "Jak wygląda współpraca?",
          lead: "Wszystkie projekty realizujemy w przewidywalnych etapach.",
        },
        pricing: {
          title: "Pakiety i ceny",
          lead: "Przykładowe pakiety, które dopasujemy do Twoich potrzeb.",
        },
        faq: {
          title: "FAQ",
          lead: "Odpowiadamy na najczęstsze pytania o współpracę.",
        },
        cta: {
          title: "Kontakt",
        },
      },
    },
    detail: {
      panelTitle: "Co dostajesz",
      contactLabel: "Kontakt",
      ctaLabel: "CTA",
    },
    quote: {
      ariaLabel: "Szybka wycena",
      scrollToQuoteLabel: "Szybka wycena",
      servicePlaceholder: "Wybierz usługę",
      serviceLabel: "Typ usługi",
      budgetLabel: "Budżet (PLN)",
      timelineLabel: "Termin",
      emailLabel: "E-mail",
      budgetPlaceholder: "np. 6000",
      timelinePlaceholder: "np. 4 tygodnie / 15.06",
      emailPlaceholder: "twoj@email.com",
      errors: {
        serviceRequired: "Wybierz usługę z listy.",
        budgetRequired: "Podaj szacowany budżet.",
        timelineRequired: "Podaj preferowany termin realizacji.",
        emailInvalid: "Podaj poprawny adres e-mail.",
        required: "Uzupełnij wymagane pola.",
        status: "Sprawdź wymagane pola i spróbuj ponownie.",
      },
      success: {
        toast: "Dziękujemy! Odpowiemy w ciągu 24-48h.",
        message: "Dziękujemy! Otrzymasz odpowiedź w ciągu 24-48h. (Demo)",
        ctaLabel: "Przejdź do kontaktu",
      },
    },
  },
  caseStudies: {
    index: {
      title: "Case studies",
      lead: "Sekcja case studies jest w przygotowaniu. Wkrótce dodamy listę realizacji.",
      cardTitle: "Co się pojawi",
      cardBullets: [
        "Lista realizacji powiązanych z usługami",
        "Filtry po typie usługi",
        "Szczegółowe opisy procesów",
      ],
    },
    meta: {
      detailTitle: "{title} — Case study | KP_Code Digital Vault",
    },
    detail: {
      metaTitle: "Kontekst projektu",
      serviceLabel: "Usługa",
      categoryLabel: "Kategoria",
      stepLabel: "Krok {index}",
      ctaPrimaryFallback: "Poproś o wycenę",
      ctaSecondaryFallback: "Kontakt",
      sections: {
        goal: {
          title: "Cel",
          lead: "Górny poziom celu klienta.",
        },
        scope: {
          title: "Zakres prac",
          lead: "Zakres dostarczonych elementów.",
        },
        stack: {
          title: "Stack",
          lead: "Użyte narzędzia i komponenty.",
        },
        process: {
          title: "Proces",
          lead: "Etapy współpracy krok po kroku.",
        },
        standards: {
          title: "Standardy",
          lead: "Zakres jakości i standardów.",
        },
        security: {
          title: "Bezpieczeństwo",
          lead: "Podstawowe podejście do ochrony projektu.",
        },
        outcome: {
          title: "Rezultat",
          lead: "Efekt wdrożenia.",
        },
        gallery: {
          title: "Galeria",
          lead: "Podglądy sekcji i widoków.",
        },
        cta: {
          title: "CTA",
        },
      },
    },
  },
};
