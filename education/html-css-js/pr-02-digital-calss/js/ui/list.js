export const renderList = (items, renderer) => {
  const wrapper = document.createElement("div");
  wrapper.className = "list";
  items.forEach((item) => wrapper.appendChild(renderer(item)));
  return wrapper;
};
