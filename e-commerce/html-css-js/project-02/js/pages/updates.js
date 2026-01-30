import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { getContent } from "../content/index.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { setMeta } from "../utils/meta.js";
import { parseHash } from "../utils/navigation.js";

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
  const content = getContent();
  const updates = content.updates;
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
  heroContent.appendChild(
    createElement("span", { className: "eyebrow", text: updates.hero.eyebrow })
  );
  heroContent.appendChild(
    createElement("h1", {
      text: updates.hero.title,
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: updates.hero.lead,
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const controlsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": updates.controls.ariaLabel },
  });
  controlsSection.appendChild(
    createSectionHeader(
      updates.controls.title,
      updates.controls.lead
    )
  );

  const tabs = createElement("div", {
    className: "tabs updates-tabs",
    attrs: { role: "tablist" },
  });
  let activeFilter = "all";

  updates.filters.forEach((filter) => {
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
    text: updates.search.label,
    attrs: { for: "updates-search" },
  });
  const searchInput = createElement("input", {
    className: "input",
    attrs: {
      id: "updates-search",
      type: "search",
      placeholder: updates.search.placeholder,
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
    const entries = [...updates.entries]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((entry) => (activeFilter === "all" ? true : entry.scope === activeFilter))
      .filter((entry) => matchesQuery(entry, query));

    if (!entries.length) {
      listWrapper.appendChild(
        createElement("div", { className: "card updates-empty" }, [
          createElement("h3", { text: updates.empty.title }),
          createElement("p", { text: updates.empty.lead }),
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
  setMeta(content.meta.routes.updates);
};
