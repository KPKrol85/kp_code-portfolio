import { content } from "../content/pl.js";

const CATEGORY_FALLBACK = {
  slug: "unknown",
  title: "Kategoria",
  description: "",
  bullets: [],
  faq: [],
};

export const productCategories = content.products?.categories ?? [];

export const getCategoryConfig = (slug) => {
  if (!slug) {
    return CATEGORY_FALLBACK;
  }
  return productCategories.find((category) => category.slug === slug) || CATEGORY_FALLBACK;
};

export const getCategoryLabel = (slug) => getCategoryConfig(slug).title || slug;
