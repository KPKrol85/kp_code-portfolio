import { createElement, clearElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";
import { createProductCard } from "../components/productCard.js";
import { cartService } from "../services/cart.js";
import { showToast } from "../components/toast.js";
import { store } from "../store/store.js";
import { renderDataState } from "../components/uiStates.js";

export const renderHome = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  if (main._homeUnsubscribe) {
    main._homeUnsubscribe();
    main._homeUnsubscribe = null;
  }

  const hero = createElement("section", { className: "container hero" });
  const heroContent = createElement("div", { className: "hero-content" });

  const h1 = createElement("h1");
  h1.append("KP_Code");
  h1.appendChild(document.createElement("br"));
  h1.append("Digital Vault");

  heroContent.appendChild(h1);

  heroContent.appendChild(
    createElement("p", {
      text: "Nowoczesny sklep z produktami cyfrowymi: szablony, UI kits i mini-narzędzia dla zespołów produktowych.",
    })
  );

  const heroActions = createElement("div", { className: "nav-links hero-actions" }, [
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

  const stats = createElement("div", { className: "grid grid-3 stats-grid" }, [
    createElement("div", { className: "card stat-card" }, [
      createElement("h3", { text: "6" }),
      createElement("p", { text: "Produktów dostępnych od ręki" }),
    ]),
    createElement("div", { className: "card stat-card" }, [
      createElement("h3", { text: "98%" }),
      createElement("p", { text: "Zadowolonych klientów (mock)" }),
    ]),
    createElement("div", { className: "card stat-card" }, [
      createElement("h3", { text: "24h" }),
      createElement("p", { text: "Średni czas wdrożenia" }),
    ]),
  ]);

  const section = createElement("section", { className: "container section" });
  section.appendChild(createElement("h2", { text: "Popularne produkty" }));
  const grid = createElement("div", { className: "grid grid-3" });

  const renderProductsGrid = (state) => {
    const { products, productsStatus, productsError } = state;
    if (
      renderDataState(grid, {
        status: productsStatus,
        items: products,
        error: productsError,
        loading: {
          count: 3,
          imageHeight: 180,
          lineWidths: [60, 80],
          lineHeights: [18, 14],
        },
        errorState: {
          title: "Nie udalo sie pobrac produktow",
          message: productsError || "Sprobuj ponownie pozniej.",
        },
        empty: {
          title: "Brak produktow",
          message: "Brak produktow do wyswietlenia.",
          action: { label: "Przegladaj produkty", href: "#/products" },
        },
      })
    ) {
      return;
    }
    products.slice(0, 3).forEach((product) => {
      grid.appendChild(
        createProductCard(product, (id) => {
          cartService.addItem(id, 1);
          store.setState({ cart: cartService.getCart() });
          showToast("Dodano produkt do koszyka.");
        })
      );
    });
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

  section.appendChild(grid);

  const info = createElement("section", { className: "container section" }, [
    createElement("div", { className: "card" }, [
      createElement("h2", { text: "Dlaczego Digital Vault?" }),
      createElement("p", {
        text: "Zbieramy i aktualizujemy najlepsze assety dla projektantów i zespołów product development.",
      }),
      createElement("div", { className: "tag-list" }, [
        createElement("span", { className: "badge", text: "Natychmiastowy dostęp" }),
        createElement("span", { className: "badge", text: "Aktualizacje w cenie" }),
        createElement("span", { className: "badge", text: `Ceny od ${formatCurrency(59)}` }),
      ]),
    ]),
  ]);

  main.appendChild(hero);
  main.appendChild(stats);
  main.appendChild(section);
  main.appendChild(info);
};
