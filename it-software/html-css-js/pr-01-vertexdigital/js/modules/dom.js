export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

export const on = (event, selector, handler, options) => {
  document.addEventListener(
    event,
    (e) => {
      const target = e.target.closest(selector);
      if (target) {
        handler(e, target);
      }
    },
    options
  );
};

export const delegate = (element, event, selector, handler, options) => {
  element.addEventListener(
    event,
    (e) => {
      const target = e.target.closest(selector);
      if (target && element.contains(target)) {
        handler(e, target);
      }
    },
    options
  );
};
