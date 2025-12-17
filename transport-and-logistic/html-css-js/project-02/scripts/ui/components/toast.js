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
    const toast = dom.h('div', 'toast');
    toast.innerHTML = `<span class="badge ${tone}">${tone === 'success' ? '✓' : '•'}</span>${message}`;
    c.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  };
  return { show };
})();

window.Toast = Toast;
