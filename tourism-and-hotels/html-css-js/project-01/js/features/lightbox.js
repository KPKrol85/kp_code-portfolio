// lightbox.js – accessible dialog with keyboard support
export function initLightbox() {
  const grid = document.querySelector('.gallery-grid');
  const lightbox = document.querySelector('.lightbox');
  if (!grid || !lightbox) return;

  const img = lightbox.querySelector('.lightbox__img');
  const caption = lightbox.querySelector('.lightbox__caption');
  const closeBtns = lightbox.querySelectorAll('[data-lightbox-close]');
  const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
  const nextBtn = lightbox.querySelector('[data-lightbox-next]');
  const dialogEl = lightbox.querySelector('.lightbox__dialog');

  const items = [...grid.querySelectorAll('[data-lightbox-item]')];
  let index = 0;
  let lastFocused = null;

  function open(i, focusOrigin) {
    index = i;
    const a = items[index];
    const picture = a.querySelector('img');
    if (picture && img) {
      img.src = picture.src;
      img.width = picture.width;
      img.height = picture.height;
      img.alt = picture.alt || 'Podgląd';
    }
    if (caption) caption.textContent = picture?.alt || '';
    lastFocused = focusOrigin || document.activeElement;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    (dialogEl || prevBtn || nextBtn || closeBtns[0])?.focus();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function show(delta) {
    index = (index + delta + items.length) % items.length;
    const a = items[index];
    const picture = a.querySelector('img');
    if (picture && img) {
      img.src = picture.src;
      img.width = picture.width;
      img.height = picture.height;
      img.alt = picture.alt || 'Podgląd';
    }
    if (caption) caption.textContent = picture?.alt || '';
  }

  items.forEach((a, i) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      open(i, a);
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', close));
  lightbox.querySelector('.lightbox__backdrop')?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => show(-1));
  nextBtn?.addEventListener('click', () => show(1));

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
    if (e.key === 'Tab') {
      const focusables = [...lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}
