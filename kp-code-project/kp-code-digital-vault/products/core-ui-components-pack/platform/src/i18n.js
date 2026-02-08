// src/i18n.js
import { en } from "./content/en.js";
import { pl } from "./content/pl.js";

const DICTS = { en, pl };
const STORAGE_KEY = "coreui_lang";

export const getLang = () => localStorage.getItem(STORAGE_KEY) || "en";

export const setLang = (lang) => {
  localStorage.setItem(STORAGE_KEY, lang);
};

export const t = (path) => {
  const lang = getLang();
  const dict = DICTS[lang] || DICTS.en;

  // path typu "overview.purposeTitle"
  return path.split(".").reduce((acc, key) => acc?.[key], dict) ?? path;
};
