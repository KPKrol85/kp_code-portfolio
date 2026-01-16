const MAX_DESCRIPTION_LENGTH = 160;

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
};
