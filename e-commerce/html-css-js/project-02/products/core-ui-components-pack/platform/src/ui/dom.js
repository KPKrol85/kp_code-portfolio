export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export const clear = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

export const createEl = (tag, options = {}) => {
  const el = document.createElement(tag);
  const { className, text, attrs } = options;

  if (className) el.className = className;
  if (text) el.textContent = text;
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }

  return el;
};

export const setChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};
