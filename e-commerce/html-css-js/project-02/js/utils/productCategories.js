import { getContent } from "../content/index.js";

const getCategoryFallback = () => ({
  slug: "unknown",
  title: getContent().products?.categoryFallbackLabel || "Category",
  description: "",
  bullets: [],
  faq: [],
});

const getCategories = () => getContent().products?.categories ?? [];

export const getCategoryConfig = (slug) => {
  if (!slug) {
    return getCategoryFallback();
  }
  return getCategories().find((category) => category.slug === slug) || getCategoryFallback();
};

export const getCategoryLabel = (slug) => getCategoryConfig(slug).title || slug;

export const getProductCategories = () => getCategories();
