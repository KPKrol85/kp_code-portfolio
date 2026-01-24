import { createElement } from "../utils/dom.js";

let activeModal = null;
let lastFocusedElement = null;

const focusableSelector =
  "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

const getFocusable = (container) =>
  Array.from(container.querySelectorAll(focusableSelector)).filter((element) => element !== container);

const isHidden = (element) =>
  element.hidden ||
  element.getAttribute("aria-hidden") === "true" ||
  element.getClientRects().length === 0;

const isDisabled = (element) => "disabled" in element && element.disabled;

const isFocusableElement = (element) =>
  element instanceof HTMLElement &&
  element.matches(focusableSelector) &&
  !isHidden(element) &&
  !isDisabled(element);

const rememberFocus = () => {
  const activeElement = document.activeElement;
  lastFocusedElement = isFocusableElement(activeElement) ? activeElement : null;
};

const getFallbackFocusTarget = () =>
  document.getElementById("main-content") || document.body;

const restoreFocus = () => {
  if (isFocusableElement(lastFocusedElement) && lastFocusedElement.isConnected) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
    return;
  }

  const fallback = getFallbackFocusTarget();
  if (fallback instanceof HTMLElement && !isHidden(fallback) && !isDisabled(fallback)) {
    fallback.focus();
  }
  lastFocusedElement = null;
};

export const closeModal = ({ restoreFocus: shouldRestoreFocus = true } = {}) => {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
    if (shouldRestoreFocus) {
      restoreFocus();
    }
  }
};

export const showModal = ({ title, description, content }) => {
  rememberFocus();
  closeModal({ restoreFocus: false });
  const backdrop = createElement("div", { className: "modal-backdrop" });
  const modal = createElement("div", {
    className: "modal",
    attrs: {
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-title",
      "aria-describedby": "modal-desc",
      tabindex: "-1",
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
  modal.focus({ preventScroll: true });
  const focusable = getFocusable(modal);
  if (focusable.length > 0) {
    focusable[0].focus({ preventScroll: true });
  }
};
