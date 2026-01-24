export const canAccessRoute = (path, user) => {
  const protectedRoutes = ["/account", "/library", "/licenses", "/checkout", "/admin"];
  const adminRoutes = ["/admin"];
  const isProtected = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  if (!isProtected) {
    return { allowed: true };
  }

  if (!user) {
    return { allowed: false, reason: "unauthenticated" };
  }

  if (adminRoutes.some((route) => path === route || path.startsWith(`${route}/`))) {
    return { allowed: false, reason: "admin-disabled" };
  }

  return { allowed: true };
};
