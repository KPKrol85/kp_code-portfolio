import { routes } from "./routes.js";

const matchRoute = (hash) => {
  const clean = hash.replace(/^#/, "") || "/dashboard";
  for (const route of routes) {
    const paramNames = [];
    const regexPath = route.path.replace(/:[^/]+/g, (match) => {
      paramNames.push(match.slice(1));
      return "([^/]+)";
    });
    const regex = new RegExp(`^${regexPath}$`);
    const match = clean.match(regex);
    if (match) {
      const params = paramNames.reduce((acc, name, idx) => {
        acc[name] = match[idx + 1];
        return acc;
      }, {});
      return { ...route, params, path: clean };
    }
  }
  return { path: "/dashboard", page: "dashboard", params: {} };
};

export const createRouter = (onRoute) => {
  const handleRoute = () => {
    const hash = window.location.hash || "#/dashboard";
    const match = matchRoute(hash);
    onRoute(match);
  };

  window.addEventListener("hashchange", handleRoute);
  handleRoute();

  return { navigate: (path) => (window.location.hash = path) };
};
