import { createEl, setChildren } from "../ui/dom.js";

export const renderComingSoon = (label) => {
  const wrap = createEl("div", { className: "empty-state" });
  setChildren(wrap, [
    createEl("h3", { text: `${label} — Coming soon` }),
    createEl("p", { text: "This section is queued for a future drop in Pack 01." }),
  ]);

  const link = createEl("a", {
    className: "button",
    text: "Jump to Download",
    attrs: { href: "#/download" },
  });
  wrap.appendChild(link);

  const body = createEl("div", { className: "main" });
  body.appendChild(wrap);

  return {
    title: label,
    description: "Placeholder until the module is shipped.",
    body,
  };
};
