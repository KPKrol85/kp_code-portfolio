import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { setMeta } from "../utils/meta.js";
import { parseHash } from "../utils/navigation.js";

const UPDATES_META = {
  title: "Aktualizacje / Changelog — KP_Code Digital Vault",
  description: "Zmiany w platformie i produktach KP_Code Digital Vault.",
};

const FILTERS = [
  { id: "all", label: "Wszystko" },
  { id: "platform", label: "Platforma" },
  { id: "products", label: "Produkty" },
  { id: "fixes", label: "Naprawy" },
  { id: "security", label: "Bezpieczeństwo" },
];

const CHANGELOG_ENTRIES = [
  {
    id: "update-2026-02-10",
    date: "2026-02-10",
    version: "2026.02.1",
    type: "Improved",
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
    type: "New",
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
    type: "Fixed",
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
    type: "Security",
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
    type: "Improved",
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
];

const createSectionHeader = (title, lead) => {
  const header = createElement("div", { className: "section-header" });
  header.appendChild(createElement("h2", { text: title }));
  if (lead) {
    header.appendChild(createElement("p", { className: "section-lead", text: lead }));
  }
  return header;
};

const createUpdateCard = (entry) => {
  const card = createElement("details", { className: "card update-card" });
  const summary = createElement("summary", { className: "update-card__summary" });

  const metaRow = createElement("div", { className: "update-card__meta" }, [
    createElement("span", { className: "badge", text: entry.type }),
    createElement("span", { className: "service-meta", text: entry.version }),
    createElement("span", { className: "service-meta", text: entry.date }),
  ]);

  const heading = createElement("div", { className: "update-card__heading" }, [
    createElement("h3", { text: entry.title }),
    createElement("p", { className: "service-meta", text: entry.summary }),
  ]);

  summary.appendChild(metaRow);
  summary.appendChild(heading);
  card.appendChild(summary);

  const details = createElement("div", { className: "update-card__details" });
  const list = createElement("ul", { className: "service-list" });
  entry.details.forEach((item) => list.appendChild(createElement("li", { text: item })));
  details.appendChild(list);

  if (entry.links?.length) {
    const linksRow = createElement("div", { className: "hero-actions" });
    entry.links.forEach((link) => {
      linksRow.appendChild(
        createElement("a", {
          className: "button secondary",
          text: link.label,
          attrs: { href: link.href },
        })
      );
    });
    details.appendChild(linksRow);
  }

  card.appendChild(details);
  return card;
};

const matchesQuery = (entry, query) => {
  if (!query) {
    return true;
  }
  const normalized = query.toLowerCase();
  const haystack = [
    entry.title,
    entry.summary,
    entry.type,
    entry.scope,
    ...(entry.details || []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalized);
};

export const renderUpdates = () => {
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

  const hero = createElement("section", { className: "hero updates-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(createElement("span", { className: "eyebrow", text: "Aktualizacje" }));
  heroContent.appendChild(
    createElement("h1", {
      text: "Aktualizacje / Changelog",
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: "Publikujemy tu zmiany platformy oraz aktualizacje produktów.",
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const controlsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Filtry aktualizacji" },
  });
  controlsSection.appendChild(
    createSectionHeader(
      "Przegląd aktualizacji",
      "Filtruj wpisy lub wyszukuj konkretne zmiany."
    )
  );

  const tabs = createElement("div", {
    className: "tabs updates-tabs",
    attrs: { role: "tablist" },
  });
  let activeFilter = "all";

  FILTERS.forEach((filter) => {
    const button = createElement("button", {
      className: "button tab-button",
      text: filter.label,
      attrs: {
        type: "button",
        role: "tab",
        "data-filter": filter.id,
        "aria-selected": filter.id === activeFilter ? "true" : "false",
      },
    });
    button.addEventListener("click", () => {
      activeFilter = filter.id;
      updateTabs();
      renderEntries();
    });
    tabs.appendChild(button);
  });

  const searchField = createElement("div", { className: "form-field updates-search" });
  const searchLabel = createElement("label", {
    text: "Szukaj aktualizacji",
    attrs: { for: "updates-search" },
  });
  const searchInput = createElement("input", {
    className: "input",
    attrs: {
      id: "updates-search",
      type: "search",
      placeholder: "Szukaj aktualizacji…",
      autocomplete: "off",
    },
  });
  searchField.appendChild(searchLabel);
  searchField.appendChild(searchInput);

  const toolbar = createElement("div", { className: "updates-toolbar" }, [tabs, searchField]);
  controlsSection.appendChild(toolbar);

  const listWrapper = createElement("div", { className: "updates-list" });
  controlsSection.appendChild(listWrapper);
  container.appendChild(controlsSection);

  main.appendChild(container);

  const updateTabs = () => {
    [...tabs.querySelectorAll("[data-filter]")].forEach((button) => {
      const isActive = button.getAttribute("data-filter") === activeFilter;
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  const renderEntries = () => {
    clearElement(listWrapper);
    const query = searchInput.value.trim();
    const entries = [...CHANGELOG_ENTRIES]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((entry) => (activeFilter === "all" ? true : entry.scope === activeFilter))
      .filter((entry) => matchesQuery(entry, query));

    if (!entries.length) {
      listWrapper.appendChild(
        createElement("div", { className: "card updates-empty" }, [
          createElement("h3", { text: "Brak wpisów" }),
          createElement("p", {
            text: "Pierwsze aktualizacje pojawią się wraz z premierą nowych paczek.",
          }),
        ])
      );
      return;
    }

    entries.forEach((entry) => {
      listWrapper.appendChild(createUpdateCard(entry));
    });
  };

  searchInput.addEventListener("input", renderEntries);

  updateTabs();
  renderEntries();
  setMeta(UPDATES_META);
};
