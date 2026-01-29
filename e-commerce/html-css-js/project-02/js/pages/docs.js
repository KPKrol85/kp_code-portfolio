import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { setMeta } from "../utils/meta.js";
import { parseHash } from "../utils/navigation.js";

const DOCS_META = {
  title: "Dokumentacja — KP_Code Digital Vault",
  description: "Przewodniki i informacje dotyczące korzystania z produktów oraz platformy.",
};

const DOCS_SECTIONS = [
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
];

const createSectionHeader = (title, lead) => {
  const header = createElement("div", { className: "section-header" });
  header.appendChild(createElement("h2", { text: title }));
  if (lead) {
    header.appendChild(createElement("p", { className: "section-lead", text: lead }));
  }
  return header;
};

const renderDocsCards = (sections = []) => {
  const grid = createElement("div", { className: "grid grid-2 docs-grid" });
  sections.forEach((section) => {
    const card = createElement("div", { className: "card docs-card card--interactive" });
    card.appendChild(createElement("h3", { text: section.title }));
    card.appendChild(createElement("p", { text: section.description }));
    if (section.note) {
      card.appendChild(
        createElement("p", { className: "service-meta" }, [
          createElement("span", { text: section.note.text + " " }),
          createElement("a", {
            className: "docs-link",
            text: "Regulamin",
            attrs: { href: section.note.href },
          }),
        ])
      );
    }
    card.appendChild(
      createElement("a", {
        className: "button secondary",
        text: section.ctaLabel,
        attrs: { href: section.ctaHref },
      })
    );
    grid.appendChild(card);
  });
  return grid;
};

const matchesQuery = (section, query) => {
  if (!query) {
    return true;
  }
  const normalized = query.toLowerCase();
  return `${section.title} ${section.description}`.toLowerCase().includes(normalized);
};

export const renderDocs = () => {
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

  const hero = createElement("section", { className: "hero docs-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(createElement("span", { className: "eyebrow", text: "Dokumentacja" }));
  heroContent.appendChild(
    createElement("h1", {
      text: "Dokumentacja",
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: "Przewodniki i informacje dotyczące korzystania z produktów oraz platformy KP_Code Digital Vault.",
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const docsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Dokumentacja" },
  });
  docsSection.appendChild(
    createSectionHeader(
      "Dokumentacja jako hub",
      "Wybierz obszar, który najlepiej pasuje do Twojego pytania."
    )
  );

  const searchField = createElement("div", { className: "form-field docs-search" });
  const searchLabel = createElement("label", {
    text: "Szukaj w dokumentacji",
    attrs: { for: "docs-search" },
  });
  const searchInput = createElement("input", {
    className: "input",
    attrs: {
      id: "docs-search",
      type: "search",
      placeholder: "Szukaj w dokumentacji…",
      autocomplete: "off",
    },
  });
  searchField.appendChild(searchLabel);
  searchField.appendChild(searchInput);
  docsSection.appendChild(searchField);

  const cardsWrapper = createElement("div", { className: "docs-list" });
  docsSection.appendChild(cardsWrapper);
  container.appendChild(docsSection);

  const crossSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Dalsza pomoc" },
  });
  crossSection.appendChild(
    createSectionHeader(
      "Dalsza pomoc",
      "Dokumentacja prowadzi dalej — skorzystaj z dedykowanych kanałów."
    )
  );
  const crossGrid = createElement("div", { className: "grid grid-3" });
  [
    { title: "Masz pytania?", description: "Przejdź do FAQ z odpowiedziami.", href: "#/faq" },
    { title: "Problem techniczny?", description: "Zobacz centrum wsparcia.", href: "#/support" },
    {
      title: "Zmiany i nowe wersje?",
      description: "Sprawdź aktualizacje i changelog.",
      href: "#/updates",
    },
  ].forEach((item) => {
    const card = createElement("div", { className: "card" });
    card.appendChild(createElement("h3", { text: item.title }));
    card.appendChild(createElement("p", { text: item.description }));
    card.appendChild(
      createElement("a", {
        className: "button secondary",
        text: "Przejdź",
        attrs: { href: item.href },
      })
    );
    crossGrid.appendChild(card);
  });
  crossSection.appendChild(crossGrid);
  container.appendChild(crossSection);

  main.appendChild(container);

  const renderCards = () => {
    clearElement(cardsWrapper);
    const query = searchInput.value.trim();
    const filtered = DOCS_SECTIONS.filter((section) => matchesQuery(section, query));

    if (!filtered.length) {
      cardsWrapper.appendChild(
        createElement("div", { className: "card docs-empty" }, [
          createElement("h3", { text: "Brak wyników" }),
          createElement("p", {
            text: "Spróbuj innego zapytania lub przejrzyj wszystkie sekcje dokumentacji.",
          }),
        ])
      );
      return;
    }

    cardsWrapper.appendChild(renderDocsCards(filtered));
  };

  searchInput.addEventListener("input", renderCards);

  renderCards();
  setMeta(DOCS_META);
};
