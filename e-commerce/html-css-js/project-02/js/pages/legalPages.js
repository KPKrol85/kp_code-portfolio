import { createElement, clearElement } from "../utils/dom.js";

const CONTACT_EMAIL = "kontakt@kp-code.pl";
const UPDATED_AT = "2026-01-17";

const buildSection = (section, index) => {
  const sectionId = `section-${index + 1}`;
  const block = createElement("div", { className: "legal-section" }, [
    createElement("h2", { text: section.title, attrs: { id: sectionId } }),
  ]);

  section.paragraphs.forEach((paragraph) => {
    block.appendChild(createElement("p", { text: paragraph }));
  });

  if (section.list?.length) {
    const list = createElement(
      "ul",
      {},
      section.list.map((item) => createElement("li", { text: item }))
    );
    block.appendChild(list);
  }

  return block;
};

const renderLegalPage = ({ title, intro, sections }) => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const page = createElement("div", { className: "legal-page" });

  page.appendChild(createElement("h1", { text: title }));
  page.appendChild(
    createElement("p", { className: "legal-meta", text: `Ostatnia aktualizacja: ${UPDATED_AT}` })
  );
  page.appendChild(
    createElement("div", { className: "notice", text: "Wersja robocza — do weryfikacji prawnej." })
  );
  page.appendChild(createElement("p", { className: "legal-intro", text: intro }));

  const content = createElement("div", { className: "legal-content" });
  sections.forEach((section, index) => {
    content.appendChild(buildSection(section, index));
  });

  const relatedLinks = createElement("div", { className: "legal-links" }, [
    createElement("a", { className: "footer-link", text: "Polityka prywatności", attrs: { href: "#/privacy" } }),
    createElement("a", { className: "footer-link", text: "Regulamin", attrs: { href: "#/terms" } }),
    createElement("a", { className: "footer-link", text: "Cookies", attrs: { href: "#/cookies" } }),
    createElement("a", { className: "footer-link", text: "Kontakt", attrs: { href: "#/contact" } }),
  ]);

  const contact = createElement("p", {
    text: `Kontakt w sprawach prawnych i prywatności: ${CONTACT_EMAIL}`,
  });
  const contactLink = createElement("a", {
    className: "footer-link",
    text: "Napisz do nas",
    attrs: { href: `mailto:${CONTACT_EMAIL}` },
  });
  contact.appendChild(createElement("span", { text: " — " }));
  contact.appendChild(contactLink);

  const footer = createElement("div", { className: "legal-footer" }, [
    createElement("h2", { text: "Powiązane dokumenty i kontakt" }),
    relatedLinks,
    contact,
  ]);

  content.appendChild(footer);

  page.appendChild(content);
  container.appendChild(page);
  main.appendChild(container);
};

export const renderPrivacy = () => {
  renderLegalPage({
    title: "Polityka prywatności",
    intro:
      "W KP_Code Digital Vault dbamy o przejrzystość. Poniżej wyjaśniamy, jakie dane zbieramy, w jakim celu i jak długo je przechowujemy, gdy korzystasz z konta, kupujesz produkty cyfrowe lub kontaktujesz się z nami.",
    sections: [
      {
        title: "Administrator danych i kontakt",
        paragraphs: [
          "Administratorem danych osobowych jest KP_Code Digital Vault. W sprawach dotyczących danych osobowych możesz skontaktować się z nami pod adresem e-mail.",
        ],
        list: [`Adres kontaktowy: ${CONTACT_EMAIL}`],
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
        paragraphs: ["Dane przetwarzamy w jasno określonych celach:"] ,
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
        paragraphs: ["Masz prawo do:"] ,
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
  });
};

export const renderTerms = () => {
  renderLegalPage({
    title: "Regulamin",
    intro:
      "Regulamin określa zasady korzystania z KP_Code Digital Vault oraz warunki zakupu i korzystania z produktów cyfrowych dostępnych w serwisie.",
    sections: [
      {
        title: "Definicje",
        paragraphs: ["Na potrzeby regulaminu przyjmujemy następujące definicje:"] ,
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
        paragraphs: ["Zakup produktu cyfrowego oznacza udzielenie licencji:"] ,
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
  });
};

export const renderCookies = () => {
  renderLegalPage({
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
        paragraphs: ["Stosujemy następujące kategorie:"] ,
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
          `W razie pytań dotyczących cookies możesz skontaktować się z nami pod adresem ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  });
};
