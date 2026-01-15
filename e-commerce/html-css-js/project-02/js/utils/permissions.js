const normalizeRole = (user) => (user?.role ? user.role : "user");

export const canAccessRoute = (path, user) => {
  const protectedRoutes = new Set(["/account", "/library", "/licenses", "/checkout", "/admin"]);
  const adminRoutes = new Set(["/admin"]);

  if (!protectedRoutes.has(path)) {
    return { allowed: true };
  }

  if (!user) {
    return { allowed: false, reason: "unauthenticated" };
  }

  if (adminRoutes.has(path) && normalizeRole(user) !== "admin") {
    return { allowed: false, reason: "forbidden" };
  }

  return { allowed: true };
};
