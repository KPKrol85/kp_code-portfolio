import { loadProducts, renderGrid } from './products.js';

export const initFilters = async () => {
  const container = document.querySelector('[data-products="shop"]');
  if (!container) return;

  const categorySelect = document.querySelector('#filter-category');
  const priceRange = document.querySelector('#filter-price');
  const priceOutput = document.querySelector('[data-price-output]');
  const sortSelect = document.querySelector('#filter-sort');
  const resultCount = document.querySelector('[data-result-count]');

  const products = await loadProducts();
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');

  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const resolveCategory = (value) => {
    if (!categorySelect) return null;
    const options = Array.from(categorySelect.options);
    const directMatch = options.find((option) => option.value === value);
    if (directMatch) return directMatch.value;
    const normalized = normalize(value);
    const normalizedMatch = options.find((option) => normalize(option.value) === normalized);
    return normalizedMatch?.value || null;
  };

  const applyFilters = () => {
    const category = categorySelect?.value || 'all';
    const maxPrice = Number(priceRange?.value || 1000);
    const sort = sortSelect?.value || 'featured';

    let filtered = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      return matchesCategory && product.price <= maxPrice;
    });

    if (sort === 'price-asc') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }
    if (sort === 'price-desc') {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
    if (sort === 'name-asc') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderGrid(container, filtered);
    if (resultCount) {
      resultCount.textContent = `${filtered.length} wyników`;
    }
  };

  if (priceRange && priceOutput) {
    priceOutput.textContent = priceRange.value;
    priceRange.addEventListener('input', () => {
      priceOutput.textContent = priceRange.value;
      applyFilters();
    });
  }

  categorySelect?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);

  if (categoryParam && categorySelect) {
    const resolved = resolveCategory(categoryParam);
    if (resolved) {
      categorySelect.value = resolved;
    }
  }

  applyFilters();
};
