const STORAGE_KEY = "dv_purchases";

const normalizeIds = (value) =>
  Array.isArray(value) ? value.filter((id) => typeof id === "string" && id.trim().length) : [];

const readIds = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return normalizeIds(JSON.parse(raw));
  } catch (error) {
    return [];
  }
};

const writeIds = (ids) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

const addId = (id) => {
  const trimmed = typeof id === "string" ? id.trim() : "";
  if (!trimmed) {
    return false;
  }
  const ids = readIds();
  if (ids.includes(trimmed)) {
    return false;
  }
  ids.unshift(trimmed);
  writeIds(ids);
  return true;
};

const DEMO_LIBRARY_ITEMS = [
  {
    id: "core-ui-components-pack",
    title: "Core UI Components Pack",
    version: "1.0",
    description: "Tokenowy UI kit do dashboardów: komponenty, layouty, stany i motywy.",
    previewUrl: "#/product/core-ui-components-pack",
  },
];

const getLibraryItems = () => {
  const ids = new Set(readIds());
  return DEMO_LIBRARY_ITEMS.filter((item) => ids.has(item.id));
};

const seedPurchaseFromQuery = () => {
  const url = new URL(window.location.href);
  const seedId = url.searchParams.get("seedPurchase");
  if (!seedId) {
    return false;
  }
  addId(seedId);
  url.searchParams.delete("seedPurchase");
  window.location.replace(url.toString());
  return true;
};

export const demoPurchasesService = {
  getLibraryItems,
  seedPurchaseFromQuery,
};
