const toStringSafe = (value) =>
  typeof value === "string" ? value : value == null ? "" : String(value);

const toNumberSafe = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeStringArray = (value) =>
  Array.isArray(value) ? value.map((item) => toStringSafe(item)).filter(Boolean) : [];

export const normalizeProduct = (product) => {
  const base = product ?? {};
  return {
    ...base,
    id: toStringSafe(base.id),
    name: toStringSafe(base.name),
    shortDescription: toStringSafe(base.shortDescription),
    description: toStringSafe(base.description),
    category: toStringSafe(base.category),
    requirements: toStringSafe(base.requirements),
    version: toStringSafe(base.version),
    updatedAt: toStringSafe(base.updatedAt),
    thumbnail: toStringSafe(base.thumbnail),
    price: toNumberSafe(base.price),
    tags: normalizeStringArray(base.tags),
    bundleContents: normalizeStringArray(base.bundleContents),
    downloadables: normalizeStringArray(base.downloadables),
  };
};

export const normalizeProducts = (list) =>
  Array.isArray(list) ? list.map((product) => normalizeProduct(product)) : [];

export const runProductNormalizationSmokeCheck = (product) => {
  const source = product ?? {};
  const withoutOptionalArrays = {
    ...source,
  };
  delete withoutOptionalArrays.tags;
  delete withoutOptionalArrays.bundleContents;
  delete withoutOptionalArrays.downloadables;

  const normalized = normalizeProduct(withoutOptionalArrays);
  const arraysReady =
    Array.isArray(normalized.tags) &&
    Array.isArray(normalized.bundleContents) &&
    Array.isArray(normalized.downloadables);

  // Dev-only smoke check: callable from the console to verify safe defaults.
  // Example: window.__kpDebug.normalizeProduct(store.getState().products[0])
  // This check intentionally lives at the data boundary.

  console.info("[products] normalization smoke check", {
    arraysReady,
    normalized,
  });

  return { arraysReady, normalized };
};

if (typeof window !== "undefined") {
  window.__kpDebug = window.__kpDebug || {};
  window.__kpDebug.normalizeProduct = runProductNormalizationSmokeCheck;
}
