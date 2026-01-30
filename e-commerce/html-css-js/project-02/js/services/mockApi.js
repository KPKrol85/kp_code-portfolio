import { getLang } from "../content/index.js";
import { fetchJsonWithRetry } from "../utils/fetch.js";

export const mockApi = {
  getProducts() {
    const lang = getLang();
    const file = lang === "en" ? "data/products.en.json" : "data/products.json";
    return fetchJsonWithRetry(file);
  },
  getLicenses() {
    const lang = getLang();
    const file = lang === "en" ? "data/licenses.en.json" : "data/licenses.json";
    return fetchJsonWithRetry(file);
  },
};
