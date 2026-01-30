
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { showToast } from "../components/toast.js";
import { getContent } from "../content/index.js";
import { getServices, getServicesPage, getServiceBySlug } from "../data/services.catalog.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { setMeta, setJsonLd } from "../utils/meta.js";
import { parseHash, navigateHash } from "../utils/navigation.js";

const JSON_LD_ID = "services-jsonld";
const PROVIDER_NAME = "KP_Code";
const AREA_SERVED = ["Poland", "Remote"];

const createSectionHeader = (title, lead) => {
  const header = createElement("div", { className: "section-header" });
  header.appendChild(createElement("h2", { text: title }));
  if (lead) {
    header.appendChild(createElement("p", { className: "section-lead", text: lead }));
  }
  return header;
};

const createTagList = (tags = []) => {
  if (!tags.length) {
    return null;
  }
  return createElement(
    "div",
    { className: "tag-list" },
    tags.map((tag) => createElement("span", { className: "badge", text: tag }))
  );
};

const createList = (items = [], className) => {
  const list = createElement("ul", className ? { className } : {});
  items.forEach((item) => {
    list.appendChild(createElement("li", { text: item }));
  });
  return list;
};

const createPricingGrid = (pricing = []) => {
  const grid = createElement("div", { className: "grid grid-3 pricing-grid" });
  pricing.forEach((tier) => {
    const card = createElement("div", { className: "card pricing-card" });
    card.appendChild(createElement("h3", { text: tier.name }));
    card.appendChild(createElement("div", { className: "price", text: tier.price }));
    if (tier.timeline) {
      card.appendChild(createElement("p", { className: "service-meta", text: tier.timeline }));
    }
    if (tier.description) {
      card.appendChild(createElement("p", { text: tier.description }));
    }
    if (tier.features?.length) {
      card.appendChild(createList(tier.features));
    }
    grid.appendChild(card);
  });
  return grid;
};

const createProcessSteps = (steps = [], stepLabel) => {
  const list = createElement("ol", { className: "process-steps" });
  steps.forEach((step, index) => {
    const item = createElement("li", { className: "process-step" });
    item.appendChild(
      createElement("span", { className: "service-meta", text: stepLabel(index + 1) })
    );
    item.appendChild(createElement("h3", { text: step.title }));
    item.appendChild(createElement("p", { text: step.description }));
    list.appendChild(item);
  });
  return list;
};

const createGalleryGrid = (service, content) => {
  const grid = createElement("div", { className: "grid grid-3 gallery-grid" });
  const actions = service.galleryActions || content.servicesUi.galleryActions;
  service.galleryPlaceholders.forEach((item) => {
    const card = createElement("div", { className: "card card--interactive" });
    card.appendChild(
      createElement("div", {
        className: "gallery-placeholder",
        text: content.common.screenshotSoon,
      })
    );
    const tags = createTagList(item.tags);
    if (tags) {
      card.appendChild(tags);
    }
    card.appendChild(createElement("h3", { text: item.title }));
    card.appendChild(createElement("p", { text: item.description }));
    const actionsRow = createElement("div", { className: "hero-actions" });
    actions.forEach((action) => {
      let isDisabled = Boolean(action.disabled);
      let href = action.href;
      if (action.type === "case-study") {
        if (item.caseStudySlug) {
          href = `#/case-studies/${item.caseStudySlug}`;
          isDisabled = false;
        } else {
          isDisabled = true;
        }
      }
      if (isDisabled) {
        actionsRow.appendChild(
          createElement("button", {
            className: "button secondary",
            text: action.label,
            attrs: { type: "button", disabled: "" },
          })
        );
        return;
      }
      actionsRow.appendChild(
        createElement("a", {
          className: "button secondary",
          text: action.label,
          attrs: { href: href || "#/contact" },
        })
      );
    });
    card.appendChild(actionsRow);
    grid.appendChild(card);
  });
  return grid;
};

const createFaqList = (items = []) => {
  const list = createElement("div", { className: "faq-list" });
  items.forEach((faq) => {
    const details = createElement("details", { className: "faq-item" });
    const summary = createElement("summary", { text: faq.question });
    const answer = createElement("p", { text: faq.answer });
    details.appendChild(summary);
    details.appendChild(answer);
    list.appendChild(details);
  });
  return list;
};

const createQuoteSection = ({ title, lead, defaultServiceSlug, content } = {}) => {
  const section = createElement("section", {
    className: "section",
    attrs: { "aria-label": title || content.servicesUi.quote.ariaLabel },
  });
  section.appendChild(createSectionHeader(title, lead));

  const form = createElement("form", { className: "card quote-form", attrs: { novalidate: "true" } });
  const fieldPrefix = defaultServiceSlug ? `quote-${defaultServiceSlug}` : "quote";

  const formGrid = createElement("div", { className: "form-grid" });
  const status = createElement("div", {
    className: "quote-form-status",
    attrs: { "aria-live": "polite" },
  });

  const createField = ({ label, id, input, errorMessage }) => {
    const field = createElement("div", { className: "form-field" });
    const errorId = `${id}-error`;
    const labelEl = createElement("label", { text: label, attrs: { for: id } });
    const errorEl = createElement("div", { className: "form-error", attrs: { id: errorId } });
    input.setAttribute("id", id);
    input.setAttribute("aria-describedby", errorId);
    field.appendChild(labelEl);
    field.appendChild(input);
    field.appendChild(errorEl);
    return { field, errorEl, errorMessage, input };
  };

  const serviceSelect = createElement("select", {
    className: "select",
    attrs: { name: "service", required: "" },
  });
  serviceSelect.appendChild(
    createElement("option", { text: content.servicesUi.quote.servicePlaceholder, attrs: { value: "" } })
  );
  getServices().forEach((service) => {
    serviceSelect.appendChild(
      createElement("option", { text: service.name, attrs: { value: service.slug } })
    );
  });

  const budgetInput = createElement("input", {
    className: "input",
    attrs: {
      name: "budget",
      type: "number",
      min: "500",
      placeholder: content.servicesUi.quote.budgetPlaceholder,
      required: "",
    },
  });

  const timelineInput = createElement("input", {
    className: "input",
    attrs: {
      name: "timeline",
      type: "text",
      placeholder: content.servicesUi.quote.timelinePlaceholder,
      required: "",
    },
  });

  const emailInput = createElement("input", {
    className: "input",
    attrs: {
      name: "email",
      type: "email",
      placeholder: content.servicesUi.quote.emailPlaceholder,
      autocomplete: "email",
      required: "",
    },
  });

  const serviceField = createField({
    label: content.servicesUi.quote.serviceLabel,
    id: `${fieldPrefix}-service`,
    input: serviceSelect,
    errorMessage: content.servicesUi.quote.errors.serviceRequired,
  });
  const budgetField = createField({
    label: content.servicesUi.quote.budgetLabel,
    id: `${fieldPrefix}-budget`,
    input: budgetInput,
    errorMessage: content.servicesUi.quote.errors.budgetRequired,
  });
  const timelineField = createField({
    label: content.servicesUi.quote.timelineLabel,
    id: `${fieldPrefix}-timeline`,
    input: timelineInput,
    errorMessage: content.servicesUi.quote.errors.timelineRequired,
  });
  const emailField = createField({
    label: content.servicesUi.quote.emailLabel,
    id: `${fieldPrefix}-email`,
    input: emailInput,
    errorMessage: content.servicesUi.quote.errors.emailInvalid,
  });

  formGrid.appendChild(serviceField.field);
  formGrid.appendChild(budgetField.field);
  formGrid.appendChild(timelineField.field);
  formGrid.appendChild(emailField.field);

  form.appendChild(formGrid);
  form.appendChild(
    createElement("button", {
      className: "button",
      text: SERVICES_PAGE.quote.submitLabel,
      attrs: { type: "submit" },
    })
  );
  form.appendChild(status);

  if (defaultServiceSlug) {
    serviceSelect.value = defaultServiceSlug;
  }

  const clearErrors = () => {
    [serviceField, budgetField, timelineField, emailField].forEach((field) => {
      field.errorEl.textContent = "";
      field.input.removeAttribute("aria-invalid");
    });
  };

  const validate = () => {
    let isValid = true;
    const fieldsToCheck = [serviceField, budgetField, timelineField, emailField];
    fieldsToCheck.forEach((field) => {
      const value = String(field.input.value || "").trim();
      let fieldValid = Boolean(value);
      if (field.input.type === "email") {
        fieldValid = field.input.validity.valid;
      }
      if (field.input.type === "number") {
        fieldValid = Number(value) > 0;
      }
      if (!fieldValid) {
        field.errorEl.textContent = field.errorMessage;
        field.input.setAttribute("aria-invalid", "true");
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearErrors();
    if (!validate()) {
      showToast(content.servicesUi.quote.errors.required, "error");
      status.textContent = content.servicesUi.quote.errors.status;
      return;
    }

    const selectedService = getServiceBySlug(serviceSelect.value);
    const message = content.servicesUi.quote.success.message;
    showToast(content.servicesUi.quote.success.toast);
    clearElement(status);
    status.appendChild(createElement("span", { text: message }));
    status.appendChild(
      createElement("a", {
        className: "button ghost",
        text: content.servicesUi.quote.success.ctaLabel,
        attrs: { href: "#/contact" },
      })
    );

    form.reset();
    serviceSelect.value = selectedService ? selectedService.slug : defaultServiceSlug || "";
  };

  form.addEventListener("submit", handleSubmit);
  section.appendChild(form);

  return {
    element: section,
    cleanup: () => form.removeEventListener("submit", handleSubmit),
  };
};

const createHero = ({ title, lead, panel }) => {
  const hero = createElement("section", { className: "hero services-hero" });
  const content = createElement("div", { className: "hero-content" });
  const heading = createElement("h1", {
    text: title,
    attrs: { tabindex: "-1", "data-focus-heading": "true" },
  });
  content.appendChild(heading);
  if (lead) {
    content.appendChild(createElement("p", { className: "hero-lead", text: lead }));
  }
  hero.appendChild(content);
  if (panel) {
    hero.appendChild(panel);
  }
  return hero;
};

const buildItemListSchema = (content) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: content.servicesUi.schema.itemListName,
  itemListElement: getServices().map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: service.name,
    url: `${window.location.origin}/#/services/${service.slug}`,
  })),
});

const buildServiceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.shortDescription,
  provider: {
    "@type": "Organization",
    name: PROVIDER_NAME,
  },
  areaServed: AREA_SERVED,
  serviceType: service.name,
  offers: {
    "@type": "OfferCatalog",
    name: "Pakiety i ceny",
    itemListElement: service.pricing.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.price,
      priceCurrency: "PLN",
      description: tier.features?.join(", ") || "",
      availability: "https://schema.org/InStock",
    })),
  },
});

export const renderServicesIndex = () => {
  const content = getContent();
  const servicesPage = getServicesPage();
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);
  const cleanupHandlers = [];
  const container = createElement("section", { className: "container" });
  const { pathname } = parseHash();
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));

  const hero = createHero({
    title: servicesPage.hero.title,
    lead: servicesPage.hero.lead,
  });
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(hero);

  const cardsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.servicesUi.index.sections.cards.title },
  });
  cardsSection.appendChild(
    createSectionHeader(
      content.servicesUi.index.sections.cards.title,
      content.servicesUi.index.sections.cards.lead
    )
  );
  const cardsGrid = createElement("div", { className: "grid grid-2" });
  getServices().forEach((service) => {
    const card = createElement("div", { className: "card service-card card--interactive" });
    const header = createElement("div", { className: "service-card__header" });

    header.appendChild(createElement("h3", { className: "service-card__title",  text: service.name }));

    header.appendChild(createElement("p", { text: service.shortDescription }));
    card.appendChild(header);
    card.appendChild(createList(service.summaryBullets, "service-list"));
    card.appendChild(
      createElement("a", {
        className: "button secondary",
        text: content.servicesUi.index.sections.cards.ctaLabel,
        attrs: { href: `#/services/${service.slug}` },
      })
    );
    cardsGrid.appendChild(card);
  });
  cardsSection.appendChild(cardsGrid);
  container.appendChild(cardsSection);

  const collaborationSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.servicesUi.index.sections.collaboration.title },
  });
  collaborationSection.appendChild(
    createSectionHeader(
      content.servicesUi.index.sections.collaboration.title,
      content.servicesUi.index.sections.collaboration.lead
    )
  );
  collaborationSection.appendChild(
    createProcessSteps(
      servicesPage.collaborationSteps,
      (index) => content.servicesUi.stepLabel.replace("{index}", index)
    )
  );
  container.appendChild(collaborationSection);

  const pricingSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.servicesUi.index.sections.pricing.title },
  });
  pricingSection.appendChild(
    createSectionHeader(
      content.servicesUi.index.sections.pricing.title,
      content.servicesUi.index.sections.pricing.lead
    )
  );
  pricingSection.appendChild(createPricingGrid(servicesPage.pricing));
  container.appendChild(pricingSection);

  const quoteSection = createQuoteSection({
    title: servicesPage.quote.title,
    lead: servicesPage.quote.lead,
    content,
  });
  container.appendChild(quoteSection.element);
  cleanupHandlers.push(quoteSection.cleanup);

  const faqSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.servicesUi.index.sections.faq.title },
  });
  faqSection.appendChild(
    createSectionHeader(
      content.servicesUi.index.sections.faq.title,
      content.servicesUi.index.sections.faq.lead
    )
  );
  faqSection.appendChild(createFaqList(servicesPage.faq));
  container.appendChild(faqSection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.servicesUi.index.sections.cta.title },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(createElement("div", {}, [
    createElement("h2", { text: servicesPage.cta.title }),
    createElement("p", { text: servicesPage.cta.description }),
  ]));
  ctaCard.appendChild(
    createElement("a", {
      className: "button",
      text: servicesPage.cta.primaryLabel,
      attrs: { href: servicesPage.cta.primaryHref },
    })
  );
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  setMeta(servicesPage.seo);
  setJsonLd(JSON_LD_ID, buildItemListSchema(content));

  main.appendChild(container);

  return () => {
    cleanupHandlers.forEach((handler) => handler());
    setJsonLd(JSON_LD_ID, null);
  };
};

export const renderServiceDetail = ({ slug } = {}) => {
  const content = getContent();
  const service = getServiceBySlug(slug);
  if (!service) {
    navigateHash("#/services", { force: true });
    return;
  }

  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);
  const cleanupHandlers = [];
  const container = createElement("section", { className: "container" });
  const { pathname } = parseHash();
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));

  const scrollToQuoteButton = createElement("button", {
    className: "button",
    text: content.servicesUi.quote.scrollToQuoteLabel,
    attrs: { type: "button" },
  });
  const handleScrollToQuote = () => {
    const target = document.getElementById("quote");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  scrollToQuoteButton.addEventListener("click", handleScrollToQuote);
  cleanupHandlers.push(() => scrollToQuoteButton.removeEventListener("click", handleScrollToQuote));

  const panel = createElement("div", { className: "services-hero-panel" });
  panel.appendChild(createElement("h3", { text: content.servicesUi.detail.panelTitle }));
  panel.appendChild(createList(service.deliverables, "service-list"));
  panel.appendChild(createElement("div", { className: "hero-actions" }, [
    scrollToQuoteButton,
    createElement("a", {
      className: "button secondary",
      text: content.servicesUi.detail.contactLabel,
      attrs: { href: "#/contact" },
    }),
  ]));

  const hero = createHero({
    title: service.name,
    lead: service.heroLead,
    panel,
  });
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(hero);

  const forWhoSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": service.sections.forWho.title },
  });
  forWhoSection.appendChild(createSectionHeader(service.sections.forWho.title, service.sections.forWho.lead));
  forWhoSection.appendChild(
    createElement("div", { className: "card" }, [createList(service.forWho, "service-list")])
  );
  container.appendChild(forWhoSection);

  const scopeSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": service.sections.scope.title },
  });
  scopeSection.appendChild(createSectionHeader(service.sections.scope.title, service.sections.scope.lead));
  const scopeGrid = createElement("div", { className: "grid grid-2" });
  service.scope.forEach((item) => {
    const card = createElement("div", { className: "card" });
    card.appendChild(createElement("h3", { text: item.title }));
    card.appendChild(createElement("p", { text: item.description }));
    scopeGrid.appendChild(card);
  });
  scopeSection.appendChild(scopeGrid);
  container.appendChild(scopeSection);

  const processSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": service.sections.process.title },
  });
  processSection.appendChild(createSectionHeader(service.sections.process.title, service.sections.process.lead));
  processSection.appendChild(
    createProcessSteps(
      service.process,
      (index) => content.servicesUi.stepLabel.replace("{index}", index)
    )
  );
  container.appendChild(processSection);

  const pricingSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": service.sections.pricing.title },
  });
  pricingSection.appendChild(createSectionHeader(service.sections.pricing.title, service.sections.pricing.lead));
  pricingSection.appendChild(createPricingGrid(service.pricing));
  container.appendChild(pricingSection);

  const gallerySection = createElement("section", {
    className: "section",
    attrs: { "aria-label": service.sections.gallery.title },
  });
  gallerySection.appendChild(createSectionHeader(service.sections.gallery.title, service.sections.gallery.lead));
  gallerySection.appendChild(createGalleryGrid(service, content));
  container.appendChild(gallerySection);

  const quoteSection = createQuoteSection({
    title: service.sections.quote.title,
    lead: service.sections.quote.lead,
    defaultServiceSlug: service.slug,
    content,
  });
  quoteSection.element.setAttribute("id", "quote");
  container.appendChild(quoteSection.element);
  cleanupHandlers.push(quoteSection.cleanup);

  const faqSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": service.sections.faq.title },
  });
  faqSection.appendChild(createSectionHeader(service.sections.faq.title, service.sections.faq.lead));
  faqSection.appendChild(createFaqList(service.faq));
  container.appendChild(faqSection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.servicesUi.detail.ctaLabel },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(createElement("div", {}, [
    createElement("h2", { text: service.cta.title }),
    createElement("p", { text: service.cta.description }),
  ]));
  const ctaActions = createElement("div", { className: "hero-actions" });
  ctaActions.appendChild(
    createElement("a", {
      className: "button",
      text: service.cta.primaryLabel,
      attrs: { href: service.cta.primaryHref },
    })
  );
  if (service.cta.secondaryLabel) {
    ctaActions.appendChild(
      createElement("a", {
        className: "button secondary",
        text: service.cta.secondaryLabel,
        attrs: { href: service.cta.secondaryHref },
      })
    );
  }
  ctaCard.appendChild(ctaActions);
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  setMeta(service.seo);
  setJsonLd(JSON_LD_ID, buildServiceSchema(service));

  main.appendChild(container);

  return () => {
    cleanupHandlers.forEach((handler) => handler());
    setJsonLd(JSON_LD_ID, null);
  };
};
