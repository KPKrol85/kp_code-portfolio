import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { getContent } from "../content/index.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { parseHash } from "../utils/navigation.js";

const buildSection = (section, index) => {
  const sectionId = `section-${index + 1}`;
  const block = createElement("div", { className: "legal-section" }, [
    createElement("h2", { text: section.title, attrs: { id: sectionId } }),
  ]);

  section.paragraphs.forEach((paragraph) => {
    block.appendChild(createElement("p", { text: paragraph }));
  });

  if (section.list?.length) {
    const list = createElement(
      "ul",
      {},
      section.list.map((item) => createElement("li", { text: item }))
    );
    block.appendChild(list);
  }

  return block;
};

const renderLegalPage = ({ title, intro, sections }) => {
  const content = getContent();
  const email = content.legal.common.contactEmail;
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(parseHash().pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  const page = createElement("div", { className: "legal-page" });

  page.appendChild(createElement("h1", { text: title }));
  page.appendChild(
    createElement("p", {
      className: "legal-meta",
      text: content.legal.common.updatedAtLabel,
    })
  );
  page.appendChild(
    createElement("div", { className: "notice", text: content.legal.common.draftNotice })
  );
  page.appendChild(createElement("p", { className: "legal-intro", text: intro }));

  const content = createElement("div", { className: "legal-content" });
  sections.forEach((section, index) => {
    content.appendChild(buildSection(section, index));
  });

  const relatedLinks = createElement(
    "div",
    { className: "legal-links" },
    content.legal.common.relatedLinks.map((link) =>
      createElement("a", {
        className: "footer-link",
        text: link.label,
        attrs: { href: link.href },
      })
    )
  );

  const contact = createElement("p", {
    text: content.legal.common.contactLine,
  });
  const contactLink = createElement("a", {
    className: "footer-link",
    text: content.legal.common.contactCta,
    attrs: { href: `mailto:${email}` },
  });
  contact.appendChild(createElement("span", { text: content.legal.common.contactSeparator }));
  contact.appendChild(contactLink);

  const footer = createElement("div", { className: "legal-footer" }, [
    createElement("h2", { text: content.legal.common.relatedTitle }),
    relatedLinks,
    contact,
  ]);

  content.appendChild(footer);

  page.appendChild(content);
  container.appendChild(page);
  main.appendChild(container);
};

export const renderPrivacy = () => {
  const content = getContent();
  renderLegalPage({
    title: content.legal.privacy.title,
    intro: content.legal.privacy.intro,
    sections: content.legal.privacy.sections,
  });
};

export const renderTerms = () => {
  const content = getContent();
  renderLegalPage({
    title: content.legal.terms.title,
    intro: content.legal.terms.intro,
    sections: content.legal.terms.sections,
  });
};

export const renderCookies = () => {
  const content = getContent();
  renderLegalPage({
    title: content.legal.cookies.title,
    intro: content.legal.cookies.intro,
    sections: content.legal.cookies.sections,
  });
};
