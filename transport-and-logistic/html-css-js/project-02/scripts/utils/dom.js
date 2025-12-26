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

// ===== Scroll-to-top binding =====
function bindLogoScroll(kind, getContainer) {
  const links = document.querySelectorAll(`[data-scroll-top="${kind}"]`);
  if (!links.length) return () => {};

  const cleanups = [];

  links.forEach((link) => {
    if (link.dataset.scrollBound === "true") {
      cleanups.push(() => {});
      return;
    }

    const handleClick = (event) => {
      const targetHash = kind === "app" ? "#/app" : "#/";
      const currentHash = window.location.hash || "#/";
      if (currentHash === targetHash) {
        event.preventDefault();
      }

      window.setTimeout(() => {
        const container = getContainer ? getContainer() : null;
        if (container && typeof container.scrollTo === "function") {
          container.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      }, 0);
    };

    link.addEventListener("click", handleClick);
    link.dataset.scrollBound = "true";
    cleanups.push(() => {
      link.removeEventListener("click", handleClick);
      delete link.dataset.scrollBound;
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

window.FleetUI = window.FleetUI || {};
window.FleetUI.bindLogoScroll = bindLogoScroll;


// ===== Empty state =====
function emptyState({ title = "Brak danych", description = "", actionLabel = "", actionHref = "" } = {}) {
  const wrap = document.createElement("div");
  wrap.className = "empty-state";

  wrap.innerHTML = `
    <div class="empty-state__card">
      <p class="tag">Brak</p>
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
