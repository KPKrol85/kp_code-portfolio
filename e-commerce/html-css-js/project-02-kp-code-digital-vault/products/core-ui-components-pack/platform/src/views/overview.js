import { t } from "../i18n.js";
import { createEl, setChildren } from "../ui/dom.js";

export const renderOverview = () => {
  const cardOne = createEl("div", { className: "card" });
  setChildren(cardOne, [
    createEl("h3", { text: t("overview.purposeTitle") }),
    createEl("p", { text: t("overview.purposeText") }),
  ]);

  const cardTwo = createEl("div", { className: "card" });
  const list = createEl("ul", { className: "list" });

  const insideItems = t("overview.insideBullets");
  (Array.isArray(insideItems) ? insideItems : []).forEach((item) => {
    list.appendChild(createEl("li", { text: item }));
  });

  setChildren(cardTwo, [createEl("h3", { text: t("overview.insideTitle") }), list]);

  const cardThree = createEl("div", { className: "card" });
  setChildren(cardThree, [
    createEl("h3", { text: t("overview.nextTitle") }),
    createEl("p", { text: t("overview.nextText") }),
  ]);

  const body = createEl("div", { className: "main" });
  setChildren(body, [cardOne, cardTwo, cardThree]);

  return {
    title: t("overview.title"),
    description: t("overview.description"),
    body,
  };
};
