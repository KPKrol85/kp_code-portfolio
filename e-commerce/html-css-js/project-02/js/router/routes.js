import { addRoute } from "./router.js";
import { content } from "../content/pl.js";

const getHandlerByName = (name) => (module) => module[name];

const addLazyRoute = (pattern, loader, getHandler, meta) => {
  addRoute(pattern, null, meta, { loader, getHandler });
};

export const registerRoutes = () => {
  const placeholderLoader = () => import("../pages/placeholder.js");
  const checkoutLoader = () => import("../pages/checkout.js");
  const legalPagesLoader = () => import("../pages/legalPages.js");
  const servicesLoader = () => import("../pages/services.js");
  const caseStudiesLoader = () => import("../pages/caseStudies.js");
  const metaRoutes = content.meta.routes;
  const placeholderBullets = {
    products: [
      "Przegląd kolekcji tematycznych i filtrów.",
      "Przykładowe podglądy i checklisty kompatybilności.",
      "Szybkie porównanie licencji i formatów plików.",
    ],
    services: [
      "Zakres i pakiety usług wraz z orientacyjnymi terminami.",
      "Case studies i przykładowe realizacje.",
      "Krótki formularz do szybkiej wyceny.",
    ],
    resources: [
      "Aktualne materiały i przewodniki dla klientów.",
      "Sekcja pytań i odpowiedzi oraz baza wiedzy.",
      "Kanały kontaktu i wsparcia technicznego.",
    ],
    company: [
      "Informacje o zespole i misji marki.",
      "Kamienie milowe oraz plan rozwoju produktu.",
      "Oferty współpracy i aktualne rekrutacje.",
    ],
    account: [
      "Ustawienia profilu i bezpieczeństwa konta.",
      "Powiadomienia oraz preferencje komunikacji.",
      "Zarządzanie danymi rozliczeniowymi.",
    ],
  };
  const defaultCtas = [
    { label: "Powrót do produktów", href: "#/products" },
    { label: "Zaloguj się", href: "#/auth", variant: "secondary" },
  ];
  const placeholderRoutes = [
    {
      pattern: /^\/pricing$/,
      meta: {
        ...metaRoutes.placeholders.pricing,
      },
      view: {
        title: "Cennik",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.resources,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/updates$/,
      meta: {
        ...metaRoutes.placeholders.updates,
      },
      view: {
        title: "Aktualizacje / Changelog",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.resources,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/docs$/,
      meta: {
        ...metaRoutes.placeholders.docs,
      },
      view: {
        title: "Dokumentacja",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.resources,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/faq$/,
      meta: {
        ...metaRoutes.placeholders.faq,
      },
      view: {
        title: "FAQ",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.resources,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/support$/,
      meta: {
        ...metaRoutes.placeholders.support,
      },
      view: {
        title: "Wsparcie",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.resources,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/about$/,
      meta: {
        ...metaRoutes.placeholders.about,
      },
      view: {
        title: "O nas",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.company,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/roadmap$/,
      meta: {
        ...metaRoutes.placeholders.roadmap,
      },
      view: {
        title: "Plan rozwoju / Roadmap",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.company,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/careers$/,
      meta: {
        ...metaRoutes.placeholders.careers,
      },
      view: {
        title: "Kariera",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.company,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/settings$/,
      meta: {
        ...metaRoutes.placeholders.settings,
      },
      view: {
        title: "Ustawienia konta",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.account,
        ctas: [
          { label: "Powrót do produktów", href: "#/products" },
          { label: "Przejdź do konta", href: "#/account", variant: "secondary" },
        ],
      },
    },
  ];

  addLazyRoute(
    /^\/$/,
    () => import("../pages/home.js"),
    getHandlerByName("renderHome"),
    metaRoutes.home
  );
  addLazyRoute(
    /^\/products(?:\?.*)?$/,
    () => import("../pages/products.js"),
    getHandlerByName("renderProducts"),
    metaRoutes.products
  );
  addLazyRoute(
    /^\/services$/,
    servicesLoader,
    getHandlerByName("renderServicesIndex"),
    metaRoutes.services
  );
  addLazyRoute(
    /^\/services\/(?<slug>[\w-]+)$/,
    servicesLoader,
    getHandlerByName("renderServiceDetail"),
    metaRoutes.serviceDetails
  );
  addLazyRoute(
    /^\/case-studies$/,
    caseStudiesLoader,
    getHandlerByName("renderCaseStudiesIndex"),
    metaRoutes.caseStudies
  );
  addLazyRoute(
    /^\/case-studies\/(?<slug>[\w-]+)$/,
    caseStudiesLoader,
    getHandlerByName("renderCaseStudyDetail"),
    metaRoutes.caseStudyDetails
  );
  const categoryLoader = () => import("../pages/productCategory.js");
  const categoryRoutes = [
    {
      pattern: /^\/products\/ui-kits$/,
      meta: metaRoutes.productCategories.uiKits,
      slug: "ui-kits",
    },
    {
      pattern: /^\/products\/templates$/,
      meta: metaRoutes.productCategories.templates,
      slug: "templates",
    },
    {
      pattern: /^\/products\/assets$/,
      meta: metaRoutes.productCategories.assets,
      slug: "assets",
    },
    {
      pattern: /^\/products\/knowledge$/,
      meta: metaRoutes.productCategories.knowledge,
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
  addLazyRoute(
    /^\/products\/(?<id>[\w-]+)$/,
    () => import("../pages/productDetails.js"),
    getHandlerByName("renderProductDetails"),
    metaRoutes.productDetails
  );
  addLazyRoute(
    /^\/cart$/,
    () => import("../pages/cart.js"),
    getHandlerByName("renderCart"),
    metaRoutes.cart
  );
  addLazyRoute(
    /^\/checkout$/,
    checkoutLoader,
    getHandlerByName("renderCheckout"),
    metaRoutes.checkout
  );
  addLazyRoute(
    /^\/checkout\/success$/,
    checkoutLoader,
    getHandlerByName("renderCheckoutSuccess"),
    metaRoutes.checkoutSuccess
  );
  addLazyRoute(
    /^\/auth$/,
    () => import("../pages/auth.js"),
    getHandlerByName("renderAuth"),
    metaRoutes.auth
  );
  addLazyRoute(
    /^\/account$/,
    () => import("../pages/account.js"),
    getHandlerByName("renderAccount"),
    metaRoutes.account
  );
  addLazyRoute(
    /^\/library$/,
    () => import("../pages/library.js"),
    getHandlerByName("renderLibrary"),
    metaRoutes.library
  );
  addLazyRoute(
    /^\/licenses$/,
    () => import("../pages/licenses.js"),
    getHandlerByName("renderLicenses"),
    metaRoutes.licenses
  );
  addLazyRoute(
    /^\/privacy$/,
    legalPagesLoader,
    getHandlerByName("renderPrivacy"),
    metaRoutes.privacy
  );
  addLazyRoute(
    /^\/terms$/,
    legalPagesLoader,
    getHandlerByName("renderTerms"),
    metaRoutes.terms
  );
  addLazyRoute(
    /^\/cookies$/,
    legalPagesLoader,
    getHandlerByName("renderCookies"),
    metaRoutes.cookies
  );
  addLazyRoute(
    /^\/admin$/,
    () => import("../pages/admin.js"),
    getHandlerByName("renderAdmin"),
    metaRoutes.admin
  );
  addLazyRoute(
    /^\/legal$/,
    () => import("../pages/legal.js"),
    getHandlerByName("renderLegal"),
    metaRoutes.legal
  );
  addLazyRoute(
    /^\/contact$/,
    () => import("../pages/contact.js"),
    getHandlerByName("renderContact"),
    metaRoutes.contact
  );
  addLazyRoute(
    /^\/404$/,
    () => import("../pages/notFound.js"),
    getHandlerByName("renderNotFound"),
    metaRoutes.notFound
  );
};
