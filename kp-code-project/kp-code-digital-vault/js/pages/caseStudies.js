import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { getContent, t } from "../content/index.js";
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

const createGalleryGrid = (items = [], placeholderLabel) => {
  const grid = createElement("div", { className: "case-gallery-grid" });
  items.forEach((label) => {
    const card = createElement("div", { className: "card" });
    card.appendChild(
      createElement("div", {
        className: "gallery-placeholder",
        text: placeholderLabel,
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
  const content = getContent();
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
  return content.breadcrumbs?.sections?.services || "Services";
};

const buildCaseBreadcrumbs = (caseStudy) => {
  const content = getContent();
  return [
    { label: content.header.nav.home, href: "#/" },
    { label: content.breadcrumbs?.sections?.services || content.header.nav.services, href: "#/services" },
    {
      label: getServiceLabel(caseStudy.serviceSlug),
      href: `#/services/${caseStudy.serviceSlug}`,
    },
    { label: caseStudy.title },
  ];
};

export const renderCaseStudiesIndex = () => {
  const content = getContent();
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
    createElement("h1", { text: content.caseStudies.index.title }),
    createElement("p", {
      text: content.caseStudies.index.lead,
    }),
  ]);

  const card = createElement("div", { className: "card" }, [
    createElement("h2", { text: content.caseStudies.index.cardTitle }),
    createList(content.caseStudies.index.cardBullets),
  ]);

  container.appendChild(header);
  container.appendChild(card);
  main.appendChild(container);

  setJsonLd(JSON_LD_ID, null);
};

export const renderCaseStudyDetail = ({ slug } = {}) => {
  const content = getContent();
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
  metaCard.appendChild(createElement("h3", { text: content.caseStudies.detail.metaTitle }));
  const metaList = createElement("ul", { className: "case-meta-list" });
  metaList.appendChild(
    createElement("li", {
      text: `${content.caseStudies.detail.serviceLabel}: ${getServiceLabel(caseStudy.serviceSlug)}`,
    })
  );
  metaList.appendChild(
    createElement("li", { text: `${content.caseStudies.detail.categoryLabel}: ${caseStudy.category}` })
  );
  metaCard.appendChild(metaList);

  hero.appendChild(heroContent);
  hero.appendChild(metaCard);
  container.appendChild(hero);

  const goalSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.caseStudies.detail.sections.goal.title },
  });
  goalSection.appendChild(
    createSectionHeader(
      content.caseStudies.detail.sections.goal.title,
      content.caseStudies.detail.sections.goal.lead
    )
  );
  goalSection.appendChild(createElement("div", { className: "card" }, [
    createElement("p", { text: caseStudy.sections.goal }),
  ]));
  container.appendChild(goalSection);

  const scopeSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.caseStudies.detail.sections.scope.title },
  });
  scopeSection.appendChild(
    createSectionHeader(
      content.caseStudies.detail.sections.scope.title,
      content.caseStudies.detail.sections.scope.lead
    )
  );
  scopeSection.appendChild(createElement("div", { className: "card" }, [
    createList(caseStudy.sections.scope, "service-list"),
  ]));
  container.appendChild(scopeSection);

  const stackSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.caseStudies.detail.sections.stack.title },
  });
  stackSection.appendChild(
    createSectionHeader(
      content.caseStudies.detail.sections.stack.title,
      content.caseStudies.detail.sections.stack.lead
    )
  );
  const stackCard = createElement("div", { className: "card" });
  const stackTags = createTagList(caseStudy.sections.stack);
  if (stackTags) {
    stackCard.appendChild(stackTags);
  }
  stackSection.appendChild(stackCard);
  container.appendChild(stackSection);

  const processSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.caseStudies.detail.sections.process.title },
  });
  processSection.appendChild(
    createSectionHeader(
      content.caseStudies.detail.sections.process.title,
      content.caseStudies.detail.sections.process.lead
    )
  );
  const processList = createElement("ol", { className: "process-steps" });
  caseStudy.sections.process.forEach((step, index) => {
    const item = createElement("li", { className: "process-step" });
    item.appendChild(
      createElement("span", {
        className: "service-meta",
        text: content.caseStudies.detail.stepLabel.replace("{index}", index + 1),
      })
    );
    item.appendChild(createElement("p", { text: step }));
    processList.appendChild(item);
  });
  processSection.appendChild(processList);
  container.appendChild(processSection);

  if (caseStudy.sections.standards) {
    const standardsSection = createElement("section", {
      className: "section",
      attrs: { "aria-label": content.caseStudies.detail.sections.standards.title },
    });
    standardsSection.appendChild(
      createSectionHeader(
        content.caseStudies.detail.sections.standards.title,
        content.caseStudies.detail.sections.standards.lead
      )
    );
    standardsSection.appendChild(createElement("div", { className: "card" }, [
      createElement("p", { text: caseStudy.sections.standards }),
    ]));
    container.appendChild(standardsSection);
  }

  if (caseStudy.sections.security) {
    const securitySection = createElement("section", {
      className: "section",
      attrs: { "aria-label": content.caseStudies.detail.sections.security.title },
    });
    securitySection.appendChild(
      createSectionHeader(
        content.caseStudies.detail.sections.security.title,
        content.caseStudies.detail.sections.security.lead
      )
    );
    securitySection.appendChild(createElement("div", { className: "card" }, [
      createElement("p", { text: caseStudy.sections.security }),
    ]));
    container.appendChild(securitySection);
  }

  const outcomeSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.caseStudies.detail.sections.outcome.title },
  });
  outcomeSection.appendChild(
    createSectionHeader(
      content.caseStudies.detail.sections.outcome.title,
      content.caseStudies.detail.sections.outcome.lead
    )
  );
  outcomeSection.appendChild(createElement("div", { className: "card" }, [
    createElement("p", { text: caseStudy.sections.outcome }),
  ]));
  container.appendChild(outcomeSection);

  const gallerySection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.caseStudies.detail.sections.gallery.title },
  });
  gallerySection.appendChild(
    createSectionHeader(
      content.caseStudies.detail.sections.gallery.title,
      content.caseStudies.detail.sections.gallery.lead
    )
  );
  gallerySection.appendChild(createGalleryGrid(caseStudy.gallery, content.common.screenshotSoon));
  container.appendChild(gallerySection);

  const ctaSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": content.caseStudies.detail.sections.cta.title },
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
      text: caseStudy.cta.primaryLabel || content.caseStudies.detail.ctaPrimaryFallback,
      attrs: { href: caseStudy.cta.primaryHref || `#/services/${caseStudy.serviceSlug}#quote` },
    })
  );
  ctaActions.appendChild(
    createElement("a", {
      className: "button secondary",
      text: caseStudy.cta.secondaryLabel || content.caseStudies.detail.ctaSecondaryFallback,
      attrs: { href: caseStudy.cta.secondaryHref || "#/contact" },
    })
  );
  ctaCard.appendChild(ctaActions);
  ctaSection.appendChild(ctaCard);
  container.appendChild(ctaSection);

  setMeta({
    title: t("caseStudies.meta.detailTitle", { title: caseStudy.title }),
    description: caseStudy.excerpt,
  });
  setJsonLd(JSON_LD_ID, buildCaseStudySchema(caseStudy));

  main.appendChild(container);

  return () => {
    setJsonLd(JSON_LD_ID, null);
  };
};
