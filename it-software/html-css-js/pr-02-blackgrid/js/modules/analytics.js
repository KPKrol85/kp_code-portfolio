export function initAnalytics() {
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-track]');
    if (!target) return;
    console.info('[BlackGrid analytics]', {
      event: 'click',
      label: target.dataset.track,
      href: target.getAttribute('href') || null
    });
  }, { passive: true });
}
