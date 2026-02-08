import { createProductCard } from "../components/productCard.js";
import { showToast } from "../components/toast.js";
import { renderDataState, createRetryButton } from "../components/uiStates.js";
import { getContent } from "../content/index.js";
import { cartService } from "../services/cart.js";
import { actions } from "../store/actions.js";
import { store } from "../store/store.js";
import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";

export const renderHome = () => {
  const content = getContent();
  const homeContent = content.home;
  const main = document.getElementById("main-content");
  clearElement(main);

  if (main._homeUnsubscribe) {
    main._homeUnsubscribe();
    main._homeUnsubscribe = null;
  }

  const hero = createElement("section", { className: "container hero" });
  const heroContent = createElement("div", { className: "hero-content" });

  const h1 = createElement("h1", { className: "hero-title" });
  h1.append("KP_Code");
  h1.appendChild(document.createElement("br"));
  h1.append("Digital Vault");

  heroContent.appendChild(h1);

  const p = createElement("p", {
    className: "hero-lead",
    text: homeContent.hero.lead,
  });

  heroContent.appendChild(p);

  const heroActions = createElement("div", { className: "hero-actions" }, [
    createElement("a", {
      className: "button",
      text: homeContent.hero.ctas.primaryLabel,
      attrs: { href: homeContent.hero.ctas.primaryHref },
    }),
    createElement("a", {
      className: "button secondary",
      text: homeContent.hero.ctas.secondaryLabel,
      attrs: { href: homeContent.hero.ctas.secondaryHref },
    }),
  ]);

  heroContent.appendChild(heroActions);

  const heroVisual = createElement("div", { className: "hero-visual" });
  const heroPoster = createElement("img", {
    attrs: {
      src: "assets/video/video-hero-960x540-poster.jpg",
      width: "960",
      height: "540",
      alt: "",
      loading: "eager",
      decoding: "async",
      fetchpriority: "high",
      style:
        "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;z-index:0;",
    },
  });
  heroVisual.appendChild(heroPoster);

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    let heroVideoLoaded = false;
    let idleHandle = null;
    const interactionEvents = ["pointerdown", "touchstart", "scroll", "keydown"];
    const removeInteractionListeners = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, upgradeToVideo);
      });
    };

    const upgradeToVideo = () => {
      if (heroVideoLoaded) {
        return;
      }
      heroVideoLoaded = true;
      removeInteractionListeners();
      if (idleHandle !== null) {
        if ("cancelIdleCallback" in window) {
          window.cancelIdleCallback(idleHandle);
        } else {
          clearTimeout(idleHandle);
        }
      }

      const heroVideo = createElement("video", {
        attrs: {
          autoplay: "",
          loop: "",
          muted: "",
          playsinline: "",
          preload: "metadata",
          poster: "assets/video/video-hero-960x540-poster.jpg",
        },
      });
      const webmSource = createElement("source", {
        attrs: {
          type: "video/webm",
          src: "assets/video/video-hero-960x540.webm",
        },
      });
      const mp4Source = createElement("source", {
        attrs: {
          type: "video/mp4",
          src: "assets/video/video-hero-960x540.optimized.mp4",
        },
      });
      heroVideo.appendChild(webmSource);
      heroVideo.appendChild(mp4Source);
      heroVideo.muted = true;
      heroVideo.autoplay = true;
      heroVideo.loop = true;
      heroVideo.playsInline = true;
      heroVisual.removeChild(heroPoster);
      heroVisual.appendChild(heroVideo);
      heroVideo.load();
      heroVideo.play().catch(() => {
        // Autoplay can be blocked; keep the poster frame.
      });
    };

    interactionEvents.forEach((eventName) => {
      const options = eventName === "keydown" ? { once: true } : { passive: true, once: true };
      window.addEventListener(eventName, upgradeToVideo, options);
    });

    if ("requestIdleCallback" in window) {
      idleHandle = window.requestIdleCallback(upgradeToVideo, { timeout: 2500 });
    } else {
      idleHandle = window.setTimeout(upgradeToVideo, 1800);
    }
  }

  hero.appendChild(heroContent);
  hero.appendChild(heroVisual);

  const enableDragScroll = (container) => {
    const canDrag =
      window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canDrag) {
      return;
    }

    const dragState = {
      isPointerDown: false,
      isDragging: false,
      wasDragged: false,
      startX: 0,
      startScrollLeft: 0,
    };
    const dragThreshold = 6;
    const dragSpeed = 1.2;

    const onPointerDown = (event) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      if (
        event.target.closest(
          "a, button, input, select, textarea, [role='button'], [data-action]"
        )
      ) {
        return;
      }
      dragState.isPointerDown = true;
      dragState.isDragging = false;
      dragState.wasDragged = false;
      dragState.startX = event.clientX;
      dragState.startScrollLeft = container.scrollLeft;
      container.classList.add("is-pointer-down");
      container.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event) => {
      if (!dragState.isPointerDown) {
        return;
      }
      const deltaX = event.clientX - dragState.startX;
      if (!dragState.isDragging && Math.abs(deltaX) >= dragThreshold) {
        dragState.isDragging = true;
        dragState.wasDragged = true;
        container.classList.add("is-dragging");
      }
      if (dragState.isDragging) {
        event.preventDefault();
        container.scrollLeft = dragState.startScrollLeft - deltaX * dragSpeed;
      }
    };

    const endDrag = (event) => {
      if (!dragState.isPointerDown) {
        return;
      }
      dragState.isPointerDown = false;
      dragState.isDragging = false;
      container.classList.remove("is-pointer-down");
      container.classList.remove("is-dragging");
      if (event && container.hasPointerCapture?.(event.pointerId)) {
        try {
          container.releasePointerCapture(event.pointerId);
        } catch {
          // Pointer capture might already be released or unavailable
        }

      }
    };

    const suppressClick = (event) => {
      if (dragState.wasDragged) {
        event.preventDefault();
        event.stopPropagation();
      }
      dragState.wasDragged = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove, { passive: false });
    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);
    container.addEventListener("click", suppressClick, true);
  };

  const debugIndicators =
    typeof window !== "undefined" &&
    (window.__DEBUG_SCROLL_INDICATORS__ ||
      new URLSearchParams(window.location.search).has("debugScrollIndicators"));

  const addScrollIndicators = (container, { shellClass = "", hint = false } = {}) => {
    const shell = createElement("div", {
      className: ["scroll-indicator-shell", shellClass, hint ? "has-hint" : ""]
        .filter(Boolean)
        .join(" "),
    });
    const overlay = createElement("div", {
      className: "scroll-indicator-arrows",
      attrs: { "aria-hidden": "true" },
    });
    const left = createElement("button", {
      className: "scroll-indicator-arrow is-left",
      attrs: { type: "button", "aria-label": homeContent.scrollIndicators.leftAria, tabindex: "0" },
    });
    const right = createElement("button", {
      className: "scroll-indicator-arrow is-right",
      attrs: { type: "button", "aria-label": homeContent.scrollIndicators.rightAria, tabindex: "0" },
    });

    overlay.appendChild(left);
    overlay.appendChild(right);
    shell.appendChild(container);
    shell.appendChild(overlay);

    let rafId = 0;
    const update = () => {
      const maxScroll = Math.max(container.scrollWidth - container.clientWidth, 0);
      const scrollable = maxScroll > 2;
      const scrollLeft = container.scrollLeft;
      shell.classList.toggle("is-scrollable", scrollable);
      shell.classList.toggle("can-scroll-left", scrollable && scrollLeft > 2);
      shell.classList.toggle("can-scroll-right", scrollable && scrollLeft < maxScroll - 2);
      if (debugIndicators) {
        console.debug("[scroll-indicator]", {
          container: container.className,
          scrollWidth: container.scrollWidth,
          clientWidth: container.clientWidth,
          scrollLeft,
          canLeft: scrollable && scrollLeft > 2,
          canRight: scrollable && scrollLeft < maxScroll - 2,
        });
      }
    };

    const scheduleUpdate = () => {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    const scrollByAmount = () => Math.max(container.clientWidth * 0.6, 180);
    const handleLeftClick = (event) => {
      event.preventDefault();
      container.scrollBy({ left: -scrollByAmount(), behavior: "smooth" });
    };
    const handleRightClick = (event) => {
      event.preventDefault();
      container.scrollBy({ left: scrollByAmount(), behavior: "smooth" });
    };
    const handleArrowKeydown = (handler) => (event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        handler(event);
      }
    };
    const handleLeftKeydown = handleArrowKeydown(handleLeftClick);
    const handleRightKeydown = handleArrowKeydown(handleRightClick);
    left.addEventListener("click", handleLeftClick);
    right.addEventListener("click", handleRightClick);
    left.addEventListener("keydown", handleLeftKeydown);
    right.addEventListener("keydown", handleRightKeydown);

    container.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    let resizeObserver = null;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(container);
    }

    if (debugIndicators) {
      console.debug("[scroll-indicator] mounted", {
        container: container.className,
        isConnected: container.isConnected,
      });
    }
    scheduleUpdate();
    const cleanup = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      left.removeEventListener("click", handleLeftClick);
      right.removeEventListener("click", handleRightClick);
      left.removeEventListener("keydown", handleLeftKeydown);
      right.removeEventListener("keydown", handleRightKeydown);
      container.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };
    return { shell, update: scheduleUpdate, cleanup };
  };

  const stats = createElement(
    "div",
    { className: "stats-grid" },
    homeContent.stats.items.map((item) =>
      createElement("div", { className: "card stat-card card--interactive" }, [
        createElement("h3", { text: item.value }),
        createElement("p", { text: item.label }),
      ])
    )
  );

  enableDragScroll(stats);
  const statsIndicators = addScrollIndicators(stats, { shellClass: "stats-shell", hint: true });

  const section = createElement("section", { className: "container section" });
  section.appendChild(createElement("h2", { text: homeContent.popular.title }));
  const grid = createElement("div", { className: "products-slider" });
  const productsIndicators = addScrollIndicators(grid, { shellClass: "products-shell", hint: true });

  const renderProductsGrid = (state) => {
    const { products, productsStatus, productsError } = state;
    if (
      renderDataState(grid, {
        status: productsStatus,
        items: products,
        error: productsError,
        loading: {
          count: 4,
          variant: "product-card",
          lineWidths: [70, 90],
          lineHeights: [18, 14],
          tagCount: 3,
          tagWidth: 52,
          priceWidth: 30,
        },
        errorState: {
          title: content.states.products.error.title,
          message: productsError || content.states.products.error.message,
          action: { element: createRetryButton() },
        },
        empty: {
          title: content.states.products.empty.title,
          message: content.states.products.empty.message,
          action: { label: content.common.browseProducts, href: "#/products" },
        },
      })
    ) {
      productsIndicators.update();
      return;
    }
    products.slice(0, 5).forEach((product) => {
      grid.appendChild(
        createProductCard(product, (id) => {
          cartService.addItem(id, 1);
          actions.cart.setCart(cartService.getCart());
          showToast(content.toasts.addedToCart);
        })
      );
    });
    productsIndicators.update();
  };

  let lastProducts = null;
  let lastStatus = null;
  let lastError = null;
  const handleStoreUpdate = (state) => {
    if (
      state.products === lastProducts &&
      state.productsStatus === lastStatus &&
      state.productsError === lastError
    ) {
      return;
    }
    lastProducts = state.products;
    lastStatus = state.productsStatus;
    lastError = state.productsError;
    renderProductsGrid(state);
  };

  const initialState = store.getState();
  lastProducts = initialState.products;
  lastStatus = initialState.productsStatus;
  lastError = initialState.productsError;
  renderProductsGrid(initialState);
  const unsubscribe = store.subscribe(handleStoreUpdate);
  main._homeUnsubscribe = unsubscribe;

  section.appendChild(productsIndicators.shell);
  enableDragScroll(grid);

  const info = createElement("section", { className: "container section" }, [
    createElement("div", { className: "card" }, [
      createElement("h2", { text: homeContent.info.title }),
      createElement("p", {
        text: homeContent.info.lead,
      }),
      createElement("div", { className: "tag-list" }, [
        createElement("span", { className: "badge", text: homeContent.info.badges[0] }),
        createElement("span", { className: "badge", text: homeContent.info.badges[1] }),
        createElement("span", {
          className: "badge",
          text: homeContent.info.badges[2].replace("{price}", formatCurrency(59)),
        }),
      ]),
    ]),
  ]);

  const statsSection = createElement("section", { className: "container stats-section" }, [
    statsIndicators.shell,
  ]);

  main.appendChild(hero);
  main.appendChild(statsSection);
  main.appendChild(section);
  statsIndicators.update();
  productsIndicators.update();
  main.appendChild(info);

  return () => {
    if (main._homeUnsubscribe) {
      main._homeUnsubscribe();
      main._homeUnsubscribe = null;
    }
    statsIndicators.cleanup();
    productsIndicators.cleanup();
  };
};
