const listeners = new Set();

const initialState = {
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

const cloneState = (value) => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

let state = cloneState(initialState);

export const store = {
  getState() {
    return state;
  },
  setState(partial) {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener(state));
  },
  resetState(nextState = initialState) {
    state = cloneState(nextState);
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export const storeInitialState = initialState;
