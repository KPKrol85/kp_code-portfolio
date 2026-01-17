import { createElement, clearElement } from "../utils/dom.js";

const footerNav = [
  {
    title: "Produkty",
    ariaLabel: "Produkty",
    links: [
      { label: "Przeglądaj produkty", href: "#/products" },
      { label: "Cennik", href: "#" }, // TODO: add pricing route
      { label: "Licencje", href: "#/licenses" },
      { label: "Aktualizacje", href: "#" }, // TODO: add releases route
      { label: "Plan rozwoju", href: "#" }, // TODO: add roadmap route
    ],
  },
  {
    title: "Zasoby",
    ariaLabel: "Zasoby",
    links: [
      { label: "Dokumentacja", href: "#" }, // TODO: add docs route
      { label: "FAQ", href: "#" }, // TODO: add FAQ route
      { label: "Wsparcie", href: "#" }, // TODO: add support route
      { label: "Kontakt", href: "#/contact" },
    ],
  },
  {
    title: "Firma",
    ariaLabel: "Firma",
    links: [
      { label: "O nas", href: "#" }, // TODO: add about route
      { label: "Regulamin", href: "#/legal" },
      { label: "Polityka prywatności", href: "#/legal" },
      { label: "Cookies", href: "#/legal" },
    ],
  },
  {
    title: "Konto",
    ariaLabel: "Konto",
    links: [
      { label: "Zaloguj się", href: "#/auth" },
      { label: "Utwórz konto", href: "#/auth" },
      { label: "Moja biblioteka", href: "#/library" },
    ],
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/KPKrol85" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kp-code" },
  { label: "X / Twitter", href: "https://x.com/KP_Code_85" },
  { label: "YouTube", href: "https://www.youtube.com/@kp_code" },
  { label: "Facebook", href: "https://www.facebook.com/kpkrol85" },
];

const createSvgIcon = (path, viewBox = "0 0 24 24") => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("footer-social-icon");
  const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  svgPath.setAttribute("d", path);
  svg.appendChild(svgPath);
  return svg;
};

const socialIcons = {
  GitHub:
    "M12 2.5c-5.25 0-9.5 4.3-9.5 9.6 0 4.22 2.74 7.8 6.54 9.07.48.1.66-.21.66-.47 0-.23-.01-.85-.02-1.67-2.66.59-3.22-1.3-3.22-1.3-.43-1.12-1.05-1.42-1.05-1.42-.87-.6.07-.59.07-.59.96.07 1.46 1.01 1.46 1.01.85 1.49 2.22 1.06 2.76.81.09-.63.34-1.06.61-1.31-2.12-.25-4.35-1.08-4.35-4.8 0-1.06.37-1.92.98-2.6-.1-.25-.43-1.24.09-2.58 0 0 .8-.26 2.62 1 .76-.22 1.57-.33 2.38-.33.81 0 1.62.11 2.38.33 1.82-1.26 2.62-1 2.62-1 .52 1.34.19 2.33.09 2.58.61.68.98 1.54.98 2.6 0 3.73-2.24 4.55-4.37 4.79.35.31.66.92.66 1.86 0 1.34-.01 2.42-.01 2.75 0 .26.17.58.67.47 3.79-1.27 6.53-4.85 6.53-9.07 0-5.3-4.25-9.6-9.5-9.6z",
  LinkedIn:
    "M4.98 3.5a2.48 2.48 0 1 1 0 4.96 2.48 2.48 0 0 1 0-4.96zM3.5 9h2.96v11H3.5V9zm6.21 0h2.84v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.03 0 3.59 2.02 3.59 4.64V20h-2.96v-5.24c0-1.25-.02-2.86-1.74-2.86-1.75 0-2.02 1.38-2.02 2.76V20H9.71V9z",
  "X / Twitter":
    "M4 4h4.2l3.04 4.37L15.5 4H20l-6.27 7.17L20.5 20H16.3l-3.32-4.73L8.06 20H3.5l6.7-7.66L4 4z",
  YouTube:
    "M21.8 8.42a2.77 2.77 0 0 0-1.96-1.96C18.1 6 12 6 12 6s-6.1 0-7.84.46a2.77 2.77 0 0 0-1.96 1.96A28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .2 3.58 2.77 2.77 0 0 0 1.96 1.96C5.9 18 12 18 12 18s6.1 0 7.84-.46a2.77 2.77 0 0 0 1.96-1.96A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.2-3.58zM10 15.5V8.5l6 3.5-6 3.5z",
  Facebook:
    "M13.5 8.5V6.6c0-.7.3-1.2 1.3-1.2h1.6V3h-2.2C12 3 11 4.4 11 6.3v2.2H9v2.6h2V21h2.5v-9.9h2.1l.4-2.6h-2.5z",
};

const LOGO_PATH =
  "M 365.851562 149.308594 L 176.976562 338.183594 L 18.148438 179.359375 L 151.707031 45.804688 L 264.011719 158.109375 L 169.574219 252.546875 L 90.160156 173.136719 L 156.9375 106.355469 L 213.09375 162.511719 L 165.875 209.730469 L 126.167969 170.023438 L 159.554688 136.632812 L 187.632812 164.710938 L 164.023438 188.320312 L 144.167969 168.46875 L 160.863281 151.773438 L 174.902344 165.8125 L 163.097656 177.617188 L 153.171875 167.691406 L 161.519531 159.34375 L 168.539062 166.363281 L 162.636719 172.265625 L 157.671875 167.300781 L 161.84375 163.128906 L 165.355469 166.636719 L 162.402344 169.589844 L 159.921875 167.105469 L 162.007812 165.019531";

const createLogo = () => {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 384 383.999986");
  svg.setAttribute("width", "140");
  svg.setAttribute("height", "64");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("aria-hidden", "true");

  const defs = document.createElementNS(ns, "defs");
  const clipPath = document.createElementNS(ns, "clipPath");
  clipPath.setAttribute("id", "footer-logo-clip");
  const clipPathShape = document.createElementNS(ns, "path");
  clipPathShape.setAttribute(
    "d",
    "M 18.128906 45.804688 L 366 45.804688 L 366 338.304688 L 18.128906 338.304688 Z M 18.128906 45.804688 "
  );
  clipPathShape.setAttribute("clip-rule", "nonzero");
  clipPath.appendChild(clipPathShape);
  defs.appendChild(clipPath);
  svg.appendChild(defs);

  const group = document.createElementNS(ns, "g");
  group.setAttribute("clip-path", "url(#footer-logo-clip)");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", LOGO_PATH);
  path.setAttribute("fill", "currentColor");
  path.setAttribute("fill-rule", "evenodd");
  group.appendChild(path);
  svg.appendChild(group);

  return svg;
};

const createNavSection = ({ title, ariaLabel, links }) => {
  const list = createElement(
    "ul",
    { className: "footer-links" },
    links.map((link) =>
      createElement("li", {}, [
        createElement("a", {
          className: "footer-link",
          text: link.label,
          attrs: { href: link.href },
        }),
      ])
    )
  );

  return createElement("nav", { className: "footer-nav", attrs: { "aria-label": ariaLabel } }, [
    createElement("h3", { className: "footer-heading", text: title }),
    list,
  ]);
};

const createSocialLink = ({ label, href }) => {
  const iconPath = socialIcons[label];
  const link = createElement("a", {
    className: "footer-link footer-social-link",
    attrs: {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": `KP_Code na ${label}`,
    },
  });

  if (iconPath) {
    link.appendChild(createSvgIcon(iconPath));
  }

  link.appendChild(createElement("span", { className: "footer-social-text", text: label }));
  return createElement("li", {}, [link]);
};

export const renderFooter = (container) => {
  clearElement(container);
  container.classList.add("footer-container");

  const footer = createElement("div", { className: "site-footer" });
  const currentYear = new Date().getFullYear();

  const brandLogo = createElement(
    "a",
    { className: "footer-logo", attrs: { href: "#/", "aria-label": "KP_Code Digital Vault" } },
    [createLogo()]
  );

  const brandBlock = createElement("div", { className: "footer-brand" }, [
    brandLogo,
    createElement("h2", { className: "footer-brand-title", text: "KP_Code Digital Vault" }),
    createElement("p", {
      className: "footer-description",
      text: "Kompaktowa biblioteka produktów cyfrowych dla twórców i zespołów. Prosty zakup i szybki dostęp.",
    }),
  ]);

  const newsletterLabel = createElement("label", {
    className: "sr-only",
    text: "Adres e-mail",
    attrs: { for: "footer-newsletter-email" },
  });
  const newsletterInput = createElement("input", {
    className: "input",
    attrs: {
      id: "footer-newsletter-email",
      type: "email",
      name: "email",
      placeholder: "Adres e-mail",
      autocomplete: "email",
      required: true,
    },
  });
  const newsletterButton = createElement("button", {
    className: "button secondary",
    text: "Subskrybuj",
    attrs: { type: "submit" },
  });
  const newsletterStatus = createElement("p", {
    className: "footer-newsletter-status",
    text: "",
    attrs: { id: "footer-newsletter-status", role: "status", "aria-live": "polite" },
  });

  const newsletterForm = createElement(
    "form",
    { className: "footer-newsletter-form", attrs: { "aria-describedby": "footer-newsletter-status" } },
    [newsletterLabel, newsletterInput, newsletterButton]
  );

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!newsletterInput.checkValidity()) {
      newsletterInput.reportValidity();
      return;
    }
    newsletterStatus.textContent = "Wkrótce";
    newsletterStatus.classList.add("is-visible");
  });

  const newsletterBlock = createElement("div", { className: "footer-newsletter" }, [
    createElement("h3", { className: "footer-heading", text: "Newsletter" }),
    createElement("p", {
      className: "footer-description",
      text: "Powiadomienia o nowych wydaniach i produktach.",
    }),
    newsletterForm,
    newsletterStatus,
  ]);

  const topSection = createElement("div", { className: "footer-top" }, [brandBlock, newsletterBlock]);

  const middleGrid = createElement(
    "div",
    { className: "footer-middle-grid" },
    footerNav.map(createNavSection)
  );

  const socialList = createElement("ul", { className: "footer-links footer-social" }, [
    ...socialLinks.map(createSocialLink),
  ]);
  const socialBlock = createElement("div", { className: "footer-social-block" }, [
    createElement("h3", { className: "footer-heading", text: "Social media" }),
    socialList,
  ]);

  middleGrid.appendChild(socialBlock);

  const middleSection = createElement("div", { className: "footer-middle" }, [middleGrid]);

  const legalLinks = createElement("div", { className: "footer-meta-links" }, [
    createElement("a", {
      className: "footer-link",
      text: "Polityka prywatności",
      attrs: { href: "#/legal" },
    }),
    createElement("a", { className: "footer-link", text: "Regulamin", attrs: { href: "#/legal" } }),
    createElement("a", { className: "footer-link", text: "Cookies", attrs: { href: "#/legal" } }),
  ]);

  const metaInfo = createElement("div", { className: "footer-meta-info" }, [
    createElement("span", { text: `© ${currentYear} KP_Code. Wszelkie prawa zastrzeżone.` }),
    createElement("span", { className: "footer-meta-divider", text: "•" }),
    createElement("span", { text: "Stworzone w Polsce" }),
  ]);

  const backToTop = createElement("button", {
    className: "footer-top-link",
    text: "Do góry",
    attrs: { type: "button" },
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const bottomSection = createElement("div", { className: "footer-bottom" }, [
    metaInfo,
    legalLinks,
    backToTop,
  ]);

  footer.appendChild(topSection);
  footer.appendChild(middleSection);
  footer.appendChild(bottomSection);

  container.appendChild(footer);
};
