import { CONFIG } from "../config.js";

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

export const loadCart = () => {
  const data = safeParse(localStorage.getItem(CONFIG.storageKey), null);
  if (!data || data.version !== CONFIG.storageVersion) {
    return { version: CONFIG.storageVersion, items: [] };
  }
  return data;
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Storage error", error);
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem(CONFIG.storageKey);
  } catch (error) {
    console.error("Storage error", error);
  }
};
