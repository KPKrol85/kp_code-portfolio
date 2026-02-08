import { createElement } from '../core/dom.js';

const ensureStack = () => {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = createElement('<div class="toast-stack" role="status" aria-live="polite"></div>');
    document.body.appendChild(stack);
  }
  return stack;
};

export const showToast = (message) => {
  const stack = ensureStack();
  const toast = createElement(`<div class="toast">${message}</div>`);
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
};
