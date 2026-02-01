const REDUCED_MOTION_KEY = "kp_reduced_motion";

const parseStoredPreference = (stored) => {
  if (stored === null) {
    return null;
  }
  if (stored === "1" || stored === "true") {
    return true;
  }
  if (stored === "0" || stored === "false") {
    return false;
  }
  return null;
};

export const applyReducedMotion = (reduced) => {
  document.documentElement.toggleAttribute("data-reduced-motion", Boolean(reduced));
};

const getSystemPreference = () =>
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const initReducedMotionPreference = () => {
  const storedRaw = window.safeStorage?.safeGet(REDUCED_MOTION_KEY) ?? null;
  const stored = parseStoredPreference(storedRaw);
  const systemPrefers = stored === null ? getSystemPreference() : false;
  const reduced = stored !== null ? stored : systemPrefers;

  applyReducedMotion(reduced);

  if (stored !== null || !window.matchMedia) {
    return;
  }

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", (event) => {
    applyReducedMotion(event.matches);
  });
};
