import { qs, qsa, delegate } from './dom.js';

export function initFilters() {
  const root = qs('[data-filter-root]');
  if (!root) return;

  let activeTag = 'all';
  let activeSeverity = 'all';

  const items = qsa('[data-item]', root);

  const render = () => {
    items.forEach((item) => {
      const tags = item.dataset.tags.split(',');
      const severity = item.dataset.severity;
      const showTag = activeTag === 'all' || tags.includes(activeTag);
      const showSeverity = activeSeverity === 'all' || severity === activeSeverity;
      item.hidden = !(showTag && showSeverity);
    });
  };

  delegate(root, '[data-filter-tag]', 'click', (_, button) => {
    activeTag = button.dataset.filterTag;
    render();
  });

  delegate(root, '[data-filter-severity]', 'click', (_, button) => {
    activeSeverity = button.dataset.filterSeverity;
    render();
  });
}
