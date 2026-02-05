export const initResourcesFilter = () => {
  const buttons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-category]');
  if (!buttons.length || !cards.length) return;

  const setActive = (active) => {
    buttons.forEach((button) => {
      const isActive = button === active;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  };

  const applyFilter = (filter) => {
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.style.display = matches ? 'block' : 'none';
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      setActive(button);
      applyFilter(filter);
    });
  });
};
