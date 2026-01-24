import { normalizeProducts } from "../data/productNormalizers.js";
import { store } from "./store.js";

const patch = (partial) => {
  store.setState(partial);
};

const patchUi = (partialUi) => {
  const prevUi = store.getState().ui || {};
  patch({ ui: { ...prevUi, ...partialUi } });
};

export const actions = {
  ui: {
    setTheme(theme) {
      patchUi({ theme });
    },
  },
  user: {
    setSession(session, user) {
      patch({ session, user });
    },
  },
  cart: {
    setCart(cart) {
      patch({ cart });
    },
    clearCart() {
      patch({ cart: [] });
    },
    removeItemById(cart, productId) {
      patch({ cart: cart.filter((item) => item.productId !== productId) });
    },
    removeItemsById(cart, productIds) {
      const removeSet = new Set(productIds);
      patch({ cart: cart.filter((item) => !removeSet.has(item.productId)) });
    },
  },
  data: {
    setProductsLoading() {
      patch({ productsStatus: "loading", productsError: null });
    },
    setProductsReady({ products, licenses }) {
      // Data boundary: normalize once before products enter the store.
      const normalizedProducts = normalizeProducts(products);
      patch({
        products: normalizedProducts,
        licenses,
        productsStatus: "ready",
        productsError: null,
      });
    },
    setProductsError(error) {
      patch({ productsStatus: "error", productsError: error });
    },
  },
};
