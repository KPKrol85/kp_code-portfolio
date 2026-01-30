import { getContent } from "../content/index.js";
import { navigateHash } from "../utils/navigation.js";

import { addRoute } from "./router.js";

const getHandlerByName = (name) => (module) => module[name];

const addLazyRoute = (pattern, loader, getHandler, meta) => {
  addRoute(pattern, null, meta, { loader, getHandler });
};

export const registerRoutes = () => {
  const getMetaRoutes = () => getContent().meta.routes;
  const getPlaceholders = () => getContent().placeholders;
  const placeholderLoader = () => import("../pages/placeholder.js");
  const checkoutLoader = () => import("../pages/checkout.js");
  const legalPagesLoader = () => import("../pages/legalPages.js");
  const servicesLoader = () => import("../pages/services.js");
  const caseStudiesLoader = () => import("../pages/caseStudies.js");
  const roadmapLoader = () => import("../pages/roadmap.js");
  const aboutLoader = () => import("../pages/about.js");
  const accountLoader = () => import("../pages/account.js");
  const faqLoader = () => import("../pages/faq.js");
  const pricingLoader = () => import("../pages/pricing.js");
  const supportLoader = () => import("../pages/support.js");
  const updatesLoader = () => import("../pages/updates.js");
  const docsLoader = () => import("../pages/docs.js");
  const getPlaceholderBullets = () => getPlaceholders().bullets;
  const getDefaultCtas = () => getPlaceholders().defaultCtas;
  const placeholderRoutes = [
    {
      pattern: /^\/careers$/,
      meta: () => getMetaRoutes().placeholders.careers,
      view: () => ({
        title: getPlaceholders().views.careers.title,
        lead: getPlaceholders().views.careers.lead,
        bullets: getPlaceholderBullets().company,
        ctas: getDefaultCtas(),
      }),
    },
  ];

  addLazyRoute(
    /^\/$/,
    () => import("../pages/home.js"),
    getHandlerByName("renderHome"),
    () => getMetaRoutes().home
  );
  addLazyRoute(
    /^\/products(?:\?.*)?$/,
    () => import("../pages/products.js"),
    getHandlerByName("renderProducts"),
    () => getMetaRoutes().products
  );
  addLazyRoute(
    /^\/pricing$/,
    pricingLoader,
    getHandlerByName("renderPricing"),
    () => getMetaRoutes().pricing
  );
  addLazyRoute(
    /^\/faq$/,
    faqLoader,
    getHandlerByName("renderFaq"),
    () => getMetaRoutes().faq
  );
  addLazyRoute(
    /^\/support$/,
    supportLoader,
    getHandlerByName("renderSupport"),
    () => getMetaRoutes().support
  );
  addLazyRoute(
    /^\/updates$/,
    updatesLoader,
    getHandlerByName("renderUpdates"),
    () => getMetaRoutes().updates
  );
  addLazyRoute(
    /^\/docs$/,
    docsLoader,
    getHandlerByName("renderDocs"),
    () => getMetaRoutes().docs
  );
  addRoute(
    /^\/products\/core-ui-components-pack\/panel$/,
    () => {
      navigateHash("#/product/core-ui-components-pack", { force: true });
    },
    () => getMetaRoutes().library
  );
  addLazyRoute(
    /^\/product\/core-ui-components-pack$/,
    () => import("../pages/productPanels.js"),
    getHandlerByName("renderCoreUiPanel"),
    () => getMetaRoutes().library
  );
  addLazyRoute(
    /^\/services$/,
    servicesLoader,
    getHandlerByName("renderServicesIndex"),
    () => getMetaRoutes().services
  );
  addLazyRoute(
    /^\/services\/(?<slug>[\w-]+)$/,
    servicesLoader,
    getHandlerByName("renderServiceDetail"),
    () => getMetaRoutes().serviceDetails
  );
  addLazyRoute(
    /^\/case-studies$/,
    caseStudiesLoader,
    getHandlerByName("renderCaseStudiesIndex"),
    () => getMetaRoutes().caseStudies
  );
  addLazyRoute(
    /^\/case-studies\/(?<slug>[\w-]+)$/,
    caseStudiesLoader,
    getHandlerByName("renderCaseStudyDetail"),
    () => getMetaRoutes().caseStudyDetails
  );
  addLazyRoute(
    /^\/roadmap$/,
    roadmapLoader,
    getHandlerByName("renderRoadmap"),
    () => getMetaRoutes().placeholders.roadmap
  );
  addLazyRoute(
    /^\/about$/,
    aboutLoader,
    getHandlerByName("renderAbout"),
    () => getMetaRoutes().placeholders.about
  );
  const categoryLoader = () => import("../pages/productCategory.js");
  const categoryRoutes = [
    {
      pattern: /^\/products\/ui-kits$/,
      meta: () => getMetaRoutes().productCategories.uiKits,
      slug: "ui-kits",
    },
    {
      pattern: /^\/products\/templates$/,
      meta: () => getMetaRoutes().productCategories.templates,
      slug: "templates",
    },
    {
      pattern: /^\/products\/assets$/,
      meta: () => getMetaRoutes().productCategories.assets,
      slug: "assets",
    },
    {
      pattern: /^\/products\/knowledge$/,
      meta: () => getMetaRoutes().productCategories.knowledge,
      slug: "knowledge",
    },
  ];
  categoryRoutes.forEach((route) => {
    addLazyRoute(
      route.pattern,
      categoryLoader,
      (module) => () => module.renderProductCategory({ category: route.slug }),
      route.meta
    );
  });
  placeholderRoutes.forEach((route) => {
    addLazyRoute(
      route.pattern,
      placeholderLoader,
      (module) => module.createPlaceholderHandler(route.view),
      route.meta
    );
  });
  addRoute(
    /^\/settings$/,
    () => {
      navigateHash("#/account/settings", { force: true });
    },
    () => getMetaRoutes().accountSettings || getMetaRoutes().account
  );
  addLazyRoute(
    /^\/products\/(?<id>[\w-]+)$/,
    () => import("../pages/productDetails.js"),
    getHandlerByName("renderProductDetails"),
    () => getMetaRoutes().productDetails
  );
  addLazyRoute(
    /^\/cart$/,
    () => import("../pages/cart.js"),
    getHandlerByName("renderCart"),
    () => getMetaRoutes().cart
  );
  addLazyRoute(
    /^\/checkout$/,
    checkoutLoader,
    getHandlerByName("renderCheckout"),
    () => getMetaRoutes().checkout
  );
  addLazyRoute(
    /^\/checkout\/success$/,
    checkoutLoader,
    getHandlerByName("renderCheckoutSuccess"),
    () => getMetaRoutes().checkoutSuccess
  );
  addLazyRoute(
    /^\/auth$/,
    () => import("../pages/auth.js"),
    getHandlerByName("renderAuth"),
    () => getMetaRoutes().auth
  );
  addLazyRoute(
    /^\/account$/,
    accountLoader,
    getHandlerByName("renderAccountOverview"),
    () => getMetaRoutes().account
  );
  addLazyRoute(
    /^\/account\/orders$/,
    accountLoader,
    getHandlerByName("renderAccountOrders"),
    () => getMetaRoutes().accountOrders || getMetaRoutes().account
  );
  addLazyRoute(
    /^\/account\/downloads$/,
    accountLoader,
    getHandlerByName("renderAccountDownloads"),
    () => getMetaRoutes().accountDownloads || getMetaRoutes().account
  );
  addLazyRoute(
    /^\/account\/settings$/,
    accountLoader,
    getHandlerByName("renderAccountSettings"),
    () => getMetaRoutes().accountSettings || getMetaRoutes().account
  );
  addLazyRoute(
    /^\/library$/,
    () => import("../pages/library.js"),
    getHandlerByName("renderLibrary"),
    () => getMetaRoutes().library
  );
  addLazyRoute(
    /^\/licenses$/,
    () => import("../pages/licenses.js"),
    getHandlerByName("renderLicenses"),
    () => getMetaRoutes().licenses
  );
  addLazyRoute(
    /^\/privacy$/,
    legalPagesLoader,
    getHandlerByName("renderPrivacy"),
    () => getMetaRoutes().privacy
  );
  addLazyRoute(
    /^\/terms$/,
    legalPagesLoader,
    getHandlerByName("renderTerms"),
    () => getMetaRoutes().terms
  );
  addLazyRoute(
    /^\/cookies$/,
    legalPagesLoader,
    getHandlerByName("renderCookies"),
    () => getMetaRoutes().cookies
  );
  addLazyRoute(
    /^\/admin$/,
    () => import("../pages/admin.js"),
    getHandlerByName("renderAdmin"),
    () => getMetaRoutes().admin
  );
  addLazyRoute(
    /^\/legal$/,
    () => import("../pages/legal.js"),
    getHandlerByName("renderLegal"),
    () => getMetaRoutes().legal
  );
  addLazyRoute(
    /^\/contact$/,
    () => import("../pages/contact.js"),
    getHandlerByName("renderContact"),
    () => getMetaRoutes().contact
  );
  addLazyRoute(
    /^\/404$/,
    () => import("../pages/notFound.js"),
    getHandlerByName("renderNotFound"),
    () => getMetaRoutes().notFound
  );
};
