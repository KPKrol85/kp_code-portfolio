import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { getContent } from "../content/index.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { setMeta } from "../utils/meta.js";
import { parseHash } from "../utils/navigation.js";

const createSectionHeader = (title, lead) => {
  const header = createElement("div", { className: "section-header" });
  header.appendChild(createElement("h2", { text: title }));
  if (lead) {
    header.appendChild(createElement("p", { className: "section-lead", text: lead }));
  }
  return header;
};

export const renderAbout = () => {
  const content = getContent();
  const about = content.about;
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const { pathname } = parseHash();
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }

  const hero = createElement("section", { className: "hero services-hero about-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(
    createElement("h1", {
      text: about.hero.title,
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: about.hero.lead,
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const missionSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": about.mission.ariaLabel },
  });
  missionSection.appendChild(
    createSectionHeader(
      about.mission.title,
      about.mission.lead
    )
  );

  const founderCard = createElement("div", { className: "card about-founder" });

  const avatar = createElement("div", {
    className: "about-avatar",
    attrs: { "aria-label": about.founder.ariaLabel },
  });

  const avatarPicture = createElement("picture", { className: "about-avatar-media" });

  const sourceAvif = createElement("source", {
    attrs: {
      type: "image/avif",
      srcset: [
        "/assets/img/_gen/about/kamil-krol-founder-w320.avif 320w",
        "/assets/img/_gen/about/kamil-krol-founder-w480.avif 480w",
        "/assets/img/_gen/about/kamil-krol-founder-w640.avif 640w",
        "/assets/img/_gen/about/kamil-krol-founder-w768.avif 768w",
        "/assets/img/_gen/about/kamil-krol-founder-w1024.avif 1024w",
      ].join(", "),
      sizes: "(max-width: 640px) 96px, 128px",
    },
  });

  const sourceWebp = createElement("source", {
    attrs: {
      type: "image/webp",
      srcset: [
        "/assets/img/_gen/about/kamil-krol-founder-w320.webp 320w",
        "/assets/img/_gen/about/kamil-krol-founder-w480.webp 480w",
        "/assets/img/_gen/about/kamil-krol-founder-w640.webp 640w",
        "/assets/img/_gen/about/kamil-krol-founder-w768.webp 768w",
        "/assets/img/_gen/about/kamil-krol-founder-w1024.webp 1024w",
      ].join(", "),
      sizes: "(max-width: 640px) 96px, 128px",
    },
  });

  const avatarImg = createElement("img", {
    attrs: {
      src: "/assets/img/_gen/about/kamil-krol-founder-w640.webp",
      alt: about.founder.imageAlt,
      loading: "lazy",
      decoding: "async",
      width: "120",
      height: "160",
    },
  });

  avatarPicture.appendChild(sourceAvif);
  avatarPicture.appendChild(sourceWebp);
  avatarPicture.appendChild(avatarImg);
  avatar.appendChild(avatarPicture);

  const founderMeta = createElement("div", { className: "about-founder-meta" }, [
    createElement("h3", { text: about.founder.name }),
    createElement("p", { className: "service-meta", text: about.founder.role }),
  ]);

  const founderBio = createElement("p", {
    text: about.founder.bio,
  });

  const valuesList = createElement(
    "ul",
    { className: "about-values" },
    about.founder.values.map((item) => createElement("li", { text: item }))
  );

  const founderCta = createElement("a", {
    className: "about-cta",
    text: about.founder.ctaLabel,
    attrs: { href: "#/contact" },
  });

  founderCard.appendChild(avatar);
  founderCard.appendChild(founderMeta);
  founderCard.appendChild(founderBio);
  founderCard.appendChild(createElement("hr", { className: "about-separator" }));
  founderCard.appendChild(valuesList);
  founderCard.appendChild(founderCta);

  const missionCard = createElement("div", { className: "card about-mission" }, [
    createElement("h3", { text: about.mission.cardTitle }),
    ...about.mission.cardParagraphs.map((text) => createElement("p", { text })),
  ]);

  const missionGrid = createElement("div", { className: "grid grid-2" }, [
    founderCard,
    missionCard,
  ]);
  missionSection.appendChild(missionGrid);
  container.appendChild(missionSection);

  const progressSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": about.progress.ariaLabel },
  });
  progressSection.appendChild(
    createSectionHeader(
      about.progress.title,
      about.progress.lead
    )
  );

  const milestonesCard = createElement("div", { className: "card" });
  milestonesCard.appendChild(createElement("h3", { text: about.progress.milestonesTitle }));
  const milestones = createElement(
    "ul",
    { className: "timeline" },
    about.progress.milestones.map((item) =>
      createElement("li", { className: "timeline-item" }, [
        createElement("span", { className: "service-meta", text: item.label }),
        createElement("p", { text: item.description }),
      ])
    )
  );
  milestonesCard.appendChild(milestones);

  const roadmapCard = createElement("div", { className: "card" });
  roadmapCard.appendChild(createElement("h3", { text: about.progress.roadmapTitle }));
  roadmapCard.appendChild(createElement("p", { text: about.progress.roadmapLead }));
  const roadmapList = createElement(
    "ul",
    { className: "about-card-list" },
    about.progress.roadmapItems.map((item) => createElement("li", { text: item }))
  );
  roadmapCard.appendChild(roadmapList);
  roadmapCard.appendChild(
    createElement("a", {
      className: "button secondary",
      text: about.progress.roadmapCtaLabel,
      attrs: { href: "#/roadmap" },
    })
  );

  const progressGrid = createElement("div", { className: "grid grid-2" }, [
    milestonesCard,
    roadmapCard,
  ]);
  progressSection.appendChild(progressGrid);
  container.appendChild(progressSection);

  const collaborationSection = createElement("section", {
    className: "section about-collaboration",
    attrs: { "aria-label": about.collaboration.ariaLabel },
  });
  collaborationSection.appendChild(
    createSectionHeader(
      about.collaboration.title,
      about.collaboration.lead
    )
  );

  const collabGrid = createElement("div", { className: "grid grid-2" });
  const partnershipsCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: about.collaboration.cards[0].title }),
    createElement("p", { text: about.collaboration.cards[0].description }),
    createElement("a", {
      className: "button secondary",
      text: about.collaboration.cards[0].ctaLabel,
      attrs: { href: "#/contact" },
    }),
  ]);
  const brandingCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: about.collaboration.cards[1].title }),
    createElement("p", { text: about.collaboration.cards[1].description }),
    createElement("a", {
      className: "button secondary",
      text: about.collaboration.cards[1].ctaLabel,
      attrs: { href: "#/contact" },
    }),
  ]);
  const affiliationCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: about.collaboration.cards[2].title }),
    createElement("p", { text: about.collaboration.cards[2].description }),
    createElement("a", {
      className: "button secondary",
      text: about.collaboration.cards[2].ctaLabel,
      attrs: { href: "#/contact" },
    }),
  ]);
  const careersCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: about.collaboration.careers.title }),
    createElement("p", { text: about.collaboration.careers.description }),
    createElement("div", { className: "notice" }, [
      createElement("p", { text: about.collaboration.careers.notice }),
    ]),
    createElement("a", {
      className: "button",
      text: about.collaboration.careers.ctaLabel,
      attrs: { href: "#/contact" },
    }),
  ]);

  collabGrid.appendChild(partnershipsCard);
  collabGrid.appendChild(brandingCard);
  collabGrid.appendChild(affiliationCard);
  collabGrid.appendChild(careersCard);
  collaborationSection.appendChild(collabGrid);
  container.appendChild(collaborationSection);

  setMeta(content.meta.routes.about);

  main.appendChild(container);
};
