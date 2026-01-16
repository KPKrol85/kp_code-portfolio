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
import { renderContact } from "./pages/contact.js";
import { renderNotFound } from "./pages/notFound.js";
import { renderAdmin } from "./pages/admin.js";
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
    showToast("Nie udało się pobrać danych.", "error");
    store.setState({
      products: [],
      productsStatus: "error",
      productsError: "Nie udało się pobrać produktów.",
    });
  }
};

const initStore = () => {
  const cart = cartService.getCart();
  const session = authService.getSession();
  const user = authService.getCurrentUser();
  const { theme, hasSaved } = detectTheme();
  store.setState({
    cart,
    session,
    user,
    ui: { theme },
  });
  applyTheme(theme, { persist: hasSaved });

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
  addRoute(/^\/$/, renderHome, {
    title: "KP_Code Digital Vault — Start",
    description: "Nowoczesny sklep z produktami cyfrowymi i biblioteką zakupów.",
  });
  addRoute(/^\/products$/, renderProducts, {
    title: "Katalog produktów — KP_Code Digital Vault",
    description: "Przeglądaj produkty cyfrowe, filtry i sortowanie.",
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
    if (preventScroll) {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      try {
        main.focus({ preventScroll: true });
      } catch (error) {
        main.focus();
        window.scrollTo(scrollX, scrollY);
      }
      return;
    }
    main.focus();
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

initErrorBoundary();
initStore();
initLayout();
initData();
initRoutes();
initRouteScrollHandling();
initRouteClickTracking();
initResizeHandling();
updateHeaderOffset();
focusMain({ preventScroll: true });

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
