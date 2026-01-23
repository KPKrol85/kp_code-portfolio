import { createElement, clearElement } from "../utils/dom.js";
import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { parseHash } from "../utils/navigation.js";
import { setMeta } from "../utils/meta.js";

const createSectionHeader = (title, lead) => {
  const header = createElement("div", { className: "section-header" });
  header.appendChild(createElement("h2", { text: title }));
  if (lead) {
    header.appendChild(createElement("p", { className: "section-lead", text: lead }));
  }
  return header;
};

export const renderAbout = () => {
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
    createElement("h1", { text: "O nas", attrs: { tabindex: "-1", "data-focus-heading": "true" } })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: "KP_Code Digital Vault to biblioteka produktów cyfrowych dla twórców i zespołów, które chcą budować szybciej i w przewidywalnym standardzie.",
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const missionSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Zespół i misja" },
  });
  missionSection.appendChild(
    createSectionHeader(
      "Zespół i misja",
      "Stawiamy na jakość wykonania, dostępność i performance — bez kompromisów w doświadczeniu użytkownika."
    )
  );

  const founderCard = createElement("div", { className: "card about-founder" });
  const avatar = createElement("div", {
    className: "about-avatar",
    attrs: { role: "img", "aria-label": "Zdjęcie założyciela — placeholder" },
  });
  const founderMeta = createElement("div", { className: "about-founder-meta" }, [
    createElement("h3", { text: "Kamil Król" }),
    createElement("p", { className: "service-meta", text: "Founder • KP_Code" }),
  ]);
  const founderBio = createElement("p", {
    text: "Projektuje i wdraża produkty cyfrowe w oparciu o realne potrzeby biznesu. Łączy design systemy z inżynierią front-endu, dbając o stabilność, dostępność i przewidywalny rozwój produktu.",
  });
  const valuesList = createElement("ul", { className: "about-values" }, [
    createElement("li", { text: "Jakość i konsekwencja w UX" }),
    createElement("li", { text: "Dostępność od pierwszego wdrożenia" }),
    createElement("li", { text: "Performance jako standard" }),
    createElement("li", { text: "Prostota i klarowność rozwiązań" }),
  ]);
  const founderCta = createElement("a", {
    className: "button secondary",
    text: "Skontaktuj się",
    attrs: { href: "#/contact" },
  });
  founderCard.appendChild(avatar);
  founderCard.appendChild(founderMeta);
  founderCard.appendChild(founderBio);
  founderCard.appendChild(createElement("h4", { text: "Wartości" }));
  founderCard.appendChild(valuesList);
  founderCard.appendChild(founderCta);

  const missionCard = createElement("div", { className: "card about-mission" }, [
    createElement("h3", { text: "Dlaczego KP_Code Digital Vault?" }),
    createElement("p", {
      text: "Budujemy bibliotekę narzędzi, które skracają czas wdrożeń i utrzymują wysoki standard UI. Każdy produkt jest tworzony z myślą o realnym użyciu w projektach komercyjnych.",
    }),
    createElement("p", {
      text: "Rozwijamy platformę iteracyjnie, weryfikując decyzje na podstawie danych, feedbacku i jakości kodu.",
    }),
  ]);

  const missionGrid = createElement("div", { className: "grid grid-2" }, [
    founderCard,
    missionCard,
  ]);
  missionSection.appendChild(missionGrid);
  container.appendChild(missionSection);

  const progressSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Milestones i roadmap" },
  });
  progressSection.appendChild(
    createSectionHeader(
      "Milestones i roadmap",
      "Budujemy produkt krok po kroku. Kamienie milowe opisują to, co już dowieźliśmy, a roadmap pokazuje najbliższe kierunki."
    )
  );

  const milestonesCard = createElement("div", { className: "card" });
  milestonesCard.appendChild(createElement("h3", { text: "Milestones" }));
  const milestones = createElement("ul", { className: "timeline" }, [
    createElement("li", { className: "timeline-item" }, [
      createElement("span", { className: "service-meta", text: "Q4 2024" }),
      createElement("p", { text: "Start KP_Code Digital Vault i pierwsza kolekcja produktów." }),
    ]),
    createElement("li", { className: "timeline-item" }, [
      createElement("span", { className: "service-meta", text: "Q1 2025" }),
      createElement("p", { text: "Rozszerzenie katalogu o szablony UI i dashboardy." }),
    ]),
    createElement("li", { className: "timeline-item" }, [
      createElement("span", { className: "service-meta", text: "Q2 2025" }),
      createElement("p", { text: "Wdrożenie panelu biblioteki i zarządzania licencjami." }),
    ]),
  ]);
  milestonesCard.appendChild(milestones);

  const roadmapCard = createElement("div", { className: "card" });
  roadmapCard.appendChild(createElement("h3", { text: "Roadmap (żywa)" }));
  roadmapCard.appendChild(
    createElement("p", {
      text: "Plan rozwoju aktualizujemy cyklicznie — kierunki mogą się zmieniać wraz z priorytetami społeczności.",
    })
  );
  const roadmapList = createElement("ul", { className: "about-card-list" }, [
    createElement("li", { text: "Q3: kolejne kategorie produktów i zestawy starterów." }),
    createElement("li", { text: "Q4: biblioteka komponentów UI z wariantami." }),
    createElement("li", { text: "Q1: narzędzia automatyzujące wydania i QA." }),
    createElement("li", { text: "Q2: program partnerski i afiliacyjny." }),
  ]);
  roadmapCard.appendChild(roadmapList);
  roadmapCard.appendChild(
    createElement("a", {
      className: "button secondary",
      text: "Zobacz plan rozwoju",
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
    attrs: { "aria-label": "Współpraca i rekrutacje" },
  });
  collaborationSection.appendChild(
    createSectionHeader(
      "Współpraca i rekrutacje",
      "Łączymy siły z markami i twórcami, którzy stawiają na jakość i długoterminowy rozwój produktu."
    )
  );

  const collabGrid = createElement("div", { className: "grid grid-2" });
  const partnershipsCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: "Współpraca produktowa" }),
    createElement("p", {
      text: "Wspólne tworzenie i wdrażanie pakietów UI, szablonów oraz narzędzi edukacyjnych.",
    }),
    createElement("a", { className: "button secondary", text: "Napisz do nas", attrs: { href: "#/contact" } }),
  ]);
  const brandingCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: "Partnerstwa brandowe" }),
    createElement("p", {
      text: "Kampanie z partnerami, integracje i wspólne premiery produktów cyfrowych.",
    }),
    createElement("a", { className: "button secondary", text: "Porozmawiajmy", attrs: { href: "#/contact" } }),
  ]);
  const affiliationCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: "Program afiliacyjny" }),
    createElement("p", {
      text: "Dla twórców i społeczności, które chcą współtworzyć dystrybucję produktów KP_Code.",
    }),
    createElement("a", { className: "button secondary", text: "Dołącz do programu", attrs: { href: "#/contact" } }),
  ]);
  const careersCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: "Rekrutacje" }),
    createElement("p", {
      text: "Aktualnie brak otwartych rekrutacji. Jeśli chcesz współpracować, zostaw kontakt.",
    }),
    createElement("div", { className: "notice" }, [
      createElement("p", { text: "Zostaw krótką informację o sobie, gdy tylko ruszy rekrutacja, odezwiemy się w pierwszej kolejności." }),
    ]),
    createElement("a", { className: "button", text: "Skontaktuj się", attrs: { href: "#/contact" } }),
  ]);

  collabGrid.appendChild(partnershipsCard);
  collabGrid.appendChild(brandingCard);
  collabGrid.appendChild(affiliationCard);
  collabGrid.appendChild(careersCard);
  collaborationSection.appendChild(collabGrid);
  container.appendChild(collaborationSection);

  setMeta({
    title: "O nas — KP_Code Digital Vault",
    description:
      "Poznaj zespół KP_Code Digital Vault, naszą misję oraz plan rozwoju platformy z produktami cyfrowymi.",
  });

  main.appendChild(container);
};
