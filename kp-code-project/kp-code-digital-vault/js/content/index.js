import { content as en } from "./en.js";
import { content as pl } from "./pl.js";

const DICTS = { en, pl };
const LANG_KEY = "dv_lang";
const DEFAULT_LANG = "pl";

const normalizeLang = (value) => {
  if (typeof value !== "string") {
    return DEFAULT_LANG;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === "en" ? "en" : "pl";
};

const applyDocumentLang = (lang) => {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.lang = lang;
};

const readStoredLang = () => normalizeLang(localStorage.getItem(LANG_KEY));

const getPathValue = (source, path) => {
  if (!source || !path) {
    return undefined;
  }
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), source);
};

const interpolate = (template, vars = {}) => {
  if (typeof template !== "string") {
    return template;
  }
  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    if (!Object.prototype.hasOwnProperty.call(vars, key)) {
      return match;
    }
    const value = vars[key];
    return value === null || value === undefined ? "" : String(value);
  });
};

const mergeFallback = (primary, fallback) => {
  if (Array.isArray(primary)) {
    return primary.slice();
  }
  if (primary && typeof primary === "object") {
    const output = {};
    const keys = new Set([
      ...Object.keys(fallback || {}),
      ...Object.keys(primary || {}),
    ]);
    keys.forEach((key) => {
      const primaryValue = primary?.[key];
      const fallbackValue = fallback?.[key];
      if (primaryValue === undefined || primaryValue === null) {
        output[key] = fallbackValue;
      } else if (
        Array.isArray(primaryValue) ||
        typeof primaryValue !== "object" ||
        primaryValue === null
      ) {
        output[key] = primaryValue;
      } else {
        output[key] = mergeFallback(primaryValue, fallbackValue);
      }
    });
    return output;
  }
  return primary ?? fallback;
};

let cachedLang = null;
let cachedContent = null;

const buildContent = (lang) => {
  const normalized = normalizeLang(lang);
  const primary = DICTS[normalized] || DICTS[DEFAULT_LANG];
  return mergeFallback(primary, pl);
};

const getLang = () => readStoredLang();

const setLang = (lang) => {
  const next = normalizeLang(lang);
  localStorage.setItem(LANG_KEY, next);
  applyDocumentLang(next);
  cachedLang = null;
  cachedContent = null;
  window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: next } }));
  return next;
};

const getDict = () => {
  const lang = getLang();
  return DICTS[lang] || DICTS[DEFAULT_LANG];
};

const getContent = () => {
  const lang = getLang();
  if (!cachedContent || cachedLang !== lang) {
    cachedContent = buildContent(lang);
    cachedLang = lang;
  }
  return cachedContent;
};

const t = (path, vars) => {
  if (!path) {
    return "";
  }
  const dict = getDict();
  let value = getPathValue(dict, path);
  if (value === undefined) {
    value = getPathValue(pl, path);
  }
  if (value === undefined) {
    return path;
  }
  return interpolate(value, vars);
};

const initLang = () => {
  const lang = getLang();
  applyDocumentLang(lang);
  return lang;
};

export {
  LANG_KEY,
  DEFAULT_LANG,
  normalizeLang,
  getLang,
  setLang,
  getDict,
  getContent,
  t,
  initLang,
};
