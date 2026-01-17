(() => {
  const safeGet = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const safeSet = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  };

  const safeRemove = (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
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
    } catch (error) {
      return fallback;
    }
  };

  const safeSetJSON = (key, data) => {
    try {
      return safeSet(key, JSON.stringify(data));
    } catch (error) {
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
