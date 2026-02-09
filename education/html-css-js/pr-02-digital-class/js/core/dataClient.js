// Adapter na przyszłe API. W MVP korzystamy z localStorage w core/storage.js.
export const dataClient = {
  fetchAll: async () => {
    throw new Error("API client not implemented");
  },
  push: async () => {
    throw new Error("API client not implemented");
  },
};
