let programmaticNav = false;

const markProgrammaticNav = () => {
  programmaticNav = true;
};

const consumeProgrammaticNav = () => {
  const value = programmaticNav;
  programmaticNav = false;
  return value;
};

const normalizeHash = (hash) => {
  if (!hash) {
    return "#/";
  }
  return hash.startsWith("#") ? hash : `#${hash}`;
};

const navigateHash = (hash, { force = false } = {}) => {
  const target = normalizeHash(hash);
  markProgrammaticNav();
  if (window.location.hash !== target) {
    window.location.hash = target;
    return true;
  }
  if (force) {
    try {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } catch (error) {
      window.location.hash = target;
    }
  }
  return false;
};

export { markProgrammaticNav, consumeProgrammaticNav, navigateHash };
