import { createBreadcrumbs } from "../components/breadcrumbs.js";
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
  renderNotice(container, {
    title: "Brak dostepu do panelu",
    message: "Aktywuj dostep demo, aby zobaczyc panel produktu.",
    action: { label: "Aktywuj dostep (demo)", href: getSeedHref() },
    headingTag: "h2",
  });
};

export const renderCoreUiPanel = () => {
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
      createElement("span", { className: "badge", text: "v1.0" }),
    ])
  );
  heroContent.appendChild(
    createElement("h1", {
      className: "hero-title",
      text: "Core UI Components Pack",
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: "Production-ready system UI dla prawdziwych dashboardow.",
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "section-lead",
      text: "Tokeny, tryby light/dark i gotowe komponenty do wdrozenia.",
    })
  );

  const heroVisual = createElement("div", { className: "hero-visual" }, [
    createElement("div", {
      className: "gallery-placeholder",
      text: "Panel dostepu do Twojej paczki.",
    }),
  ]);
  hero.appendChild(heroContent);
  hero.appendChild(heroVisual);

  const featuresSection = createElement("section", { className: "section" });
  featuresSection.appendChild(
    createElement("div", { className: "section-header" }, [
      createElement("h2", { text: "Kluczowe cechy" }),
      createElement("p", {
        className: "section-lead",
        text: "Tokeny, tryby light/dark i gotowe komponenty do wdrozenia.",
      }),
    ])
  );
  const featuresGrid = createElement("div", { className: "grid grid-3" }, [
    createElement("article", { className: "card" }, [
      createElement("h3", { text: "Tokenowe motywy" }),
      createElement("p", {
        className: "section-lead",
        text: "Semantyczne tokeny utrzymuja spojny light i dark mode.",
      }),
    ]),
    createElement("article", { className: "card" }, [
      createElement("h3", { text: "Bez zaleznosci" }),
      createElement("p", {
        className: "section-lead",
        text: "Tylko HTML i CSS, bez narzedzi build.",
      }),
    ]),
    createElement("article", { className: "card" }, [
      createElement("h3", { text: "Gotowe wzorce" }),
      createElement("p", {
        className: "section-lead",
        text: "Najczestsze wzorce UI gotowe do produkcji.",
      }),
    ]),
  ]);
  featuresSection.appendChild(featuresGrid);

  container.appendChild(hero);
  container.appendChild(featuresSection);
  main.appendChild(container);
};
