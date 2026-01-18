import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { renderHome } from "./pages/home.js";
import { renderProducts } from "./pages/products.js";
import { renderProductDetails } from "./pages/productDetails.js";
import { renderCart } from "./pages/cart.js";
import { renderCheckout, renderCheckoutSuccess } from "./pages/checkout.js";
import { renderAuth } from "./pages/auth.js";
import { renderAccount } from "./pages/account.js";
import { renderLibrary } from "./pages/library.js";
import { renderLicenses } from "./pages/licenses.js";
import { renderLegal } from "./pages/legal.js";
import { renderCookies, renderPrivacy, renderTerms } from "./pages/legalPages.js";
import { renderContact } from "./pages/contact.js";
import { renderNotFound } from "./pages/notFound.js";
import { renderAdmin } from "./pages/admin.js";
import { createPlaceholderHandler } from "./pages/placeholder.js";
import { addRoute, startRouter } from "./router/router.js";
import { mockApi } from "./services/mockApi.js";
import { cartService } from "./services/cart.js";
import { authService } from "./services/auth.js";
import { storage } from "./services/storage.js";
import { store } from "./store/store.js";
import { showToast } from "./components/toast.js";
import { initErrorBoundary } from "./utils/error-boundary.js";
import { initKeyboardShortcuts } from "./utils/keyboard-shortcuts.js";
import { closeModal } from "./components/modal.js";
import { consumeProgrammaticNav, markProgrammaticNav, navigateHash } from "./utils/navigation.js";
import { content } from "./content/pl.js";
import { setMetaImages } from "./utils/meta.js";

const THEME_KEY = "kp_theme";

const applyTheme = (theme, { persist = true } = {}) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (persist) {
    storage.set(THEME_KEY, theme);
  }
  store.setState({ ui: { theme } });
};

const detectTheme = () => {
  const saved = storage.get(THEME_KEY, null);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    theme: saved ?? (prefersDark ? "dark" : "light"),
    hasSaved: Boolean(saved),
  };
};

const initData = async () => {
  store.setState({ productsStatus: "loading", productsError: null });
  try {
    const [products, licenses] = await Promise.all([mockApi.getProducts(), mockApi.getLicenses()]);
    store.setState({ products, licenses, productsStatus: "ready", productsError: null });
  } catch (error) {
    showToast(content.toasts.dataFetchError, "error");
    store.setState({
      products: [],
      productsStatus: "error",
      productsError: content.states.products.error.title,
    });
  }
};

const initStore = () => {
  const cart = cartService.getCart();
  const session = authService.getSession();
  const user = authService.getUser();
  const { theme, hasSaved } = detectTheme();
  store.setState({
    cart,
    session,
    user,
    ui: { theme },
  });
  applyTheme(theme, { persist: hasSaved });

  authService.onAuthChange(({ session: nextSession, user: nextUser }) => {
    store.setState({ session: nextSession, user: nextUser });
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (event) => {
    if (storage.get(THEME_KEY, null)) {
      return;
    }
    applyTheme(event.matches ? "dark" : "light", { persist: false });
  });
};

const initLayout = () => {
  renderHeader(
    document.getElementById("app-header"),
    () => {
      const currentTheme = store.getState().ui.theme;
      applyTheme(currentTheme === "light" ? "dark" : "light");
    },
    { onHeightChange: updateHeaderOffset }
  );
  renderFooter(document.getElementById("app-footer"));
};

const initRoutes = () => {
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
      pattern: /^\/products\/ui-kits$/,
      meta: {
        title: "UI Kits & Components — KP_Code Digital Vault",
        description: "Kategoria UI Kits & Components jest w przygotowaniu.",
      },
      view: {
        title: "UI Kits & Components",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.products,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/products\/templates$/,
      meta: {
        title: "Templates & Dashboards — KP_Code Digital Vault",
        description: "Kategoria Templates & Dashboards jest w przygotowaniu.",
      },
      view: {
        title: "Templates & Dashboards",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.products,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/products\/assets$/,
      meta: {
        title: "Assets & Graphics — KP_Code Digital Vault",
        description: "Kategoria Assets & Graphics jest w przygotowaniu.",
      },
      view: {
        title: "Assets & Graphics",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.products,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/products\/knowledge$/,
      meta: {
        title: "Knowledge & Tools — KP_Code Digital Vault",
        description: "Kategoria Knowledge & Tools jest w przygotowaniu.",
      },
      view: {
        title: "Knowledge & Tools",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.products,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/services$/,
      meta: {
        title: "Usługi — KP_Code Digital Vault",
        description: "Sekcja usług KP_Code Digital Vault jest w przygotowaniu.",
      },
      view: {
        title: "Usługi",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.services,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/services\/web-development$/,
      meta: {
        title: "Web Development — KP_Code Digital Vault",
        description: "Usługa Web Development jest w przygotowaniu.",
      },
      view: {
        title: "Web Development",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.services,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/services\/wordpress$/,
      meta: {
        title: "WordPress Solutions — KP_Code Digital Vault",
        description: "Usługa WordPress Solutions jest w przygotowaniu.",
      },
      view: {
        title: "WordPress Solutions",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.services,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/services\/ui-ux-branding$/,
      meta: {
        title: "UI / UX & Branding — KP_Code Digital Vault",
        description: "Usługa UI / UX & Branding jest w przygotowaniu.",
      },
      view: {
        title: "UI / UX & Branding",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.services,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/services\/consulting-support$/,
      meta: {
        title: "Consulting & Support — KP_Code Digital Vault",
        description: "Usługa Consulting & Support jest w przygotowaniu.",
      },
      view: {
        title: "Consulting & Support",
        lead: "W przygotowaniu.",
        bullets: placeholderBullets.services,
        ctas: defaultCtas,
      },
    },
    {
      pattern: /^\/pricing$/,
      meta: {
        title: "Cennik — KP_Code Digital Vault",
        description: "Cennik jest w przygotowaniu.",
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
        title: "Aktualizacje — KP_Code Digital Vault",
        description: "Aktualizacje i changelog są w przygotowaniu.",
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
        title: "Dokumentacja — KP_Code Digital Vault",
        description: "Dokumentacja jest w przygotowaniu.",
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
        title: "FAQ — KP_Code Digital Vault",
        description: "FAQ jest w przygotowaniu.",
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
        title: "Wsparcie — KP_Code Digital Vault",
        description: "Wsparcie jest w przygotowaniu.",
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
        title: "O nas — KP_Code Digital Vault",
        description: "Sekcja o nas jest w przygotowaniu.",
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
        title: "Plan rozwoju — KP_Code Digital Vault",
        description: "Plan rozwoju jest w przygotowaniu.",
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
        title: "Kariera — KP_Code Digital Vault",
        description: "Sekcja kariera jest w przygotowaniu.",
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
        title: "Ustawienia konta — KP_Code Digital Vault",
        description: "Ustawienia konta są w przygotowaniu.",
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

  addRoute(/^\/$/, renderHome, {
    title: "KP_Code Digital Vault — Start",
    description: "Nowoczesny sklep z produktami cyfrowymi i biblioteką zakupów.",
  });
  addRoute(/^\/products(?:\?.*)?$/, renderProducts, {
    title: "Katalog produktów — KP_Code Digital Vault",
    description: "Przeglądaj produkty cyfrowe, filtry i sortowanie.",
  });
  placeholderRoutes.forEach((route) => {
    addRoute(route.pattern, createPlaceholderHandler(route.view), route.meta);
  });
  addRoute(/^\/products\/(?<id>[\w-]+)$/, renderProductDetails, {
    title: "Szczegóły produktu — KP_Code Digital Vault",
    description: "Poznaj szczegóły produktu cyfrowego i jego zawartość.",
  });
  addRoute(/^\/cart$/, renderCart, {
    title: "Koszyk — KP_Code Digital Vault",
    description: "Sprawdź produkty w koszyku i podsumowanie zamówienia.",
  });
  addRoute(/^\/checkout$/, renderCheckout, {
    title: "Checkout — KP_Code Digital Vault",
    description: "Złóż zamówienie na produkty cyfrowe.",
  });
  addRoute(/^\/checkout\/success$/, renderCheckoutSuccess, {
    title: "Sukces zamówienia — KP_Code Digital Vault",
    description: "Potwierdzenie złożenia zamówienia.",
  });
  addRoute(/^\/auth$/, renderAuth, {
    title: "Logowanie — KP_Code Digital Vault",
    description: "Zaloguj się lub utwórz konto użytkownika.",
  });
  addRoute(/^\/account$/, renderAccount, {
    title: "Konto — KP_Code Digital Vault",
    description: "Panel użytkownika i historia zamówień.",
  });
  addRoute(/^\/library$/, renderLibrary, {
    title: "Biblioteka — KP_Code Digital Vault",
    description: "Pobieraj zakupione produkty cyfrowe.",
  });
  addRoute(/^\/licenses$/, renderLicenses, {
    title: "Licencje — KP_Code Digital Vault",
    description: "Sprawdź typy licencji i pobierz pliki licencyjne.",
  });
  addRoute(/^\/privacy$/, renderPrivacy, {
    title: "Polityka prywatnosci - KP_Code Digital Vault",
    description: "Informacje o przetwarzaniu danych i prywatnosci w KP_Code Digital Vault.",
  });
  addRoute(/^\/terms$/, renderTerms, {
    title: "Regulamin - KP_Code Digital Vault",
    description: "Zasady korzystania z KP_Code Digital Vault i zakupu produktow cyfrowych.",
  });
  addRoute(/^\/cookies$/, renderCookies, {
    title: "Cookies - KP_Code Digital Vault",
    description: "Informacje o cookies i localStorage w KP_Code Digital Vault.",
  });
  addRoute(/^\/admin$/, renderAdmin, {
    title: "Panel administratora - KP_Code Digital Vault",
    description: "Strefa administracyjna sklepu (w budowie).",
  });
  addRoute(/^\/legal$/, renderLegal, {
    title: "Dokumenty prawne — KP_Code Digital Vault",
    description: "Regulamin i polityka prywatności sklepu.",
  });
  addRoute(/^\/contact$/, renderContact, {
    title: "Kontakt — KP_Code Digital Vault",
    description: "Skontaktuj się z nami w sprawie produktów cyfrowych.",
  });
  addRoute(/^\/404$/, renderNotFound, {
    title: "404 — KP_Code Digital Vault",
    description: "Nie znaleziono strony.",
  });

  startRouter();
};

const focusMain = ({ preventScroll = false } = {}) => {
  const main = document.getElementById("main-content");
  if (main) {
    const heading = main.querySelector("[data-focus-heading]");
    const target = heading || main;
    if (preventScroll) {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
        window.scrollTo(scrollX, scrollY);
      }
      return;
    }
    target.focus();
  }
};

const updateHeaderOffset = () => {
  const header = document.querySelector("header");
  if (!header) {
    return;
  }
  const height = Math.round(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--header-offset", `${height}px`);
};

const initRouteScrollHandling = () => {
  let isFirstRoute = true;
  window.addEventListener("route:after", () => {
    const shouldReset = consumeProgrammaticNav() || isFirstRoute;
    requestAnimationFrame(() => {
      if (shouldReset) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      requestAnimationFrame(() => {
        updateHeaderOffset();
        focusMain({ preventScroll: true });
      });
    });
    isFirstRoute = false;
  });
};

const initRouteClickTracking = () => {
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const link = event.target.closest('a[href^="#/"]');
    if (link) {
      markProgrammaticNav();
    }
  });
};

const initResizeHandling = () => {
  let resizeRaf = null;
  window.addEventListener("resize", () => {
    if (resizeRaf) {
      window.cancelAnimationFrame(resizeRaf);
    }
    resizeRaf = window.requestAnimationFrame(() => {
      updateHeaderOffset();
      resizeRaf = null;
    });
  });
};

const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
          console.info("Service Worker registered.");
        }
      })
      .catch((error) => {
        if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
          console.warn("Service Worker registration failed:", error);
        }
      });
  });
};

initErrorBoundary();
initStore();
initLayout();
setMetaImages();
initData();
initRoutes();
initRouteScrollHandling();
initRouteClickTracking();
initResizeHandling();
updateHeaderOffset();
focusMain({ preventScroll: true });
registerServiceWorker();

initKeyboardShortcuts({
  getSearchInput: () => document.querySelector('input[type="search"]'),
  closeModal,
  navigateToAuth: () => {
    const { user } = store.getState();
    const target = user ? "#/account" : "#/auth";
    if (!target) {
      return false;
    }
    navigateHash(target, { force: true });
    return true;
  },
});
