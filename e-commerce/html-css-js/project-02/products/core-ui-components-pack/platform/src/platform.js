
import { navItems } from "./config/nav.js";
import { clear } from "./ui/dom.js";
import { renderLayout } from "./ui/layout.js";
import { renderButtons } from "./views/buttons.js";
import { renderComingSoon } from "./views/comingSoon.js";
import { renderDownload } from "./views/download.js";
import { renderForms } from "./views/forms.js";
import { renderInputs } from "./views/inputs.js";
import { renderOverview } from "./views/overview.js";

// Route table for ready views.
const routes = {
  overview: renderOverview,
  buttons: renderButtons,
  forms: renderForms,
  inputs: renderInputs,
  download: renderDownload,
};

const root = document.getElementById("app");
const { navLinks, viewTitle, viewDesc, main } = renderLayout(root, navItems);

// Highlight the active nav item.
const setActiveLink = (route) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === route);
  });
};

// Hash-based router with fallback to overview.
const renderRoute = () => {
  const raw = window.location.hash.replace("#/", "").trim();
  const route = raw || "overview";
  const navItem = navItems.find((item) => item.route === route) || navItems[0];
  const isReady = navItem.status === "ready";
  const view = isReady ? routes[navItem.route] : null;
  const payload = view ? view() : renderComingSoon(navItem.label);

  viewTitle.textContent = payload.title;
  viewDesc.textContent = payload.description;

  clear(main);
  main.appendChild(payload.body);

  setActiveLink(navItem.route);
};

if (!window.location.hash) {
  window.location.hash = "#/overview";
}

window.addEventListener("hashchange", renderRoute);
renderRoute();
