export function applyAriaCurrent() {
  const links = document.querySelectorAll(".nav__links a[href], .footer__list a[href]");
  if (!links.length) return;

  const fullPath = window.location.pathname;
  let fileName = fullPath.split("/").pop();

  if (!fileName) {
    fileName = "index.html";
  }

  links.forEach((link) => {
    const href = link.getAttribute("href");
    const isHomeLink = href === "/" || href === "./" || href === "index.html";

    const isCurrent = href === fileName || href === fullPath || (isHomeLink && (fullPath === "/" || fileName === "index.html"));

    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
