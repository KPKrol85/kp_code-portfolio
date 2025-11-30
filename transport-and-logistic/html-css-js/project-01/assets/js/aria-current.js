// Marks current page in nav for screen readers
export function applyAriaCurrent() {
  const links = document.querySelectorAll(".nav__links a");
  const path = window.location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path || (href === "index.html" && path === "")) {
      link.setAttribute("aria-current", "page");
    }
  });
}
