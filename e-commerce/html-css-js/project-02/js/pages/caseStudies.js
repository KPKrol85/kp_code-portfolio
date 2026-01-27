import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { content } from "../content/pl.js";
import { getCaseStudyBySlug } from "../data/caseStudies.catalog.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { setMeta, setJsonLd } from "../utils/meta.js";
import { navigateHash, parseHash } from "../utils/navigation.js";

const JSON_LD_ID = "case-study-jsonld";

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
  items.forEach((item) => list.appendChild(createElement("li", { text: item })));
  return list;
};

const createGalleryGrid = (items = []) => {
  const grid = createElement("div", { className: "case-gallery-grid" });
  items.forEach((label) => {
    const card = createElement("div", { className: "card" });
    card.appendChild(
      createElement("div", {
        className: "gallery-placeholder",
        text: "Screenshot wkrotce",
      })
    );
    card.appendChild(createElement("p", { className: "service-meta", text: label }));
    grid.appendChild(card);
  });
  return grid;
};

const buildCaseStudySchema = (caseStudy) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: caseStudy.title,
  description: caseStudy.excerpt,
  about: caseStudy.category,
  keywords: caseStudy.tags,
  url: `${window.location.origin}/#/case-studies/${caseStudy.slug}`,
});

const getServiceLabel = (serviceSlug) => {
  const serviceLabels = content.breadcrumbs?.services ?? {};
  if (serviceSlug === "wordpress") {
    return serviceLabels.wordpress || "WordPress Solutions";
  }
  if (serviceSlug === "web-development") {
    return serviceLabels.webDevelopment || "Web Development";
  }
  if (serviceSlug === "ui-ux-branding") {
    return serviceLabels.uiUxBranding || "UI / UX & Branding";
  }
  if (serviceSlug === "consulting-support") {
    return serviceLabels.consultingSupport || "Consulting & Support";
  }
  return "Uslugi";
};

const buildCaseBreadcrumbs = (caseStudy) => {
  return [
    { label: "Start", href: "#/" },
    { label: "Uslugi", href: "#/services" },
    {
      label: getServiceLabel(caseStudy.serviceSlug),
      href: `#/services/${caseStudy.serviceSlug}`,
    },
    { label: caseStudy.title },
  ];
};

export const renderCaseStudiesIndex = () => {
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const { pathname } = parseHash();
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));
  const header = createElement("div", { className: "section" }, [
    breadcrumbs,
    createElement("h1", { text: "Case studies" }),
    createElement("p", {
      text: "Sekcja case studies jest w przygotowaniu. Wkrotce dodamy liste realizacji.",
    }),
  ]);

  const card = createElement("div", { className: "card" }, [
    createElement("h2", { text: "Co sie pojawi" }),
    createList([
      "Lista realizacji powiazanych z uslugami",
      "Filtry po typie uslugi",
      "Szczegolowe opisy procesow",
    ]),
  ]);

  container.appendChild(header);
  container.appendChild(card);
  main.appendChild(container);

  setJsonLd(JSON_LD_ID, null);
};

export const renderCaseStudyDetail = ({ slug } = {}) => {
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) {
    navigateHash("#/404", { force: true });
    return;
  }

  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildCaseBreadcrumbs(caseStudy));

  const hero = createElement("section", { className: "hero case-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(breadcrumbs);
  heroContent.appendChild(
    createElement("h1", {
      text: caseStudy.title,
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(createElement("p", { className: "hero-lead", text: caseStudy.excerpt }));
  const tags = createTagList(caseStudy.tags);
  if (tags) {
    heroContent.appendChild(tags);
  }

  const metaCard = createElement("div", { className: "card case-meta" });
  metaCard.appendChild(createElement("h3", { text: "Kontekst projektu" }));
  const metaList = createElement("ul", { className: "case-meta-list" });
  metaList.appendChild(
    createElement("li", { text: `Usluga: ${getServiceLabel(caseStudy.serviceSlug)}` })
  );
  metaList.appendChild(createElement("li", { text: `Kategoria: ${caseStudy.category}` }));
  metaCard.appendChild(metaList);

  hero.appendChild(heroContent);
  hero.appendChild(metaCard);
  container.appendChild(hero);

  const goalSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Cel" },
  });
  goalSection.appendChild(createSectionHeader("Cel", "Gorny poziom celu klienta."));
  goalSection.appendChild(createElement("div", { className: "card" }, [
    createElement("p", { text: caseStudy.sections.goal }),
  ]));
  container.appendChild(goalSection);

  const scopeSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Zakres prac" },
  });
  scopeSection.appendChild(createSectionHeader("Zakres prac", "Zakres dostarczonych elementow."));
  scopeSection.appendChild(createElement("div", { className: "card" }, [
    createList(caseStudy.sections.scope, "service-list"),
  ]));
  container.appendChild(scopeSection);

  const stackSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Stack" },
  });
  stackSection.appendChild(createSectionHeader("Stack", "Uzyte narzedzia i komponenty."));
  const stackCard = createElement("div", { className: "card" });
  const stackTags = createTagList(caseStudy.sections.stack);
  if (stackTags) {
    stackCard.appendChild(stackTags);
  }
  stackSection.appendChild(stackCard);
  container.appendChild(stackSection);

  const processSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Proces" },
  });
  processSection.appendChild(createSectionHeader("Proces", "Etapy wspolpracy krok po kroku."));
  const processList = createElement("ol", { className: "process-steps" });
  caseStudy.sections.process.forEach((step, index) => {
    const item = createElement("li", { className: "process-step" });
    item.appendChild(createElement("span", { className: "service-meta", text: `Krok ${index + 1}` }));
    item.appendChild(createElement("p", { text: step }));
    processList.appendChild(item);
  });
  processSection.appendChild(processList);
  container.appendChild(processSection);

  if (caseStudy.sections.standards) {
    const standardsSection = createElement("section", {
      className: "section",
      attrs: { "aria-label": "Standardy" },
    });
    standardsSection.appendChild(createSectionHeader("Standardy", "Zakres jakosci i standardow."));
    standardsSection.appendChild(createElement("div", { className: "card" }, [
      createElement("p", { text: caseStudy.sections.standards }),
    ]));
    container.appendChild(standardsSection);
  }

  if (caseStudy.sections.security) {
    const securitySection = createElement("section", {
      className: "section",
      attrs: { "aria-label": "Bezpieczenstwo" },
    });
    securitySection.appendChild(createSectionHeader("Bezpieczenstwo", "Podstawowe podejscie do ochrony projektu."));
    securitySection.appendChild(createElement("div", { className: "card" }, [
      createElement("p", { text: caseStudy.sections.security }),
    ]));
    container.appendChild(securitySection);
  }

  const outcomeSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Rezultat" },
  });
  outcomeSection.appendChild(createSectionHeader("Rezultat", "Efekt wdrozenia."));
  outcomeSection.appendChild(createElement("div", { className: "card" }, [
    createElement("p", { text: caseStudy.sections.outcome }),
  ]));
  container.appendChild(outcomeSection);

  const gallerySection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Galeria" },
  });
  gallerySection.appendChild(createSectionHeader("Galeria", "Podglady sekcji i widokow."));
  gallerySection.appendChild(createGalleryGrid(caseStudy.gallery));
  container.appendChild(gallerySection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "CTA" },
  });
  const ctaCard = createElement("div", { className: "card services-cta" });
  ctaCard.appendChild(createElement("div", {}, [
    createElement("h2", { text: caseStudy.cta.title }),
    createElement("p", { text: caseStudy.cta.description }),
  ]));
  const ctaActions = createElement("div", { className: "hero-actions" });
  ctaActions.appendChild(
    createElement("a", {
      className: "button",
      text: caseStudy.cta.primaryLabel || "Popros o wycene",
      attrs: { href: caseStudy.cta.primaryHref || `#/services/${caseStudy.serviceSlug}#quote` },
    })
  );
  ctaActions.appendChild(
    createElement("a", {
      className: "button secondary",
      text: caseStudy.cta.secondaryLabel || "Kontakt",
      attrs: { href: caseStudy.cta.secondaryHref || "#/contact" },
    })
  );
  ctaCard.appendChild(ctaActions);
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  setMeta({
    title: `${caseStudy.title} — Case study | KP_Code Digital Vault`,
    description: caseStudy.excerpt,
  });
  setJsonLd(JSON_LD_ID, buildCaseStudySchema(caseStudy));

  main.appendChild(container);

  return () => {
    setJsonLd(JSON_LD_ID, null);
  };
};
