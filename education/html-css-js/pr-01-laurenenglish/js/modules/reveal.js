export const initReveal = () => {
  const items = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!items.length) return;

  if (typeof window.matchMedia !== "function") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof window.IntersectionObserver !== "function") return;

  let pendingCount = items.length;
  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          entry.target.classList.contains("is-reveal-pending")
        ) {
          entry.target.classList.add("is-visible");
          entry.target.classList.remove("is-reveal-pending");
          pendingCount -= 1;
          observer.unobserve(entry.target);

          if (pendingCount === 0) {
            observer.disconnect();
          }
        }
      });
    },
    { threshold: 0.2 },
  );

  try {
    items.forEach((item) => {
      item.classList.add("is-reveal-pending");
      observer.observe(item);
    });
  } catch (error) {
    observer.disconnect();
    items.forEach((item) =>
      item.classList.remove("is-reveal-pending", "is-visible"),
    );
    throw error;
  }
};
