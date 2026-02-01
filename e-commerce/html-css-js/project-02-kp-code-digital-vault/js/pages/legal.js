import { createBreadcrumbs } from "../components/breadcrumbs.js";
import { buildBreadcrumbsForPath } from "../utils/breadcrumbs.js";
import { createElement, clearElement } from "../utils/dom.js";
import { parseHash } from "../utils/navigation.js";

const regulaminSections = [
  {
    title: "1. Postanowienia ogólne",
    body: "Sklep sprzedaje cyfrowe produkty dostępne natychmiast po opłaceniu zamówienia.",
  },
  {
    title: "2. Licencje",
    body: "Zakupione produkty są objęte licencją przypisaną do konta użytkownika.",
  },
  {
    title: "3. Zwroty",
    body: "Zwroty realizowane są zgodnie z obowiązującymi przepisami dotyczącymi treści cyfrowych.",
  },
];

const privacySections = [
  {
    title: "1. Zakres danych",
    body: "Przechowujemy dane niezbędne do realizacji zamówień oraz obsługi konta.",
  },
  {
    title: "2. Cookies",
    body: "Serwis wykorzystuje pliki cookie do zapamiętywania preferencji użytkownika.",
  },
  {
    title: "3. Kontakt",
    body: "W sprawach prywatności skontaktuj się: kontakt@kp-code.pl.",
  },
];

const renderSections = (sections) => {
  const container = createElement("div");
  sections.forEach((section) => {
    container.appendChild(createElement("h3", { text: section.title }));
    container.appendChild(createElement("p", { text: section.body }));
  });
  return container;
};

export const renderLegal = () => {
  const main = document.getElementById("main-content");
  clearElement(main);

  const container = createElement("section", { className: "container" });
  const breadcrumbs = createBreadcrumbs(buildBreadcrumbsForPath(parseHash().pathname));
  if (breadcrumbs) {
    container.appendChild(breadcrumbs);
  }
  container.appendChild(createElement("h1", { text: "Dokumenty prawne (demo)" }));
  container.appendChild(
    createElement("p", {
      text: "Poniższe treści mają charakter przykładowy i nie stanowią porady prawnej.",
    })
  );

  const grid = createElement("div", { className: "grid grid-2 section" });

  const regulamin = createElement("div", { className: "card" }, [
    createElement("h2", { text: "Regulamin" }),
    renderSections(regulaminSections),
  ]);

  const privacy = createElement("div", { className: "card" }, [
    createElement("h2", { text: "Polityka prywatności" }),
    renderSections(privacySections),
  ]);

  grid.appendChild(regulamin);
  grid.appendChild(privacy);
  container.appendChild(grid);
  main.appendChild(container);
};
