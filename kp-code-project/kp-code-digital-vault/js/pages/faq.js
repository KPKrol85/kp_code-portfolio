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

const findFaqMatches = (items, query) => {
  if (!query) {
    return [];
  }
  const normalized = query.toLowerCase();
  return items.filter((item) => {
    return (
      item.question.toLowerCase().includes(normalized) ||
      item.answer.toLowerCase().includes(normalized)
    );
  });
};

const getCategoryItems = (items, category) =>
  items.filter((item) => item.category === category);

export const renderFaq = () => {
  const content = getContent();
  const faq = content.faq;
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
  heroContent.appendChild(createElement("span", { className: "eyebrow", text: faq.hero.eyebrow }));
  heroContent.appendChild(
    createElement("h1", {
      text: faq.hero.title,
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: faq.hero.lead,
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const controlsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": faq.controls.ariaLabel },
  });
  controlsSection.appendChild(
    createSectionHeader(faq.controls.title, faq.controls.lead)
  );

  const tabs = createElement("div", {
    className: "tabs faq-tabs",
    attrs: { role: "tablist" },
  });

  const searchField = createElement("div", { className: "form-field faq-search" });
  const searchLabel = createElement("label", {
    text: faq.search.label,
    attrs: { for: "faq-search" },
  });
  const searchInput = createElement("input", {
    className: "input",
    attrs: {
      id: "faq-search",
      type: "search",
      placeholder: faq.search.placeholder,
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
    attrs: { "aria-label": faq.cta.ariaLabel },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(
    createElement("div", {}, [
      createElement("h2", { text: faq.cta.title }),
      createElement("p", { text: faq.cta.lead }),
    ])
  );
  const ctaActions = createElement("div", { className: "hero-actions" });
  ctaActions.appendChild(
    createElement("a", {
      className: "button",
      text: faq.cta.primaryLabel,
      attrs: { href: "#/contact" },
    })
  );
  ctaActions.appendChild(
    createElement("a", {
      className: "button secondary",
      text: faq.cta.secondaryLabel,
      attrs: { href: "#/updates" },
    })
  );
  ctaCard.appendChild(ctaActions);
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  main.appendChild(container);

  let activeCategory = faq.categories[0].id;

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
      items = findFaqMatches(faq.items, query);
    } else {
      items = getCategoryItems(faq.items, activeCategory);
    }

    if (!items.length) {
      resultsWrapper.appendChild(
        createElement("div", { className: "card faq-empty" }, [
          createElement("h3", { text: faq.empty.title }),
          createElement("p", { text: faq.empty.lead }),
        ])
      );
      return;
    }

    resultsWrapper.appendChild(createFaqList(items));
  };

  faq.categories.forEach((category) => {
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
  setMeta(content.meta.routes.faq);
};
