export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
export const on = (el, event, handler, options) => el?.addEventListener(event, handler, options);
export const delegate = (root, selector, eventName, handler) => {
  if (!root) return;
  root.addEventListener(eventName, (event) => {
    const target = event.target.closest(selector);
    if (target && root.contains(target)) {
      handler(event, target);
    }
  });
};
