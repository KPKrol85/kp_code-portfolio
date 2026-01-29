import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { setMeta } from "../utils/meta.js";
import { parseHash } from "../utils/navigation.js";

const SUPPORT_META = {
  title: "Wsparcie — KP_Code Digital Vault",
  description: "Pomoc techniczna, FAQ, aktualizacje i informacje o wsparciu.",
};

const createSectionHeader = (title, lead) => {
  const header = createElement("div", { className: "section-header" });
  header.appendChild(createElement("h2", { text: title }));
  if (lead) {
    header.appendChild(createElement("p", { className: "section-lead", text: lead }));
  }
  return header;
};

const createList = (items = [], className) => {
  const list = createElement("ul", className ? { className } : {});
  items.forEach((item) => {
    list.appendChild(createElement("li", { text: item }));
  });
  return list;
};

const createSupportCards = (cards = []) => {
  const grid = createElement("div", { className: "grid grid-2 support-grid" });
  cards.forEach((card) => {
    const entry = createElement("div", { className: "card support-card card--interactive" });
    const icon = createElement("span", {
      className: "support-card__icon",
      text: card.icon,
      attrs: { "aria-hidden": "true" },
    });
    entry.appendChild(icon);
    entry.appendChild(createElement("h3", { text: card.title }));
    entry.appendChild(createElement("p", { text: card.description }));

    if (card.type === "scroll") {
      entry.appendChild(
        createElement("button", {
          className: "button secondary",
          text: card.ctaLabel,
          attrs: { type: "button", "data-scroll-target": card.ctaTarget },
        })
      );
    } else {
      entry.appendChild(
        createElement("a", {
          className: "button secondary",
          text: card.ctaLabel,
          attrs: { href: card.ctaHref },
        })
      );
    }
    grid.appendChild(entry);
  });
  return grid;
};

export const renderSupport = () => {
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

  const hero = createElement("section", { className: "hero support-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(createElement("span", { className: "eyebrow", text: "Wsparcie" }));
  heroContent.appendChild(
    createElement("h1", { text: "Wsparcie", attrs: { tabindex: "-1", "data-focus-heading": "true" } })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: "Znajdź pomoc, dokumentację lub informacje dotyczące wsparcia technicznego.",
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const helpSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Jak możemy pomóc" },
  });
  helpSection.appendChild(
    createSectionHeader(
      "Jak możemy pomóc?",
      "Wybierz najwłaściwszą ścieżkę, aby szybko znaleźć odpowiedź."
    )
  );
  helpSection.appendChild(
    createSupportCards([
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
    ])
  );
  container.appendChild(helpSection);

  const issueSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Jak zgłosić problem techniczny" },
  });
  issueSection.setAttribute("id", "issue-reporting");
  issueSection.appendChild(
    createSectionHeader(
      "Jak zgłosić problem techniczny",
      "Zanim napiszesz, przygotuj podstawowe informacje — dzięki temu szybciej pomożemy."
    )
  );
  const issueSteps = createElement("ol", { className: "process-steps" });
  [
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
  ].forEach((step, index) => {
    const item = createElement("li", { className: "process-step" });
    item.appendChild(createElement("span", { className: "service-meta", text: `Krok ${index + 1}` }));
    item.appendChild(createElement("h3", { text: step.title }));
    item.appendChild(createElement("p", { text: step.description }));
    issueSteps.appendChild(item);
  });
  issueSection.appendChild(issueSteps);
  issueSection.appendChild(
    createElement("div", { className: "hero-actions" }, [
      createElement("a", {
        className: "button secondary",
        text: "Przejdź do FAQ",
        attrs: { href: "#/faq" },
      }),
      createElement("a", {
        className: "button",
        text: "Kontakt",
        attrs: { href: "#/contact" },
      }),
    ])
  );
  container.appendChild(issueSection);

  const scopeSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Zakres wsparcia" },
  });
  scopeSection.appendChild(
    createSectionHeader("Zakres wsparcia", "Jasne zasady pomagają szybciej rozwiązać problem.")
  );
  const scopeGrid = createElement("div", { className: "grid grid-2" });
  const includedCard = createElement("div", { className: "card support-scope" });
  includedCard.appendChild(createElement("h3", { text: "Wsparcie obejmuje" }));
  includedCard.appendChild(
    createList(
      [
        "Wyjaśnienia dotyczące zawartości produktów i licencji.",
        "Pomoc przy pobieraniu plików i dostępie do biblioteki.",
        "Weryfikację problemów technicznych związanych z produktem.",
        "Informacje o aktualizacjach i rekomendacjach wdrożeniowych.",
      ],
      "service-list"
    )
  );
  const excludedCard = createElement("div", { className: "card support-scope" });
  excludedCard.appendChild(createElement("h3", { text: "Wsparcie nie obejmuje" }));
  excludedCard.appendChild(
    createList(
      [
        "Pełnych wdrożeń po stronie klienta bez zamówionej usługi.",
        "Modyfikacji produktów wykraczających poza opis licencji.",
        "Audytów bezpieczeństwa i infrastruktury hostingowej.",
        "Wdrożeń funkcji spoza zakupionego zakresu.",
      ],
      "service-list"
    )
  );
  scopeGrid.appendChild(includedCard);
  scopeGrid.appendChild(excludedCard);
  scopeSection.appendChild(scopeGrid);
  container.appendChild(scopeSection);

  const responseSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Czas odpowiedzi" },
  });
  responseSection.appendChild(
    createSectionHeader(
      "Czas odpowiedzi",
      "Wsparcie realizujemy asynchronicznie — odpowiadamy możliwie szybko w dni robocze."
    )
  );
  const responseCard = createElement("div", { className: "card support-response" }, [
    createElement("p", {
      text: "Orientacyjny czas odpowiedzi: 24–48 godzin roboczych.",
    }),
    createElement("p", {
      className: "service-meta",
      text: "W pilnych przypadkach opisz priorytet i kontekst biznesowy w zgłoszeniu.",
    }),
  ]);
  responseSection.appendChild(responseCard);
  container.appendChild(responseSection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Kontakt" },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(
    createElement("div", {}, [
      createElement("h2", { text: "Nie znalazłeś odpowiedzi?" }),
      createElement("p", { text: "Jeśli potrzebujesz wsparcia, skontaktuj się z nami." }),
    ])
  );
  ctaCard.appendChild(
    createElement("a", {
      className: "button",
      text: "Kontakt",
      attrs: { href: "#/contact" },
    })
  );
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  main.appendChild(container);

  const scrollButtons = [...container.querySelectorAll("[data-scroll-target]")];
  const handleScroll = (event) => {
    const targetId = event.currentTarget.getAttribute("data-scroll-target");
    if (!targetId) {
      return;
    }
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  scrollButtons.forEach((button) => button.addEventListener("click", handleScroll));

  setMeta(SUPPORT_META);

  return () => {
    scrollButtons.forEach((button) => button.removeEventListener("click", handleScroll));
  };
};
