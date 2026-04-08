const SEO_ORIGIN = "https://e-commerce-pr02-outlandgear.netlify.app";

const INDEXABLE_PAGE_PATHS = [
  "/",
  "/kategoria.html",
  "/produkt.html",
  "/o-nas.html",
  "/kontakt.html",
  "/regulamin.html",
  "/polityka-prywatnosci.html",
  "/faq.html",
];

const NON_INDEXABLE_PAGE_PATHS = [
  "/checkout.html",
  "/checkout-potwierdzenie.html",
  "/kontakt-wyslano.html",
  "/koszyk.html",
];

const resolveSeoUrl = (pathname) => new URL(pathname, `${SEO_ORIGIN}/`).toString();

const buildRobotsTxt = () =>
  ["User-agent: *", "Allow: /", `Sitemap: ${resolveSeoUrl("/sitemap.xml")}`].join("\n") + "\n";

const buildSitemapXml = () => {
  const urls = INDEXABLE_PAGE_PATHS.map(
    (pathname) => `  <url>\n    <loc>${resolveSeoUrl(pathname)}</loc>\n  </url>`
  ).join("\n");

  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', urls, "</urlset>", ""].join("\n");
};

export {
  INDEXABLE_PAGE_PATHS,
  NON_INDEXABLE_PAGE_PATHS,
  SEO_ORIGIN,
  buildRobotsTxt,
  buildSitemapXml,
  resolveSeoUrl,
};
