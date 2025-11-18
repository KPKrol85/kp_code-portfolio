export function initLightbox() {
  const gallery = document.querySelector('[data-gallery]');
  const overlay = document.querySelector('[data-lightbox]');
  if (!gallery || !overlay) return;

  const images = Array.from(gallery.querySelectorAll('img[data-lightbox-src]'));
  const preview = overlay.querySelector('[data-lightbox-image]');
  const caption = overlay.querySelector('[data-lightbox-caption]');
  const closeBtn = overlay.querySelector('[data-lightbox-close]');
  const prevBtn = overlay.querySelector('[data-lightbox-prev]');
  const nextBtn = overlay.querySelector('[data-lightbox-next]');

  if (!images.length || !preview || !caption || !closeBtn || !prevBtn || !nextBtn) return;

  let index = 0;
  let lastFocus = null;

  const focusable = [closeBtn, prevBtn, nextBtn];

  images.forEach((img, idx) => {
    img.addEventListener('click', () => open(idx));
    img.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(idx);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));
  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      close();
    }
  });

  overlay.addEventListener('keydown', trapFocus);
  document.addEventListener('keydown', event => {
    if (overlay.hasAttribute('hidden')) return;
    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'ArrowLeft') {
      navigate(-1);
    } else if (event.key === 'ArrowRight') {
      navigate(1);
    }
  });

  function open(newIndex) {
    index = newIndex;
    const img = images[index];
    lastFocus = document.activeElement;
    overlay.hidden = false;
    updateContent(img);
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    if (lastFocus instanceof HTMLElement) {
      lastFocus.focus();
    }
  }

  function navigate(step) {
    index = (index + step + images.length) % images.length;
    updateContent(images[index]);
  }

  function updateContent(img) {
    preview.src = img.dataset.lightboxSrc || img.src;
    preview.alt = img.alt;
    caption.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
