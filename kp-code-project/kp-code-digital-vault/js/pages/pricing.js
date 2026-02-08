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

const buildExplanationList = (items = []) => {
  const list = createElement("ul", { className: "pricing-explanation" });
  items.forEach((item) => {
    const entry = createElement("li");
    entry.appendChild(createElement("strong", { text: item.title }));
    if (item.description) {
      entry.appendChild(createElement("p", { className: "service-meta", text: item.description }));
    }
    if (item.linkLabel && item.linkHref) {
      entry.appendChild(
        createElement("a", {
          className: "pricing-explanation__link",
          text: item.linkLabel,
          attrs: { href: item.linkHref },
        })
      );
    }
    list.appendChild(entry);
  });
  return list;
};

const buildPricingGrid = (items = []) => {
  const grid = createElement("div", { className: "grid grid-3 pricing-grid" });
  items.forEach((tier) => {
    const card = createElement("div", { className: "card pricing-card" });
    card.appendChild(createElement("h3", { text: tier.name }));
    card.appendChild(createElement("div", { className: "price", text: tier.price }));
    if (tier.description) {
      card.appendChild(createElement("p", { className: "service-meta", text: tier.description }));
    }
    if (tier.features?.length) {
      card.appendChild(createList(tier.features));
    }
    if (tier.ctaLabel && tier.ctaHref) {
      card.appendChild(
        createElement("a", {
          className: "button secondary",
          text: tier.ctaLabel,
          attrs: { href: tier.ctaHref },
        })
      );
    }
    grid.appendChild(card);
  });
  return grid;
};

export const renderPricing = () => {
  const content = getContent();
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);

  const page = content.pricing;
  const container = createElement("section", { className: "container" });
  const { pathname } = parseHash();
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));

  const hero = createElement("section", { className: "hero pricing-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(createElement("span", { className: "eyebrow", text: page.hero.eyebrow }));
  heroContent.appendChild(
    createElement("h1", { text: page.hero.title, attrs: { tabindex: "-1", "data-focus-heading": "true" } })
  );
  heroContent.appendChild(createElement("p", { className: "hero-lead", text: page.hero.lead }));
  if (page.hero.ctas?.length) {
    const actions = createElement("div", { className: "hero-actions" });
    page.hero.ctas.forEach((cta) => {
      actions.appendChild(
        createElement("a", {
          className: `button${cta.variant === "secondary" ? " secondary" : ""}`,
          text: cta.label,
          attrs: { href: cta.href },
        })
      );
    });
    heroContent.appendChild(actions);
  }
  hero.appendChild(heroContent);

  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(hero);

  const explanationSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": page.explanation.title },
  });
  explanationSection.appendChild(createSectionHeader(page.explanation.title, page.explanation.lead));
  const explanationCard = createElement("div", { className: "card pricing-callout" });
  explanationCard.appendChild(buildExplanationList(page.explanation.items));
  explanationSection.appendChild(explanationCard);
  container.appendChild(explanationSection);

  const productsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": page.products.title },
  });
  productsSection.appendChild(createSectionHeader(page.products.title, page.products.lead));
  productsSection.appendChild(buildPricingGrid(page.products.items));
  container.appendChild(productsSection);

  const servicesSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": page.services.title },
  });
  servicesSection.appendChild(createSectionHeader(page.services.title, page.services.lead));
  servicesSection.appendChild(buildPricingGrid(page.services.items));
  container.appendChild(servicesSection);

  const faqSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": page.faq.title },
  });
  faqSection.appendChild(createSectionHeader(page.faq.title, page.faq.lead));
  faqSection.appendChild(createFaqList(page.faq.items));
  container.appendChild(faqSection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": page.cta.title },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(createElement("div", {}, [
    createElement("h2", { text: page.cta.title }),
    createElement("p", { text: page.cta.description }),
  ]));
  const ctaActions = createElement("div", { className: "hero-actions" });
  ctaActions.appendChild(
    createElement("a", {
      className: "button",
      text: page.cta.primaryLabel,
      attrs: { href: page.cta.primaryHref },
    })
  );
  if (page.cta.secondaryLabel && page.cta.secondaryHref) {
    ctaActions.appendChild(
      createElement("a", {
        className: "button secondary",
        text: page.cta.secondaryLabel,
        attrs: { href: page.cta.secondaryHref },
      })
    );
  }
  ctaCard.appendChild(ctaActions);
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  setMeta(page.seo);
  main.appendChild(container);
};
