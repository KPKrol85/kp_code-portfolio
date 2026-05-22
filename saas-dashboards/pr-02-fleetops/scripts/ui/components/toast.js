const Toast = (() => {
  let container;
  const ensure = () => {
    if (!container) {
      container = dom.h('div', 'toast-container');
      document.body.appendChild(container);
    }
    return container;
  };
  const show = (message, tone = 'default') => {
    const c = ensure();
    const toneClass = /^[a-z0-9_-]+$/i.test(String(tone)) ? String(tone) : 'default';
    const toast = dom.h('div', 'toast');
    const badge = dom.h('span', 'badge');
    badge.classList.add(toneClass);
    badge.textContent = toneClass === 'success' ? '✓' : '•';
    toast.appendChild(badge);
    toast.appendChild(document.createTextNode(String(message ?? "")));
    c.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  };
  return { show };
})();

window.Toast = Toast;
