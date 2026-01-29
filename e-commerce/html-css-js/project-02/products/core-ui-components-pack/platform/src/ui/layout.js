import { createEl, setChildren } from "./dom.js";

const ICON_SUN = `
<svg xmlns="http://www.w3.org/2000/svg"
  width="18" height="18"
  viewBox="0 0 24 24"
  fill="none" stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round" stroke-linejoin="round"
  aria-hidden="true">
  <path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
</svg>
`;

const ICON_MOON = `
<svg xmlns="http://www.w3.org/2000/svg"
  width="18" height="18"
  viewBox="0 0 24 24"
  fill="none" stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round" stroke-linejoin="round"
  aria-hidden="true">
  <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
</svg>
`;

const ICON_DOWNLOAD = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
  stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
</svg>
`;

const updateThemeIcon = (btn) => {
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  btn.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;
};

const updateBrandMarkTheme = (imgEl) => {
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  imgEl.src =
    theme === "dark" ? "/assets/logo/logo-light-mode.svg" : "/assets/logo/logo-dark-mode.svg";
};

export const renderLayout = (root, navItems) => {
  const shell = createEl("div", { className: "shell" });
  const sidebar = createEl("aside", { className: "sidebar" });
  const content = createEl("section", { className: "content" });

  const brand = createEl("div", { className: "brand" });
  const brandMark = createEl("img", { className: "brand-mark" });
  brandMark.alt = "KP_Code";

  updateBrandMarkTheme(brandMark);

  const title = createEl("h1", { text: "Core UI Components Pack" });
  setChildren(brand, [brandMark, title]);

  const nav = createEl("nav");
  const navLinks = navItems.map((item) => {
    const link = createEl("a", {
      className: "nav-item",
      attrs: { href: `#/${item.route}`, "data-route": item.route },
    });

    const dot = createEl("span", { className: "nav-dot", text: "•" });
    const label = createEl("span", { className: "nav-label", text: item.label });

    setChildren(link, [dot, label]);

    if (item.status === "soon") {
      const soon = createEl("span", { text: "Soon" });
      link.appendChild(soon);
    }

    return link;
  });

  navLinks.forEach((link) => nav.appendChild(link));

  const topbar = createEl("div", { className: "topbar" });
  const titleBlock = createEl("div", { className: "title-block" });

  const titleRow = createEl("div", { className: "title-row" });
  const viewTitle = createEl("h2");
  const viewAction = createEl("a", {
    className: "pack-download",
    attrs: {
      href: "#/download",
      "aria-label": "Download section CSS",
      title: "Download CSS",
    },
  });
  viewAction.innerHTML = ICON_DOWNLOAD;

  setChildren(titleRow, [viewTitle, viewAction]);

  const viewDesc = createEl("p");
  setChildren(titleBlock, [titleRow, viewDesc]);

  const themeButton = createEl("button", {
    className: "theme-toggle",
    attrs: { type: "button", "aria-label": "Toggle theme" },
  });

  themeButton.addEventListener("click", () => {
    window.toggleTheme();
    updateThemeIcon(themeButton);
    updateBrandMarkTheme(brandMark);
  });

  updateThemeIcon(themeButton);

  const langButton = createEl("button", {
    className: "lang-toggle",
    text: localStorage.getItem("coreui_lang") || "en",
    attrs: { type: "button", title: "Change language" },
  });

  langButton.addEventListener("click", () => {
    const next = langButton.textContent === "en" ? "pl" : "en";
    localStorage.setItem("coreui_lang", next);
    window.__renderRoute();
    langButton.textContent = next;
  });

  const actions = createEl("div", { className: "topbar-actions" });
  setChildren(actions, [langButton, themeButton]);

  setChildren(topbar, [titleBlock, actions]);

  const main = createEl("div", { className: "main" });

  setChildren(sidebar, [brand, nav]);
  setChildren(content, [topbar, main]);
  setChildren(shell, [sidebar, content]);

  root.appendChild(shell);

  return {
    navLinks,
    viewTitle,
    viewDesc,
    main,
  };
};
