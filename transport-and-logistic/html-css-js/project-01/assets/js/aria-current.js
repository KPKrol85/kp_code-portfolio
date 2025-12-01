// Marks current page in nav for screen readers
export function applyAriaCurrent() {
  // Bierzemy tylko linki w głównym nav
  const links = document.querySelectorAll(".nav__links a[href]");
  if (!links.length) return;

  const fullPath = window.location.pathname; // "/", "/index.html", "/about.html", "/transport-project-01/about.html"
  let fileName = fullPath.split("/").pop(); // "", "index.html", "about.html"

  // Root "/" traktujemy jak index.html
  if (!fileName) {
    fileName = "index.html";
  }

  links.forEach((link) => {
    const href = link.getAttribute("href");

    const isHomeLink = href === "/" || href === "./" || href === "index.html";

    const isCurrent =
      // Relatywne linki typu "about.html", "services.html"
      href === fileName ||
      // Pełne ścieżki typu "/about.html" albo "/transport-project-01/about.html"
      href === fullPath ||
      // Warianty strony głównej
      (isHomeLink && (fullPath === "/" || fileName === "index.html"));

    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}


