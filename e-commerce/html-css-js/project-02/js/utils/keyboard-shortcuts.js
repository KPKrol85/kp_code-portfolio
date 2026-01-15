const isEditableTarget = (target) => {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select";
};

const focusSearch = (getSearchInput) => {
  if (!getSearchInput) {
    return false;
  }
  const input = getSearchInput();
  if (!input) {
    return false;
  }
  if (typeof input.scrollIntoView === "function") {
    input.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  input.focus();
  if (input.value) {
    input.select();
  }
  return true;
};

const resetUi = ({ closeModal }) => {
  if (typeof closeModal === "function") {
    closeModal();
  }
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
};

const initKeyboardShortcuts = ({ getSearchInput, closeModal, navigateToAuth } = {}) => {
  if (window.__keyboardShortcutsReady) {
    return;
  }
  window.__keyboardShortcutsReady = true;

  window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey) {
      return;
    }
    const target = event.target;
    const isEditable = isEditableTarget(target);
    const key = event.key;

    if (key === "/" && !event.altKey) {
      if (isEditable) {
        return;
      }
      if (focusSearch(getSearchInput)) {
        event.preventDefault();
      }
      return;
    }

    if (key === "Escape") {
      if (isEditable) {
        return;
      }
      resetUi({ closeModal });
      return;
    }

    if ((key === "l" || key === "L") && event.altKey) {
      if (isEditable) {
        return;
      }
      if (typeof navigateToAuth === "function") {
        const handled = navigateToAuth();
        if (!handled) {
          console.warn("[keyboard] Alt+L not handled.");
        }
      }
    }
  });
};

export { initKeyboardShortcuts };
