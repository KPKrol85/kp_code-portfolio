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

const renderDocsCards = (sections = [], noteLinkLabel) => {
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
            text: section.note.linkLabel || noteLinkLabel,
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
  const content = getContent();
  const docs = content.docs;
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
  heroContent.appendChild(
    createElement("span", { className: "eyebrow", text: docs.hero.eyebrow })
  );
  heroContent.appendChild(
    createElement("h1", {
      text: docs.hero.title,
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: docs.hero.lead,
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const docsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": docs.hub.title },
  });
  docsSection.appendChild(
    createSectionHeader(
      docs.hub.title,
      docs.hub.lead
    )
  );

  const searchField = createElement("div", { className: "form-field docs-search" });
  const searchLabel = createElement("label", {
    text: docs.search.label,
    attrs: { for: "docs-search" },
  });
  const searchInput = createElement("input", {
    className: "input",
    attrs: {
      id: "docs-search",
      type: "search",
      placeholder: docs.search.placeholder,
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
    attrs: { "aria-label": docs.cross.title },
  });
  crossSection.appendChild(
    createSectionHeader(
      docs.cross.title,
      docs.cross.lead
    )
  );
  const crossGrid = createElement("div", { className: "grid grid-3" });
  docs.cross.items.forEach((item) => {
    const card = createElement("div", { className: "card" });
    card.appendChild(createElement("h3", { text: item.title }));
    card.appendChild(createElement("p", { text: item.description }));
    card.appendChild(
      createElement("a", {
        className: "button secondary",
        text: docs.cross.ctaLabel,
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
    const filtered = docs.sections.filter((section) => matchesQuery(section, query));

    if (!filtered.length) {
      cardsWrapper.appendChild(
        createElement("div", { className: "card docs-empty" }, [
          createElement("h3", { text: docs.empty.title }),
          createElement("p", { text: docs.empty.lead }),
        ])
      );
      return;
    }

    cardsWrapper.appendChild(renderDocsCards(filtered, docs.noteLinkLabel));
  };

  searchInput.addEventListener("input", renderCards);

  renderCards();
  setMeta(content.meta.routes.docs);
};
