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

const parseHash = (hash = window.location.hash) => {
  const rawHash = typeof hash === "string" ? hash : "";
  const trimmedHash = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  const [pathWithQuery = ""] = trimmedHash.split("#");
  const queryIndex = pathWithQuery.indexOf("?");
  const pathnamePart =
    queryIndex === -1 ? pathWithQuery : pathWithQuery.slice(0, queryIndex);
  const queryString =
    queryIndex === -1 ? "" : pathWithQuery.slice(queryIndex + 1);
  const normalizedPathname = pathnamePart
    ? pathnamePart.startsWith("/")
      ? pathnamePart
      : `/${pathnamePart}`
    : "/";
  const queryParams = {};
  if (queryString) {
    queryString.split("&").forEach((segment) => {
      if (!segment) {
        return;
      }
      const [rawKey, rawValue = ""] = segment.split("=");
      if (!rawKey) {
        return;
      }
      if (Object.hasOwn(queryParams, rawKey)) {
        const existing = queryParams[rawKey];
        if (Array.isArray(existing)) {
          existing.push(rawValue);
        } else {
          queryParams[rawKey] = [existing, rawValue];
        }
      } else {
        queryParams[rawKey] = rawValue;
      }
    });
  }
  return { pathname: normalizedPathname, queryString, queryParams };
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

export { markProgrammaticNav, consumeProgrammaticNav, navigateHash, parseHash };
