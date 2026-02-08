import { createElement } from "./dom.js";

export const getDownloadLabel = (file, { locked = false } = {}) => {
  if (!file) {
    return "";
  }

  if (locked) {
    return `${file.name} (odblokuj po zakupie)`;
  }

  return `${file.name} (${file.size})`;
};

export const createDownloadLink = (file) => {
  if (!file) {
    return null;
  }

  return createElement("a", {
    text: getDownloadLabel(file),
    attrs: { href: file.file, download: file.name },
  });
};
