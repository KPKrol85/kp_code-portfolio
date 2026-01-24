import { focusMain } from "../utils/focusMain.js";
import { updateHeaderOffset } from "../utils/layout.js";

let previousPathname = null;
let isFirstRoute = true;

const trackRouteChange = (_payload) => {
  // Hook for future analytics integrations.
};

const shouldResetScroll = ({ pathname, source }) => {
  if (isFirstRoute || pathname !== previousPathname) {
    return true;
  }
  // Preserve existing behavior for redirects and forced programmatic navigations.
  return source === "programmatic";
};

const onRouteChange = ({ pathname, queryParams, source }) => {
  const resetScroll = shouldResetScroll({ pathname, source });

  requestAnimationFrame(() => {
    if (resetScroll) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    requestAnimationFrame(() => {
      updateHeaderOffset();
      focusMain({ preventScroll: true });
      trackRouteChange({ pathname, queryParams, source });
    });
  });

  previousPathname = pathname;
  isFirstRoute = false;
};

export { onRouteChange };
