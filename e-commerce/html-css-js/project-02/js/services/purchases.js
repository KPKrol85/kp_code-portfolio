import { storage } from "./storage.js";

const LIBRARY_KEY = "kp_library";
const ORDERS_KEY = "kp_orders";

export const purchasesService = {
  getLibrary(userId) {
    const library = storage.get(LIBRARY_KEY, {});
    return library[userId] || [];
  },
  addToLibrary(userId, items) {
    const library = storage.get(LIBRARY_KEY, {});
    const current = library[userId] || [];
    library[userId] = [...current, ...items];
    storage.set(LIBRARY_KEY, library);
  },
  getOrders(userId) {
    const orders = storage.get(ORDERS_KEY, {});
    return orders[userId] || [];
  },
  addOrder(userId, order) {
    const orders = storage.get(ORDERS_KEY, {});
    const current = orders[userId] || [];
    orders[userId] = [order, ...current];
    storage.set(ORDERS_KEY, orders);
  },
};
