const focusMain = ({ preventScroll = false } = {}) => {
  const main = document.getElementById("main-content");
  if (!main) {
    return;
  }
  const heading = main.querySelector("[data-focus-heading]");
  const target = heading || main;
  if (!preventScroll) {
    target.focus();
    return;
  }
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  try {
    target.focus({ preventScroll: true });
  } catch {
    target.focus();
    window.scrollTo(scrollX, scrollY);
  }
};

export { focusMain };
