export const content = {
  common: {
    browseProducts: "Przeglądaj produkty",
    backToCatalog: "Wróć do katalogu",
    goToLibrary: "Przejdź do biblioteki",
    goToCheckout: "Przejdź do checkout",
    processing: "Przetwarzanie...",
    summaryTitle: "Podsumowanie",
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
    },
    checkout: {
      empty: {
        title: "Twój koszyk jest pusty.",
        message: "Przeglądaj produkty to get started.",
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
  },
  cart: {
    title: "Twój koszyk",
    checkoutCta: "Przejdź do checkout",
  },
  checkout: {
    title: "Checkout",
    orderDetailsTitle: "Dane zamówienia",
    submit: "Złóż zamówienie",
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
};
