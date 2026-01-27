import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { showToast } from "../components/toast.js";
import { renderNotice, createRetryButton } from "../components/uiStates.js";
import { content } from "../content/pl.js";
import { cartService } from "../services/cart.js";
import { purchasesService } from "../services/purchases.js";
import { actions } from "../store/actions.js";
import { store } from "../store/store.js";
import { buildProductDetailsBreadcrumbs } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { createDownloadLink, getDownloadLabel } from "../utils/downloads.js";
import { formatCurrency, formatDate } from "../utils/format.js";
import { createResponsivePicture, updateResponsivePicture } from "../utils/images.js";
import { setMeta } from "../utils/meta.js";
import { getCategoryLabel } from "../utils/productCategories.js";

export const renderProductDetails = ({ id }) => {
  const main = document.getElementById("main-content");
  clearElement(main);

  if (main._productDetailsUnsubscribe) {
    main._productDetailsUnsubscribe();
    main._productDetailsUnsubscribe = null;
  }

  const renderView = (state) => {
    clearElement(main);
    const { products, productsStatus, productsError } = state;

    if (productsStatus === "loading" || productsStatus === "idle") {
      setMeta({
        title: content.states.productDetails.loading.metaTitle,
        description: content.states.productDetails.loading.message,
      });
      const container = createElement("div", { className: "container" });
      renderNotice(container, {
        title: content.states.productDetails.loading.title,
        message: content.states.productDetails.loading.message,
      });
      main.appendChild(container);
      return;
    }

    if (productsStatus === "error") {
      setMeta({
        title: content.states.productDetails.error.metaTitle,
        description: productsError || content.states.productDetails.error.message,
      });
      const container = createElement("div", { className: "container" });
      renderNotice(container, {
        title: content.states.productDetails.error.metaTitle,
        message: productsError || content.states.productDetails.error.message,
        action: { element: createRetryButton() },
      });
      main.appendChild(container);
      return;
    }

    const product = products.find((item) => item.id === id);
    if (!product) {
      setMeta({
        title: content.states.productDetails.notFound.metaTitle,
        description: content.states.productDetails.notFound.metaDescription,
      });
      const container = createElement("div", { className: "container" });
      renderNotice(container, {
        title: content.states.productDetails.notFound.title,
        message: content.states.productDetails.notFound.message,
        action: { label: content.common.backToCatalog, href: "#/products" },
      });
      main.appendChild(container);
      return;
    }

    setMeta({
      title: `${product.name} - KP_Code Digital Vault`,
      description:
        product.shortDescription || product.description || "Szczegóły produktu cyfrowego.",
    });

    const wrapper = createElement("section", { className: "container" });
    const breadcrumbs = createBreadcrumbs(buildProductDetailsBreadcrumbs(product));
    const hero = createElement("section", { className: "hero services-hero products-hero" });
    const heroContent = createElement("div", { className: "hero-content" });
    if (breadcrumbs) {
      wrapper.appendChild(breadcrumbs);
    }
    heroContent.appendChild(
      createElement("h1", {
        text: product.name,
        attrs: { tabindex: "-1", "data-focus-heading": "true" },
      })
    );
    heroContent.appendChild(
      createElement("p", {
        className: "hero-lead",
        text: product.shortDescription || product.description || "Szczegóły produktu cyfrowego.",
      })
    );
    hero.appendChild(heroContent);
    wrapper.appendChild(hero);
    const layout = createElement("div", { className: "grid grid-2 section" });

    const buildMedia = (images) => {
      const mainSizes = "(min-width: 960px) 480px, 100vw";
      const thumbSizes = "120px";
      const gallery = createElement("div", { className: "product-gallery" });
      const main = createElement("div", { className: "product-gallery__main" });
      const mainPicture = createResponsivePicture({
        imageBase: images[0],
        imgClassName: "product-gallery__main-image",
        alt: product.name,
        loading: "eager",
        decoding: "async",
        fetchPriority: "high",
        sizes: mainSizes,
      });
      let currentBase = images[0];
      main.appendChild(mainPicture);

      const slider = createElement("div", { className: "product-gallery__thumbs" });
      const thumbs = images.slice(1);
      let currentIndex = 0;
      const setActiveThumb = (nextIndex, { focus } = {}) => {
        const normalizedIndex = Math.max(0, Math.min(thumbs.length - 1, nextIndex));
        const nextBase = thumbs[normalizedIndex];
        if (currentBase !== nextBase) {
          updateResponsivePicture(mainPicture, nextBase, { sizes: mainSizes });
          currentBase = nextBase;
        }
        slider.querySelectorAll(".product-gallery__thumb").forEach((thumb, thumbIndex) => {
          const isActive = thumbIndex === normalizedIndex;
          thumb.classList.toggle("is-active", isActive);
          thumb.setAttribute("aria-pressed", isActive ? "true" : "false");
          thumb.tabIndex = isActive ? 0 : -1;
          if (isActive && focus) {
            thumb.focus();
          }
        });
        currentIndex = normalizedIndex;
      };
      thumbs.forEach((imageBase, index) => {
        const isActive = index === currentIndex;
        const image = createResponsivePicture({
          imageBase,
          imgClassName: "product-gallery__thumb-image",
          alt: `${product.name} ${index + 2}`,
          loading: "lazy",
          decoding: "async",
          sizes: thumbSizes,
        });
        const item = createElement(
          "button",
          {
            className: `product-gallery__thumb${isActive ? " is-active" : ""}`,
            attrs: {
              type: "button",
              "aria-label": `Zobacz zdjęcie ${index + 2}`,
              "aria-pressed": isActive ? "true" : "false",
              tabindex: isActive ? "0" : "-1",
            },
          },
          [image]
        );
        item.addEventListener("click", () => {
          setActiveThumb(index);
        });
        item.addEventListener("keydown", (event) => {
          const { key } = event;
          if (key === "ArrowRight") {
            event.preventDefault();
            setActiveThumb(currentIndex + 1, { focus: true });
          } else if (key === "ArrowLeft") {
            event.preventDefault();
            setActiveThumb(currentIndex - 1, { focus: true });
          } else if (key === "Home") {
            event.preventDefault();
            setActiveThumb(0, { focus: true });
          } else if (key === "End") {
            event.preventDefault();
            setActiveThumb(thumbs.length - 1, { focus: true });
          }
        });
        slider.appendChild(item);
      });

      gallery.appendChild(main);
      if (thumbs.length) {
        gallery.appendChild(slider);
      }
      return gallery;
    };

    const buildThumbnail = () =>
      createResponsivePicture({
        imageBase: product.thumbnail,
        imgClassName: "product-hero-image",
        alt: product.name,
        width: "320",
        height: "200",
        loading: "lazy",
        decoding: "async",
        sizes: "(min-width: 960px) 320px, 60vw",
      });

    const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    const media = images.length ? buildMedia(images) : buildThumbnail();
    const details = createElement("div", { className: "card" });
    details.appendChild(createElement("h2", { text: product.name }));
    details.appendChild(createElement("p", { text: product.description }));
    details.appendChild(
      createElement("div", { className: "price", text: formatCurrency(product.price) })
    );

    const tags = createElement("div", { className: "tag-list" });
    product.tags.forEach((tag) =>
      tags.appendChild(createElement("span", { className: "badge", text: tag }))
    );
    details.appendChild(tags);

    const metaList = createElement("div", { className: "surface-muted" }, [
      createElement("p", { text: `Kategoria: ${getCategoryLabel(product.category)}` }),
      createElement("p", { text: `Wymagania: ${product.requirements}` }),
      createElement("p", { text: `Wersja: ${product.version}` }),
      createElement("p", { text: `Aktualizacja: ${formatDate(product.updatedAt)}` }),
    ]);
    details.appendChild(metaList);

    const actionRow = createElement("div", { className: "nav-links" });
    const addButton = createElement("button", {
      className: "button",
      text: "Dodaj do koszyka",
      attrs: { type: "button" },
    });
    addButton.addEventListener("click", () => {
      cartService.addItem(product.id, 1);
      actions.cart.setCart(cartService.getCart());
      showToast(content.toasts.addedToCartDetails);
    });
    actionRow.appendChild(addButton);
    actionRow.appendChild(
      createElement("a", {
        className: "button secondary",
        text: "Przejdź do koszyka",
        attrs: { href: "#/cart" },
      })
    );
    details.appendChild(actionRow);

    const contents = createElement("div", { className: "card section" }, [
      createElement("h2", { text: "Zawartość paczki" }),
    ]);
    const list = createElement("ul");
    product.bundleContents.forEach((item) => list.appendChild(createElement("li", { text: item })));
    contents.appendChild(list);

    const downloads = createElement("div", { className: "card section" }, [
      createElement("h2", { text: "Pliki do pobrania" }),
    ]);
    const downloadList = createElement("ul");
    const hasAccess = purchasesService
      .getPurchases()
      .some((purchase) => purchase.items.some((entry) => entry.productId === product.id));

    const downloadables = Array.isArray(product.downloadables) ? product.downloadables : [];
    downloadables.forEach((item) => {
      if (hasAccess) {
        const link = createDownloadLink(item);
        if (!link) {
          return;
        }
        downloadList.appendChild(createElement("li", {}, [link]));
        return;
      }
      downloadList.appendChild(
        createElement("li", { text: getDownloadLabel(item, { locked: true }) })
      );
    });
    downloads.appendChild(downloadList);
    if (!hasAccess) {
      downloads.appendChild(
        createElement("p", { text: content.states.productDetails.downloadsHint })
      );
    }

    layout.appendChild(media);
    layout.appendChild(details);

    wrapper.appendChild(layout);
    wrapper.appendChild(contents);
    wrapper.appendChild(downloads);

    main.appendChild(wrapper);
  };

  renderView(store.getState());
  main._productDetailsUnsubscribe = store.subscribe(renderView);

  return () => {
    if (main._productDetailsUnsubscribe) {
      main._productDetailsUnsubscribe();
      main._productDetailsUnsubscribe = null;
    }
  };
};
