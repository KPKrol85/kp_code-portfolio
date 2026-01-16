import { updateActiveNav } from "../components/header.js";
import { setMeta } from "../utils/meta.js";
import { authService } from "../services/auth.js";
import { store } from "../store/store.js";
import { canAccessRoute } from "../utils/permissions.js";
import { createElement, clearElement } from "../utils/dom.js";
import { renderNotice } from "../components/uiStates.js";
import { navigateHash } from "../utils/navigation.js";

const routes = [];
let activeCleanup = null;

export const addRoute = (pattern, handler, meta) => {
  routes.push({ pattern, handler, meta });
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
  const notifyRouteRendered = (path) => {
    window.dispatchEvent(
      new CustomEvent("route:after", {
        detail: { path },
      })
    );
  };

  const handleRoute = () => {
    if (typeof activeCleanup === "function") {
      activeCleanup();
      activeCleanup = null;
    }
    const path = location.hash.replace("#", "") || "/";
    const access = canAccessRoute(path, store.getState().user);
    if (!access.allowed) {
      if (access.reason === "unauthenticated") {
        authService.setReturnTo(`#${path}`);
        if (path !== "/auth") {
          navigateHash("#/auth");
          return;
        }
      } else if (access.reason === "forbidden") {
        setMeta({
          title: "Brak uprawnien",
          description: "Nie masz uprawnien do tej sekcji.",
        });
        const main = document.getElementById("main-content");
        if (main) {
          clearElement(main);
          const container = createElement("section", { className: "container" });
          renderNotice(container, {
            title: "Brak uprawnien",
            message: "Nie masz uprawnien do tej sekcji.",
            action: { label: "Wroc na strone glowna", href: "#/" },
            headingTag: "h2",
          });
          main.appendChild(container);
        }
        updateActiveNav("");
        notifyRouteRendered(path);
        return;
      }
    }
    const route = matchRoute(path);
    if (route) {
      if (route.meta) {
        updateMeta(route.meta.title, route.meta.description);
      }
      const cleanup = route.handler(route.params);
      if (typeof cleanup === "function") {
        activeCleanup = cleanup;
      }
      updateActiveNav(`#${path === "/" ? "/" : path}`);
      notifyRouteRendered(path);
    } else {
      const fallback = routes.find((item) => item.pattern.source === "^/404$");
      if (fallback) {
        const cleanup = fallback.handler({});
        if (typeof cleanup === "function") {
          activeCleanup = cleanup;
        }
        updateMeta(fallback.meta.title, fallback.meta.description);
        updateActiveNav("");
        notifyRouteRendered("/404");
      }
    }
  };

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
};
