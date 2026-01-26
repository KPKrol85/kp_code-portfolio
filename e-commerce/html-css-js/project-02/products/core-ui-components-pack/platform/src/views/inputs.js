import { createEl, setChildren } from "../ui/dom.js";

export const renderInputs = () => {
  const cardOne = createEl("div", { className: "card" });
  setChildren(cardOne, [
    createEl("h3", { text: "Input types" }),
    createEl("p", { text: "Catalog text, number, date, and masked variants." }),
  ]);

  const cardTwo = createEl("div", { className: "card" });
  setChildren(cardTwo, [
    createEl("h3", { text: "Spacing" }),
    createEl("p", { text: "Consistent padding and label placement rules." }),
  ]);

  const cardThree = createEl("div", { className: "card" });
  setChildren(cardThree, [
    createEl("h3", { text: "Accessibility" }),
    createEl("p", { text: "Focus treatment and input messaging checklist." }),
  ]);

  const body = createEl("div", { className: "main" });
  setChildren(body, [cardOne, cardTwo, cardThree]);

  return {
    title: "Inputs",
    description: "Define the core input field library.",
    body,
  };
};
