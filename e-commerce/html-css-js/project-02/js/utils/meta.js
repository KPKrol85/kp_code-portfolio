const MAX_DESCRIPTION_LENGTH = 160;
const SITE_URL = window.location.origin;
const DEFAULT_OG_IMAGE_PATH = "/assets/og/og-dv-1200x630.png";
// TODO: Replace with branded OG images per route.
export const DEFAULT_OG_IMAGE_URL = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;

const normalizeText = (value) => {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
};

const truncateText = (value, maxLength) => {
  const normalized = normalizeText(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 3)}...`;
};

export const setMeta = ({ title, description } = {}) => {
  if (title) {
    document.title = String(title);
  }
  const metaDescription = document.getElementById("meta-description");
  if (!metaDescription) {
    return;
  }
  const safeDescription = truncateText(description, MAX_DESCRIPTION_LENGTH);
  metaDescription.setAttribute("content", safeDescription);
  if (title) {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", String(title));
    }
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", String(title));
    }
  }
  if (safeDescription) {
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", safeDescription);
    }
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute("content", safeDescription);
    }
  }
};

export const setMetaImages = (imageUrl = DEFAULT_OG_IMAGE_URL) => {
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute("content", imageUrl);
  }
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage) {
    twitterImage.setAttribute("content", imageUrl);
  }
};

export const setJsonLd = (id, data) => {
  const scriptId = id || "json-ld-dynamic";
  let script = document.getElementById(scriptId);
  if (!data) {
    if (script) {
      script.remove();
    }
    return;
  }
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};
