import { createElement } from "../utils/dom.js";
import { formatCurrency } from "../utils/format.js";
import { createResponsivePicture } from "../utils/images.js";
import { navigateHash } from "../utils/navigation.js";

export const createProductCard = (product, onAdd) => {
  const card = createElement("article", {
    className: "card card-product",
    attrs: { "data-product-id": product.id },
  });
  const image = createResponsivePicture({
    imageBase: product.thumbnail,
    alt: product.name,
    width: "320",
    height: "200",
    loading: "lazy",
    decoding: "async",
    sizes: "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw",
  });
  const title = createElement("h3", { text: product.name });
  const description = createElement("p", { text: product.shortDescription });
  const tags = createElement("div", { className: "tag-list" });
  product.tags.forEach((tag) =>
    tags.appendChild(createElement("span", { className: "badge", text: tag }))
  );
  const price = createElement("div", { className: "price", text: formatCurrency(product.price) });
  const actions = createElement("div", { className: "flex-between" }, [
    createElement("a", {
      className: "button secondary",
      text: "Zobacz",
      attrs: { href: `#/products/${product.id}` },
    }),
    createElement("button", {
      className: "button",
      text: "Dodaj do koszyka",
      attrs: { type: "button" },
    }),
  ]);

  const detailsLink = actions.querySelector("a");
  const addButton = actions.querySelector("button");

  detailsLink.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigateHash(`#/products/${product.id}`);
  });

  addButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onAdd(product.id);
  });

  const media = createElement("div", { className: "card-product__media" }, [image]);
  card.appendChild(media);
  card.appendChild(title);
  card.appendChild(description);
  card.appendChild(tags);
  card.appendChild(price);
  card.appendChild(actions);
  return card;
};
