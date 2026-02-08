import { createEl } from "../utils/dom.js";

export const renderEmptyState = ({ title, body, ctaLabel, onCta }) => {
  const wrapper = createEl("div", { className: "empty-state" });
  const heading = createEl("h3", { text: title });
  const text = createEl("p", { text: body });
  wrapper.appendChild(heading);
  wrapper.appendChild(text);
  if (ctaLabel) {
    const button = createEl("button", { className: "button", text: ctaLabel });
    button.addEventListener("click", onCta);
    wrapper.appendChild(button);
  }
  return wrapper;
};
