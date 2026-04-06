import { CONFIG } from "../config.js";
import { qs, qsa, on } from "./dom.js";
import { formatCurrency } from "../utils.js";
import { addToCart, updateCartCount } from "./cart.js";
import { showToast } from "./toast.js";
import { createFallbackNotice } from "./fallback.js";
import { fetchJson } from "./data.js";
import { findProductBySlug } from "./product-data.js";
import { setUiState, clearUiState } from "./ui-state.js";

const SITE_NAME = "Outland Gear";
const SITE_URL = "https://outlandgear.example.com/";
const PRODUCT_PAGE_PATH = "produkt.html";
const FALLBACK_SOCIAL_IMAGE = "assets/svg/social-share-placeholder.svg";
const WEBPAGE_SCHEMA_SELECTOR = 'script[data-schema="webpage"]';
const PRODUCT_SCHEMA_SELECTOR = 'script[data-schema="product"]';
const getMainImageAlt = (productName, index = 0) => `Zdjęcie ${index + 1} produktu ${productName}`;
const getThumbLabel = (productName, index = 0) => `Pokaż zdjęcie ${index + 1} produktu ${productName}`;

const ensureMetaTag = (selector, attributes) => {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attributes || {}).forEach(([key, value]) => {
      tag.setAttribute(key, value);
    });
    document.head.appendChild(tag);
  }
  return tag;
};

const setMetaContent = (selector, attributes, value) => {
  const tag = ensureMetaTag(selector, attributes);
  if (tag) {
    tag.setAttribute("content", value);
  }
};

const ensureJsonLdScript = (selector, schemaType) => {
  let script = document.querySelector(selector);
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-schema", schemaType);
    document.head.appendChild(script);
  }
  return script;
};

const setJsonLd = (selector, schemaType, payload) => {
  const script = ensureJsonLdScript(selector, schemaType);
  if (script) {
    script.textContent = JSON.stringify(payload);
  }
};

const setProductMetadata = (product, slug) => {
  if (!product || !slug) return;

  const titleParts = [product.name, product.category, SITE_NAME];
  const pageTitle = titleParts.filter(Boolean).join(" | ");
  document.title = pageTitle;

  const description = [product.shortDescription, product.subcategory].filter(Boolean).join(" ");
  setMetaContent('meta[name="description"]', { name: "description" }, description);

  const canonicalUrl = new URL(PRODUCT_PAGE_PATH, window.location.origin);
  canonicalUrl.searchParams.set("slug", slug);
  const canonicalHref = canonicalUrl.href;
  const primaryImagePath = product.images?.[0] || FALLBACK_SOCIAL_IMAGE;
  const imageUrl = new URL(primaryImagePath, window.location.origin).href;
  const imageAlt = product.name ? `${product.name} — ${SITE_NAME}` : "Outland Gear - outdoor i travel marketplace";
  const formattedPrice = Number.isFinite(product.price) ? product.price.toFixed(2) : "";

  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute("href", canonicalHref);
  }

  setMetaContent('meta[property="og:title"]', { property: "og:title" }, pageTitle);
  setMetaContent('meta[property="og:description"]', { property: "og:description" }, description);
  setMetaContent('meta[property="og:url"]', { property: "og:url" }, canonicalHref);
  setMetaContent('meta[property="og:image"]', { property: "og:image" }, imageUrl);
  setMetaContent('meta[property="og:image:alt"]', { property: "og:image:alt" }, imageAlt);

  setMetaContent('meta[name="twitter:title"]', { name: "twitter:title" }, pageTitle);
  setMetaContent('meta[name="twitter:description"]', { name: "twitter:description" }, description);
  setMetaContent('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);

  setJsonLd(WEBPAGE_SCHEMA_SELECTOR, "webpage", {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description,
    url: canonicalHref,
    inLanguage: "pl-PL",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  });

  setJsonLd(PRODUCT_SCHEMA_SELECTOR, "product", {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || description,
    category: product.category || undefined,
    sku: String(product.id || slug),
    image: [imageUrl],
    url: canonicalHref,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency || "PLN",
      price: formattedPrice,
      availability: product.stockStatus === "Dostępny" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: canonicalHref,
    },
    aggregateRating: Number.isFinite(product.rating)
      ? {
          "@type": "AggregateRating",
          ratingValue: String(product.rating),
          reviewCount: String(product.reviewsCount || 0),
        }
      : undefined,
  });
};

const renderProduct = (product) => {
  const root = qs(CONFIG.selectors.productRoot);
  if (!root) return;

  const title = qs("[data-product-title]", root);
  const price = qs("[data-product-price]", root);
  const oldPrice = qs("[data-product-old-price]", root);
  const rating = qs("[data-product-rating]", root);
  const stock = qs("[data-product-stock]", root);
  const description = qs("[data-product-description]", root);
  const highlights = qs("[data-product-highlights]", root);
  const specs = qs("[data-product-specs]", root);

  if (title) title.textContent = product.name || "";
  if (price) price.textContent = formatCurrency(product.price, product.currency);
  if (oldPrice) {
    if (product.oldPrice) {
      oldPrice.textContent = formatCurrency(product.oldPrice, product.currency);
    } else {
      oldPrice.textContent = "";
    }
  }
  if (rating) rating.textContent = `Ocena ${product.rating} • ${product.reviewsCount} opinii`;
  if (stock) stock.textContent = product.stockStatus;
  if (description) description.textContent = product.shortDescription || "";

  if (highlights) {
    highlights.innerHTML = "";
    const items = Array.isArray(product.highlights) ? product.highlights : [];
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      highlights.appendChild(li);
    });
  }

  if (specs) {
    specs.innerHTML = "";
    Object.entries(product.specs || {}).forEach(([label, value]) => {
      const row = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = label;
      const td = document.createElement("td");
      td.textContent = value;
      row.append(th, td);
      specs.appendChild(row);
    });
  }

  const mainImage = qs("[data-product-main]", root);
  const thumbs = qsa("[data-product-thumb]", root);
  const images = Array.isArray(product?.images) && product.images.length ? product.images : [""];
  const setActiveThumb = (activeIndex) => {
    thumbs.forEach((thumb, index) => {
      thumb.setAttribute("aria-pressed", index === activeIndex ? "true" : "false");
    });
  };

  if (mainImage) {
    mainImage.src = images[0] || "";
    mainImage.alt = product.imageAlt || product.name || "";
  }

  setActiveThumb(0);

  thumbs.forEach((thumb, index) => {
    const img = qs("img", thumb);
    if (img && images[index]) {
      img.src = images[index];
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
    }

    thumb.setAttribute("aria-label", `Pokaż zdjęcie ${index + 1} produktu ${product.name}`);

    on(thumb, "click", () => {
      if (mainImage && images[index]) {
        mainImage.src = images[index];
        mainImage.alt = getMainImageAlt(product.name, index);
      }
      setActiveThumb(index);
    });
  });

  const addBtn = qs("[data-add-product]", root);
  const qtyInput = qs("[data-qty-input]", root);
  on(addBtn, "click", () => {
    const qty = qtyInput ? Number(qtyInput.value) : 1;
    const saved = addToCart(product, qty);
    if (!saved) return;

    updateCartCount();
    showToast(`Dodano „${product.name}” do koszyka.`, { type: "success" });
  });
};

const renderRelated = (products, current) => {
  const grid = qs(CONFIG.selectors.relatedGrid);
  if (!grid) return;
  grid.innerHTML = "";
  const related = products.filter((item) => item.category === current.category && item.id !== current.id).slice(0, 3);
  related.forEach((product) => {
    const article = document.createElement("article");
    article.className = "card product-card";
    const media = document.createElement("div");
    media.className = "product-card__media";
    const img = document.createElement("img");
    img.src = product.images[0];
    img.alt = product.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 320;
    img.height = 220;
    media.appendChild(img);

    const body = document.createElement("div");
    body.className = "product-card__content";
    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.name;

    const price = document.createElement("div");
    price.className = "product-card__price";
    price.textContent = formatCurrency(product.price, product.currency);

    const meta = document.createElement("p");
    meta.className = "product-card__meta";
    meta.textContent = `Ocena ${product.rating} • ${product.reviewsCount} opinii`;

    const actions = document.createElement("div");
    actions.className = "product-card__actions";

    const link = document.createElement("a");
    link.href = `produkt.html?slug=${product.slug}`;
    link.className = "btn btn--outline btn--small";
    link.textContent = "Zobacz";

    actions.append(link);
    body.append(title, price, meta, actions);
    article.append(media, body);
    grid.appendChild(article);
  });
};

const renderProductLoadError = (root) => {
  if (!root) return;

  root.innerHTML = "";
  const section = document.createElement("section");
  section.className = "section";
  const container = document.createElement("div");
  container.className = "container";

  const fallback = createFallbackNotice({
    message: "Nie udało się załadować produktu. Odśwież stronę i spróbuj ponownie.",
    actionLabel: "Odśwież stronę",
    onAction: () => window.location.reload(),
  });

  container.appendChild(fallback);
  section.appendChild(container);
  root.appendChild(section);
};

export const initProduct = async () => {
  const root = qs(CONFIG.selectors.productRoot);
  if (!root) return;
  const stateRegion = qs("[data-product-state]", root);
  let products = [];
  try {
    products = await fetchJson("data/products.json");
  } catch (error) {
    console.error("Product data error", error);
    renderProductLoadError(root);
    return;
  }

  const slug = new URLSearchParams(window.location.search).get("slug");
  const normalizedSlug = slug?.trim() || "";
  const matchedProduct = findProductBySlug(products, normalizedSlug);
  const product = matchedProduct || products[0];
  if (!product) {
    renderProductLoadError(root);
    return;
  }

  if (matchedProduct) {
    setProductMetadata(matchedProduct, normalizedSlug);
  }

  renderProduct(product);
  renderRelated(products, product);

  if (!matchedProduct && normalizedSlug) {
    setUiState(stateRegion, {
      type: "info",
      title: "Nie znaleźliśmy tego produktu",
      message: "Wyświetlamy najbliższą dostępną propozycję.",
    });
    return;
  }

  clearUiState(stateRegion);
};
