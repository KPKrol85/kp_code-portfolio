const fallbackStorage = {
  safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  safeRemove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  safeGetJSON(key, fallback = null) {
    const raw = this.safeGet(key);
    if (!raw) {
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  safeSetJSON(key, data) {
    try {
      return this.safeSet(key, JSON.stringify(data));
    } catch {
      return false;
    }
  },
};

const safeStorage = window.safeStorage ?? fallbackStorage;

export const safeGet = (key) => safeStorage.safeGet(key);
export const safeSet = (key, value) => safeStorage.safeSet(key, value);
export const safeRemove = (key) => safeStorage.safeRemove(key);
export const safeGetJSON = (key, fallback = null) => safeStorage.safeGetJSON(key, fallback);
export const safeSetJSON = (key, data) => safeStorage.safeSetJSON(key, data);

export const storage = {
  get(key, fallback) {
    return safeGetJSON(key, fallback);
  },
  set(key, value) {
    safeSetJSON(key, value);
  },
  remove(key) {
    safeRemove(key);
  },
};
