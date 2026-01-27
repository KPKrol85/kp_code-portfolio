import { content } from "../content/pl.js";

import { getCategoryConfig } from "./productCategories.js";

const sections = content.breadcrumbs?.sections ?? {};
const services = content.breadcrumbs?.services ?? {};

const toHash = (path) => `#${path.startsWith("/") ? path : `/${path}`}`;

const routeLabels = new Map([
  ["/products", sections.products],
  ["/services", sections.services],
  ["/services/web-development", services.webDevelopment],
  ["/services/wordpress", services.wordpress],
  ["/services/ui-ux-branding", services.uiUxBranding],
  ["/services/consulting-support", services.consultingSupport],
  ["/pricing", sections.pricing],
  ["/updates", sections.updates],
  ["/docs", sections.docs],
  ["/faq", sections.faq],
  ["/support", sections.support],
  ["/about", sections.about],
  ["/roadmap", sections.roadmap],
  ["/careers", sections.careers],
  ["/contact", sections.contact],
  ["/cart", sections.cart],
  ["/checkout", sections.checkout],
  ["/checkout/success", sections.checkoutSuccess],
  ["/auth", sections.auth],
  ["/account", sections.account],
  ["/account/orders", sections.accountOrders],
  ["/account/downloads", sections.accountDownloads],
  ["/account/settings", sections.accountSettings],
  ["/library", sections.library],
  ["/licenses", sections.licenses],
  ["/legal", sections.legal],
  ["/privacy", sections.privacy],
  ["/terms", sections.terms],
  ["/cookies", sections.cookies],
  ["/admin", sections.admin],
  ["/404", sections.notFound],
]);

const parentRoutes = new Map([
  ["/services/web-development", "/services"],
  ["/services/wordpress", "/services"],
  ["/services/ui-ux-branding", "/services"],
  ["/services/consulting-support", "/services"],
  ["/library", "/account"],
  ["/licenses", "/account"],
  ["/account/orders", "/account"],
  ["/account/downloads", "/account"],
  ["/account/settings", "/account"],
  ["/privacy", "/legal"],
  ["/terms", "/legal"],
  ["/cookies", "/legal"],
  ["/checkout/success", "/checkout"],
]);

export const buildBreadcrumbsForPath = (pathname) => {
  if (!pathname || pathname === "/") {
    return [];
  }
  const label = routeLabels.get(pathname);
  if (!label) {
    return [];
  }
  const parentPath = parentRoutes.get(pathname);
  if (parentPath) {
    const parentLabel = routeLabels.get(parentPath);
    if (parentLabel) {
      return [{ label: parentLabel, href: toHash(parentPath) }, { label }];
    }
  }
  return [{ label }];
};

export const buildProductsBreadcrumbs = () => {
  if (!sections.products) {
    return [];
  }
  return [{ label: sections.products }];
};

export const buildProductCategoryBreadcrumbs = (slug) => {
  if (!sections.products) {
    return [];
  }
  const category = getCategoryConfig(slug);
  return [
    { label: sections.products, href: toHash("/products") },
    { label: category.title || slug },
  ];
};

export const buildProductDetailsBreadcrumbs = (product) => {
  if (!product?.name || !sections.products) {
    return [];
  }
  const category = getCategoryConfig(product.category);
  const items = [{ label: sections.products, href: toHash("/products") }];
  if (category?.slug && category?.title) {
    items.push({ label: category.title, href: toHash(`/products/${category.slug}`) });
  }
  items.push({ label: product.name });
  return items;
};
