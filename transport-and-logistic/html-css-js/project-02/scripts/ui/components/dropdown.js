const Dropdown = (() => {
  const activeHandlers = new WeakMap();
  const registeredForCleanup = new WeakSet();

  const detach = (menu) => {
    const entry = activeHandlers.get(menu);
    if (entry) {
      if (entry.timeoutId) clearTimeout(entry.timeoutId);
      document.removeEventListener("click", entry.handler);
      activeHandlers.delete(menu);
    }
    menu.classList.remove("open");
  };

  const toggle = (trigger, menu) => {
    const isOpen = menu.classList.contains("open");

    if (isOpen) {
      detach(menu);
      return;
    }

    detach(menu);

    const handler = (event) => {
      if (!menu.contains(event.target) && !trigger.contains(event.target)) {
        detach(menu);
      }
    };

    const timeoutId = setTimeout(() => {
      const entry = activeHandlers.get(menu);
      if (!entry || entry.handler !== handler) return;
      entry.timeoutId = null;
      document.addEventListener("click", handler);
    }, 0);

    activeHandlers.set(menu, { handler, trigger, timeoutId });
    menu.classList.add("open");

    if (window.CleanupRegistry && !registeredForCleanup.has(menu)) {
      CleanupRegistry.add(() => detach(menu));
      registeredForCleanup.add(menu);
    }
  };

  return { toggle };
})();

window.Dropdown = Dropdown;
