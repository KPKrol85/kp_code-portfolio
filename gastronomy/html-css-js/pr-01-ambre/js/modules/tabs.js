import { $, $$, byTestId, log } from "./utils.js";

export function initTabs() {
  const grid = document.querySelector(".menu__grid, .menu-grid");
  if (!grid) return;

  const root = byTestId("menu-tabs") || grid.closest("section") || document;
  const tabs = $$(".tabs__tab", root);
  if (!tabs.length) return;

  const dishes = $$(".dish", grid);
  if (!dishes.length) return;

  const normalize = (value) =>
    (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  if (root !== document && !root.hasAttribute("role")) {
    root.setAttribute("role", "tablist");
  }

  tabs.forEach((tab) => {
    if (!tab.hasAttribute("role")) tab.setAttribute("role", "tab");
  });

  const apply = (tab) => {
    tabs.forEach((btn) => {
      const isActive = btn === tab;
      btn.classList.toggle("tabs__tab--active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
      btn.tabIndex = isActive ? 0 : -1;
    });

    const filter = normalize(tab?.dataset?.filter || "");
    const showAll = filter === "" || filter === "all";
    dishes.forEach((dish) => {
      const raw = dish.dataset.cat || dish.dataset.filter || "";
      const normalized = normalize(raw).split(/[\s,]+/).filter(Boolean);
      const matches = showAll || normalized.includes(filter);
      const loadVisible = dish.dataset.loadHidden !== "true";
      dish.hidden = !(matches && loadVisible);
    });
  };

  apply($(".tabs__tab.tabs__tab--active", root) || tabs[0]);

  root.addEventListener(
    "click",
    (event) => {
      const tab = event.target.closest(".tabs__tab");
      if (tab && tabs.includes(tab)) apply(tab);
    },
    { passive: true }
  );

  root.addEventListener("keydown", (event) => {
    const tab = event.target.closest(".tabs__tab");
    if (!tab || !tabs.includes(tab)) return;

    const index = tabs.indexOf(tab);
    const focusTab = (nextIndex) => tabs[(nextIndex + tabs.length) % tabs.length].focus();

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      tabs[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      tabs[tabs.length - 1].focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      apply(tab);
    }
  });

  log(byTestId("menu-tabs"), tabs.length);
}

export function initGalleryFilter() {
  const page = document.querySelector("main.page-gallery");
  if (!page) return;

  const tabsRoot = page.querySelector(".gallery__tabs");
  if (!tabsRoot) return;

  const tabs = Array.from(tabsRoot.querySelectorAll(".tabs__tab"));
  const items = Array.from(page.querySelectorAll(".gallery__section .gallery__item"));

  const normalize = (value) =>
    (value || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const apply = (tab) => {
    tabs.forEach((btn) => {
      const isActive = btn === tab;
      btn.setAttribute("aria-selected", String(isActive));
      btn.classList.toggle("tabs__tab--active", isActive);
    });

    tabs.forEach((btn) => {
      btn.setAttribute("tabindex", btn === tab ? "0" : "-1");
    });

    const filter = normalize(tab.dataset.filter || "");
    const showAll = filter === "" || filter === "all";

    items.forEach((item) => {
      const raw = item.dataset.cat || item.dataset.filter || "";
      const normalized = normalize(raw).split(/[\s,]+/).filter(Boolean);
      const matches = showAll || normalized.includes(filter);
      const loadVisible = item.dataset.loadHidden !== "true";
      item.hidden = !(loadVisible && matches);
    });

    tab.focus();
  };

  const focusTab = (index) => {
    const nextIndex = (index + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
  };

  tabsRoot.addEventListener("keydown", (event) => {
    const key = event.key;
    const active = document.activeElement;
    const index = tabs.indexOf(active);
    if (index === -1) return;

    if (key === "ArrowRight" || key === "ArrowLeft") {
      event.preventDefault();
      focusTab(key === "ArrowRight" ? index + 1 : index - 1);
      return;
    }

    if (key === "Home") {
      event.preventDefault();
      focusTab(0);
      return;
    }

    if (key === "End") {
      event.preventDefault();
      focusTab(tabs.length - 1);
      return;
    }

    if (key === "Enter" || key === " " || key === "Spacebar") {
      event.preventDefault();
      apply(active);
      return;
    }

    if (key === "Escape") active.blur();
  });

  tabs.forEach((tab) => tab.addEventListener("click", () => apply(tab)));

  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "tab");
    const selected = tab.getAttribute("aria-selected");
    const isActive = selected ? selected === "true" : index === 0;
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });

  const activeTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
  if (activeTab) apply(activeTab);

  log(tabs.length, items.length);
}
