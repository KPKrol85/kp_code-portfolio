// tabs.js – roving tabindex + filtering
export function initTabs() {
  const list = document.querySelector('.tabs[role="tablist"]');
  const panel = document.querySelector('[data-tabs-panel]');
  if (!list || !panel) return;

  const tabs = [...list.querySelectorAll('[role="tab"]')];
  let current = tabs.findIndex(t => t.classList.contains('is-active'));
  if (current < 0) current = 0;

  function updateActive(i) {
    tabs.forEach((t, idx) => {
      const active = idx === i;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
  }

  function applyFilter(value) {
    panel.setAttribute('data-active', value);
    const items = panel.querySelectorAll('[data-room-type]');
    items.forEach(el => {
      const show = value === 'all' || el.getAttribute('data-room-type') === value;
      el.style.display = show ? '' : 'none';
    });
  }

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => {
      current = idx; updateActive(current);
      applyFilter(tab.getAttribute('data-tab-target') || 'all');
    });
    tab.addEventListener('keydown', (e) => {
      const len = tabs.length;
      if (e.key === 'ArrowRight') { e.preventDefault(); current = (current + 1) % len; tabs[current].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); current = (current - 1 + len) % len; tabs[current].focus(); }
      if (e.key === 'Home') { e.preventDefault(); current = 0; tabs[current].focus(); }
      if (e.key === 'End') { e.preventDefault(); current = len - 1; tabs[current].focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tabs[current].click(); }
    });
  });

  // initial
  updateActive(current);
  applyFilter(tabs[current].getAttribute('data-tab-target') || 'all');
}

