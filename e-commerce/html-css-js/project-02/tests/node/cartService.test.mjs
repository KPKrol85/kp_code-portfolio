import assert from "node:assert/strict";

import { cartService, __cartTestUtils } from "../../js/services/cart.js";

const { normalizeCart, mergeCarts } = __cartTestUtils;

const guestKey = "kp_cart_guest";
const userKey = (userId) => `kp_cart_${userId}`;

const setStoredCart = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const tests = [
  {
    name: "cart.normalizeCart tolerates incomplete shapes",
    run() {
      assert.deepEqual(normalizeCart(null), []);
      assert.deepEqual(normalizeCart({}), []);
      assert.deepEqual(
        normalizeCart([
          null,
          {},
          { productId: "a" },
          { productId: "b", quantity: 2.7 },
          { productId: "c", quantity: 0 },
        ]),
        [
          { productId: "a", quantity: 1 },
          { productId: "b", quantity: 2 },
          { productId: "c", quantity: 1 },
        ]
      );
    },
  },
  {
    name: "cart.mergeCarts sums quantities for matching products",
    run() {
      const merged = mergeCarts(
        [
          { productId: "a", quantity: 1 },
          { productId: "b", quantity: 2 },
        ],
        [
          { productId: "a", quantity: 3 },
          { productId: "c", quantity: 4 },
        ]
      );

      assert.deepEqual(merged, [
        { productId: "a", quantity: 4 },
        { productId: "b", quantity: 2 },
        { productId: "c", quantity: 4 },
      ]);
    },
  },
  {
    name: "cart.mergeGuestCartIntoUserCart merges carts, clears guest, returns merged",
    run() {
      setStoredCart(guestKey, [{ productId: "a", quantity: 1 }]);
      setStoredCart(userKey("user-1"), [{ productId: "a", quantity: 2 }]);

      const merged = cartService.mergeGuestCartIntoUserCart("user-1");

      assert.deepEqual(merged, [{ productId: "a", quantity: 3 }]);
      assert.equal(localStorage.getItem(guestKey), null);
      assert.deepEqual(JSON.parse(localStorage.getItem(userKey("user-1"))), merged);
    },
  },
];
