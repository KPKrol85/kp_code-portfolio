# 1. P0 — Critical risks

none detected.

# 2. P1 — Important issues worth fixing next

- Real defect: the JSON load error path is broken for catalog, product, and cart flows. `fetchJson()` swallows fetch failures and returns `fallback` instead of rethrowing (`js/modules/data.js:3-24`), but the consumers rely on `try/catch` as if failures would throw (`js/modules/catalog.js:284-293`, `js/modules/product.js:375-382`, `js/modules/cart.js:225-231`). After a failed fetch, the code continues with non-array data and then dereferences it as an array (`js/modules/catalog.js:313`, `js/modules/product.js:386-398`, `js/modules/cart.js:188-195`, `js/modules/product-data.js:151-160`). This turns a recoverable data-load failure into a runtime break instead of the intended fallback UI.

- Real defect: sitemap generation is not aligned with the project’s actual indexable URLs. The build only emits the hard-coded paths from `INDEXABLE_PAGE_PATHS` (`scripts/seo-config.mjs:3-31`), which excludes `komplety.html` even though that source page is marked indexable and canonicalized (`komplety.html:9-12`). The same sitemap also includes only bare `/produkt.html` (`scripts/seo-config.mjs:3-12`), while the product implementation publishes canonical product URLs with `?slug=...` (`js/modules/product.js:76-91`) and the catalog links users to those slugged URLs (`js/modules/catalog.js:159-162`). Current sitemap output therefore omits real canonical destinations exposed by the site.

# 3. P2 — Minor refinements

- Minor polish item: Open Graph image metadata is internally inconsistent in source pages. The pages point `og:image` to an `.svg` asset while declaring `og:image:type` as `image/png` (`index.html:20-24`, `komplety.html:20-24`, same pattern across other HTML entry pages). On the dynamic product page, the script updates `og:image` to the current product image but leaves the static `og:image:type` / dimensions untouched (`produkt.html:20-24`, `js/modules/product.js:108-133`). This is unlikely to break rendering outright, but it weakens metadata correctness for crawlers and social scrapers.
