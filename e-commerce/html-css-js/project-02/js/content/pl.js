// Zasada: teksty UI dodajemy wyłącznie przez content/.
export const content = {
  common: {
    browseProducts: "Przeglądaj produkty",
    backToCatalog: "Wróć do katalogu",
    goToLibrary: "Przejdź do biblioteki",
    goToCheckout: "Przejdź do checkout",
    processing: "Przetwarzanie...",
    summaryTitle: "Podsumowanie",
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
  products: {
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
    errorFallbackMessage: "Spróbuj ponownie później.",
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
  },
  account: {
    title: "Twoje konto",
    nav: {
      ariaLabel: "Konto",
      overview: "Przegląd",
      orders: "Zamówienia",
      downloads: "Pobrane pliki",
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
};
