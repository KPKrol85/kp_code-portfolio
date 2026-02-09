import { CONFIG } from "../config.js";
import { fetchJson } from "./data.js";
import { qs, qsa, on } from "./dom.js";
import { formatCurrency } from "../utils.js";
import { addToCart, updateCartCount } from "./cart.js";
import { showToast } from "./toast.js";

const renderProduct = (product) => {
  const root = qs(CONFIG.selectors.productRoot);
  if (!root) return;

  const title = qs("[data-product-title]", root);
  const price = qs("[data-product-price]", root);
  const oldPrice = qs("[data-product-old-price]", root);
  const rating = qs("[data-product-rating]", root);
  const stock = qs("[data-product-stock]", root);
  const description = qs("[data-product-description]", root);
  const highlights = qs("[data-product-highlights]", root);
  const specs = qs("[data-product-specs]", root);

  if (title) title.textContent = product.name;
  if (price) price.textContent = formatCurrency(product.price, product.currency);
  if (oldPrice) {
    if (product.oldPrice) {
      oldPrice.textContent = formatCurrency(product.oldPrice, product.currency);
    } else {
      oldPrice.textContent = "";
    }
  }
  if (rating) rating.textContent = `Ocena ${product.rating} • ${product.reviewsCount} opinii`;
  if (stock) stock.textContent = product.stockStatus;
  if (description) description.textContent = product.shortDescription;

  if (highlights) {
    highlights.innerHTML = "";
    product.highlights.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      highlights.appendChild(li);
    });
  }

  if (specs) {
    specs.innerHTML = "";
    Object.entries(product.specs).forEach(([label, value]) => {
      const row = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = label;
      const td = document.createElement("td");
      td.textContent = value;
      row.append(th, td);
      specs.appendChild(row);
    });
  }

  const mainImage = qs("[data-product-main]", root);
  const thumbs = qsa("[data-product-thumb]", root);
  if (mainImage) {
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
  }
  thumbs.forEach((thumb, index) => {
    const img = qs("img", thumb);
    if (img && product.images[index]) {
      img.src = product.images[index];
      img.alt = `${product.name} ${index + 1}`;
    }
    on(thumb, "click", () => {
      if (mainImage && product.images[index]) {
        mainImage.src = product.images[index];
        mainImage.alt = `${product.name} ${index + 1}`;
      }
    });
  });

  const addBtn = qs("[data-add-product]", root);
  const qtyInput = qs("[data-qty-input]", root);
  on(addBtn, "click", () => {
    const qty = qtyInput ? Number(qtyInput.value) : 1;
    addToCart(product, qty);
    updateCartCount();
    showToast(`${product.name} dodano do koszyka.`);
  });
};

const renderRelated = (products, current) => {
  const grid = qs(CONFIG.selectors.relatedGrid);
  if (!grid) return;
  grid.innerHTML = "";
  const related = products
    .filter((item) => item.category === current.category && item.id !== current.id)
    .slice(0, 3);
  related.forEach((product) => {
    const article = document.createElement("article");
    article.className = "card product-card";
    const media = document.createElement("div");
    media.className = "product-card__media";
    const img = document.createElement("img");
    img.src = product.images[0];
    img.alt = product.name;
    img.width = 320;
    img.height = 220;
    media.appendChild(img);

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.name;

    const price = document.createElement("div");
    price.className = "product-card__price";
    price.textContent = formatCurrency(product.price, product.currency);

    const link = document.createElement("a");
    link.href = `produkt.html?slug=${product.slug}`;
    link.className = "btn btn--outline btn--small";
    link.textContent = "Zobacz";

    body.append(title, price, link);
    article.append(media, body);
    grid.appendChild(article);
  });
};

export const initProduct = async () => {
  const root = qs(CONFIG.selectors.productRoot);
  if (!root) return;
  const products = await fetchJson("data/products.json");
  const slug = new URLSearchParams(window.location.search).get("slug");
  const product = products.find((item) => item.slug === slug) || products[0];
  renderProduct(product);
  renderRelated(products, product);
};
