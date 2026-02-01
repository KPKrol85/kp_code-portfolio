const MAX_CACHE_ENTRIES = 10;
const baseCache = new Map();
const limitedCache = new Map();

const touchCache = (cache, key) => {
  if (!cache.has(key)) {
    return null;
  }
  const value = cache.get(key);
  cache.delete(key);
  cache.set(key, value);
  return value;
};

const setCache = (cache, key, value) => {
  if (cache.has(key)) {
    cache.delete(key);
  }
  cache.set(key, value);
  if (cache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
};

const buildCacheKey = ({ query, category, sort, limit, dataVersion }) => {
  const normalizedQuery = query.trim().toLowerCase();
  const limitKey = Number.isFinite(limit) ? `limit:${limit}` : "limit:none";
  return [dataVersion, normalizedQuery, category, sort, limitKey].join("|");
};

export const getVisibleProducts = (
  products,
  { query = "", category = "all", sort = "latest", limit = null, dataVersion = 0 } = {}
) => {
  const normalizedQuery = query.trim().toLowerCase();
  const baseKey = buildCacheKey({
    query: normalizedQuery,
    category,
    sort,
    limit: null,
    dataVersion,
  });
  const limitedKey = buildCacheKey({
    query: normalizedQuery,
    category,
    sort,
    limit,
    dataVersion,
  });

  if (Number.isFinite(limit)) {
    const cachedLimited = touchCache(limitedCache, limitedKey);
    if (cachedLimited) {
      return cachedLimited;
    }
  }

  const cachedBase = touchCache(baseCache, baseKey);
  let sorted = cachedBase;
  if (!sorted) {
    let visible = products;

    if (normalizedQuery) {
      visible = visible.filter((product) => {
        const nameMatch = product.name?.toLowerCase().includes(normalizedQuery);
        const tagsMatch = Array.isArray(product.tags)
          ? product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
          : false;
        return nameMatch || tagsMatch;
      });
    }

    if (category && category !== "all") {
      visible = visible.filter((product) => product.category === category);
    }

    sorted = [...visible];
    if (sort === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }
    setCache(baseCache, baseKey, sorted);
  }

  if (Number.isFinite(limit)) {
    const limited = sorted.slice(0, Math.max(0, limit));
    setCache(limitedCache, limitedKey, limited);
    return limited;
  }

  return sorted;
};
