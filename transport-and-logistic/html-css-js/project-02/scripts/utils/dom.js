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


// ===== Empty state =====
function emptyState({ title = "Brak danych", description = "", actionLabel = "", actionHref = "" } = {}) {
  const wrap = document.createElement("div");
  wrap.className = "empty-state";

  wrap.innerHTML = `
    <div class="empty-state__card">
      <p class="tag">Empty</p>
      <h3 class="empty-state__title">${title}</h3>
      ${description ? `<p class="muted">${description}</p>` : ""}
      ${
        actionLabel && actionHref
          ? `<a class="button secondary" href="${actionHref}">${actionLabel}</a>`
          : ""
      }
    </div>
  `;

  return wrap;
}

window.FleetUI = window.FleetUI || {};
window.FleetUI.emptyState = emptyState;
