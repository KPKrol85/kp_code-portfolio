const updateHeaderOffset = () => {
  const header = document.querySelector("header");
  if (!header) {
    return;
  }
  const height = Math.round(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--header-offset", `${height}px`);
};

export { updateHeaderOffset };
