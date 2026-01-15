import { storage } from "./storage.js";

const CART_KEY = "kp_cart";

export const cartService = {
  getCart() {
    return storage.get(CART_KEY, []);
  },
  saveCart(cart) {
    storage.set(CART_KEY, cart);
  },
  addItem(productId, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find((item) => item.productId === productId);
    const safeQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
    if (existing) {
      existing.quantity += safeQuantity;
    } else {
      cart.push({ productId, quantity: safeQuantity });
    }
    this.saveCart(cart);
    return cart;
  },
  updateItem(productId, quantity) {
    const safeQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
    const cart = this.getCart().map((item) =>
      item.productId === productId ? { ...item, quantity: safeQuantity } : item
    );
    this.saveCart(cart);
    return cart;
  },
  removeItem(productId) {
    const cart = this.getCart().filter((item) => item.productId !== productId);
    this.saveCart(cart);
    return cart;
  },
  clear() {
    storage.remove(CART_KEY);
  },
};
