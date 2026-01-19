import { fetchJsonWithRetry } from "../utils/fetch.js";

export const mockApi = {
  getProducts() {
    return fetchJsonWithRetry("data/products.json");
  },
  getLicenses() {
    return fetchJsonWithRetry("data/licenses.json");
  },
};
