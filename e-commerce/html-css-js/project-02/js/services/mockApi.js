const fetchJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Nie udało się załadować ${path}`);
  }
  return response.json();
};

export const mockApi = {
  getProducts() {
    return fetchJson("data/products.json");
  },
  getLicenses() {
    return fetchJson("data/licenses.json");
  },
};
