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

const createTagList = (tags = []) => {
  const list = createElement("div", { className: "tag-list" });
  tags.forEach((tag) => list.appendChild(createElement("span", { className: "badge", text: tag })));
  return list;
};

export const renderRoadmap = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const { pathname } = parseHash();
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }

  const hero = createElement("section", { className: "hero services-hero roadmap-hero" });
  const heroContent = createElement("div", { className: "hero-content" });
  heroContent.appendChild(
    createElement("div", { className: "tag-list" }, [
      createElement("span", { className: "badge", text: "Roadmap 12 miesięcy" }),
      createElement("span", { className: "badge", text: "Platforma aktywna" }),
    ])
  );
  heroContent.appendChild(
    createElement("h1", {
      text: "Plan rozwoju",
      attrs: { tabindex: "-1", "data-focus-heading": "true" },
    })
  );
  heroContent.appendChild(
    createElement("p", {
      className: "hero-lead",
      text: "KP_Code Digital Vault działa i rośnie. Roadmapa pokazuje kierunek skalowania oferty, sprzedaży i jakości doświadczenia — priorytety aktualizujemy w oparciu o dane i feedback użytkowników.",
    })
  );
  hero.appendChild(heroContent);
  container.appendChild(hero);

  const whySection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Dlaczego roadmap" },
  });
  whySection.appendChild(
    createSectionHeader(
      "Dlaczego roadmap?",
      "Roadmapa porządkuje rozwój platformy i pokazuje, jak wzmacniamy wartość dla kupujących oraz partnerów."
    )
  );
  const whyCard = createElement("div", { className: "card" }, [
    createElement("p", {
      text: "Skupiamy się na skalowaniu oferty, jakości katalogu i doświadczeniu zakupowym. Zależy nam na spójnym standardzie treści, jasnych licencjach i przewidywalnym procesie zakupowym.",
    }),
    createElement("p", {
      text: "Roadmapę aktualizujemy cyklicznie, aby odzwierciedlała realne potrzeby rynku i użytkowników platformy.",
    }),
  ]);
  whySection.appendChild(whyCard);
  container.appendChild(whySection);

  const prioritiesSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Priorytety na rok" },
  });
  prioritiesSection.appendChild(
    createSectionHeader(
      "Priorytety na rok",
      "Obszary, które bezpośrednio wpływają na sprzedaż, retencję i wiarygodność platformy."
    )
  );
  const prioritiesGrid = createElement("div", { className: "grid grid-3" }, [
    createElement("div", { className: "card" }, [
      createElement("h3", { text: "Rozwój oferty i monetyzacja" }),
      createElement("p", {
        text: "Systematyczne zwiększanie wartości platformy poprzez rozwój katalogu produktów cyfrowych, starter collections oraz iteracje pricingu, bundle i promocji — z naciskiem na powtarzalność przychodów i jasną komunikację wartości.",
      }),
      createTagList(["Produkty", "Monetyzacja", "Growth"]),
    ]),
    createElement("div", { className: "card" }, [
      createElement("h3", { text: "Skalowanie UX katalogu i zakupów" }),
      createElement("p", {
        text: "Lepsza odkrywalność oferty i wyższa konwersja dzięki ulepszeniom filtrowania, sortowania, kart produktowych i ścieżki zakupowej (koszyk/checkout) w oparciu o realne scenariusze zakupowe.",
      }),
      createTagList(["UX", "Platforma", "Produkty"]),
    ]),
    createElement("div", { className: "card" }, [
      createElement("h3", { text: "Jakość platformy i retencja" }),
      createElement("p", {
        text: "Stabilne konto użytkownika i biblioteka zakupów (historia pobrań, wersjonowanie), czytelne komunikaty systemowe oraz ciągłe audyty a11y i performance dla przewidywalnego działania i zaufania do platformy.",
      }),
      createTagList(["Platforma", "A11y", "Performance"]),
    ]),
  ]);
  prioritiesSection.appendChild(prioritiesGrid);
  container.appendChild(prioritiesSection);

  const roadmapSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Roadmap 12 miesięcy" },
  });
  roadmapSection.appendChild(
    createSectionHeader(
      "Roadmap 12 miesięcy",
      "Kwartały pokazują, co planujemy rozwijać w danym okresie i na jakim etapie jest dany obszar."
    )
  );

  const roadmapGrid = createElement("div", { className: "grid grid-4 roadmap-grid" });
  const quarters = [
    {
      title: "Q1",
      status: "W toku",
      items: [
        {
          title: "Skalowanie oferty",
          description: "Regularne publikacje nowych produktów w każdej kategorii.",
          tags: ["Produkty", "Growth"],
        },
        {
          title: "Starter collections",
          description: "Zestawy startowe ułatwiające wejście w ofertę i szybkie zakupy.",
          tags: ["Produkty", "Monetyzacja"],
        },
        {
          title: "Licencje i wartość",
          description: "Precyzyjne wersjonowanie produktów i komunikacja korzyści.",
          tags: ["Produkty", "Content"],
        },
        {
          title: "Pricing i promo",
          description: "Iteracje cen, testy ofert promocyjnych i mierzenie konwersji.",
          tags: ["Growth", "Monetyzacja"],
        },
      ],
    },
    {
      title: "Q2",
      status: "Planowane",
      items: [
        {
          title: "UX katalogu",
          description: "Filtry i sortowanie pod realne use-case’y zakupowe.",
          tags: ["UX", "Produkty"],
        },
        {
          title: "Value-driven opisy",
          description: "Standaryzacja kart i preview contentu dla każdej kategorii.",
          tags: ["Content", "Produkty"],
        },
        {
          title: "Ścieżka zakupowa",
          description: "Usprawnienia koszyka i checkoutu pod kątem klarowności decyzji.",
          tags: ["UX", "Platforma"],
        },
        {
          title: "Content edukacyjny",
          description: "Materiały wspierające wybór produktów i ich zastosowanie.",
          tags: ["Content", "Growth"],
        },
      ],
    },
    {
      title: "Q3",
      status: "Planowane",
      items: [
        {
          title: "Konto i biblioteka",
          description: "Historia pobrań, wersjonowanie produktów i lepsza organizacja.",
          tags: ["Platforma", "UX"],
        },
        {
          title: "Komunikaty i statusy",
          description: "Spójne powiadomienia systemowe i klarowne stany UI.",
          tags: ["Platforma", "UX"],
        },
        {
          title: "A11y i performance",
          description: "Audyt dostępności oraz optymalizacje wydajności kluczowych widoków.",
          tags: ["A11y", "Performance"],
        },
        {
          title: "Stabilizacja funkcji",
          description: "Porządkowanie i utrwalanie istniejących procesów platformy.",
          tags: ["Platforma", "Jakość"],
        },
      ],
    },
    {
      title: "Q4",
      status: "Rozważane",
      items: [
        {
          title: "Bundling i kolekcje",
          description: "Pakiety produktów i kolekcje tematyczne wspierające sprzedaż.",
          tags: ["Growth", "Produkty"],
        },
        {
          title: "Changelog jako kanał",
          description: "Release notes jako element komunikacji i wiarygodności.",
          tags: ["Content", "Platforma"],
        },
        {
          title: "Integracje i linki",
          description: "Integracja linków do portfolio i usług KP_Code.",
          tags: ["Ekosystem", "Integracje"],
        },
        {
          title: "Partnerstwa i afiliacje",
          description: "Pilotażowe współprace z partnerami i program afiliacyjny.",
          tags: ["Growth", "Partnerstwa"],
        },
      ],
    },
  ];

  quarters.forEach((quarter) => {
    const card = createElement("details", {
      className: "card roadmap-card",
      attrs: { open: "true" },
    });
    const summary = createElement("summary", { className: "roadmap-summary" });
    summary.appendChild(createElement("h3", { text: quarter.title }));
    summary.appendChild(createElement("span", { className: "badge", text: quarter.status }));
    card.appendChild(summary);

    quarter.items.forEach((item) => {
      const block = createElement("div", { className: "roadmap-item" });
      block.appendChild(createElement("h4", { text: item.title }));
      block.appendChild(createElement("p", { text: item.description }));
      block.appendChild(createTagList(item.tags));
      card.appendChild(block);
    });

    roadmapGrid.appendChild(card);
  });
  roadmapSection.appendChild(roadmapGrid);

  const visualCard = createElement("div", { className: "card roadmap-visual" }, [
    createElement("div", {
      className: "roadmap-visual-placeholder",
      attrs: { role: "img", "aria-label": "Miniatura roadmapy — placeholder" },
    }),
    createElement("p", {
      text: "Miniatura planu rozwoju — miejsce na skrótowe podsumowanie lub wizualizację.",
    }),
    createElement("a", {
      className: "button secondary",
      text: "Zobacz changelog",
      attrs: { href: "#/updates" },
    }),
  ]);
  roadmapSection.appendChild(visualCard);
  container.appendChild(roadmapSection);

  const feedbackSection = createElement("section", {
    className: "section",
    attrs: { "aria-label": "Współpraca i feedback" },
  });
  feedbackSection.appendChild(
    createSectionHeader(
      "Współpraca i feedback",
      "Masz pomysł na rozwój platformy lub nowych produktów? Napisz — roadmapa jest tworzona z myślą o realnych potrzebach użytkowników."
    )
  );
  const feedbackCard = createElement("div", { className: "card services-cta" });
  feedbackCard.appendChild(
    createElement("div", {}, [
      createElement("h3", { text: "Zaproponuj kierunek" }),
      createElement("p", {
        text: "Opisz potrzeby Twojego zespołu lub społeczności. Wrócimy z aktualizacją roadmapy lub propozycją współpracy.",
      }),
    ])
  );
  feedbackCard.appendChild(
    createElement("a", {
      className: "button",
      text: "Skontaktuj się",
      attrs: { href: "#/contact" },
    })
  );
  feedbackSection.appendChild(feedbackCard);
  container.appendChild(feedbackSection);

  setMeta({
    title: "Plan rozwoju — KP_Code Digital Vault",
    description:
      "Roadmapa rozwoju KP_Code Digital Vault: priorytety na 12 miesięcy, rozwój platformy, produktów cyfrowych i usług.",
  });

  main.appendChild(container);
};
