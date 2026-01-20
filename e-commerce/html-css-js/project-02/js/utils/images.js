import { createElement } from "./dom.js";

const MANIFEST_URL = "assets/img/_gen/manifest.json";
const ASSET_ROOT = "assets/img/_gen";

let manifestPromise = null;
let manifestIndex = null;

const stripExtension = (value) => value.replace(/\.[^/.]+$/, "");

const normalizeBase = (value) => {
  if (!value) {
    return "";
  }
  const cleaned = String(value).replace(/^\/?assets\/img\/_gen\//, "");
  return stripExtension(cleaned);
};

const loadManifest = async () => {
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Missing image manifest: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.warn("[images] Failed to load manifest.", error);
        return { items: {} };
      });
  }
  return manifestPromise;
};

const buildIndex = (manifest) => {
  const map = new Map();
  Object.entries(manifest.items || {}).forEach(([key, entry]) => {
    map.set(stripExtension(key), entry);
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

export const updateResponsivePicture = async (picture, imageBase, { sizes } = {}) => {
  if (!picture || !imageBase) {
    return;
  }
  const index = await getManifestIndex();
  const entry = index.get(normalizeBase(imageBase));
  if (!entry) {
    console.warn(`[images] Missing manifest entry for ${imageBase}.`);
    return;
  }

  const avifSource = ensureSource(picture, "image/avif");
  const webpSource = ensureSource(picture, "image/webp");
  avifSource.setAttribute("srcset", buildSrcset(entry.avif));
  webpSource.setAttribute("srcset", buildSrcset(entry.webp));
  if (sizes) {
    avifSource.setAttribute("sizes", sizes);
    webpSource.setAttribute("sizes", sizes);
  }

  const img = picture.querySelector("img");
  if (img) {
    const fallback = pickLargest(entry.webp) || pickLargest(entry.avif);
    if (fallback) {
      img.setAttribute("src", `${ASSET_ROOT}/${fallback.path}`);
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
