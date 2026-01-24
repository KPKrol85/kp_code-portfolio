const createMemoryStorage = () => {
  const data = new Map();

  return {
    get length() {
      return data.size;
    },
    key(index) {
      if (!Number.isInteger(index) || index < 0 || index >= data.size) {
        return null;
      }
      return Array.from(data.keys())[index] ?? null;
    },
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(String(key), String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    clear() {
      data.clear();
    },
    reset() {
      data.clear();
    },
  };
};

export const memoryStorage = createMemoryStorage();
export { createMemoryStorage };
