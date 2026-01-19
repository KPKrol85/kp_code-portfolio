import { store } from "./store.js";

const patch = (partial) => {
  store.setState(partial);
};

export const actions = {
  ui: {
    setTheme(theme) {
      patch({ ui: { theme } });
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
      patch({ products, licenses, productsStatus: "ready", productsError: null });
    },
    setProductsError(error) {
      patch({ productsStatus: "error", productsError: error });
    },
  },
};
