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
  const zoom = lightbox?.querySelector(".lightbox__zoom");
  const zoomImg = lightbox?.querySelector(".lightbox__zoom-img");
  const zoomClose = lightbox?.querySelector(".lightbox__zoom-close");
  if (!lightbox || !dialog || !titleEl || !heroImg || !grid || !closeBtn || !prevBtn || !nextBtn || !zoom || !zoomImg || !zoomClose || !triggers.length) {
    return;
  }

  const GALLERIES = {
    solo: [
      { avif: "assets/img/fleet/bus/1.avif", webp: "assets/img/fleet/bus/1.webp", jpg: "assets/img/fleet/bus/1.jpg", alt: "Bus dostawczy – zdjęcie 1" },
      { avif: "assets/img/fleet/bus/2.avif", webp: "assets/img/fleet/bus/2.webp", jpg: "assets/img/fleet/bus/2.jpg", alt: "Bus dostawczy – zdjęcie 2" },
      { avif: "assets/img/fleet/bus/3.avif", webp: "assets/img/fleet/bus/3.webp", jpg: "assets/img/fleet/bus/3.jpg", alt: "Bus dostawczy – zdjęcie 3" },
      { avif: "assets/img/fleet/bus/4.avif", webp: "assets/img/fleet/bus/4.webp", jpg: "assets/img/fleet/bus/4.jpg", alt: "Bus dostawczy – zdjęcie 4" },
      { avif: "assets/img/fleet/bus/5.avif", webp: "assets/img/fleet/bus/5.webp", jpg: "assets/img/fleet/bus/5.jpg", alt: "Bus dostawczy – zdjęcie 5" },
      { avif: "assets/img/fleet/bus/6.avif", webp: "assets/img/fleet/bus/6.webp", jpg: "assets/img/fleet/bus/6.jpg", alt: "Bus dostawczy – zdjęcie 6" },
    ],
    truck: [
      { avif: "assets/img/fleet/truck/truck-1.avif", webp: "assets/img/fleet/truck/truck-1.webp", jpg: "assets/img/fleet/truck/truck-1.jpg", alt: "Ciężarówka plandeka – zdjęcie 1" },
      { avif: "assets/img/fleet/truck/truck-2.avif", webp: "assets/img/fleet/truck/truck-2.webp", jpg: "assets/img/fleet/truck/truck-2.jpg", alt: "Ciężarówka plandeka – zdjęcie 2" },
      { avif: "assets/img/fleet/truck/truck-3.avif", webp: "assets/img/fleet/truck/truck-3.webp", jpg: "assets/img/fleet/truck/truck-3.jpg", alt: "Ciężarówka plandeka – zdjęcie 3" },
      { avif: "assets/img/fleet/truck/truck-4.avif", webp: "assets/img/fleet/truck/truck-4.webp", jpg: "assets/img/fleet/truck/truck-4.jpg", alt: "Ciężarówka plandeka – zdjęcie 4" },
      { avif: "assets/img/fleet/truck/truck-5.avif", webp: "assets/img/fleet/truck/truck-5.webp", jpg: "assets/img/fleet/truck/truck-5.jpg", alt: "Ciężarówka plandeka – zdjęcie 5" },
      { avif: "assets/img/fleet/truck/truck-6.avif", webp: "assets/img/fleet/truck/truck-6.webp", jpg: "assets/img/fleet/truck/truck-6.jpg", alt: "Ciężarówka plandeka – zdjęcie 6" },
    ],
    chlodnia: [
      { avif: "assets/img/fleet/chlodnia/1.avif", webp: "assets/img/fleet/chlodnia/1.webp", jpg: "assets/img/fleet/chlodnia/1.jpg", alt: "Ciężarówka z chłodnią – zdjęcie 1" },
      { avif: "assets/img/fleet/chlodnia/2.avif", webp: "assets/img/fleet/chlodnia/2.webp", jpg: "assets/img/fleet/chlodnia/2.jpg", alt: "Ciężarówka z chłodnią – zdjęcie 2" },
      { avif: "assets/img/fleet/chlodnia/3.avif", webp: "assets/img/fleet/chlodnia/3.webp", jpg: "assets/img/fleet/chlodnia/3.jpg", alt: "Ciężarówka z chłodnią – zdjęcie 3" },
      { avif: "assets/img/fleet/chlodnia/4.avif", webp: "assets/img/fleet/chlodnia/4.webp", jpg: "assets/img/fleet/chlodnia/4.jpg", alt: "Ciężarówka z chłodnią – zdjęcie 4" },
      { avif: "assets/img/fleet/chlodnia/5.avif", webp: "assets/img/fleet/chlodnia/5.webp", jpg: "assets/img/fleet/chlodnia/5.jpg", alt: "Ciężarówka z chłodnią – zdjęcie 5" },
      { avif: "assets/img/fleet/chlodnia/6.avif", webp: "assets/img/fleet/chlodnia/6.webp", jpg: "assets/img/fleet/chlodnia/6.jpg", alt: "Ciężarówka z chłodnią – zdjęcie 6" },
    ],
    set: [
      { avif: "assets/img/fleet/mega/1.avif", webp: "assets/img/fleet/mega/1.webp", jpg: "assets/img/fleet/mega/1.jpg", alt: "Ciężarówka Zestaw Mega – zdjęcie 1" },
      { avif: "assets/img/fleet/mega/2.avif", webp: "assets/img/fleet/mega/2.webp", jpg: "assets/img/fleet/mega/2.jpg", alt: "Ciężarówka Zestaw Mega – zdjęcie 2" },
      { avif: "assets/img/fleet/mega/3.avif", webp: "assets/img/fleet/mega/3.webp", jpg: "assets/img/fleet/mega/3.jpg", alt: "Ciężarówka Zestaw Mega – zdjęcie 3" },
      { avif: "assets/img/fleet/mega/4.avif", webp: "assets/img/fleet/mega/4.webp", jpg: "assets/img/fleet/mega/4.jpg", alt: "Ciężarówka Zestaw Mega – zdjęcie 4" },
      { avif: "assets/img/fleet/mega/5.avif", webp: "assets/img/fleet/mega/5.webp", jpg: "assets/img/fleet/mega/5.jpg", alt: "Ciężarówka Zestaw Mega – zdjęcie 5" },
      { avif: "assets/img/fleet/mega/6.avif", webp: "assets/img/fleet/mega/6.webp", jpg: "assets/img/fleet/mega/6.jpg", alt: "Ciężarówka Zestaw Mega – zdjęcie 6" },
    ],
  };

  let currentCategoryIndex = 0;
  let lastTrigger = null;
  let scrollY = 0;
  const lockScroll = () => {
    scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.classList.add("no-scroll");
  };

  const unlockScroll = () => {
    document.body.classList.remove("no-scroll");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  };

  let zoomOpen = false;
  let lastZoomTriggerEl = null;
  const getZoomFocusable = () => Array.from(zoom.querySelectorAll("button,[href],[tabindex]:not([tabindex='-1'])"));
  const openZoom = (src, alt = "") => {
    lastZoomTriggerEl = document.activeElement;
    zoomImg.src = src;
    zoomImg.alt = alt;
    zoom.hidden = false;
    zoom.setAttribute("aria-hidden", "false");
    dialog.setAttribute("aria-hidden", "true");
    zoomOpen = true;
    zoomClose.focus();
  };

  const closeZoom = () => {
    zoom.hidden = true;
    zoom.setAttribute("aria-hidden", "true");
    zoomImg.src = "";
    zoomImg.alt = "";
    zoomOpen = false;
    dialog.removeAttribute("aria-hidden");
    if (lastZoomTriggerEl && typeof lastZoomTriggerEl.focus === "function") lastZoomTriggerEl.focus();
    lastZoomTriggerEl = null;
  };

  const trapFocusInZoom = (e) => {
    if (!zoomOpen || e.key !== "Tab") return;
    const nodes = getZoomFocusable();
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  zoomClose.addEventListener("click", closeZoom);
  zoom.addEventListener("click", (e) => {
    if (e.target === zoom) closeZoom();
  });

  const focusable = () => dialog.querySelectorAll("button");
  const renderGridForKey = (key) => {
    const items = GALLERIES[key] || [];
    grid.innerHTML = items
      .map((item) => {
        if (item.avif && item.webp && item.jpg) {
          return `
          <picture class="lightbox__thumb">
            <source srcset="${item.avif}" type="image/avif">
            <source srcset="${item.webp}" type="image/webp">
            <img src="${item.jpg}" alt="${item.alt || ""}" title="Powiększ zdjęcie" loading="lazy">
          </picture>
        `;
        }
        return `
        <picture class="lightbox__thumb">
          <img src="${item.src}" alt="${item.alt || ""}" title="Powiększ zdjęcie" loading="lazy">
        </picture>
      `;
      })
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
    lockScroll();
    closeBtn.focus();
  };

  const close = () => {
    closeZoom();
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.hidden = true;
    unlockScroll();
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
  lightbox.addEventListener(
    "touchmove",
    (e) => {
      if (!lightbox.hidden && !zoomOpen) e.preventDefault();
    },
    { passive: false },
  );

  const getThumbImg = (target) => {
    const thumb = target.closest(".lightbox__thumb");
    if (!thumb) return null;
    return thumb.querySelector("img");
  };

  grid.addEventListener("dblclick", (e) => {
    const img = getThumbImg(e.target);
    if (!img) return;
    openZoom(img.currentSrc || img.src, img.alt || "");
  });

  let lastTapTime = 0;
  let lastTapEl = null;
  const DOUBLE_TAP_MS = 300;
  grid.addEventListener("pointerdown", (e) => {
    const img = getThumbImg(e.target);
    if (!img) return;
    const now = Date.now();
    const isDoubleTap = lastTapEl === img && now - lastTapTime <= DOUBLE_TAP_MS;
    lastTapTime = now;
    lastTapEl = img;
    if (!isDoubleTap) return;
    openZoom(img.currentSrc || img.src, img.alt || "");
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (zoomOpen) {
      trapFocusInZoom(e);
      if (e.key === "Escape") closeZoom();
      return;
    }
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
