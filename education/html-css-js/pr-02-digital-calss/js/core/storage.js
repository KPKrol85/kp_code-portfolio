import { STORAGE_KEY } from "./constants.js";

export const loadFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Storage parse error", error);
    return null;
  }
};

export const saveToStorage = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};
