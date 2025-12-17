const h = (tag, className, content) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content !== undefined) {
    if (typeof content === 'string') el.innerHTML = content;
    else el.appendChild(content);
  }
  return el;
};

const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); };

const mount = (selector, content) => {
  const target = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!target) return;
  clear(target);
  if (typeof content === 'string') target.innerHTML = content; else target.appendChild(content);
};

window.dom = { h, clear, mount };
