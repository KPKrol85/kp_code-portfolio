import { storage } from "./storage.js";

const PURCHASES_KEY = "kp_purchases";

export const purchasesService = {
  getPurchases() {
    const purchases = storage.get(PURCHASES_KEY, []);
    return Array.isArray(purchases) ? purchases : [];
  },
  addPurchase(purchase) {
    const purchases = this.getPurchases();
    const next = [purchase, ...purchases];
    storage.set(PURCHASES_KEY, next);
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
