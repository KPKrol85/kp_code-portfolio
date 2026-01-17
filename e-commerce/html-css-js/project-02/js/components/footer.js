import { createElement, clearElement } from "../utils/dom.js";

const footerNav = [
  {
    title: "Product",
    ariaLabel: "Product",
    links: [
      { label: "Browse products", href: "#/products" },
      { label: "Pricing", href: "#" }, // TODO: add pricing route
      { label: "Licenses", href: "#/licenses" },
      { label: "Releases", href: "#" }, // TODO: add releases route
      { label: "Roadmap", href: "#" }, // TODO: add roadmap route
    ],
  },
  {
    title: "Resources",
    ariaLabel: "Resources",
    links: [
      { label: "Docs", href: "#" }, // TODO: add docs route
      { label: "FAQ", href: "#" }, // TODO: add FAQ route
      { label: "Support", href: "#" }, // TODO: add support route
      { label: "Contact", href: "#/contact" },
    ],
  },
  {
    title: "Company",
    ariaLabel: "Company",
    links: [
      { label: "About", href: "#" }, // TODO: add about route
      { label: "Terms", href: "#/legal" },
      { label: "Privacy", href: "#/legal" },
      { label: "Cookies", href: "#/legal" },
    ],
  },
  {
    title: "Account",
    ariaLabel: "Account",
    links: [
      { label: "Sign in", href: "#/auth" },
      { label: "Create account", href: "#/auth" },
      { label: "My library", href: "#/library" },
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
      "aria-label": `KP_Code on ${label}`,
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

  const brandBlock = createElement("div", { className: "footer-brand" }, [
    createElement("h2", { className: "footer-brand-title", text: "KP_Code Digital Vault" }),
    createElement("p", {
      className: "footer-description",
      text: "Kompaktowa biblioteka produktów cyfrowych dla twórców i zespołów. Prosty zakup i szybki dostęp.",
    }),
  ]);

  const newsletterLabel = createElement("label", {
    className: "sr-only",
    text: "Email address",
    attrs: { for: "footer-newsletter-email" },
  });
  const newsletterInput = createElement("input", {
    className: "input",
    attrs: {
      id: "footer-newsletter-email",
      type: "email",
      name: "email",
      placeholder: "Email",
      autocomplete: "email",
      required: true,
    },
  });
  const newsletterButton = createElement("button", {
    className: "button secondary",
    text: "Subscribe",
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
    newsletterStatus.textContent = "Coming soon";
    newsletterStatus.classList.add("is-visible");
  });

  const newsletterBlock = createElement("div", { className: "footer-newsletter" }, [
    createElement("h3", { className: "footer-heading", text: "Newsletter" }),
    createElement("p", {
      className: "footer-description",
      text: "Minimalne aktualizacje o nowych wydaniach i produktach.",
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
    createElement("h3", { className: "footer-heading", text: "Social" }),
    socialList,
  ]);

  middleGrid.appendChild(socialBlock);

  const middleSection = createElement("div", { className: "footer-middle" }, [middleGrid]);

  const legalLinks = createElement("div", { className: "footer-meta-links" }, [
    createElement("a", {
      className: "footer-link",
      text: "Privacy Policy",
      attrs: { href: "#/legal" },
    }),
    createElement("a", { className: "footer-link", text: "Terms", attrs: { href: "#/legal" } }),
    createElement("a", { className: "footer-link", text: "Cookies", attrs: { href: "#/legal" } }),
  ]);

  const metaInfo = createElement("div", { className: "footer-meta-info" }, [
    createElement("span", { text: `© ${currentYear} KP_Code. All rights reserved.` }),
    createElement("span", { className: "footer-meta-divider", text: "•" }),
    createElement("span", { text: "Made in Poland" }),
  ]);

  const backToTop = createElement("button", {
    className: "footer-top-link",
    text: "Back to top",
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
