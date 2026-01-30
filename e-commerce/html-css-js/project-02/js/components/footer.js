import { getContent } from "../content/index.js";
import { selectors } from "../store/selectors.js";
import { store } from "../store/store.js";
import { createElement, clearElement } from "../utils/dom.js";

const getAccountLinks = (content, isAuthenticated) => {
  if (!isAuthenticated) {
    return [
      { label: content.footer.accountLinks.login, href: "#/auth" },
      { label: content.footer.accountLinks.register, href: "#/auth" },

    ];
  }
  return [
    { label: content.footer.accountLinks.account, href: "#/account" },
    { label: content.footer.accountLinks.library, href: "#/library" },
    { label: content.footer.accountLinks.licenses, href: "#/licenses" },
  ];
};

const getFooterNav = (content, isAuthenticated) => [
  {
    title: content.footer.nav.products.title,
    ariaLabel: content.footer.nav.products.ariaLabel,
    links: [
      { label: content.footer.nav.products.links.browse, href: "#/products" },
      { label: content.footer.nav.products.links.categories, href: "#/products" },
      { label: content.footer.nav.products.links.pricing, href: "#/pricing" },
      { label: content.footer.nav.products.links.updates, href: "#/updates" },
    ],
  },
  {
    title: content.footer.nav.resources.title,
    ariaLabel: content.footer.nav.resources.ariaLabel,
    links: [
      { label: content.footer.nav.resources.links.docs, href: "#/docs" },
      { label: content.footer.nav.resources.links.faq, href: "#/faq" },
      { label: content.footer.nav.resources.links.support, href: "#/support" },
      { label: content.footer.nav.resources.links.contact, href: "#/contact" },
    ],
  },
  {
    title: content.footer.nav.company.title,
    ariaLabel: content.footer.nav.company.ariaLabel,
    links: [
      { label: content.footer.nav.company.links.about, href: "#/about" },
      { label: content.footer.nav.company.links.roadmap, href: "#/roadmap" },
      { label: content.footer.nav.company.links.careers, href: "#/careers" },
    ],
  },
  {
    title: content.footer.nav.account.title,
    ariaLabel: content.footer.nav.account.ariaLabel,
    key: "account",
    links: getAccountLinks(content, isAuthenticated),
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

const LOGO_SOURCES = {
  light: "assets/logo/logo-light-mode.svg",
  dark: "assets/logo/logo-dark-mode.svg",
};
const LOGO_WIDTH = 140;
const LOGO_HEIGHT = 64;

const getLogoSrc = (theme) => (theme === "dark" ? LOGO_SOURCES.dark : LOGO_SOURCES.light);

const createLogoImage = (theme) =>
  createElement("img", {
    attrs: {
      src: getLogoSrc(theme),
      alt: "KP_Code Digital Vault",
      width: String(LOGO_WIDTH),
      height: String(LOGO_HEIGHT),
    },
  });

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

  const section = createElement(
    "nav",
    { className: "footer-nav", attrs: { "aria-label": ariaLabel } },
    [createElement("h3", { className: "footer-heading", text: title }), list]
  );

  return { section, list };
};

const createSocialLink = (content, { label, href }) => {
  const iconPath = socialIcons[label];
  const link = createElement("a", {
    className: "footer-link footer-social-link",
    attrs: {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": content.footer.socialAria.replace("{label}", label),
    },
  });

  if (iconPath) {
    link.appendChild(createSvgIcon(iconPath));
  }

  link.appendChild(createElement("span", { className: "footer-social-text", text: label }));
  return createElement("li", {}, [link]);
};

export const renderFooter = (container) => {
  const content = getContent();
  const footerRoot = container?.closest("footer");
  if (footerRoot) {
    footerRoot.classList.add("is-mounted");
  }
  clearElement(container);
  container.classList.add("footer-container");
  if (container._footerUnsubscribe) {
    container._footerUnsubscribe();
    container._footerUnsubscribe = null;
  }

  const footer = createElement("div", { className: "site-footer" });
  const currentYear = new Date().getFullYear();

  const brandLogoImage = createLogoImage(selectors.theme(store.getState()));
  const brandLogo = createElement(
    "a",
    {
      className: "footer-logo",
      attrs: { href: "#/", "aria-label": content.footer.brandAriaLabel },
    },
    [brandLogoImage]
  );

  const brandBlock = createElement("div", { className: "footer-brand" }, [
    brandLogo,
    createElement("h2", { className: "footer-brand-title", text: content.footer.brandTitle }),
    createElement("p", {
      className: "footer-description",
      text: content.footer.brandDescription,
    }),
  ]);

  const newsletterLabel = createElement("label", {
    className: "sr-only",
    text: content.footer.newsletter.emailLabel,
    attrs: { for: "footer-newsletter-email" },
  });
  const newsletterInput = createElement("input", {
    className: "input",
    attrs: {
      id: "footer-newsletter-email",
      type: "email",
      name: "email",
      placeholder: content.footer.newsletter.emailPlaceholder,
      inputmode: "email",
      autocomplete: "email",
      autocapitalize: "none",
      spellcheck: "false",
      required: true,
    },
  });
  const newsletterButton = createElement("button", {
    className: "button secondary",
    text: content.footer.newsletter.submitLabel,
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
    newsletterStatus.textContent = getContent().footer.newsletter.soonLabel;
    newsletterStatus.classList.add("is-visible");
  });

  const newsletterBlock = createElement("div", { className: "footer-newsletter" }, [
    createElement("h3", { className: "footer-heading", text: content.footer.newsletter.title }),
    createElement("p", {
      className: "footer-description",
      text: content.footer.newsletter.description,
    }),
    newsletterForm,
    newsletterStatus,
  ]);

  const topSection = createElement("div", { className: "footer-top" }, [brandBlock, newsletterBlock]);

  const middleGrid = createElement("div", { className: "footer-middle-grid" });
  const isAuthenticated = selectors.isAuthenticated(store.getState());
  const sections = getFooterNav(content, isAuthenticated);
  let accountSection = null;
  sections.forEach((section) => {
    const created = createNavSection(section);
    if (section.key === "account") {
      accountSection = created;
    }
    middleGrid.appendChild(created.section);
  });

  const socialList = createElement("ul", { className: "footer-links footer-social" }, [
    ...socialLinks.map((link) => createSocialLink(content, link)),
  ]);
  const socialBlock = createElement("div", { className: "footer-social-block" }, [
    createElement("h3", { className: "footer-heading", text: content.footer.socialTitle }),
    socialList,
  ]);

  middleGrid.appendChild(socialBlock);

  const middleSection = createElement("div", { className: "footer-middle" }, [middleGrid]);

  const legalLinks = createElement("div", { className: "footer-meta-links" }, [
    createElement("a", {
      className: "footer-link",
      text: content.footer.legal.privacy,
      attrs: { href: "#/privacy" },
    }),
    createElement("a", {
      className: "footer-link",
      text: content.footer.legal.terms,
      attrs: { href: "#/terms" },
    }),
    createElement("a", {
      className: "footer-link",
      text: content.footer.legal.cookies,
      attrs: { href: "#/cookies" },
    }),
  ]);

  const metaInfo = createElement("div", { className: "footer-meta-info" }, [
    createElement("span", {
      text: content.footer.copyright.replace("{year}", String(currentYear)),
    }),
  ]);

  const backToTop = createElement("button", {
    className: "footer-top-link",
    text: content.footer.backToTop,
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

  let previousAuth = isAuthenticated;
  let previousTheme = selectors.theme(store.getState());
  container._footerUnsubscribe = store.subscribe((state) => {
    const nextAuth = Boolean(state.user);
    const nextTheme = state.ui?.theme;
    if (nextTheme && nextTheme !== previousTheme) {
      brandLogoImage.setAttribute("src", getLogoSrc(nextTheme));
      previousTheme = nextTheme;
    }
    if (nextAuth !== previousAuth) {
      previousAuth = nextAuth;
      if (accountSection && accountSection.list) {
        clearElement(accountSection.list);
        getAccountLinks(getContent(), nextAuth).forEach((link) => {
          accountSection.list.appendChild(
            createElement("li", {}, [
              createElement("a", {
                className: "footer-link",
                text: link.label,
                attrs: { href: link.href },
              }),
            ])
          );
        });
      }
    }
  });
};
