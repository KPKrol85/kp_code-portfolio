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
  const content = getContent();
  const support = content.support;
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
  heroContent.appendChild(createElement("span", { className: "eyebrow", text: support.hero.eyebrow }));
  heroContent.appendChild(
    createElement("h1", {
      text: support.hero.title,
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: support.hero.lead,
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const helpSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": support.help.ariaLabel },
  });
  helpSection.appendChild(
    createSectionHeader(
      support.help.title,
      support.help.lead
    )
  );
  helpSection.appendChild(
    createSupportCards([
      ...support.help.cards,
    ])
  );
  container.appendChild(helpSection);

  const issueSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": support.issue.ariaLabel },
  });
  issueSection.setAttribute("id", "issue-reporting");
  issueSection.appendChild(
    createSectionHeader(
      support.issue.title,
      support.issue.lead
    )
  );
  const issueSteps = createElement("ol", { className: "process-steps" });
  support.issue.steps.forEach((step, index) => {
    const item = createElement("li", { className: "process-step" });
    item.appendChild(
      createElement("span", {
        className: "service-meta",
        text: support.issue.stepLabel.replace("{index}", index + 1),
      })
    );
    item.appendChild(createElement("h3", { text: step.title }));
    item.appendChild(createElement("p", { text: step.description }));
    issueSteps.appendChild(item);
  });
  issueSection.appendChild(issueSteps);
  issueSection.appendChild(
    createElement("div", { className: "hero-actions" }, [
      createElement("a", {
        className: "button secondary",
        text: support.issue.ctaPrimaryLabel,
        attrs: { href: "#/faq" },
      }),
      createElement("a", {
        className: "button",
        text: support.issue.ctaSecondaryLabel,
        attrs: { href: "#/contact" },
      }),
    ])
  );
  container.appendChild(issueSection);

  const scopeSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": support.scope.ariaLabel },
  });
  scopeSection.appendChild(
    createSectionHeader(support.scope.title, support.scope.lead)
  );
  const scopeGrid = createElement("div", { className: "grid grid-2" });
  const includedCard = createElement("div", { className: "card support-scope" });
  includedCard.appendChild(createElement("h3", { text: support.scope.includedTitle }));
  includedCard.appendChild(
    createList(
      support.scope.included,
      "service-list"
    )
  );
  const excludedCard = createElement("div", { className: "card support-scope" });
  excludedCard.appendChild(createElement("h3", { text: support.scope.excludedTitle }));
  excludedCard.appendChild(
    createList(
      support.scope.excluded,
      "service-list"
    )
  );
  scopeGrid.appendChild(includedCard);
  scopeGrid.appendChild(excludedCard);
  scopeSection.appendChild(scopeGrid);
  container.appendChild(scopeSection);

  const responseSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": support.response.ariaLabel },
  });
  responseSection.appendChild(
    createSectionHeader(
      support.response.title,
      support.response.lead
    )
  );
  const responseCard = createElement("div", { className: "card support-response" }, [
    createElement("p", { text: support.response.primary }),
    createElement("p", { className: "service-meta", text: support.response.secondary }),
  ]);
  responseSection.appendChild(responseCard);
  container.appendChild(responseSection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": support.cta.ariaLabel },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(
    createElement("div", {}, [
      createElement("h2", { text: support.cta.title }),
      createElement("p", { text: support.cta.lead }),
    ])
  );
  ctaCard.appendChild(
    createElement("a", {
      className: "button",
      text: support.cta.primaryLabel,
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

  setMeta(content.meta.routes.support);

  return () => {
    scrollButtons.forEach((button) => button.removeEventListener("click", handleScroll));
  };
};
