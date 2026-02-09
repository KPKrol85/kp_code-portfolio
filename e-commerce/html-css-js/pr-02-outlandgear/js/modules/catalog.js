import { CONFIG } from "../config.js";
import { fetchJson } from "./data.js";
import { qs, qsa, on, delegate } from "./dom.js";
import { debounce, formatCurrency } from "../utils.js";
import { addToCart, updateCartCount } from "./cart.js";
import { showToast } from "./toast.js";

const parseRange = (value) => {
  if (!value) return null;
  const [min, max] = value.split("-").map(Number);
  return { min, max };
};

const sorters = {
  popularity: (a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  newest: (a, b) => b.id - a.id,
};

const createCard = (product) => {
  const article = document.createElement("article");
  article.className = "card product-card";

  const media = document.createElement("div");
  media.className = "product-card__media";
  const img = document.createElement("img");
  img.src = product.images[0];
  img.alt = product.name;
  img.loading = "lazy";
  img.width = 320;
  img.height = 220;
  media.appendChild(img);

  if (product.badges && product.badges.length) {
    const badge = document.createElement("span");
    const badgeKey = product.badges[0].toLowerCase();
    badge.className = `badge product-card__badge badge--${badgeKey}`;
    badge.textContent = product.badges[0];
    media.appendChild(badge);
  }

  const body = document.createElement("div");
  const title = document.createElement("h3");
  title.className = "product-card__title";
  title.textContent = product.name;

  const meta = document.createElement("div");
  meta.className = "product-card__meta";
  meta.textContent = `Ocena ${product.rating} • ${product.reviewsCount} opinii`;

  const price = document.createElement("div");
  price.className = "product-card__price";
  price.textContent = formatCurrency(product.price, product.currency);

  if (product.oldPrice) {
    const oldPrice = document.createElement("span");
    oldPrice.className = "product-card__price--old";
    oldPrice.textContent = formatCurrency(product.oldPrice, product.currency);
    price.appendChild(oldPrice);
  }

  const actions = document.createElement("div");
  actions.className = "product-card__actions";

  const viewLink = document.createElement("a");
  viewLink.href = `produkt.html?slug=${product.slug}`;
  viewLink.className = "btn btn--outline btn--small";
  viewLink.textContent = "Zobacz";

  const addBtn = document.createElement("button");
  addBtn.className = "btn btn--small";
  addBtn.type = "button";
  addBtn.textContent = "Dodaj do koszyka";
  addBtn.setAttribute("data-add-to-cart", product.id);

  actions.append(viewLink, addBtn);
  body.append(title, price, meta, actions);

  article.append(media, body);
  return article;
};

const renderListing = (products, grid, countEl, limit) => {
  grid.innerHTML = "";
  const items = products.slice(0, limit);
  items.forEach((product) => grid.appendChild(createCard(product)));
  if (countEl) {
    countEl.textContent = `${products.length} produktów`;
  }
};

const applyFilters = (products, filters, searchTerm) => {
  const term = searchTerm?.toLowerCase() ?? "";
  return products
    .filter((product) => {
      if (term) {
        const haystack = `${product.name} ${product.shortDescription} ${product.badges.join(" ")}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (filters.subcategory && product.subcategory !== filters.subcategory) return false;
      if (filters.rating && product.rating < filters.rating) return false;
      if (filters.range) {
        if (product.price < filters.range.min || product.price > filters.range.max) return false;
      }
      if (filters.badges.length) {
        const hasBadge = filters.badges.some((badge) => product.badges.includes(badge));
        if (!hasBadge) return false;
      }
      return true;
    })
    .sort(sorters[filters.sort] || sorters.popularity);
};

const getFilters = (form) => {
  const rangeValue = qs("[name=price]", form)?.value;
  const ratingValue = qs("[name=rating]", form)?.value;
  const subValue = qs("[name=subcategory]", form)?.value;
  const sortValue = qs("[name=sort]", form)?.value;
  const badgeInputs = qsa("[name=badge]:checked", form);
  return {
    range: parseRange(rangeValue),
    rating: ratingValue ? Number(ratingValue) : 0,
    subcategory: subValue || "",
    badges: badgeInputs.map((input) => input.value),
    sort: sortValue || "popularity",
  };
};

export const initCatalog = async () => {
  const grid = qs(CONFIG.selectors.listingGrid);
  if (!grid) return;

  const products = await fetchJson("data/products.json");
  const form = qs(CONFIG.selectors.filtersForm);
  const countEl = qs(CONFIG.selectors.listingCount);
  const loadMoreBtn = qs(CONFIG.selectors.listingLoad);
  const searchInput = qs(CONFIG.selectors.searchInput);

  let limit = CONFIG.perPage;
  let searchTerm = new URLSearchParams(window.location.search).get("q") || "";
  if (searchInput && searchTerm) {
    searchInput.value = searchTerm;
  }

  const updateListing = () => {
    const filters = form ? getFilters(form) : { range: null, rating: 0, subcategory: "", badges: [], sort: "popularity" };
    const filtered = applyFilters(products, filters, searchTerm);
    renderListing(filtered, grid, countEl, limit);

    if (loadMoreBtn) {
      loadMoreBtn.hidden = filtered.length <= limit;
      loadMoreBtn.setAttribute("aria-hidden", String(filtered.length <= limit));
    }

    const emptyState = qs("[data-empty-state]");
    if (emptyState) {
      emptyState.hidden = filtered.length !== 0;
    }
  };

  if (form) {
    on(form, "change", () => {
      limit = CONFIG.perPage;
      updateListing();
    });
  }

  if (searchInput) {
    on(
      searchInput,
      "input",
      debounce((event) => {
        searchTerm = event.target.value.trim();
        limit = CONFIG.perPage;
        updateListing();
      }, CONFIG.debounceMs)
    );
  }

  if (loadMoreBtn) {
    on(loadMoreBtn, "click", () => {
      limit += CONFIG.perPage;
      updateListing();
    });
  }

  delegate(grid, "[data-add-to-cart]", "click", (_, target) => {
    const productId = Number(target.getAttribute("data-add-to-cart"));
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    addToCart(product, 1);
    updateCartCount();
    showToast(`${product.name} dodano do koszyka.`);
  });

  updateListing();
};
