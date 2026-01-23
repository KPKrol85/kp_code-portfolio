import { createElement, clearElement } from "../utils/dom.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { parseHash, navigateHash } from "../utils/navigation.js";
import { setMeta, setJsonLd } from "../utils/meta.js";
import { showToast } from "../components/toast.js";
import { SERVICES, SERVICES_PAGE, getServiceBySlug } from "../data/services.catalog.js";

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

const createProcessSteps = (steps = []) => {
  const list = createElement("ol", { className: "process-steps" });
  steps.forEach((step, index) => {
    const item = createElement("li", { className: "process-step" });
    item.appendChild(createElement("span", { className: "service-meta", text: `Krok ${index + 1}` }));
    item.appendChild(createElement("h3", { text: step.title }));
    item.appendChild(createElement("p", { text: step.description }));
    list.appendChild(item);
  });
  return list;
};

const createGalleryGrid = (service) => {
  const grid = createElement("div", { className: "grid grid-3 gallery-grid" });
  const actions = service.galleryActions || [
    { label: "Demo", disabled: true },
    { label: "Szczegoly", disabled: true },
  ];
  service.galleryPlaceholders.forEach((item) => {
    const card = createElement("div", { className: "card" });
    card.appendChild(
      createElement("div", {
        className: "gallery-placeholder",
        text: "Screenshot wkrotce",
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
      if (action.disabled) {
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
          attrs: { href: action.href || "#/contact" },
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

const createQuoteSection = ({ title, lead, defaultServiceSlug } = {}) => {
  const section = createElement("section", {
    className: "section",
    attrs: { "aria-label": title || "Szybka wycena" },
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
  serviceSelect.appendChild(createElement("option", { text: "Wybierz usluge", attrs: { value: "" } }));
  SERVICES.forEach((service) => {
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
      placeholder: "np. 6000",
      required: "",
    },
  });

  const timelineInput = createElement("input", {
    className: "input",
    attrs: {
      name: "timeline",
      type: "text",
      placeholder: "np. 4 tygodnie / 15.06",
      required: "",
    },
  });

  const emailInput = createElement("input", {
    className: "input",
    attrs: {
      name: "email",
      type: "email",
      placeholder: "twoj@email.com",
      autocomplete: "email",
      required: "",
    },
  });

  const serviceField = createField({
    label: "Typ uslugi",
    id: `${fieldPrefix}-service`,
    input: serviceSelect,
    errorMessage: "Wybierz usluge z listy.",
  });
  const budgetField = createField({
    label: "Budzet (PLN)",
    id: `${fieldPrefix}-budget`,
    input: budgetInput,
    errorMessage: "Podaj szacowany budzet.",
  });
  const timelineField = createField({
    label: "Termin",
    id: `${fieldPrefix}-timeline`,
    input: timelineInput,
    errorMessage: "Podaj preferowany termin realizacji.",
  });
  const emailField = createField({
    label: "E-mail",
    id: `${fieldPrefix}-email`,
    input: emailInput,
    errorMessage: "Podaj poprawny adres e-mail.",
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
      showToast("Uzupelnij wymagane pola.", "error");
      status.textContent = "Sprawdz wymagane pola i sprobuj ponownie.";
      return;
    }

    const selectedService = getServiceBySlug(serviceSelect.value);
    const message = `Dziekujemy! Otrzymasz odpowiedz w ciagu 24-48h. (Demo)`;
    showToast("Dziekujemy! Odpowiemy w ciagu 24-48h.");
    clearElement(status);
    status.appendChild(createElement("span", { text: message }));
    status.appendChild(
      createElement("a", {
        className: "button ghost",
        text: "Przejdz do kontaktu",
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

const createHero = ({ title, lead, breadcrumbs, panel }) => {
  const hero = createElement("section", { className: "hero services-hero" });
  const content = createElement("div", { className: "hero-content" });
  if (breadcrumbs) {
    content.appendChild(breadcrumbs);
  }
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

const buildItemListSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Uslugi KP_Code",
  itemListElement: SERVICES.map((service, index) => ({
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
    title: SERVICES_PAGE.hero.title,
    lead: SERVICES_PAGE.hero.lead,
    breadcrumbs,
  });
  container.appendChild(hero);

  const cardsSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Wszystkie uslugi" },
  });
  cardsSection.appendChild(createSectionHeader("Wszystkie uslugi", "Wybierz obszar, w ktorym potrzebujesz wsparcia."));
  const cardsGrid = createElement("div", { className: "grid grid-2" });
  SERVICES.forEach((service) => {
    const card = createElement("div", { className: "card service-card" });
    card.appendChild(createElement("h3", { text: service.name }));
    card.appendChild(createElement("p", { text: service.shortDescription }));
    card.appendChild(createList(service.summaryBullets, "service-list"));
    card.appendChild(
      createElement("a", {
        className: "button secondary",
        text: "Zobacz szczegoly",
        attrs: { href: `#/services/${service.slug}` },
      })
    );
    cardsGrid.appendChild(card);
  });
  cardsSection.appendChild(cardsGrid);
  container.appendChild(cardsSection);

  const collaborationSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Jak wyglada wspolpraca" },
  });
  collaborationSection.appendChild(
    createSectionHeader("Jak wyglada wspolpraca?", "Wszystkie projekty realizujemy w przewidywalnych etapach.")
  );
  collaborationSection.appendChild(createProcessSteps(SERVICES_PAGE.collaborationSteps));
  container.appendChild(collaborationSection);

  const pricingSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Pakiety i ceny" },
  });
  pricingSection.appendChild(createSectionHeader("Pakiety i ceny", "Przykladowe pakiety, ktore dopasujemy do Twoich potrzeb."));
  pricingSection.appendChild(createPricingGrid(SERVICES_PAGE.pricing));
  container.appendChild(pricingSection);

  const quoteSection = createQuoteSection({
    title: SERVICES_PAGE.quote.title,
    lead: SERVICES_PAGE.quote.lead,
  });
  container.appendChild(quoteSection.element);
  cleanupHandlers.push(quoteSection.cleanup);

  const faqSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "FAQ" },
  });
  faqSection.appendChild(createSectionHeader("FAQ", "Odpowiadamy na najczestsze pytania o wspolprace."));
  faqSection.appendChild(createFaqList(SERVICES_PAGE.faq));
  container.appendChild(faqSection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Kontakt" },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(createElement("div", {}, [
    createElement("h2", { text: SERVICES_PAGE.cta.title }),
    createElement("p", { text: SERVICES_PAGE.cta.description }),
  ]));
  ctaCard.appendChild(
    createElement("a", {
      className: "button",
      text: SERVICES_PAGE.cta.primaryLabel,
      attrs: { href: SERVICES_PAGE.cta.primaryHref },
    })
  );
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  setMeta(SERVICES_PAGE.seo);
  setJsonLd(JSON_LD_ID, buildItemListSchema());

  main.appendChild(container);

  return () => {
    cleanupHandlers.forEach((handler) => handler());
    setJsonLd(JSON_LD_ID, null);
  };
};

export const renderServiceDetail = ({ slug } = {}) => {
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
    text: "Szybka wycena",
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
  panel.appendChild(createElement("h3", { text: "Co dostajesz" }));
  panel.appendChild(createList(service.deliverables, "service-list"));
  panel.appendChild(createElement("div", { className: "hero-actions" }, [
    scrollToQuoteButton,
    createElement("a", {
      className: "button secondary",
      text: "Kontakt",
      attrs: { href: "#/contact" },
    }),
  ]));

  const hero = createHero({
    title: service.name,
    lead: service.heroLead,
    breadcrumbs,
    panel,
  });
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
  processSection.appendChild(createProcessSteps(service.process));
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
  gallerySection.appendChild(createGalleryGrid(service));
  container.appendChild(gallerySection);

  const quoteSection = createQuoteSection({
    title: service.sections.quote.title,
    lead: service.sections.quote.lead,
    defaultServiceSlug: service.slug,
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
    attrs: { "aria-label": "CTA" },
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
