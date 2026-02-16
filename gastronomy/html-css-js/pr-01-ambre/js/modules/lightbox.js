import { log } from "./utils.js";

export function initLightbox() {
  const box = document.getElementById("lb") || document.querySelector(".lightbox");
  if (!box) return;

  const isDialog = box.nodeName === "DIALOG" && typeof box.showModal === "function";
  const picture = box.querySelector("picture") || box;
  const sourceAvif = picture?.querySelector('source[type="image/avif"]') || document.getElementById("lb-avif");
  const sourceWebp = picture?.querySelector('source[type="image/webp"]') || document.getElementById("lb-webp");
  const img = picture?.querySelector("img") || document.getElementById("lb-img");
  const closeBtn = box.querySelector(".lb-close") || box.querySelector("[data-close]");
  const overlay = box.querySelector(".lb-overlay");

  let counter = box.querySelector(".lb-counter");
  if (!counter) {
    counter = document.createElement("output");
    counter.className = "lb-counter";
    counter.setAttribute("aria-live", "polite");
    counter.setAttribute("aria-atomic", "true");
    box.appendChild(counter);
  }

  if (!isDialog) {
    box.setAttribute("hidden", "");
    box.setAttribute("aria-hidden", "true");
  }

  const normalizeUrl = (value) => {
    if (!value) return "";
    try {
      return new URL(value, location.href).href;
    } catch {
      return value;
    }
  };

  const basePath = (value = "") => {
    if (!value) return "";
    return normalizeUrl(value)
      .replace(/[?#].*$/, "")
      .replace(/\.(avif|webp|jpe?g|png)$/i, "");
  };

  const getFull = (node) => {
    if (!node) return "";
    try {
      const datasetValue = node.dataset && node.dataset.full;
      if (datasetValue) return normalizeUrl(datasetValue);
    } catch {}

    const attrValue = node.getAttribute && node.getAttribute("data-full");
    if (attrValue) return normalizeUrl(attrValue);

    const href = node.getAttribute && node.getAttribute("href");
    if (href && !href.startsWith("#")) return normalizeUrl(href);

    const innerImg = node.querySelector && node.querySelector("img");
    return innerImg ? innerImg.currentSrc || innerImg.src || "" : "";
  };

  const setImage = (value, alt = "") => {
    if (!value) return;
    const base = basePath(value);
    if (!base) return;

    if (sourceAvif) sourceAvif.srcset = `${base}.avif`;
    if (sourceWebp) sourceWebp.srcset = `${base}.webp`;
    if (img) {
      img.src = `${base}.jpg`;
      img.alt = alt || "";
    }
  };

  let index = -1;
  let items = [];
  let lastActive = null;
  let scrollY = 0;
  let prevPosition = "";
  let prevTop = "";
  let prevWidth = "";
  let prevHash = "";

  const getGalleryItems = (root) =>
    root
      ? Array.from(root.querySelectorAll(".g-item")).filter(
          (item) => !item.hidden && item.offsetParent !== null
        )
      : [];

  const getDishItems = () =>
    Array.from(document.querySelectorAll(".dish-thumb")).filter(
      (item) => !item.hidden && item.offsetParent !== null
    );

  const updateCounter = () => {
    const total = items.length;
    if (!counter || total <= 1 || index < 0) {
      counter.hidden = true;
      counter.textContent = "";
      return;
    }

    counter.hidden = false;
    const label = `${index + 1} / ${total}`;
    counter.value = label;
    counter.textContent = label;
  };

  const open = (src, alt, startIndex = -1, scopeItems = []) => {
    if (!src) return;

    lastActive = document.activeElement;
    items = Array.isArray(scopeItems) && scopeItems.length
      ? scopeItems
      : getGalleryItems(document.querySelector(".gallery-grid"));

    if (!items.length) items = getDishItems();

    const normalized = normalizeUrl(src);
    setImage(normalized, alt);

    if (typeof startIndex === "number" && startIndex >= 0) {
      index = startIndex;
    } else {
      index = items.findIndex((item) => {
        const itemSrc = getFull(item) || "";
        return itemSrc && normalizeUrl(itemSrc) === normalized;
      });
    }

    if (index === -1 && items.length) index = 0;

    prevHash = location.hash || "";
    if (prevHash) {
      history.replaceState(null, "", location.pathname + location.search);
    }

    scrollY = window.scrollY;
    prevPosition = document.body.style.position;
    prevTop = document.body.style.top;
    prevWidth = document.body.style.width;
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    if (isDialog) {
      try {
        if (!box.open) box.showModal();
      } catch (error) {
        console.error(error);
      }
    } else {
      box.removeAttribute("hidden");
      box.setAttribute("aria-hidden", "false");
      box.classList.add("open");
    }

    if (closeBtn && typeof closeBtn.focus === "function") closeBtn.focus();
    updateCounter();
    preload(1);
    preload(-1);
  };

  const close = () => {
    if (isDialog) {
      if (box.open) box.close();
    } else {
      box.classList.remove("open");
      box.setAttribute("aria-hidden", "true");
      box.setAttribute("hidden", "");
      setTimeout(() => {
        sourceAvif?.removeAttribute("srcset");
        sourceWebp?.removeAttribute("srcset");
        img?.removeAttribute("src");
      }, 170);
    }

    if (prevHash) {
      history.replaceState(null, "", location.pathname + location.search + prevHash);
    }

    document.body.style.position = prevPosition;
    document.body.style.top = prevTop;
    document.body.style.width = prevWidth;
    window.scrollTo(0, scrollY);

    if (lastActive && typeof lastActive.focus === "function") lastActive.focus();

    index = -1;
    items = [];
    if (counter) {
      counter.hidden = true;
      counter.textContent = "";
    }
  };

  const showAt = (nextIndex) => {
    if (!items.length) return;
    index = (nextIndex + items.length) % items.length;
    const node = items[index];
    const src = getFull(node) || "";
    const alt = node?.querySelector("img")?.alt || node?.getAttribute("aria-label") || "";
    setImage(src, alt);
    updateCounter();
  };

  const preload = (step) => {
    if (!items.length || index === -1) return;
    const nextIndex = (index + step + items.length) % items.length;
    const node = items[nextIndex];
    const src = getFull(node) || "";
    if (!src) return;

    const base = basePath(src);
    if (!base) return;

    [`${base}.webp`, `${base}.avif`, `${base}.jpg`].forEach((value) => {
      const image = new Image();
      image.src = value;
    });
  };

  document.addEventListener("click", (event) => {
    const dish = event.target.closest(".dish-thumb");
    if (dish) {
      const src = getFull(dish);
      const alt =
        dish.querySelector("img")?.alt || dish.getAttribute("aria-label") || "";
      if (event.target.closest("a")) event.preventDefault();
      const dishItems = getDishItems();
      const dishIndex = dishItems.indexOf(dish);
      open(src, alt, dishIndex >= 0 ? dishIndex : -1, dishItems);
      return;
    }

    const item = event.target.closest(".g-item");
    if (item) {
      const src = getFull(item);
      const alt =
        item.querySelector("img")?.alt || item.getAttribute("aria-label") || "";
      if (event.target.closest("a")) event.preventDefault();
      const grid = item.closest(".gallery-grid");
      const gridItems = getGalleryItems(grid);
      const gridIndex = gridItems.indexOf(item);
      open(src, alt, gridIndex >= 0 ? gridIndex : -1, gridItems);
    }
  });

  const gallery = document.getElementById("galeria-grid") || document.querySelector("#galeria-grid");
  if (gallery) {
    gallery.addEventListener(
      "click",
      (event) => {
        if (event.target.closest('a[href^="#"]')) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      true
    );
  }

  window.addEventListener(
    "hashchange",
    () => {
      const isOpen = isDialog ? box.open : box.classList.contains("open");
      if (isOpen) {
        history.replaceState(null, "", location.pathname + location.search);
        window.scrollTo(0, scrollY);
      }
    },
    true
  );

  closeBtn?.addEventListener("click", close);
  overlay && overlay.addEventListener("click", close);
  box.addEventListener("click", (event) => {
    if (event.target === box) close();
  });

  box.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      const isOpen = isDialog ? box.open : box.classList.contains("open");
      const activeInside = box.contains(document.activeElement);
      if (!isOpen || !activeInside) return;
      event.preventDefault();
      if (items.length) showAt(index === -1 ? 0 : index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      const isOpen = isDialog ? box.open : box.classList.contains("open");
      const activeInside = box.contains(document.activeElement);
      if (!isOpen || !activeInside) return;
      event.preventDefault();
      if (items.length) showAt(index === -1 ? 0 : index + 1);
      return;
    }

    if (event.key === "Escape") {
      const isOpen = isDialog ? box.open : box.classList.contains("open");
      if (isOpen) close();
    }
  });

  let prevButton = box.querySelector(".lb-prev");
  let nextButton = box.querySelector(".lb-next");

  const buildButton = (className, label, icon) => {
    const button = document.createElement("button");
    button.className = className;
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.innerHTML = icon;
    return button;
  };

  if (!prevButton) {
    prevButton = buildButton(
      "lb-prev",
      "Poprzednie zdjęcie",
      '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 19L8 12l7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    );
    box.appendChild(prevButton);
  }

  if (!nextButton) {
    nextButton = buildButton(
      "lb-next",
      "Następne zdjęcie",
      '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    );
    box.appendChild(nextButton);
  }

  prevButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (items.length) showAt(index === -1 ? 0 : index - 1);
  });

  nextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (items.length) showAt(index === -1 ? 0 : index + 1);
  });

  (function enableSwipe() {
    if (!img) return;
    const supportsPointer = "PointerEvent" in window;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let tracking = false;
    let horizontal = false;

    const reset = () => {
      if (prefersReducedMotion) {
        img.style.transition = "none";
        img.style.transform = "translate3d(0,0,0)";
        img.style.willChange = "";
        return;
      }
      img.style.transition = "transform .18s ease";
      img.style.transform = "translate3d(0,0,0)";
      img.addEventListener(
        "transitionend",
        () => {
          img.style.willChange = "";
        },
        { once: true }
      );
    };

    const onStart = (x, y) => {
      startX = x;
      startY = y;
      deltaX = 0;
      deltaY = 0;
      tracking = true;
      horizontal = false;
    };

    const onMove = (x, y, event) => {
      if (!tracking) return;
      deltaX = x - startX;
      deltaY = y - startY;
      if (!horizontal && Math.abs(deltaX) > 8) {
        horizontal = Math.abs(deltaY / (deltaX || 1)) < 0.577;
      }
      if (horizontal) {
        event?.preventDefault?.();
        img.style.transition = "none";
        img.style.transform = `translate3d(${deltaX}px,0,0)`;
        img.style.willChange = "transform";
      }
    };

    const onEnd = () => {
      if (!tracking) return;
      tracking = false;

      if (horizontal && Math.abs(deltaX) > 60 && items.length) {
        const direction = deltaX < 0 ? 1 : -1;
        if (prefersReducedMotion) {
          showAt(index === -1 ? 0 : index + direction);
          preload(1);
          preload(-1);
          reset();
          return;
        }
        img.style.transition = "transform .12s ease";
        img.style.transform = `translate3d(${Math.sign(deltaX) * window.innerWidth * 0.25}px,0,0)`;
        setTimeout(() => {
          showAt(index === -1 ? 0 : index + direction);
          img.style.transition = "none";
          img.style.transform = `translate3d(${28 * Math.sign(-deltaX)}px,0,0)`;
          requestAnimationFrame(() => reset());
          preload(1);
          preload(-1);
        }, 90);
      } else {
        reset();
      }
    };

    if (supportsPointer) {
      img.addEventListener(
        "pointerdown",
        (event) => {
          if (event.pointerType !== "mouse") onStart(event.clientX, event.clientY);
        },
        { passive: true }
      );
      img.addEventListener(
        "pointermove",
        (event) => {
          if (event.pointerType !== "mouse") onMove(event.clientX, event.clientY, event);
        },
        { passive: false }
      );
      img.addEventListener("pointerup", onEnd, { passive: true });
      img.addEventListener("pointercancel", onEnd, { passive: true });
      return;
    }

    img.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.touches[0];
        if (touch) onStart(touch.clientX, touch.clientY);
      },
      { passive: true }
    );

    img.addEventListener(
      "touchmove",
      (event) => {
        const touch = event.touches[0];
        if (touch) onMove(touch.clientX, touch.clientY, event);
      },
      { passive: false }
    );

    img.addEventListener("touchend", onEnd, { passive: true });
    img.addEventListener("touchcancel", onEnd, { passive: true });
  })();

  const fullscreenTarget = box;
  const canFullscreen = !!(
    fullscreenTarget.requestFullscreen ||
    fullscreenTarget.webkitRequestFullscreen ||
    fullscreenTarget.msRequestFullscreen
  );

  const isFullscreen = () =>
    !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );

  const zoomIn = () => box.classList.add("is-zoomed");
  const zoomOut = () => box.classList.remove("is-zoomed");
  const setFullscreenClass = (value) => box.classList.toggle("is-fs", !!value);

  const toggleFullscreen = async () => {
    if (canFullscreen) {
      if (isFullscreen()) {
        await (document.exitFullscreen?.() ||
          document.webkitExitFullscreen?.() ||
          document.msExitFullscreen?.());
        setFullscreenClass(false);
      } else {
        try {
          await (
            fullscreenTarget.requestFullscreen?.() ||
            fullscreenTarget.webkitRequestFullscreen?.() ||
            fullscreenTarget.msRequestFullscreen?.()
          );
          setFullscreenClass(true);
        } catch {
          zoomIn();
          setFullscreenClass(true);
        }
      }
    } else if (box.classList.contains("is-zoomed")) {
      zoomOut();
      setFullscreenClass(false);
    } else {
      zoomIn();
      setFullscreenClass(true);
    }
  };

  box.addEventListener("close", () => {
    zoomOut();
    setFullscreenClass(false);
  });

  document.addEventListener("fullscreenchange", () => setFullscreenClass(isFullscreen()));

  img?.addEventListener("dblclick", (event) => {
    event.preventDefault();
    toggleFullscreen();
  });

  let lastTap = 0;
  img?.addEventListener(
    "touchend",
    (event) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        event.preventDefault();
        toggleFullscreen();
        lastTap = 0;
      } else {
        lastTap = now;
      }
    },
    { passive: false }
  );

  box.addEventListener("keydown", (event) => {
    if (event.key === "f" || event.key === "F") {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  window.openLB = (src, alt, startIndex) => open(src, alt, startIndex);
  window.closeLB = close;

  log();
}
