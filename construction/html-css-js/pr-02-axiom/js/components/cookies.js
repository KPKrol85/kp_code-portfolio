import { COOKIE_BANNER, SELECTORS } from "../core/config.js";
import { qs } from "../utils/dom.js";
import { safeGetItem, safeSetItem } from "../utils/storage.js";

export const initCookieBanner = () => {
  const banner = qs(SELECTORS.cookieBanner);
  if (!banner) return;
  const stored = safeGetItem(COOKIE_BANNER.storageKey);
  if (stored) {
    banner.remove();
    return;
  }
  banner.hidden = false;
  function save(val) {
    safeSetItem(COOKIE_BANNER.storageKey, JSON.stringify({ v: 1, value: val, ts: Date.now() }));
    document.cookie = `${COOKIE_BANNER.cookieName}=${val}; max-age=${COOKIE_BANNER.cookieMaxAge}; path=/; SameSite=Lax`;
    banner.remove();
  }
  banner.addEventListener("click", (e) => {
    if (e.target.closest("#cookieAccept")) save("accepted");
    if (e.target.closest("#cookieReject")) save("rejected");
  });
};
