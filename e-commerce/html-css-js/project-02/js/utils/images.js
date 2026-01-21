import { createElement } from "./dom.js";

const MANIFEST_URL = "assets/img/_gen/manifest.json";
const ASSET_ROOT = "assets/img/_gen";
const FALLBACK_ROOT = "assets/img/_src";
const FETCH_TIMEOUT_MS = 4000;
const SAFE_PLACEHOLDER_SRC =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

let manifestPromise = null;
let manifestIndex = null;
let manifestStatus = "idle";
let prefetchScheduled = false;
let statusShown = false;

const LOCAL_MANIFEST_FALLBACK = new Map([
  [
    "products/ui-kits-components/core-ui-components-pack/01",
    "assets/img/_src/products/ui-kits-components/core-ui-components-pack/01.png",
  ],
  [
    "products/templates-dashboards/saas-dashboard-template/01",
    "assets/img/_src/products/templates-dashboards/saas-dashboard-template/01.png",
  ],
  [
    "products/assets-graphics/ui-ilustration-pack/01",
    "assets/img/_src/products/assets-graphics/ui-ilustration-pack/01.png",
  ],
  [
    "products/knowledge-tools/logic-flashcards-for-kids/01",
    "assets/img/_src/products/knowledge-tools/logic-flashcards-for-kids/01.png",
  ],
]);

const CRITICAL_IMAGE_BASES = new Set(LOCAL_MANIFEST_FALLBACK.keys());

const stripExtension = (value) => value.replace(/\.[^/.]+$/, "");

const normalizeBase = (value) => {
  if (!value) {
    return "";
  }
  const cleaned = String(value).replace(/^\/?assets\/img\/_gen\//, "");
  return stripExtension(cleaned);
};

const normalizeFallbackBase = (value) => {
  if (!value) {
    return "";
  }
  return String(value).replace(/^\/?assets\/img\/(_gen|_src)\//, "");
};

const buildFallbackSrc = (imageBase) => {
  const cleaned = normalizeFallbackBase(imageBase);
  if (!cleaned) {
    return "";
  }
  if (/\.(png|jpe?g|webp|avif)$/i.test(cleaned)) {
    return `${FALLBACK_ROOT}/${cleaned}`;
  }
  return `${FALLBACK_ROOT}/${cleaned}.png`;
};

const buildFallbackIndex = () => {
  const map = new Map();
  LOCAL_MANIFEST_FALLBACK.forEach((src, key) => {
    map.set(normalizeBase(key), { fallbackSrc: src });
  });
  return map;
};

const FALLBACK_INDEX = buildFallbackIndex();

const showManifestStatus = () => {
  if (statusShown) {
    return;
  }
  const footer = document.querySelector("footer");
  if (!footer) {
    return;
  }
  let status = footer.querySelector(".image-manifest-status");
  if (!status) {
    status = createElement("div", {
      className: "image-manifest-status",
      text: "Obrazy mogą być tymczasowo uproszczone z powodu wolnego łącza.",
      attrs: { role: "status", "aria-live": "polite" },
    });
    footer.appendChild(status);
  }
  statusShown = true;
};

const notifyMissingCriticalImage = (imageBase) => {
  const normalized = normalizeBase(imageBase);
  if (!CRITICAL_IMAGE_BASES.has(normalized)) {
    return;
  }
  if (manifestStatus !== "failed") {
    return;
  }
  showManifestStatus();
};

const withTimeout = async (promise, controller) => {
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await promise;
  } finally {
    clearTimeout(timeoutId);
  }
};

const loadManifest = async () => {
  if (!manifestPromise) {
    manifestStatus = "loading";
    const controller = new AbortController();
    manifestPromise = withTimeout(fetch(MANIFEST_URL, { signal: controller.signal }), controller)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Missing image manifest: ${response.status}`);
        }
        return response.json();
      })
      .then((manifest) => {
        if (!manifest || typeof manifest !== "object" || typeof manifest.items !== "object") {
          throw new Error("Invalid image manifest payload.");
        }
        manifestStatus = "ready";
        return manifest;
      })
      .catch((error) => {
        manifestStatus = "failed";
        console.warn("[images] Failed to load manifest.", error);
        return null;
      });
  }
  return manifestPromise;
};

const buildIndex = (manifest) => {
  const map = new Map();
  if (manifest?.items && typeof manifest.items === "object") {
    Object.entries(manifest.items).forEach(([key, entry]) => {
      map.set(stripExtension(key), entry);
    });
  }
  FALLBACK_INDEX.forEach((entry, key) => {
    if (!map.has(key)) {
      map.set(key, entry);
    } else if (!map.get(key)?.fallbackSrc) {
      map.set(key, { ...map.get(key), fallbackSrc: entry.fallbackSrc });
    }
  });
  return map;
};

const getManifestIndex = async () => {
  if (manifestIndex) {
    return manifestIndex;
  }
  const manifest = await loadManifest();
  manifestIndex = buildIndex(manifest);
  return manifestIndex;
};

const scheduleIdle = (callback) => {
  if (typeof window === "undefined") {
    setTimeout(callback, 0);
    return;
  }
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: 1500 });
  } else {
    setTimeout(callback, 300);
  }
};

const scheduleManifestPrefetch = () => {
  if (prefetchScheduled || manifestPromise || manifestIndex) {
    return;
  }
  prefetchScheduled = true;
  scheduleIdle(() => {
    if (manifestPromise || manifestIndex) {
      return;
    }
    void loadManifest();
  });
};

const buildSrcset = (variants = []) =>
  variants.map((variant) => `${ASSET_ROOT}/${variant.path} ${variant.w}w`).join(", ");

const pickLargest = (variants = []) => {
  if (!variants.length) {
    return null;
  }
  return [...variants].sort((a, b) => b.w - a.w)[0];
};

const ensureSource = (picture, type) => {
  let source = picture.querySelector(`source[type="${type}"]`);
  if (!source) {
    source = document.createElement("source");
    source.setAttribute("type", type);
    picture.insertBefore(source, picture.firstChild);
  }
  return source;
};

const resolveFallbackSrc = (imageBase, entry) => {
  if (entry?.fallbackSrc) {
    return entry.fallbackSrc;
  }
  const normalized = normalizeBase(imageBase);
  if (LOCAL_MANIFEST_FALLBACK.has(normalized)) {
    return LOCAL_MANIFEST_FALLBACK.get(normalized);
  }
  return buildFallbackSrc(imageBase);
};

const setPlaceholderImage = (img, imageBase) => {
  img.setAttribute("src", SAFE_PLACEHOLDER_SRC);
  notifyMissingCriticalImage(imageBase);
};

const applyFallbackImage = (img, imageBase, entry) => {
  const fallbackSrc = resolveFallbackSrc(imageBase, entry);
  if (fallbackSrc) {
    img.setAttribute("src", fallbackSrc);
    return true;
  }
  setPlaceholderImage(img, imageBase);
  return false;
};

const attachImageErrorHandler = (img, imageBase, entry) => {
  img.onerror = () => {
    img.onerror = null;
    const fallbackSrc = resolveFallbackSrc(imageBase, entry);
    const currentSrc = img.getAttribute("src") || "";
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      img.onerror = () => {
        img.onerror = null;
        setPlaceholderImage(img, imageBase);
      };
      img.setAttribute("src", fallbackSrc);
      return;
    }
    setPlaceholderImage(img, imageBase);
  };
};

export const updateResponsivePicture = async (picture, imageBase, { sizes } = {}) => {
  if (!picture || !imageBase) {
    return;
  }
  const index = await getManifestIndex();
  const normalizedBase = normalizeBase(imageBase);
  const entry = index.get(normalizedBase);
  if (!entry) {
    console.warn(`[images] Missing manifest entry for ${imageBase}.`);
  }

  if (entry?.avif?.length || entry?.webp?.length) {
    const avifSource = ensureSource(picture, "image/avif");
    const webpSource = ensureSource(picture, "image/webp");
    if (entry.avif?.length) {
      avifSource.setAttribute("srcset", buildSrcset(entry.avif));
    }
    if (entry.webp?.length) {
      webpSource.setAttribute("srcset", buildSrcset(entry.webp));
    }
    if (sizes) {
      avifSource.setAttribute("sizes", sizes);
      webpSource.setAttribute("sizes", sizes);
    }
  }

  const img = picture.querySelector("img");
  if (img) {
    attachImageErrorHandler(img, imageBase, entry);
    const manifestFallback = pickLargest(entry?.webp) || pickLargest(entry?.avif);
    if (manifestFallback) {
      img.setAttribute("src", `${ASSET_ROOT}/${manifestFallback.path}`);
    } else {
      applyFallbackImage(img, imageBase, entry);
    }
  }
  picture.dataset.imageBase = imageBase;
};

export const createResponsivePicture = ({
  imageBase,
  imgClassName,
  alt,
  sizes,
  loading,
  decoding,
  fetchPriority,
  width,
  height,
} = {}) => {
  const img = createElement("img", {
    className: imgClassName,
    attrs: {
      alt: alt || "",
      loading,
      decoding,
      fetchpriority: fetchPriority,
      width,
      height,
    },
  });
  const picture = createElement("picture", {}, [img]);
  if (imageBase) {
    updateResponsivePicture(picture, imageBase, { sizes });
  }
  return picture;
};

scheduleManifestPrefetch();
