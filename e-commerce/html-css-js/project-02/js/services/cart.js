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
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    this.saveCart(cart);
    return cart;
  },
  updateItem(productId, quantity) {
    let cart = this.getCart();
    cart = cart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    cart = cart.filter((item) => item.quantity > 0);
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
