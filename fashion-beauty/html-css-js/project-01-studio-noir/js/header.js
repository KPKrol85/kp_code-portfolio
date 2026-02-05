export const initHeader = () => {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const update = () => {
    if (window.scrollY > 20) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
};
