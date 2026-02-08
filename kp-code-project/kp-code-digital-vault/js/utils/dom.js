export const createElement = (tag, options = {}, children = []) => {
  const element = document.createElement(tag);
  const { className, text, attrs } = options;
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
      element.setAttribute(key, value);
    });
  }
  children.forEach((child) => {
    if (child) {
      element.appendChild(child);
    }
  });
  return element;
};

export const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

export const createIconLabel = (label, value) => {
  return createElement("div", { className: "badge" }, [
    createElement("span", { text: label }),
    createElement("strong", { text: value }),
  ]);
};
