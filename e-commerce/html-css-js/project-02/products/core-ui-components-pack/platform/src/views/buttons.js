import { createEl, setChildren } from "../ui/dom.js";

export const renderButtons = () => {
  const cardOne = createEl("div", { className: "card" });
  setChildren(cardOne, [
    createEl("h3", { text: "Button inventory" }),
    createEl("p", { text: "Outline the button set, states, and sizing rules." }),
  ]);

  const cardTwo = createEl("div", { className: "card" });
  setChildren(cardTwo, [
    createEl("h3", { text: "States" }),
    createEl("p", { text: "Primary, secondary, ghost, and destructive states will land here." }),
  ]);

  const cardThree = createEl("div", { className: "card" });
  setChildren(cardThree, [
    createEl("h3", { text: "Usage notes" }),
    createEl("p", { text: "Document spacing and icon pairing rules before styling." }),
  ]);

  const body = createEl("div", { className: "main" });
  setChildren(body, [cardOne, cardTwo, cardThree]);

  return {
    title: "Buttons",
    description: "Define button roles and UX guidance.",
    body,
  };
};
