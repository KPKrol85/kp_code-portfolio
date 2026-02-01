import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { getContent } from "../content/index.js";
import { renderNotice } from "../components/uiStates.js";
import { demoPurchasesService } from "../services/demo-purchases.js";
import { purchasesService } from "../services/purchases.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";

const PRODUCT_ID = "core-ui-components-pack";
const getSeedHref = () => `./index.html?seedPurchase=${PRODUCT_ID}#/product/${PRODUCT_ID}`;

const hasAccess = () => {
  const demoItems = demoPurchasesService.getLibraryItems();
  if (demoItems.some((item) => item.id === PRODUCT_ID)) {
    return true;
  }
  const purchases = purchasesService.getLibraryItems();
  return purchases.some((item) => item.productId === PRODUCT_ID);
};

const renderAccessNotice = (container) => {
  const content = getContent();
  renderNotice(container, {
    title: content.productPanels.coreUi.accessDenied.title,
    message: content.productPanels.coreUi.accessDenied.message,
    action: { label: content.productPanels.coreUi.accessDenied.action, href: getSeedHref() },
    headingTag: "h2",
  });
};

export const renderCoreUiPanel = () => {
  const content = getContent();
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath("/library"));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }

  if (!hasAccess()) {
    renderAccessNotice(container);
    main.appendChild(container);
    return;
  }

  const hero = createElement("section", { className: "hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(
    createElement("div", { className: "tag-list" }, [
      createElement("span", { className: "badge", text: content.productPanels.coreUi.versionBadge }),
    ])
  );
  heroContent.appendChild(
    createElement("h1", {
      className: "hero-title",
      text: content.productPanels.coreUi.hero.title,
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: content.productPanels.coreUi.hero.lead,
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "section-lead",
      text: content.productPanels.coreUi.hero.sublead,
    })
  );

  const heroVisual = createElement("div", { className: "hero-visual" }, [
    createElement("div", {
      className: "gallery-placeholder",
      text: content.productPanels.coreUi.heroPlaceholder,
    }),
  ]);
  hero.appendChild(heroContent);
  hero.appendChild(heroVisual);

  const featuresSection = createElement("section", { className: "section" });
  featuresSection.appendChild(
    createElement("div", { className: "section-header" }, [
      createElement("h2", { text: content.productPanels.coreUi.features.title }),
      createElement("p", {
        className: "section-lead",
        text: content.productPanels.coreUi.features.lead,
      }),
    ])
  );
  const featureItems = content.productPanels.coreUi.features.items || [];
  const featuresGrid = createElement("div", { className: "grid grid-3" }, [
    createElement("article", { className: "card" }, [
      createElement("h3", { text: featureItems[0]?.title || "" }),
      createElement("p", {
        className: "section-lead",
        text: featureItems[0]?.lead || "",
      }),
    ]),
    createElement("article", { className: "card" }, [
      createElement("h3", { text: featureItems[1]?.title || "" }),
      createElement("p", {
        className: "section-lead",
        text: featureItems[1]?.lead || "",
      }),
    ]),
    createElement("article", { className: "card" }, [
      createElement("h3", { text: featureItems[2]?.title || "" }),
      createElement("p", {
        className: "section-lead",
        text: featureItems[2]?.lead || "",
      }),
    ]),
  ]);
  featuresSection.appendChild(featuresGrid);

  container.appendChild(hero);
  container.appendChild(featuresSection);
  main.appendChild(container);
};
