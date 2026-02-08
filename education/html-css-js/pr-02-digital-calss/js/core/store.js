import { saveToStorage } from "./storage.js";

export const createStore = (initialState) => {
  let state = initialState;
  const listeners = new Set();

  const getState = () => state;

  const setState = (nextState) => {
    state = nextState;
    saveToStorage(state);
    listeners.forEach((listener) => listener(state));
  };

  const dispatch = (action) => {
    const nextState = action(state);
    if (nextState) {
      setState(nextState);
    }
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, dispatch, subscribe, setState };
};
