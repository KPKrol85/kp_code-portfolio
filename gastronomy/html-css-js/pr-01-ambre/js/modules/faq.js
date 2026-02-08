import { log } from "./utils.js";

export function initFaqAria() {
  const section = document.getElementById("faq") || document.querySelector(".faq");
  if (!section) return;

  const items = section.querySelectorAll("details");
  if (!items.length) return;

  items.forEach((item, index) => {
    const summary = item.querySelector("summary");
    if (!summary) return;

    const content = item.querySelector(".content");
    if (content && !content.id) {
      content.id = `faqp-${index}-${Math.random().toString(36).slice(2)}`;
    }

    if (content && !summary.hasAttribute("aria-controls")) {
      summary.setAttribute("aria-controls", content.id);
    }

    const update = () => {
      summary.setAttribute("aria-expanded", item.hasAttribute("open") ? "true" : "false");
    };

    item.addEventListener("toggle", update);
    update();
  });

  log(items.length);
}