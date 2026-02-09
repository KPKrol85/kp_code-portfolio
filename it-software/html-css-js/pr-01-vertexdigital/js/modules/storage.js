import { SCHEMA_VERSION, STORAGE_KEYS } from '../config.js';

const isStorageAvailable = () => {
  try {
    const testKey = '__vertex_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

export const storage = {
  get(key) {
    if (!isStorageAvailable()) return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  set(key, value) {
    if (!isStorageAvailable()) return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  },
  ensureSchema() {
    if (!isStorageAvailable()) return;
    const current = window.localStorage.getItem(STORAGE_KEYS.schema);
    if (current !== SCHEMA_VERSION) {
      window.localStorage.clear();
      window.localStorage.setItem(STORAGE_KEYS.schema, SCHEMA_VERSION);
    }
  }
};
