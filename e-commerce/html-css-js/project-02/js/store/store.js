const listeners = new Set();

let state = {
  products: [],
  productsStatus: "idle",
  productsError: null,
  licenses: [],
  cart: [],
  user: null,
  session: null,
  ui: {
    theme: "light",
  },
};

export const store = {
  getState() {
    return state;
  },
  setState(partial) {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener(state));
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
