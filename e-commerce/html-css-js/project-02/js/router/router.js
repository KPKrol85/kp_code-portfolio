import { updateActiveNav } from "../components/header.js";
import { setMeta } from "../utils/meta.js";
import { authService } from "../services/auth.js";
import { store } from "../store/store.js";
import { canAccessRoute } from "../utils/permissions.js";
import { createElement, clearElement } from "../utils/dom.js";
import { createRetryButton, renderNotice } from "../components/uiStates.js";
import { consumeNavigationSource, navigateHash, parseHash } from "../utils/navigation.js";
import { selectors } from "../store/selectors.js";
import { onRouteChange } from "./routeEffects.js";

const routes = [];
let activeCleanup = null;
const routeModuleCache = new Map();

const loadRouteModule = async (route) => {
  if (!route?.loader) {
    return null;
  }
  if (routeModuleCache.has(route.loader)) {
    return routeModuleCache.get(route.loader);
  }
  const loadPromise = route
    .loader()
    .then((module) => {
      routeModuleCache.set(route.loader, module);
      return module;
    })
    .catch((error) => {
      routeModuleCache.delete(route.loader);
      throw error;
    });
  routeModuleCache.set(route.loader, loadPromise);
  return loadPromise;
};

const resolveRouteHandler = (route, module) => {
  if (typeof route.getHandler === "function") {
    return route.getHandler(module);
  }
  return route.handler;
};

const renderRouteLoading = (main) => {
  if (!main) {
    return;
  }
  clearElement(main);
  const container = createElement("section", { className: "container" });
  const notice = renderNotice(container, {
    title: "Ładowanie",
    message: "Ładowanie widoku...",
  });
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  main.appendChild(container);
};

const getRouteErrorMessage = (error) => {
  if (error?.message) {
    return `Nie udało się załadować widoku. Szczegóły: ${error.message}`;
  }
  return "Nie udało się załadować widoku. Spróbuj ponownie.";
};

const renderRouteLoadError = (main, { error, onRetry } = {}) => {
  if (!main) {
    return;
  }
  clearElement(main);
  const container = createElement("section", { className: "container" });
  const retryButton = createRetryButton();
  if (typeof onRetry === "function") {
    retryButton.addEventListener("click", onRetry);
  }
  const notice = renderNotice(container, {
    title: "Nie udało się załadować widoku",
    message: getRouteErrorMessage(error),
    action: { element: retryButton },
  });
  notice.setAttribute("role", "alert");
  main.appendChild(container);
};

export const addRoute = (pattern, handler, meta, options = {}) => {
  routes.push({ pattern, handler, meta, ...options });
};

const matchRoute = (path) => {
  for (const route of routes) {
    const match = path.match(route.pattern);
    if (match) {
      return { ...route, params: match.groups || {} };
    }
  }
  return null;
};

export const updateMeta = (title, description) => {
  setMeta({ title, description });
};

export const startRouter = () => {
  let hasHandledRoute = false;

  const resolveRouteSource = () => {
    const source = consumeNavigationSource();
    if (source !== "unknown") {
      return source;
    }
    return hasHandledRoute ? "pop" : "unknown";
  };

  const notifyRouteRendered = ({ pathname, queryParams, path, source }) => {
    onRouteChange({ pathname, queryParams, source });
    window.dispatchEvent(
      new CustomEvent("route:after", {
        detail: { path },
      })
    );
    hasHandledRoute = true;
  };

  const handleRoute = async () => {
    if (typeof activeCleanup === "function") {
      activeCleanup();
      activeCleanup = null;
    }
    const { pathname, queryString, queryParams } = parseHash(location.hash);
    const source = resolveRouteSource();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
    const access = canAccessRoute(pathname, selectors.user(store.getState()));
    if (!access.allowed) {
      if (access.reason === "unauthenticated") {
        authService.setReturnTo(`#${fullPath}`);
        if (pathname !== "/auth") {
          const nextParam = encodeURIComponent(fullPath);
          navigateHash(`#/auth?next=${nextParam}`);
          return;
        }
      } else if (access.reason === "forbidden" || access.reason === "admin-disabled") {
        const isAdminDisabled = access.reason === "admin-disabled";
        const title = isAdminDisabled ? "Administracja niedostępna" : "Brak uprawnień";
        const message = isAdminDisabled
          ? "Panel administracyjny wymaga weryfikacji po stronie backendu. W trybie demo jest niedostępny."
          : "Nie masz uprawnień do tej sekcji.";
        setMeta({
          title,
          description: message,
        });
        const main = document.getElementById("main-content");
        if (main) {
          clearElement(main);
          const container = createElement("section", { className: "container" });
          renderNotice(container, {
            title,
            message,
            action: { label: "Wróć na stronę główną", href: "#/" },
            headingTag: "h2",
          });
          main.appendChild(container);
        }
        updateActiveNav("");
        notifyRouteRendered({ pathname, queryParams, path: fullPath, source });
        return;
      }
    }
    const route = matchRoute(pathname);
    if (route) {
      if (route.meta) {
        updateMeta(route.meta.title, route.meta.description);
      }
      const main = document.getElementById("main-content");
      if (route.loader) {
        renderRouteLoading(main);
      }
      let handler = route.handler;
      if (route.loader) {
        try {
          const module = await loadRouteModule(route);
          handler = resolveRouteHandler(route, module);
        } catch (error) {
          console.error("Failed to load route module:", error);
          renderRouteLoadError(main, {
            error,
            onRetry: () => {
              renderRouteLoading(main);
              runHandleRoute();
            },
          });
          updateActiveNav(`#${pathname === "/" ? "/" : pathname}`);
          notifyRouteRendered({ pathname, queryParams, path: fullPath, source });
          return;
        }
      }
      if (typeof handler === "function") {
        const cleanup = handler(route.params);
        if (typeof cleanup === "function") {
          activeCleanup = cleanup;
        }
      }
      updateActiveNav(`#${pathname === "/" ? "/" : pathname}`);
      notifyRouteRendered({ pathname, queryParams, path: fullPath, source });
    } else {
      const fallback = routes.find((item) => item.pattern.source === "^/404$");
      if (fallback) {
        const notFoundPath = "/404";
        let handler = fallback.handler;
        if (fallback.loader) {
          const main = document.getElementById("main-content");
          renderRouteLoading(main);
          try {
            const module = await loadRouteModule(fallback);
            handler = resolveRouteHandler(fallback, module);
          } catch (error) {
            console.error("Failed to load route module:", error);
            renderRouteLoadError(main, {
              error,
              onRetry: () => {
                renderRouteLoading(main);
                runHandleRoute();
              },
            });
            updateActiveNav("");
            notifyRouteRendered({
              pathname: notFoundPath,
              queryParams: {},
              path: notFoundPath,
              source,
            });
            return;
          }
        }
        if (typeof handler === "function") {
          const cleanup = handler({});
          if (typeof cleanup === "function") {
            activeCleanup = cleanup;
          }
        }
        updateMeta(fallback.meta.title, fallback.meta.description);
        updateActiveNav("");
        notifyRouteRendered({
          pathname: notFoundPath,
          queryParams: {},
          path: notFoundPath,
          source,
        });
      }
    }
  };

  const runHandleRoute = () => {
    handleRoute().catch((error) => {
      console.error("Route handler failed:", error);
    });
  };

  window.addEventListener("hashchange", runHandleRoute);
  runHandleRoute();
};
