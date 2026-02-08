import { createEl, setChildren } from "../ui/dom.js";

export const renderDownload = () => {
  const intro = createEl("div", { className: "card" });
  setChildren(intro, [
    createEl("h3", { text: "Core UI Components Pack" }),
    createEl("p", { text: "Download the current CSS package and plug it into your HTML." }),
  ]);

  const downloadCard = createEl("div", { className: "card" });
  const downloadLink = createEl("a", {
    className: "button",
    text: "Download core-ui-components-pack.css",
    attrs: {
      href: "../package/core-ui-components-pack.css",
      download: "core-ui-components-pack.css",
    },
  });
  const path = createEl("p", {
    text: "File path: products/core-ui-components-pack/package/core-ui-components-pack.css",
  });
  setChildren(downloadCard, [downloadLink, path]);

  const usage = createEl("div", { className: "card" });
  const code = createEl("pre", { className: "code-block" });
  code.innerHTML = `&lt;link rel="stylesheet" href="./package/core-ui-components-pack.css" /&gt;`;
  setChildren(usage, [createEl("h3", { text: "Usage" }), code]);

  const body = createEl("div", { className: "main" });
  setChildren(body, [intro, downloadCard, usage]);

  return {
    title: "Download",
    description: "Grab the CSS package for integration.",
    body,
  };
};
