// assets/js/features/lightbox.js

export function initLightbox() {
  const overlay = document.querySelector("[data-lightbox]");
  if (!overlay) return;

  const preview = overlay.querySelector("[data-lightbox-image]");
  const caption = overlay.querySelector("[data-lightbox-caption]");
  const closeBtn = overlay.querySelector("[data-lightbox-close]");
  const prevBtn = overlay.querySelector("[data-lightbox-prev]");
  const nextBtn = overlay.querySelector("[data-lightbox-next]");

  if (!preview || !caption || !closeBtn || !prevBtn || !nextBtn) return;

  let images = [];
  let index = 0;
  let lastFocus = null;
  let previousBodyOverflow = "";

  const focusable = [closeBtn, prevBtn, nextBtn];

  function collectImages() {
    images = Array.from(document.querySelectorAll("[data-gallery] img[data-lightbox-src]"));
  }

  function lockScroll() {
    previousBodyOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.overflow = previousBodyOverflow;
  }

  function open(newIndex) {
    collectImages();
    index = newIndex;

    const img = images[index];
    if (!img) return;

    lastFocus = document.activeElement;
    overlay.hidden = false;
    updateContent(img);
    closeBtn.focus();
    lockScroll();
  }

  function close() {
    overlay.hidden = true;
    unlockScroll();

    // Jeśli jesteśmy w fullscreen – wyjdź
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    if (lastFocus instanceof HTMLElement) {
      lastFocus.focus();
    }
  }

  function navigate(step) {
    if (!images.length) return;
    index = (index + step + images.length) % images.length;
    updateContent(images[index]);
  }

  function updateContent(img) {
    preview.src = img.dataset.lightboxSrc || img.src;
    preview.alt = img.alt;
    caption.textContent = img.closest("figure")?.querySelector("figcaption")?.textContent || "";
  }

  function trapFocus(event) {
    if (event.key !== "Tab") return;
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

  // 🔹 Kliknięcie w miniaturę (delegacja)
  document.addEventListener("click", (event) => {
    const picture = event.target.closest("picture.tour-gallery__item");
    if (!picture) return;

    const img = picture.querySelector("img[data-lightbox-src]");
    if (!img) return;

    if (!img.closest("[data-gallery]")) return;

    collectImages();
    const idx = images.indexOf(img);
    if (idx === -1) return;
    open(idx);
  });

  // 🔹 Enter / spacja na miniaturze (klawiatura)
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const img = document.activeElement;
    if (!(img instanceof HTMLImageElement)) return;
    if (!img.matches("img[data-lightbox-src]")) return;
    if (!img.closest("[data-gallery]")) return;

    event.preventDefault();
    collectImages();
    const idx = images.indexOf(img);
    if (idx === -1) return;
    open(idx);
  });

  // 🔹 Sterowanie kiedy overlay jest otwarty
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => navigate(-1));
  nextBtn.addEventListener("click", () => navigate(1));

  // ❌ Kliknięcie w tło już NIE zamyka lightboxa
  // overlay.addEventListener("click", (event) => {
  //   if (event.target === overlay) {
  //     close();
  //   }
  // });

  overlay.addEventListener("keydown", trapFocus);

  // 🔹 Klawiatura: ESC, strzałki lewo/prawo
  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;

    if (event.key === "Escape") {
      close();
    } else if (event.key === "ArrowLeft") {
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      navigate(1);
    }
  });

  // 🔹 Podwójny klik w zdjęcie = fullscreen / wyjście z fullscreen
  preview.addEventListener("dblclick", () => {
    // Jeśli nie ma wsparcia dla Fullscreen API – nic nie rób
    if (!preview.requestFullscreen && !preview.webkitRequestFullscreen) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (preview.requestFullscreen) {
        preview.requestFullscreen().catch(() => {});
      } else if (preview.webkitRequestFullscreen) {
        preview.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  });

  // 🔹 Swipe (przesuwanie palcem w lewo/prawo)
  let touchStartX = 0;
  let touchEndX = 0;

  preview.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });

  preview.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;

    const diff = touchEndX - touchStartX;

    // próg, żeby lekkie muśnięcia nie zmieniały zdjęcia
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff < 0) {
        navigate(1); // przesunięcie w lewo → następne
      } else {
        navigate(-1); // przesunięcie w prawo → poprzednie
      }
    }
  });
}
