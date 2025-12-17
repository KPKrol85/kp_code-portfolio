const Dropdown = (() => {
  const toggle = (trigger, menu) => {
    menu.classList.toggle('open');
    const handler = (e) => {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        menu.classList.remove('open');
        document.removeEventListener('click', handler);
      }
    };
    setTimeout(() => document.addEventListener('click', handler), 0);
  };

  return { toggle };
})();

window.Dropdown = Dropdown;
