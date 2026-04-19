import { qs, qsa } from "../utils.js";

const getCurrentPage = () => {
  const currentPath = window.location.pathname.split("/").filter(Boolean).pop();
  return currentPath || "index.html";
};

const applyHeaderState = (header) => {
  const currentPage = getCurrentPage();

  qsa('[aria-current="page"]', header).forEach((link) => {
    link.removeAttribute("aria-current");
  });

  const currentPrimaryLink = qs(`.nav__link[href="${currentPage}"]`, header);
  currentPrimaryLink?.setAttribute("aria-current", "page");

  if (currentPage !== "uslugi.html") return;

  const servicesOverviewLink = qs('.nav__dropdown-link[href="uslugi.html"]', header);
  servicesOverviewLink?.setAttribute("aria-current", "page");

  // Keep section links local when the current page already contains the sections.
  qsa('.nav__dropdown-link[href^="uslugi.html#"]', header).forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    link.setAttribute("href", href.slice(hashIndex));
  });
};

const decoratePartial = (host) => {
  if (host.dataset.partial === "header") {
    applyHeaderState(host);
  }
};

const loadPartial = async (host) => {
  const src = host.dataset.partialSrc;
  if (!src) return;

  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to load partial: ${src} (${response.status})`);
    }

    host.innerHTML = await response.text();
    decoratePartial(host);
    host.dataset.partialLoaded = "true";
  } catch (error) {
    console.error(error);
  }
};

export const initPartials = async () => {
  const partialHosts = qsa("[data-partial]");

  if (!partialHosts.length) return;

  await Promise.all(partialHosts.map((host) => loadPartial(host)));
};
