import { store } from "../store/store.js";

import { storage } from "./storage.js";

const LEGACY_PURCHASES_KEY = "kp_purchases";
const PURCHASES_KEY_PREFIX = "kp_purchases_";

const getUserId = () => store.getState().user?.id ?? null;

const getPurchasesKey = (userId) => `${PURCHASES_KEY_PREFIX}${userId}`;

const normalizePurchases = (value) => (Array.isArray(value) ? value : []);

const mergePurchases = (primary, secondary) => {
  const result = [...primary];
  const ids = new Set(
    primary.map((purchase) => purchase?.id).filter((id) => typeof id === "string" && id.length)
  );
  secondary.forEach((purchase) => {
    const id = purchase?.id;
    if (typeof id === "string" && id.length) {
      if (!ids.has(id)) {
        ids.add(id);
        result.push(purchase);
      }
      return;
    }
    result.push(purchase);
  });
  return result;
};

const migrateLegacyPurchases = (userId) => {
  if (!userId) {
    return;
  }
  const legacy = storage.get(LEGACY_PURCHASES_KEY, null);
  if (!legacy) {
    return;
  }
  if (!Array.isArray(legacy)) {
    return;
  }
  const userKey = getPurchasesKey(userId);
  const existing = normalizePurchases(storage.get(userKey, []));
  const next = existing.length ? mergePurchases(existing, legacy) : legacy;
  storage.set(userKey, next);
  storage.remove(LEGACY_PURCHASES_KEY);
};

export const purchasesService = {
  getPurchases() {
    const userId = getUserId();
    if (!userId) {
      return [];
    }
    migrateLegacyPurchases(userId);
    const purchases = storage.get(getPurchasesKey(userId), []);
    return normalizePurchases(purchases);
  },
  addPurchase(purchase) {
    const userId = getUserId();
    if (!userId) {
      return [];
    }
    const purchases = this.getPurchases();
    const next = [purchase, ...purchases];
    storage.set(getPurchasesKey(userId), next);
    return next;
  },
  getLibraryItems() {
    const purchases = this.getPurchases();
    return purchases.flatMap((purchase) =>
      purchase.items.map((item) => ({
        purchaseId: purchase.id,
        purchasedAt: purchase.createdAt,
        ...item,
      }))
    );
  },
  getOrders() {
    return this.getPurchases();
  },
};
