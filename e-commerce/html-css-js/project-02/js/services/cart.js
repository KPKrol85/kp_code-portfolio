import { storage } from "./storage.js";
import { store } from "../store/store.js";

const LEGACY_CART_KEY = "kp_cart";
const CART_KEY_PREFIX = "kp_cart_";
const GUEST_CART_KEY = "kp_cart_guest";

const getUserId = () => store.getState().user?.id ?? null;

const getCartKey = (userId) => (userId ? `${CART_KEY_PREFIX}${userId}` : GUEST_CART_KEY);

const getCartByKey = (key) => normalizeCart(storage.get(key, []));

const normalizeCart = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (!item || typeof item.productId !== "string") {
        return null;
      }
      const quantity = Number.isFinite(item.quantity) ? Math.max(1, Math.floor(item.quantity)) : 1;
      return { productId: item.productId, quantity };
    })
    .filter(Boolean);
};

const mergeCarts = (primary, secondary) => {
  const result = normalizeCart(primary);
  const index = new Map(result.map((item) => [item.productId, item]));
  normalizeCart(secondary).forEach((item) => {
    const existing = index.get(item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      const entry = { ...item };
      result.push(entry);
      index.set(item.productId, entry);
    }
  });
  return result;
};

const migrateLegacyCart = (userId) => {
  const legacy = storage.get(LEGACY_CART_KEY, null);
  if (!legacy) {
    return;
  }
  if (!Array.isArray(legacy)) {
    return;
  }
  const targetKey = getCartKey(userId);
  const existing = storage.get(targetKey, []);
  const next = Array.isArray(existing) && existing.length ? mergeCarts(existing, legacy) : legacy;
  storage.set(targetKey, normalizeCart(next));
  storage.remove(LEGACY_CART_KEY);
};

export const cartService = {
  mergeGuestCartIntoUserCart(userId) {
    if (!userId) {
      return this.getCart();
    }
    migrateLegacyCart(userId);
    const guestCart = getCartByKey(GUEST_CART_KEY);
    if (!guestCart.length) {
      return getCartByKey(getCartKey(userId));
    }
    const userCartKey = getCartKey(userId);
    const userCart = getCartByKey(userCartKey);
    const mergedCart = mergeCarts(userCart, guestCart);
    storage.set(userCartKey, mergedCart);
    storage.remove(GUEST_CART_KEY);
    return mergedCart;
  },
  getCart() {
    const userId = getUserId();
    migrateLegacyCart(userId);
    return getCartByKey(getCartKey(userId));
  },
  saveCart(cart) {
    const userId = getUserId();
    storage.set(getCartKey(userId), normalizeCart(cart));
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
    const userId = getUserId();
    storage.remove(getCartKey(userId));
  },
};

export const __cartTestUtils = {
  normalizeCart,
  mergeCarts,
};
