import { initReveal } from './reveal.js';

const DATA_URL = new URL('../../data/products.json', import.meta.url);

let cached = null;

const getPrefix = () => (window.location.pathname.includes('/pages/') ? '../' : '');

const formatPrice = (value) => `${value.toFixed(0)} zł`;

export const loadProducts = async () => {
  if (cached) return cached;
  const response = await fetch(DATA_URL);
  cached = await response.json();
  return cached;
};

const productLink = (id) => {
  const prefix = getPrefix();
  return prefix ? `product.html?id=${id}` : `pages/product.html?id=${id}`;
};

const productImage = (path) => `${getPrefix()}${path}`;

const renderCard = (product) => `
  <article class="card" aria-label="${product.name}" data-reveal>
    <img src="${productImage(product.image)}" alt="${product.name}" loading="lazy" />
    <span class="badge">${product.badge}</span>
    <h3 class="card-title">${product.name}</h3>
    <p>${product.description}</p>
    <div class="card-meta">
      <span class="price">${formatPrice(product.price)}</span>
      <span>${product.category}</span>
    </div>
    <div class="tag-list">
      <a class="btn btn-outline" href="${productLink(product.id)}">Szczegóły</a>
      <button class="btn btn-accent" type="button" data-add-to-cart data-product-id="${product.id}">Dodaj</button>
    </div>
  </article>
`;

export const renderGrid = (container, products) => {
  if (!container) return;
  container.innerHTML = products.map(renderCard).join('');
  initReveal();
};

export const initFeaturedProducts = async () => {
  const container = document.querySelector('[data-products="featured"]');
  if (!container) return;
  const products = await loadProducts();
  renderGrid(container, products.slice(0, 3));
};

export const initShopProducts = async () => {
  const container = document.querySelector('[data-products="shop"]');
  if (!container) return;
  const products = await loadProducts();
  renderGrid(container, products);
};

export const initRelatedProducts = async () => {
  const container = document.querySelector('[data-products="related"]');
  if (!container) return;
  const products = await loadProducts();
  renderGrid(container, products.slice(2, 5));
};

export const initProductDetails = async () => {
  const container = document.querySelector('[data-product-details]');
  if (!container) return;

  const products = await loadProducts();
  const params = new URLSearchParams(window.location.search);
  const currentId = params.get('id') || products[0].id;
  const product = products.find((item) => item.id === currentId) || products[0];

  container.innerHTML = `
    <div class="page-layout">
      <div class="card" data-reveal>
        <img src="${productImage(product.image)}" alt="${product.name}" />
        <div class="tag-list">
          <img src="${productImage(product.image)}" alt="${product.name} miniatura" loading="lazy" />
          <img src="${productImage(product.image)}" alt="${product.name} detal" loading="lazy" />
        </div>
      </div>
      <div class="card" data-reveal>
        <span class="badge">${product.badge}</span>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <div class="price">${formatPrice(product.price)}</div>
        <ul class="stacked">
          ${product.features.map((feature) => `<li>${feature}</li>`).join('')}
        </ul>
        <label class="input-group">
          <span>Ilość</span>
          <select name="qty" data-qty-select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>
        <button class="btn btn-accent" type="button" data-add-to-cart data-product-id="${product.id}">Dodaj do koszyka</button>
      </div>
    </div>
  `;
  initReveal();
};

export const getProductImage = productImage;
export const getProductLink = productLink;
export const formatProductPrice = formatPrice;
