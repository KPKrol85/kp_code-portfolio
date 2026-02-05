export const initLightbox = () => {
  const root = document.querySelector("[data-lightbox-root]");
  const image = document.querySelector("[data-lightbox-image]");
  const triggers = document.querySelectorAll("[data-lightbox]");
  if (!root || !image || !triggers.length) return;

  const open = (src, alt) => {
    image.src = src;
    image.alt = alt || "Podgląd zdjęcia";
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    image.src = "";
    document.body.style.overflow = "";
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const src = trigger.getAttribute("data-lightbox");
      const img = trigger.querySelector("img");
      open(src, img?.alt);
    });
  });

  root.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-lightbox-close")) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("is-open")) {
      close();
    }
  });
};
