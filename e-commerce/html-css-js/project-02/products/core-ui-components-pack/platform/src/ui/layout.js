import { createEl, setChildren } from "./dom.js";

// Build the shell layout (sidebar + content).
export const renderLayout = (root, navItems) => {
  const shell = createEl("div", { className: "shell" });
  const sidebar = createEl("aside", { className: "sidebar" });
  const content = createEl("section", { className: "content" });

  const brand = createEl("div", { className: "brand" });
  const title = createEl("h1", { text: "Core UI Components Pack" });
  const desc = createEl("p", { text: "Stripe-like shell for core UI assets." });
  const badge = createEl("span", { className: "badge", text: "Pack 01" });
  setChildren(brand, [title, desc, badge]);

  const nav = createEl("nav");
  const navLinks = navItems.map((item) => {
    const link = createEl("a", {
      className: "nav-item",
      attrs: { href: `#/${item.route}`, "data-route": item.route },
    });
    const dot = createEl("span", { text: "•" });
    const label = createEl("span", { text: item.label });
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
  const viewTitle = createEl("h2");
  const viewDesc = createEl("p");
  setChildren(titleBlock, [viewTitle, viewDesc]);

  const downloadButton = createEl("a", {
    className: "button",
    text: "Download CSS",
    attrs: { href: "#/download" },
  });

  setChildren(topbar, [titleBlock, downloadButton]);

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
