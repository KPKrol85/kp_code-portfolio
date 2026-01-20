import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";
import { createProductCard } from "../components/productCard.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { renderDataState, createRetryButton } from "../components/uiStates.js";
import { content } from "../content/pl.js";
import { actions } from "../store/actions.js";

export const renderHome = () => {
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
    text: "Produkty cyfrowe dla twórców i firm: szablony stron, UI kits, komponenty i mini-narzędzia — gotowe do użycia w Twoich projektach.",
  });

  heroContent.appendChild(p);

  const heroActions = createElement("div", { className: "hero-actions" }, [
    createElement("a", {
      className: "button",
      text: "Przeglądaj produkty",
      attrs: { href: "#/products" },
    }),
    createElement("a", {
      className: "button secondary",
      text: "Zobacz demo konta",
      attrs: { href: "#/account" },
    }),
  ]);

  heroContent.appendChild(heroActions);

  const heroVisual = createElement("div", { className: "hero-visual" });
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
      "data-src": "assets/video/video-hero-960x540.webm",
    },
  });
  const mp4Source = createElement("source", {
    attrs: {
      type: "video/mp4",
      "data-src": "assets/video/video-hero-960x540.optimized.mp4",
    },
  });
  heroVideo.appendChild(webmSource);
  heroVideo.appendChild(mp4Source);
  heroVideo.muted = true;
  heroVideo.autoplay = true;
  heroVideo.loop = true;
  heroVideo.playsInline = true;
  heroVisual.appendChild(heroVideo);

  let heroVideoLoaded = false;
  const loadHeroVideo = () => {
    if (heroVideoLoaded) {
      return;
    }
    heroVideoLoaded = true;
    heroVideo.querySelectorAll("source").forEach((source) => {
      const dataSrc = source.getAttribute("data-src");
      if (dataSrc) {
        source.setAttribute("src", dataSrc);
      }
    });
    heroVideo.load();
    heroVideo.play().catch(() => {
      // Autoplay can be blocked; keep the poster frame.
    });
  };

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadHeroVideo();
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    observer.observe(heroVisual);
  } else if (!prefersReducedMotion) {
    loadHeroVideo();
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
        } catch {}
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
      attrs: { type: "button", "aria-hidden": "true", tabindex: "-1" },
    });
    const right = createElement("button", {
      className: "scroll-indicator-arrow is-right",
      attrs: { type: "button", "aria-hidden": "true", tabindex: "-1" },
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
    left.addEventListener("click", (event) => {
      event.preventDefault();
      container.scrollBy({ left: -scrollByAmount(), behavior: "smooth" });
    });
    right.addEventListener("click", (event) => {
      event.preventDefault();
      container.scrollBy({ left: scrollByAmount(), behavior: "smooth" });
    });

    container.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(scheduleUpdate);
      observer.observe(container);
    }

    if (debugIndicators) {
      console.debug("[scroll-indicator] mounted", {
        container: container.className,
        isConnected: container.isConnected,
      });
    }
    scheduleUpdate();
    return { shell, update: scheduleUpdate };
  };

  const stats = createElement("div", { className: "stats-grid" }, [
    createElement("div", { className: "card stat-card" }, [
      createElement("h3", { text: "6" }),
      createElement("p", { text: "Gotowych rozwiązań cyfrowych" }),
    ]),
    createElement("div", { className: "card stat-card" }, [
      createElement("h3", { text: "Senior-level" }),
      createElement("p", { text: "Jakość kodu i architektury" }),
    ]),
    createElement("div", { className: "card stat-card" }, [
      createElement("h3", { text: "< 24h" }),
      createElement("p", { text: "Czas wdrożenia produktu" }),
    ]),
    createElement("div", { className: "card stat-card" }, [
      createElement("h3", { text: "Dożywotni dostęp" }),
      createElement("p", { text: "Aktualizacje w cenie" }),
    ]),
  ]);

  enableDragScroll(stats);
  const statsIndicators = addScrollIndicators(stats, { shellClass: "stats-shell", hint: true });

  const section = createElement("section", { className: "container section" });
  section.appendChild(createElement("h2", { text: "Popularne produkty" }));
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
          count: 5,
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
      createElement("h2", { text: "Dlaczego Digital Vault?" }),
      createElement("p", {
        text: "Digital Vault to starannie wyselekcjonowane produkty cyfrowe, które pomagają szybciej tworzyć, uczyć się i rozwijać projekty. Dla twóców, zespołów oraz osób, które po prostu chcą dobrych narzędzi bez chaosu.",
      }),
      createElement("div", { className: "tag-list" }, [
        createElement("span", { className: "badge", text: "Natychmiastowy dostęp" }),
        createElement("span", { className: "badge", text: "Aktualizacje w cenie" }),
        createElement("span", { className: "badge", text: `Ceny od ${formatCurrency(59)}` }),
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
};
