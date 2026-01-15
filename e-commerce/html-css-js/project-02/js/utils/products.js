export const getVisibleProducts = (products, { query = "", category = "all", sort = "latest" } = {}) => {
  const normalizedQuery = query.trim().toLowerCase();
  let visible = products;

  if (normalizedQuery) {
    visible = visible.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(normalizedQuery);
      const tagsMatch = Array.isArray(product.tags)
        ? product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        : false;
      return nameMatch || tagsMatch;
    });
  }

  if (category && category !== "all") {
    visible = visible.filter((product) => product.category === category);
  }

  const sorted = [...visible];
  if (sort === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  return sorted;
};
