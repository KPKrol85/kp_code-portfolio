// Accessible lightbox for fleet gallery
export function initLightbox() {
  const triggers = document.querySelectorAll(".lightbox-trigger");
  const lightbox = document.querySelector(".lightbox");
  const dialog = lightbox?.querySelector(".lightbox__dialog");
  const img = lightbox?.querySelector(".lightbox__img");
  const closeBtn = lightbox?.querySelector("[data-lightbox-close]");
  const prevBtn = lightbox?.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox?.querySelector("[data-lightbox-next]");
  if (!lightbox || !img || !triggers.length) return;

  let currentIndex = 0;
  const focusable = () => dialog.querySelectorAll("button");

  const open = (index) => {
    currentIndex = index;
    const target = triggers[currentIndex];
    img.src = target.dataset.full || target.src;
    img.alt = target.alt || "";
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    closeBtn.focus();
  };

  const close = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
    triggers[currentIndex]?.focus();
  };

  const next = () => open((currentIndex + 1) % triggers.length);
  const prev = () => open((currentIndex - 1 + triggers.length) % triggers.length);

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => open(index));
  });

  closeBtn?.addEventListener("click", close);
  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "Tab") {
      const nodes = focusable();
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
