import assert from "node:assert/strict";

import { purchasesService } from "../../js/services/purchases.js";
import { store } from "../../js/store/store.js";

const user = {
  id: "user-1",
  email: "user@example.com",
  name: "User",
};

const buildPurchase = () => ({
  id: "order-1",
  createdAt: new Date(0).toISOString(),
  items: [
    {
      productId: "prod-1",
      title: "Produkt 1",
      quantity: 1,
    },
  ],
});

export const tests = [
  {
    name: "purchases getters return arrays when storage is empty",
    run() {
      store.setState({ user });

      const orders = purchasesService.getOrders();
      const libraryItems = purchasesService.getLibraryItems();

      assert.ok(Array.isArray(orders));
      assert.ok(Array.isArray(libraryItems));
      assert.equal(orders.length, 0);
      assert.equal(libraryItems.length, 0);
    },
  },
  {
    name: "purchases.addPurchase stores a record and library items reflect it",
    run() {
      store.setState({ user });
      const purchase = buildPurchase();

      const next = purchasesService.addPurchase(purchase);
      const orders = purchasesService.getOrders();
      const libraryItems = purchasesService.getLibraryItems();

      assert.equal(next[0].id, purchase.id);
      assert.equal(orders[0].id, purchase.id);
      assert.equal(libraryItems[0].purchaseId, purchase.id);
      assert.equal(libraryItems[0].productId, purchase.items[0].productId);
    },
  },
];
