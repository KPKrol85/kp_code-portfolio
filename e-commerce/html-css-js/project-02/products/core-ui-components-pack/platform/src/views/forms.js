import { createEl, setChildren } from "../ui/dom.js";

export const renderForms = () => {
  const cardOne = createEl("div", { className: "card" });
  setChildren(cardOne, [
    createEl("h3", { text: "Form layouts" }),
    createEl("p", { text: "Grid and stack patterns for key product flows." }),
  ]);

  const cardTwo = createEl("div", { className: "card" });
  setChildren(cardTwo, [
    createEl("h3", { text: "Validation" }),
    createEl("p", { text: "Guidelines for inline, summary, and success messaging." }),
  ]);

  const cardThree = createEl("div", { className: "card" });
  setChildren(cardThree, [
    createEl("h3", { text: "Content model" }),
    createEl("p", { text: "Define label, hint, and helper text expectations." }),
  ]);

  const body = createEl("div", { className: "main" });
  setChildren(body, [cardOne, cardTwo, cardThree]);

  return {
    title: "Forms",
    description: "Structure the form system and UX rules.",
    body,
  };
};
