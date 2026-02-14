import { APP_CONFIG } from '../config.js';

const key = (name) => `${APP_CONFIG.storagePrefix}:${APP_CONFIG.storageVersion}:${name}`;

export const storage = {
  get(name, fallback = null) {
    try {
      const item = localStorage.getItem(key(name));
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
};
