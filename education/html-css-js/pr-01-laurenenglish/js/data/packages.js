export const PACKAGE_KEYS = Object.freeze(["start", "regular", "intensive"]);

export const packages = Object.freeze({
  start: Object.freeze({
    key: "start",
    label: "Start",
    href: "/pakiety.html#pakiet-start",
    summary: "Rytm: spokojny, regularne spotkania w miesiącu.",
    priceLabel: null,
    benefits: Object.freeze([
      "Diagnoza potrzeb i plan działania",
      "Materiały podstawowe po lekcjach",
      "Feedback i rekomendacje",
    ]),
    audience: "dla osób wracających do nauki.",
    emphasisLabel: null,
    cta: Object.freeze({
      label: "Informacje o zapisach",
      href: "/index.html#contact",
    }),
  }),
  regular: Object.freeze({
    key: "regular",
    label: "Regular",
    href: "/pakiety.html#pakiet-regular",
    summary: "Rytm: stałe spotkania w tygodniu, spójny progres.",
    priceLabel: null,
    benefits: Object.freeze([
      "Plan tematyczny na kilka tygodni",
      "Materiały rozszerzone i zadania domowe",
      "Mini podsumowania postępów",
    ]),
    audience: "dla osób, które chcą stabilnie rosnąć.",
    emphasisLabel: null,
    cta: Object.freeze({
      label: "Informacje o zapisach",
      href: "/index.html#contact",
    }),
  }),
  intensive: Object.freeze({
    key: "intensive",
    label: "Intensive",
    href: "/pakiety.html#pakiet-intensive",
    summary: "Rytm: intensywny, częstsze spotkania i wsparcie między lekcjami.",
    priceLabel: null,
    benefits: Object.freeze([
      "Priorytetowy plan i szybkie korekty",
      "Materiały premium oraz próby egzaminacyjne",
      "Kontakt między spotkaniami",
    ]),
    audience: "dla osób z konkretnym terminem lub celem.",
    emphasisLabel: null,
    cta: Object.freeze({
      label: "Informacje o zapisach",
      href: "/index.html#contact",
    }),
  }),
});

export const packageList = Object.freeze(
  PACKAGE_KEYS.map((key) => packages[key]),
);

export const packagesSectionHref = "/pakiety.html#pakiety";
