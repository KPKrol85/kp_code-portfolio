const Accordion = {
  init(root) {
    const items = root.querySelectorAll('.accordion-item');
    items.forEach((item) => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      header.addEventListener('click', () => {
        const open = content.classList.contains('open');
        content.classList.toggle('open', !open);
        content.style.maxHeight = !open ? content.scrollHeight + 'px' : '0';
      });
    });
  }
};

window.Accordion = Accordion;
