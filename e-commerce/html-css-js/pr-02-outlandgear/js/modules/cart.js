import { CONFIG } from "../config.js";
import { fetchJson } from "./data.js";
import { qs, qsa, on, delegate } from "./dom.js";
import { loadCart, saveCart } from "./storage.js";
import { clamp, formatCurrency } from "../utils.js";

let productsCache = [];

const getCart = () => loadCart();

const setCart = (cart) => {
  saveCart(cart);
};

export const addToCart = (product, qty = 1) => {
  const cart = getCart();
  const existing = cart.items.find((item) => item.id === product.id);
  if (existing) {
    existing.qty = clamp(existing.qty + qty, 1, 99);
  } else {
    cart.items.push({ id: product.id, qty: clamp(qty, 1, 99) });
  }
  setCart(cart);
};

export const updateCartCount = () => {
  const cart = getCart();
  const count = cart.items.reduce((total, item) => total + item.qty, 0);
  qsa(CONFIG.selectors.cartCount).forEach((el) => {
    el.textContent = String(count);
  });
};

const removeItem = (id) => {
  const cart = getCart();
  cart.items = cart.items.filter((item) => item.id !== id);
  setCart(cart);
};

const updateQty = (id, qty) => {
  const cart = getCart();
  const item = cart.items.find((entry) => entry.id === id);
  if (item) {
    item.qty = clamp(qty, 1, 99);
  }
  setCart(cart);
};

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 600 ? 0 : 24;
  return { subtotal, delivery, total: subtotal + delivery };
};

const renderCart = (items) => {
  const container = qs(CONFIG.selectors.cartContainer);
  const summary = qs(CONFIG.selectors.cartSummary);
  const empty = qs(CONFIG.selectors.cartEmpty);
  if (!container || !summary) return;

  container.innerHTML = "";
  if (!items.length) {
    if (empty) empty.hidden = false;
    summary.innerHTML = "";
    return;
  }

  if (empty) empty.hidden = true;

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.setAttribute("data-cart-item", item.id);

    const media = document.createElement("img");
    media.className = "cart-item__media";
    media.src = item.images[0];
    media.alt = item.name;
    media.width = 90;
    media.height = 90;

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.name;
    const meta = document.createElement("p");
    meta.className = "subtle";
    meta.textContent = `${item.category} • ${item.subcategory}`;
    info.append(title, meta);

    const price = document.createElement("div");
    price.textContent = formatCurrency(item.price, item.currency);

    const qtyGroup = document.createElement("div");
    const qtyLabel = document.createElement("label");
    qtyLabel.className = "visually-hidden";
    qtyLabel.textContent = "Ilość";
    qtyLabel.setAttribute("for", `qty-${item.id}`);
    const qtyInput = document.createElement("input");
    qtyInput.className = "form__input";
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.max = "99";
    qtyInput.value = String(item.qty);
    qtyInput.id = `qty-${item.id}`;
    qtyInput.setAttribute("data-qty-input", item.id);

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn--ghost btn--small";
    removeBtn.type = "button";
    removeBtn.textContent = "Usuń";
    removeBtn.setAttribute("data-remove-item", item.id);

    qtyGroup.append(qtyLabel, qtyInput, removeBtn);

    row.append(media, info, price, qtyGroup);
    container.appendChild(row);
  });

  const totals = calculateTotals(items);
  summary.innerHTML = `
    <div class="cart-summary__row"><span>Subtotal</span><span>${formatCurrency(totals.subtotal)}</span></div>
    <div class="cart-summary__row"><span>Dostawa</span><span>${totals.delivery ? formatCurrency(totals.delivery) : "0 PLN"}</span></div>
    <div class="cart-summary__row"><span>Razem</span><span>${formatCurrency(totals.total)}</span></div>
  `;
};

const hydrateItems = (products, cart) =>
  cart.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product) return null;
      return { ...product, qty: item.qty };
    })
    .filter(Boolean);

export const initCart = async () => {
  const container = qs(CONFIG.selectors.cartContainer);
  if (!container) {
    updateCartCount();
    return;
  }
  productsCache = await fetchJson("data/products.json");
  const cart = getCart();
  const items = hydrateItems(productsCache, cart);
  renderCart(items);
  updateCartCount();

  delegate(container, "[data-remove-item]", "click", (_, target) => {
    const id = Number(target.getAttribute("data-remove-item"));
    removeItem(id);
    const refreshed = hydrateItems(productsCache, getCart());
    renderCart(refreshed);
    updateCartCount();
  });

  delegate(container, "[data-qty-input]", "change", (event, target) => {
    const id = Number(target.getAttribute("data-qty-input"));
    const qty = Number(target.value);
    updateQty(id, qty);
    const refreshed = hydrateItems(productsCache, getCart());
    renderCart(refreshed);
    updateCartCount();
  });
};
