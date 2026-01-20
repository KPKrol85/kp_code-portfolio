export const canAccessRoute = (path, user) => {
  const protectedRoutes = new Set(["/account", "/library", "/licenses", "/checkout", "/admin"]);
  const adminRoutes = new Set(["/admin"]);

  if (!protectedRoutes.has(path)) {
    return { allowed: true };
  }

  if (!user) {
    return { allowed: false, reason: "unauthenticated" };
  }

  if (adminRoutes.has(path)) {
    return { allowed: false, reason: "admin-disabled" };
  }

  return { allowed: true };
};
