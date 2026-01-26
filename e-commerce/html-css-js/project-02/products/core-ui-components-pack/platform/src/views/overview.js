import { createEl, setChildren } from "../ui/dom.js";

export const renderOverview = () => {
  const cardOne = createEl("div", { className: "card" });
  setChildren(cardOne, [
    createEl("h3", { text: "Purpose" }),
    createEl("p", { text: "Centralize UI component rules and layouts for fast product builds." }),
  ]);

  const cardTwo = createEl("div", { className: "card" });
  const list = createEl("ul", { className: "list" });
  ["Base layout patterns", "Component placeholders", "Downloadable CSS pack"].forEach((item) => {
    list.appendChild(createEl("li", { text: item }));
  });
  setChildren(cardTwo, [createEl("h3", { text: "What's inside" }), list]);

  const cardThree = createEl("div", { className: "card" });
  setChildren(cardThree, [
    createEl("h3", { text: "Next up" }),
    createEl("p", { text: "Finalize tokens, then lock in component-level styles." }),
  ]);

  const body = createEl("div", { className: "main" });
  setChildren(body, [cardOne, cardTwo, cardThree]);

  return {
    title: "Overview",
    description: "Snapshot of the Core UI Components Pack status.",
    body,
  };
};
