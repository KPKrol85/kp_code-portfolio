(() => {
  const safeGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const safeRemove = (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  };

  const safeGetJSON = (key, fallback = null) => {
    const raw = safeGet(key);
    if (!raw) {
      return fallback;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const safeSetJSON = (key, data) => {
    try {
      return safeSet(key, JSON.stringify(data));
    } catch {
      return false;
    }
  };

  window.safeStorage = {
    safeGet,
    safeSet,
    safeRemove,
    safeGetJSON,
    safeSetJSON,
  };
})();
