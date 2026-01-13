import { createElement } from "../utils/dom.js";

let activeModal = null;

const getFocusable = (container) =>
  Array.from(
    container.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )
  );

export const closeModal = () => {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
};

export const showModal = ({ title, description, content }) => {
  closeModal();
  const backdrop = createElement("div", { className: "modal-backdrop" });
  const modal = createElement("div", {
    className: "modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-title",
      "aria-describedby": "modal-desc",
    },
  });

  const header = createElement("div", { className: "flex-between" }, [
    createElement("h2", { text: title, attrs: { id: "modal-title" } }),
    createElement("button", {
      className: "button ghost",
      text: "Zamknij",
      attrs: { type: "button" },
    }),
  ]);

  header.querySelector("button").addEventListener("click", closeModal);

  const descriptionEl = createElement("p", { text: description, attrs: { id: "modal-desc" } });
  modal.appendChild(header);
  modal.appendChild(descriptionEl);
  if (content) {
    modal.appendChild(content);
  }

  backdrop.appendChild(modal);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeModal();
    }
  });

  backdrop.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
    if (event.key === "Tab") {
      const focusable = getFocusable(modal);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.getElementById("modal-root").appendChild(backdrop);
  activeModal = backdrop;
  const focusable = getFocusable(modal);
  if (focusable.length > 0) {
    focusable[0].focus();
  }
};
