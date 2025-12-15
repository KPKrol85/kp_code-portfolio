// Lightbox: prev/next przełącza KATEGORIE (4 ikony), grid 2x3 pokazuje miniatury dla aktywnej kategorii
export function initLightbox() {
  const triggers = Array.from(document.querySelectorAll(".lightbox-trigger[data-gallery]"));

  const lightbox = document.querySelector(".lightbox");
  const dialog = lightbox?.querySelector(".lightbox__dialog");
  const titleEl = lightbox?.querySelector(".lightbox__title");
  const heroImg = lightbox?.querySelector(".lightbox__hero");
  const grid = lightbox?.querySelector(".lightbox__grid");
  const closeBtn = lightbox?.querySelector("[data-lightbox-close]");
  const prevBtn = lightbox?.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox?.querySelector("[data-lightbox-next]");

  if (!lightbox || !dialog || !titleEl || !heroImg || !grid || !closeBtn || !prevBtn || !nextBtn || !triggers.length) return;

  const GALLERIES = {
    solo: [
      {
        avif: "assets/img/fleet/bus/bus-1.avif",
        webp: "assets/img/fleet/bus/bus-1.webp",
        jpg: "assets/img/fleet/bus/bus-1.jpg",
        alt: "Bus dostawczy – zdjęcie 1",
      },
      {
        avif: "assets/img/fleet/bus/bus-2.avif",
        webp: "assets/img/fleet/bus/bus-2.webp",
        jpg: "assets/img/fleet/bus/bus-2.jpg",
        alt: "Bus dostawczy – zdjęcie 2",
      },
      {
        avif: "assets/img/fleet/bus/bus-3.avif",
        webp: "assets/img/fleet/bus/bus-3.webp",
        jpg: "assets/img/fleet/bus/bus-3.jpg",
        alt: "Bus dostawczy – zdjęcie 3",
      },
      {
        avif: "assets/img/fleet/bus/bus-4.avif",
        webp: "assets/img/fleet/bus/bus-4.webp",
        jpg: "assets/img/fleet/bus/bus-4.jpg",
        alt: "Bus dostawczy – zdjęcie 4",
      },
      {
        avif: "assets/img/fleet/bus/bus-5.avif",
        webp: "assets/img/fleet/bus/bus-5.webp",
        jpg: "assets/img/fleet/bus/bus-5.jpg",
        alt: "Bus dostawczy – zdjęcie 5",
      },
      {
        avif: "assets/img/fleet/bus/bus-6.avif",
        webp: "assets/img/fleet/bus/bus-6.webp",
        jpg: "assets/img/fleet/bus/bus-6.jpg",
        alt: "Bus dostawczy – zdjęcie 6",
      },
    ],
    truck: [
      { src: "assets/img/demo/bus-01.jpg", alt: "Ciężarówka plandeka – zdjęcie 1" },
      { src: "assets/img/demo/bus-02.jpg", alt: "Ciężarówka plandeka – zdjęcie 2" },
      { src: "assets/img/demo/bus-03.jpg", alt: "Ciężarówka plandeka – zdjęcie 3" },
      { src: "assets/img/demo/bus-04.jpg", alt: "Ciężarówka plandeka – zdjęcie 4" },
      { src: "assets/img/demo/bus-05.jpg", alt: "Ciężarówka plandeka – zdjęcie 5" },
      { src: "assets/img/demo/bus-06.jpg", alt: "Ciężarówka plandeka – zdjęcie 6" },
    ],
    chlodnia: [
      { src: "assets/img/demo/chlodnia-01.jpg", alt: "Ciężarówka chłodnia – zdjęcie 1" },
      { src: "assets/img/demo/chlodnia-02.jpg", alt: "Ciężarówka chłodnia – zdjęcie 2" },
      { src: "assets/img/demo/chlodnia-03.jpg", alt: "Ciężarówka chłodnia – zdjęcie 3" },
      { src: "assets/img/demo/chlodnia-04.jpg", alt: "Ciężarówka chłodnia – zdjęcie 4" },
      { src: "assets/img/demo/chlodnia-05.jpg", alt: "Ciężarówka chłodnia – zdjęcie 5" },
      { src: "assets/img/demo/chlodnia-06.jpg", alt: "Ciężarówka chłodnia – zdjęcie 6" },
    ],
    set: [
      { src: "assets/img/demo/set-01.jpg", alt: "Zestaw Mega – zdjęcie 1" },
      { src: "assets/img/demo/set-02.jpg", alt: "Zestaw Mega – zdjęcie 2" },
      { src: "assets/img/demo/set-03.jpg", alt: "Zestaw Mega – zdjęcie 3" },
      { src: "assets/img/demo/set-04.jpg", alt: "Zestaw Mega – zdjęcie 4" },
      { src: "assets/img/demo/set-05.jpg", alt: "Zestaw Mega – zdjęcie 5" },
      { src: "assets/img/demo/set-06.jpg", alt: "Zestaw Mega – zdjęcie 6" },
    ],
  };

  let currentCategoryIndex = 0;
  let lastTrigger = null;

  const focusable = () => dialog.querySelectorAll("button");

const renderGridForKey = (key) => {
  const items = GALLERIES[key] || [];

  grid.innerHTML = items
    .map(
      (item) => `
        <picture class="lightbox__thumb">
          <source srcset="${item.avif}" type="image/avif">
          <source srcset="${item.webp}" type="image/webp">
          <img src="${item.jpg}" alt="${item.alt}" loading="lazy">
        </picture>
      `
    )
    .join("");
};


  const applyCategoryFromTrigger = (triggerEl) => {
    const key = triggerEl.dataset.gallery;
    if (!key) return;

    titleEl.textContent = triggerEl.dataset.title || "Galeria pojazdu";

    heroImg.src = triggerEl.currentSrc || triggerEl.src;
    heroImg.alt = triggerEl.alt || "";

    renderGridForKey(key);
  };

  const open = (triggerEl) => {
    lastTrigger = triggerEl;

    currentCategoryIndex = triggers.indexOf(triggerEl);
    if (currentCategoryIndex < 0) currentCategoryIndex = 0;

    applyCategoryFromTrigger(triggers[currentCategoryIndex]);

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
    lastTrigger?.focus();
  };

  const nextCategory = () => {
    currentCategoryIndex = (currentCategoryIndex + 1) % triggers.length;
    applyCategoryFromTrigger(triggers[currentCategoryIndex]);
  };

  const prevCategory = () => {
    currentCategoryIndex = (currentCategoryIndex - 1 + triggers.length) % triggers.length;
    applyCategoryFromTrigger(triggers[currentCategoryIndex]);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => open(trigger));
  });

  closeBtn.addEventListener("click", close);
  nextBtn.addEventListener("click", nextCategory);
  prevBtn.addEventListener("click", prevCategory);

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;

    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") nextCategory();
    if (e.key === "ArrowLeft") prevCategory();

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
