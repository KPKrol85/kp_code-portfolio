import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { startRouter } from "./router/router.js";
import { registerRoutes } from "./router/routes.js";
import { mockApi } from "./services/mockApi.js";
import { cartService } from "./services/cart.js";
import { authService } from "./services/auth.js";
import { storage } from "./services/storage.js";
import { store } from "./store/store.js";
import { actions } from "./store/actions.js";
import { selectors } from "./store/selectors.js";
import { showToast } from "./components/toast.js";
import { initErrorBoundary } from "./utils/error-boundary.js";
import { initKeyboardShortcuts } from "./utils/keyboard-shortcuts.js";
import { closeModal } from "./components/modal.js";
import { consumeProgrammaticNav, markProgrammaticNav, navigateHash } from "./utils/navigation.js";
import { content } from "./content/pl.js";
import { setMetaImages } from "./utils/meta.js";

const THEME_KEY = "kp_theme";
const SW_UPDATE_TOAST_KEY = "kp_sw_update_toast_shown";
const SW_UPDATE_RELOAD_KEY = "kp_sw_update_reloaded";

const applyTheme = (theme, { persist = true } = {}) => {
  document.documentElement.setAttribute("data-theme", theme);
  if (persist) {
    storage.set(THEME_KEY, theme);
  }
  actions.ui.setTheme(theme);
};

const detectTheme = () => {
  const saved = storage.get(THEME_KEY, null);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return {
    theme: saved ?? (prefersDark ? "dark" : "light"),
    hasSaved: Boolean(saved),
  };
};

const RETRY_BUTTON_SELECTOR = '[data-retry="init-data"]';
let isDataRetrying = false;

const updateRetryButtonsState = (isLoading) => {
  document.querySelectorAll(RETRY_BUTTON_SELECTOR).forEach((button) => {
    button.disabled = isLoading;
    button.textContent = isLoading ? "Ładowanie..." : "Spróbuj ponownie";
  });
};

const initData = async () => {
  if (isDataRetrying) {
    return;
  }
  isDataRetrying = true;
  updateRetryButtonsState(true);
  actions.data.setProductsLoading();
  try {
    const [products, licenses] = await Promise.all([mockApi.getProducts(), mockApi.getLicenses()]);
    actions.data.setProductsReady({ products, licenses });
  } catch (error) {
    showToast(content.toasts.dataFetchError, "error");
    actions.data.setProductsError(content.states.products.error.title);
  } finally {
    isDataRetrying = false;
    updateRetryButtonsState(false);
  }
};

const initStore = () => {
  const session = authService.getSession();
  const user = authService.getUser();
  const { theme, hasSaved } = detectTheme();
  actions.user.setSession(session, user);
  actions.cart.setCart(cartService.getCart());
  actions.ui.setTheme(theme);
  applyTheme(theme, { persist: hasSaved });

  authService.onAuthChange(({ session: nextSession, user: nextUser }) => {
    actions.user.setSession(nextSession, nextUser);
    actions.cart.setCart(cartService.getCart());
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
      const currentTheme = selectors.theme(store.getState());
      applyTheme(currentTheme === "light" ? "dark" : "light");
    },
    { onHeightChange: updateHeaderOffset }
  );
};

const initFooter = () => {
  const container = document.getElementById("app-footer");
  if (!container || container._footerMounted) {
    return;
  }
  container._footerMounted = true;
  renderFooter(container);
};

const initFooterAfterFirstRoute = () => {
  const handleFirstRoute = () => {
    initFooter();
    window.removeEventListener("route:after", handleFirstRoute);
  };
  window.addEventListener("route:after", handleFirstRoute);
};

const initDataRetryHandling = () => {
  document.addEventListener("click", (event) => {
    const target = event.target.closest(RETRY_BUTTON_SELECTOR);
    if (!target) {
      return;
    }
    event.preventDefault();
    initData();
  });
};

const initRoutes = () => {
  registerRoutes();
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

const initConnectivityFeedback = () => {
  let lastOnlineState = navigator.onLine;
  const handleStateChange = (isOnline) => {
    if (isOnline === lastOnlineState) {
      return;
    }
    lastOnlineState = isOnline;
    if (isOnline) {
      showToast("Połączenie przywrócone.", "info");
    } else {
      showToast("Jesteś offline — część danych może być nieaktualna.", "warning");
    }
  };
  window.addEventListener("online", () => handleStateChange(true));
  window.addEventListener("offline", () => handleStateChange(false));
};

const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        if (!registration) {
          return;
        }
        let updateToastShown = false;
        const showUpdateToast = () => {
          if (updateToastShown || sessionStorage.getItem(SW_UPDATE_TOAST_KEY)) {
            return;
          }
          const waitingWorker = registration.waiting;
          if (!waitingWorker) {
            return;
          }
          updateToastShown = true;
          sessionStorage.setItem(SW_UPDATE_TOAST_KEY, "1");
          showToast(content.toasts.updateAvailable, "info", {
            actionLabel: content.toasts.updateCta,
            duration: null,
            onAction: () => {
              if (sessionStorage.getItem(SW_UPDATE_RELOAD_KEY)) {
                return;
              }
              sessionStorage.setItem(SW_UPDATE_RELOAD_KEY, "1");
              const reloadOnce = () => {
                navigator.serviceWorker.removeEventListener("controllerchange", reloadOnce);
                window.location.reload();
              };
              navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);
              waitingWorker.postMessage({ type: "SKIP_WAITING" });
            },
          });
        };
        if (registration.waiting && navigator.serviceWorker.controller) {
          showUpdateToast();
        }
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) {
            return;
          }
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              showUpdateToast();
            }
          });
        });
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
initDataRetryHandling();
initData();
initFooterAfterFirstRoute();
initRoutes();
initRouteScrollHandling();
initRouteClickTracking();
initResizeHandling();
initConnectivityFeedback();
updateHeaderOffset();
focusMain({ preventScroll: true });
registerServiceWorker();

initKeyboardShortcuts({
  getSearchInput: () => document.querySelector('input[type="search"]'),
  closeModal,
  navigateToAuth: () => {
    const user = selectors.user(store.getState());
    const target = user ? "#/account" : "#/auth";
    if (!target) {
      return false;
    }
    navigateHash(target, { force: true });
    return true;
  },
});
