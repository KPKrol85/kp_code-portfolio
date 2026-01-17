const fallbackStorage = {
  safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  },
  safeRemove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
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
    } catch (error) {
      return fallback;
    }
  },
  safeSetJSON(key, data) {
    try {
      return this.safeSet(key, JSON.stringify(data));
    } catch (error) {
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
