import { updateActiveNav } from "../components/header.js";

const routes = [];

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
  document.title = title;
  const metaDescription = document.getElementById("meta-description");
  if (metaDescription) {
    metaDescription.setAttribute("content", description);
  }
};

export const startRouter = () => {
  const handleRoute = () => {
    const path = location.hash.replace("#", "") || "/";
    const route = matchRoute(path);
    if (route) {
      if (route.meta) {
        updateMeta(route.meta.title, route.meta.description);
      }
      route.handler(route.params);
      updateActiveNav(`#${path === "/" ? "/" : path}`);
    } else {
      const fallback = routes.find((item) => item.pattern.source === "^/404$");
      if (fallback) {
        fallback.handler({});
        updateMeta(fallback.meta.title, fallback.meta.description);
        updateActiveNav("");
      }
    }
  };

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
};
