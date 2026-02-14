import { qsa } from './dom.js';

export function initTabs() {
  qsa('[data-tabs]').forEach((root) => {
    const tabs = qsa('[role="tab"]', root);
    const panels = qsa('[role="tabpanel"]', root);
    if (!tabs.length) return;

    const activate = (tab) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute('aria-controls');
      });
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        const idx = tabs.indexOf(tab);
        if (event.key === 'ArrowRight') activate(tabs[(idx + 1) % tabs.length]);
        if (event.key === 'ArrowLeft') activate(tabs[(idx - 1 + tabs.length) % tabs.length]);
      });
    });
  });
}
