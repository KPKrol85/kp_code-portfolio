import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { setMeta } from "../utils/meta.js";
import { parseHash } from "../utils/navigation.js";

const FAQ_META = {
  title: "FAQ — KP_Code Digital Vault",
  description: "Odpowiedzi na pytania o produkty cyfrowe, licencje, zakupy i dostęp.",
};

const FAQ_CATEGORIES = [
  { id: "general", label: "Ogólne" },
  { id: "digital-products", label: "Produkty cyfrowe" },
  { id: "licenses", label: "Licencje i użycie" },
  { id: "purchase", label: "Zakup i płatności" },
  { id: "access", label: "Dostęp i konto" },
  { id: "services", label: "Usługi" },
  { id: "support", label: "Wsparcie techniczne" },
];

const FAQ_ITEMS = [
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
];

const createSectionHeader = (title, lead) => {
  const header = createElement("div", { className: "section-header" });
  header.appendChild(createElement("h2", { text: title }));
  if (lead) {
    header.appendChild(createElement("p", { className: "section-lead", text: lead }));
  }
  return header;
};

const createFaqList = (items = []) => {
  const list = createElement("div", { className: "faq-list" });
  items.forEach((faq) => {
    const details = createElement("details", { className: "faq-item" });
    details.appendChild(createElement("summary", { text: faq.question }));
    details.appendChild(createElement("p", { text: faq.answer }));
    list.appendChild(details);
  });
  return list;
};

const findFaqMatches = (query) => {
  if (!query) {
    return [];
  }
  const normalized = query.toLowerCase();
  return FAQ_ITEMS.filter((item) => {
    return (
      item.question.toLowerCase().includes(normalized) ||
      item.answer.toLowerCase().includes(normalized)
    );
  });
};

const getCategoryItems = (category) =>
  FAQ_ITEMS.filter((item) => item.category === category);

export const renderFaq = () => {
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const { pathname } = parseHash();
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));

  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }

  const hero = createElement("section", { className: "hero faq-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(createElement("span", { className: "eyebrow", text: "FAQ" }));
  heroContent.appendChild(
    createElement("h1", {
      text: "Najczęściej zadawane pytania",
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: "Pytania o produkty, licencje i działanie platformy.",
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const controlsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Kategorie FAQ" },
  });
  controlsSection.appendChild(
    createSectionHeader("Kategorie", "Wybierz kategorię lub wyszukaj odpowiedź.")
  );

  const tabs = createElement("div", {
    className: "tabs faq-tabs",
    attrs: { role: "tablist" },
  });

  const searchField = createElement("div", { className: "form-field faq-search" });
  const searchLabel = createElement("label", {
    text: "Szukaj pytania",
    attrs: { for: "faq-search" },
  });
  const searchInput = createElement("input", {
    className: "input",
    attrs: {
      id: "faq-search",
      type: "search",
      placeholder: "Szukaj pytania…",
      autocomplete: "off",
    },
  });
  searchField.appendChild(searchLabel);
  searchField.appendChild(searchInput);

  const toolbar = createElement("div", { className: "faq-toolbar" }, [tabs, searchField]);
  controlsSection.appendChild(toolbar);

  const resultsWrapper = createElement("div", { className: "faq-results" });
  controlsSection.appendChild(resultsWrapper);
  container.appendChild(controlsSection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Kontakt" },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(
    createElement("div", {}, [
      createElement("h2", { text: "Nie znalazłeś odpowiedzi?" }),
      createElement("p", { text: "Napisz do nas — odpowiemy możliwie najszybciej." }),
    ])
  );
  const ctaActions = createElement("div", { className: "hero-actions" });
  ctaActions.appendChild(
    createElement("a", {
      className: "button",
      text: "Kontakt",
      attrs: { href: "#/contact" },
    })
  );
  ctaActions.appendChild(
    createElement("a", {
      className: "button secondary",
      text: "Aktualizacje / Changelog",
      attrs: { href: "#/updates" },
    })
  );
  ctaCard.appendChild(ctaActions);
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  main.appendChild(container);

  let activeCategory = FAQ_CATEGORIES[0].id;

  const updateTabs = () => {
    [...tabs.querySelectorAll("button[data-category]")].forEach((button) => {
      const isActive = button.getAttribute("data-category") === activeCategory;
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  const renderResults = () => {
    clearElement(resultsWrapper);
    const query = searchInput.value.trim();
    let items = [];

    if (query) {
      items = findFaqMatches(query);
    } else {
      items = getCategoryItems(activeCategory);
    }

    if (!items.length) {
      resultsWrapper.appendChild(
        createElement("div", { className: "card faq-empty" }, [
          createElement("h3", { text: "Brak wyników" }),
          createElement("p", { text: "Spróbuj innego zapytania lub wybierz inną kategorię." }),
        ])
      );
      return;
    }

    resultsWrapper.appendChild(createFaqList(items));
  };

  FAQ_CATEGORIES.forEach((category) => {
    const button = createElement("button", {
      className: "button tab-button",
      text: category.label,
      attrs: {
        type: "button",
        role: "tab",
        "data-category": category.id,
        "aria-selected": category.id === activeCategory ? "true" : "false",
      },
    });
    button.addEventListener("click", () => {
      activeCategory = category.id;
      updateTabs();
      if (!searchInput.value.trim()) {
        renderResults();
      }
    });
    tabs.appendChild(button);
  });

  searchInput.addEventListener("input", renderResults);

  updateTabs();
  renderResults();
  setMeta(FAQ_META);
};
