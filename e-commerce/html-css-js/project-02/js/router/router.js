import { updateActiveNav } from "../components/header.js";
import { setMeta } from "../utils/meta.js";

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
  const handleRoute = () => {
    if (typeof activeCleanup === "function") {
      activeCleanup();
      activeCleanup = null;
    }
    const path = location.hash.replace("#", "") || "/";
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
    } else {
      const fallback = routes.find((item) => item.pattern.source === "^/404$");
      if (fallback) {
        const cleanup = fallback.handler({});
        if (typeof cleanup === "function") {
          activeCleanup = cleanup;
        }
        updateMeta(fallback.meta.title, fallback.meta.description);
        updateActiveNav("");
      }
    }
  };

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
};
