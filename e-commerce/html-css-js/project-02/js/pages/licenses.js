import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { renderEmptyState } from "../components/ui-state-helpers.js";
import { renderNotice, createRetryButton } from "../components/uiStates.js";
import { content } from "../content/pl.js";
import { purchasesService } from "../services/purchases.js";
import { store } from "../store/store.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import { parseHash } from "../utils/navigation.js";

const SECTION_IDS = {
  your: "your-licenses",
  types: "license-types",
};

const getSectionFromQuery = () => {
  const { queryParams } = parseHash();
  const section = typeof queryParams.section === "string" ? queryParams.section : "";
  if (section === SECTION_IDS.your || section === SECTION_IDS.types) {
    return section;
  }
  return null;
};

const scrollToSection = (sectionId) => {
  if (!sectionId) {
    return;
  }
  const target = document.getElementById(sectionId);
  if (!target) {
    return;
  }
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  });
};

const LicenseCard = ({ license, status, assignedAt, issuer, products, libraryHref }) => {
  const metaItems = [];
  if (assignedAt) {
    metaItems.push({
      label: content.licensesPage.your.assignedAtLabel,
      value: formatDate(assignedAt),
    });
  }
  metaItems.push({ label: content.licensesPage.your.issuerLabel, value: issuer });

  const productList = createElement(
    "ul",
    { className: "license-card__products" },
    products.map((product) =>
      createElement("li", {}, [
        createElement("span", { text: product.name }),
        libraryHref
          ? createElement("a", {
              className: "license-card__library-link",
              text: content.licensesPage.your.libraryLink,
              attrs: { href: libraryHref },
            })
          : null,
      ])
    )
  );

  return createElement("article", { className: "card license-card" }, [
    createElement("div", { className: "license-card__header" }, [
      createElement("h3", { text: license }),
      createElement("span", { className: "badge", text: status }),
    ]),
    metaItems.length
      ? createElement(
          "dl",
          { className: "license-card__meta" },
          metaItems.flatMap((item) => [
            createElement("dt", { text: item.label }),
            createElement("dd", { text: item.value }),
          ])
        )
      : null,
    createElement("div", { className: "license-card__section" }, [
      createElement("h4", { text: content.licensesPage.your.productsLabel }),
      productList,
    ]),
  ]);
};

const buildUserLicenses = ({ purchases, products, licenseTypes }) => {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const fallbackType = licenseTypes[1]?.type || licenseTypes[0]?.type || "Commercial";

  return purchases
    .map((purchase, index) => {
      const productItems = Array.isArray(purchase?.items) ? purchase.items : [];
      const coveredProducts = productItems
        .map((item) => {
          const product = productMap.get(item.productId);
          return {
            id: item.productId,
            name: product?.name || "Produkt cyfrowy",
          };
        })
        .filter((item) => item.id);
      if (!coveredProducts.length) {
        return null;
      }
      return {
        id: purchase?.id || `license-${index}`,
        license: purchase?.licenseType || fallbackType,
        status: content.licensesPage.your.statusActive,
        assignedAt: purchase?.createdAt || null,
        issuer: "KP_Code",
        products: coveredProducts,
      };
    })
    .filter(Boolean);
};

export const renderLicenses = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const { licenses, products, productsStatus, productsError, user } = store.getState();
  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(parseHash().pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(createElement("h1", { text: content.licensesPage.title }));
  container.appendChild(
    createElement("p", { className: "section-lead", text: content.licensesPage.lead })
  );
  container.appendChild(
    createElement("nav", { className: "nav-links license-nav", attrs: { "aria-label": "Sekcje" } }, [
      createElement("a", {
        className: "nav-link",
        text: content.licensesPage.nav.your,
        attrs: { href: `#/licenses?section=${SECTION_IDS.your}` },
      }),
      createElement("a", {
        className: "nav-link",
        text: content.licensesPage.nav.types,
        attrs: { href: `#/licenses?section=${SECTION_IDS.types}` },
      }),
    ])
  );

  if (productsStatus === "loading" || productsStatus === "idle") {
    renderNotice(container, {
      title: content.states.licenses.loading.title,
      message: content.states.licenses.loading.message,
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  if (productsStatus === "error") {
    renderNotice(container, {
      title: content.states.products.error.title,
      message: productsError || content.states.products.error.message,
      action: { element: createRetryButton() },
      headingTag: "h2",
    });
    main.appendChild(container);
    return;
  }

  const yourSection = createElement("section", {
    className: "section license-section",
    attrs: { id: SECTION_IDS.your },
  });
  yourSection.appendChild(createElement("h2", { text: content.licensesPage.your.title }));
  yourSection.appendChild(
    createElement("p", { className: "section-lead", text: content.licensesPage.your.lead })
  );
  if (user?.email === "demo@kpcode.dev") {
    yourSection.appendChild(
      createElement("p", { className: "license-demo", text: content.licensesPage.your.demoNote })
    );
  }

  const purchases = purchasesService.getPurchases();
  const userLicenses = buildUserLicenses({ purchases, products, licenseTypes: licenses });
  if (!userLicenses.length) {
    const emptyState = renderEmptyState({
      title: content.licensesPage.your.emptyTitle,
      message: content.licensesPage.your.emptyMessage,
      ctaText: content.licensesPage.your.emptyCta,
      ctaHref: "#/products",
    });
    yourSection.appendChild(emptyState);
  } else {
    const list = createElement("div", { className: "grid grid-2" });
    userLicenses.forEach((license) => {
      list.appendChild(
        LicenseCard({
          ...license,
          libraryHref: content.meta?.routes?.library ? "#/library" : null,
        })
      );
    });
    yourSection.appendChild(list);
  }

  container.appendChild(yourSection);

  const typesSection = createElement("section", {
    className: "section license-section",
    attrs: { id: SECTION_IDS.types },
  });
  typesSection.appendChild(createElement("h2", { text: content.licensesPage.types.title }));
  typesSection.appendChild(
    createElement("p", { className: "section-lead", text: content.licensesPage.types.lead })
  );

  const licenseGrid = createElement("div", { className: "grid grid-2" });
  if (!licenses.length) {
    renderNotice(licenseGrid, {
      title: content.states.licenses.empty.title,
      message: content.states.licenses.empty.message,
    });
  } else {
    licenses.forEach((license) => {
      const card = createElement("div", { className: "card" }, [
        createElement("h3", { text: license.type }),
        createElement("p", {
          text: `${content.licensesPage.types.audienceLabel}: ${license.summary}`,
        }),
        createElement("h4", { text: content.licensesPage.types.permissionsLabel }),
        createElement(
          "ul",
          {},
          license.permissions.map((item) => createElement("li", { text: item }))
        ),
        createElement("h4", { text: content.licensesPage.types.limitationsLabel }),
        createElement(
          "ul",
          {},
          license.limitations.map((item) => createElement("li", { text: item }))
        ),
        createElement("p", {
          text: `${content.licensesPage.types.supportLabel}: ${license.support}`,
        }),
      ]);
      licenseGrid.appendChild(card);
    });
  }

  typesSection.appendChild(licenseGrid);

  const links = [];
  if (content.meta?.routes?.terms) {
    links.push(
      createElement("a", {
        className: "nav-link",
        text: content.licensesPage.types.legalLinkLabel,
        attrs: { href: "#/terms" },
      })
    );
  }
  if (content.meta?.routes?.docs) {
    links.push(
      createElement("a", {
        className: "nav-link",
        text: content.licensesPage.types.docsLinkLabel,
        attrs: { href: "#/docs" },
      })
    );
  }
  if (links.length) {
    typesSection.appendChild(
      createElement("div", { className: "nav-links license-links" }, links)
    );
  }

  container.appendChild(typesSection);
  main.appendChild(container);

  scrollToSection(getSectionFromQuery());
};
