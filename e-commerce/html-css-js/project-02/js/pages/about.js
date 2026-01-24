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
    createElement("p", { className: "service-meta", text: "Founder · KP_Code" }),
  ]);
  const founderBio = createElement("p", {
    text: "Projektuje i rozwija produkty cyfrowe w oparciu o realne potrzeby biznesowe. Łączy design systemy z inżynierią front-endu, koncentrując się na stabilności, dostępności i przewidywalnym rozwoju platformy.",
  });
  const valuesList = createElement("ul", { className: "about-values" }, [
    createElement("li", { text: "Jakość i konsekwencja w UX" }),
    createElement("li", { text: "Dostępność od pierwszego wdrożenia" }),
    createElement("li", { text: "Performance jako standard, nie dodatek" }),
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
      text: "KP_Code Digital Vault powstał jako odpowiedź na potrzebę uporządkowanych, wysokiej jakości produktów cyfrowych, które realnie skracają czas wdrożeń i podnoszą standard pracy zespołów produktowych.",
    }),
    createElement("p", {
      text: "Tworzymy bibliotekę narzędzi, komponentów i zasobów projektowych, które są projektowane z myślą o rzeczywistym użyciu w projektach komercyjnych — nie jako demonstracje, lecz jako gotowe, skalowalne rozwiązania.",
    }),
    createElement("p", {
      text: "Platformę rozwijamy iteracyjnie, podejmując decyzje w oparciu o dane, feedback użytkowników oraz jakość architektury. Skupiamy się na długofalowej wartości: stabilności, dostępności, performance i spójności całego ekosystemu.",
    }),
    createElement("p", {
      text: "KP_Code Digital Vault to nie jednorazowy zestaw produktów, ale rosnąca platforma, która ma wspierać twórców i zespoły w budowaniu lepszych, bardziej przewidywalnych produktów cyfrowych.",
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
      "Budujemy KP_Code Digital Vault iteracyjnie. Kamienie milowe pokazują to, co już dowieźliśmy, a roadmapa wskazuje priorytety na kolejny etap — na bazie danych, celów biznesowych i feedbacku."
    )
  );

  const milestonesCard = createElement("div", { className: "card" });
  milestonesCard.appendChild(createElement("h3", { text: "Milestones" }));
  const milestones = createElement("ul", { className: "timeline" }, [
    createElement("li", { className: "timeline-item" }, [
      createElement("span", {
        className: "service-meta",
        text: "Uruchomienie platformy KP_Code Digital Vault",
      }),
      createElement("p", {
        text: "Stabilny start platformy oraz publikacja pierwszej kolekcji produktów cyfrowych.",
      }),
    ]),
    createElement("li", { className: "timeline-item" }, [
      createElement("span", {
        className: "service-meta",
        text: "Rozszerzenie katalogu i standaryzacja ofert",
      }),
      createElement("p", {
        text: "Nowe kategorie produktów oraz dopracowany standard kart i preview contentu.",
      }),
    ]),
    createElement("li", { className: "timeline-item" }, [
      createElement("span", {
        className: "service-meta",
        text: "Biblioteka użytkownika i zarządzanie zakupami",
      }),
      createElement("p", {
        text: "Pobrania, licencje, wersjonowanie produktów oraz uporządkowana historia zakupów.",
      }),
    ]),
  ]);
  milestonesCard.appendChild(milestones);

  const roadmapCard = createElement("div", { className: "card" });
  roadmapCard.appendChild(createElement("h3", { text: "Roadmap (żywa)" }));
  roadmapCard.appendChild(
    createElement("p", {
      text: "Roadmapę aktualizujemy cyklicznie. Opisuje ona kluczowe kierunki rozwoju platformy, które mogą ewoluować wraz z rozwojem produktu, wynikami sprzedaży oraz potrzebami użytkowników i partnerów.",
    })
  );
  const roadmapList = createElement("ul", { className: "about-card-list" }, [
    createElement("li", {
      text: "Rozwój katalogu produktów — nowe kategorie, starter collections oraz lepsza odkrywalność oferty.",
    }),
    createElement("li", {
      text: "Biblioteka komponentów UI — spójne warianty, wyższa jakość i szybsze wdrażanie produktów.",
    }),
    createElement("li", {
      text: "Automatyzacja wydań i QA — stabilność platformy, mniej regresji i przewidywalne releasy.",
    }),
    createElement("li", {
      text: "Partnerstwa i afiliacje — bezpieczny program współpracy oraz integracje w ramach ekosystemu KP_Code.",
    }),
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
      "Budujemy KP_Code Digital Vault we współpracy z markami, twórcami i partnerami, którzy stawiają na jakość, skalowalność i długoterminowy rozwój produktów cyfrowych."
    )
  );

  const collabGrid = createElement("div", { className: "grid grid-2" });
  const partnershipsCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: "Współpraca produktowa" }),
    createElement("p", {
      text: "Wspólne projektowanie i wdrażanie produktów cyfrowych: pakietów UI, szablonów, komponentów oraz narzędzi wspierających realne use-case’y rynkowe. Skupiamy się na jakości, spójności i wartości dla użytkownika końcowego.",
    }),
    createElement("a", { className: "button secondary", text: "Napisz do nas", attrs: { href: "#/contact" } }),
  ]);
  const brandingCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: "Partnerstwa brandowe" }),
    createElement("p", {
      text: "Partnerstwa z markami i zespołami, które chcą rozwijać widoczność produktów poprzez wspólne premiery, integracje oraz działania oparte na wartości, a nie jednorazowej promocji.",
    }),
    createElement("a", { className: "button secondary", text: "Porozmawiajmy", attrs: { href: "#/contact" } }),
  ]);
  const affiliationCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: "Program afiliacyjny" }),
    createElement("p", {
      text: "Program dla twórców, społeczności i partnerów, którzy chcą współtworzyć dystrybucję produktów KP_Code Digital Vault w przejrzystym i długofalowym modelu współpracy.",
    }),
    createElement("a", { className: "button secondary", text: "Dołącz do programu", attrs: { href: "#/contact" } }),
  ]);
  const careersCard = createElement("div", { className: "card" }, [
    createElement("h3", { text: "Rekrutacje" }),
    createElement("p", {
      text: "Aktualnie nie prowadzimy otwartych rekrutacji. Jeśli jesteś zainteresowany współpracą w przyszłości, zostaw kontakt — wrócimy do rozmowy, gdy pojawi się odpowiedni moment.",
    }),
    createElement("div", { className: "notice" }, [
      createElement("p", { text: "Zgłoszenia traktujemy jako pulę kontaktów do dalszego rozwoju projektu." }),
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
