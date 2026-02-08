const dropdownSelector = "[data-lang-dropdown]";
const triggerSelector = "[data-lang-trigger]";
const menuSelector = "[data-lang-menu]";
const optionSelector = "[data-lang]";
const openClass = "is-open";

const state = {
  listenersBound: false,
  openDropdown: null,
};

const getTrigger = (dropdown) => dropdown?.querySelector(triggerSelector);
const getMenu = (dropdown) => dropdown?.querySelector(menuSelector);
const getFirstOption = (menu) => menu?.querySelector(optionSelector);

const getDebugInfo = (event, dropdown) => {
  const trigger = getTrigger(dropdown);
  const menu = getMenu(dropdown);
  const target = event?.target || null;
  const path = event?.composedPath?.() ?? [];
  return {
    isOpen: trigger?.getAttribute("aria-expanded") === "true",
    target,
    triggerContains: trigger ? trigger.contains(target) : false,
    menuContains: menu ? menu.contains(target) : false,
    inTriggerPath: trigger ? path.includes(trigger) : false,
    inMenuPath: menu ? path.includes(menu) : false,
  };
};

const debugLog = (message, event, dropdown) => {
  if (!window.__DV_DEBUG_DROPDOWN__) {
    return;
  }
  console.log("langDropdown:", message, getDebugInfo(event, dropdown));
};

const closeMenu = (dropdown, { focusTrigger = false, event } = {}) => {
  if (!dropdown) {
    return;
  }
  const trigger = getTrigger(dropdown);
  const menu = getMenu(dropdown);
  if (!trigger || !menu) {
    return;
  }
  trigger.setAttribute("aria-expanded", "false");
  menu.setAttribute("hidden", "");
  dropdown.classList.remove(openClass);
  debugLog("menu close", event, dropdown);
  if (focusTrigger) {
    trigger.focus();
  }
};

const openMenu = (dropdown, event) => {
  if (!dropdown) {
    return;
  }
  const trigger = getTrigger(dropdown);
  const menu = getMenu(dropdown);
  if (!trigger || !menu) {
    return;
  }
  trigger.setAttribute("aria-expanded", "true");
  menu.removeAttribute("hidden");
  dropdown.classList.add(openClass);
  const firstOption = getFirstOption(menu);
  if (firstOption) {
    firstOption.focus();
  }
  state.openDropdown = dropdown;
  debugLog("menu open", event, dropdown);
};

const toggleMenu = (dropdown, event) => {
  if (!dropdown) {
    return;
  }
  const trigger = getTrigger(dropdown);
  if (!trigger) {
    return;
  }
  const isOpen = trigger.getAttribute("aria-expanded") === "true";
  if (isOpen) {
    closeMenu(dropdown, { focusTrigger: true, event });
    state.openDropdown = null;
    return;
  }
  if (state.openDropdown && state.openDropdown !== dropdown) {
    closeMenu(state.openDropdown, { event });
  }
  openMenu(dropdown, event);
};

const handleDocumentClick = (event) => {
  const target = event.target;
  const trigger = target.closest(triggerSelector);
  if (trigger) {
    debugLog("trigger click", event, trigger.closest(dropdownSelector));
    toggleMenu(trigger.closest(dropdownSelector), event);
    return;
  }

  const option = target.closest(optionSelector);
  if (option) {
    const dropdown = option.closest(dropdownSelector);
    closeMenu(dropdown, { focusTrigger: true, event });
    state.openDropdown = null;
    return;
  }

  if (!state.openDropdown) {
    return;
  }

  const menu = getMenu(state.openDropdown);
  const openTrigger = getTrigger(state.openDropdown);
  const path = event.composedPath?.() ?? [];
  const inTrigger = openTrigger ? path.includes(openTrigger) : false;
  const inMenu = menu ? path.includes(menu) : false;

  if (inTrigger || inMenu) {
    return;
  }

  debugLog("document click outside detected", event, state.openDropdown);
  closeMenu(state.openDropdown, { focusTrigger: true, event });
  state.openDropdown = null;
};

const handleDocumentKeydown = (event) => {
  if (event.key === "Escape" && state.openDropdown) {
    debugLog("keydown ESC detected", event, state.openDropdown);
    closeMenu(state.openDropdown, { focusTrigger: true, event });
    state.openDropdown = null;
    return;
  }

  const target = event.target;
  const trigger = target.closest(triggerSelector);
  if (!trigger) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    openMenu(trigger.closest(dropdownSelector), event);
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleMenu(trigger.closest(dropdownSelector), event);
  }
};

const bindGlobalListeners = () => {
  if (state.listenersBound) {
    return;
  }
  state.listenersBound = true;
  document.addEventListener("click", handleDocumentClick, true);
  document.addEventListener("keydown", handleDocumentKeydown, true);
};

export const initLangDropdown = ({ root = document } = {}) => {
  if (!root) {
    return;
  }
  bindGlobalListeners();
  root.querySelectorAll(dropdownSelector).forEach((dropdown) => {
    if (dropdown.dataset.langDropdownReady === "true") {
      return;
    }
    dropdown.dataset.langDropdownReady = "true";
    const trigger = getTrigger(dropdown);
    const menu = getMenu(dropdown);
    if (!trigger || !menu) {
      return;
    }
    trigger.setAttribute("aria-expanded", "false");
    menu.setAttribute("hidden", "");
  });
};

initLangDropdown({ root: document });
