import {
  getMaterialPresentation,
  resolveMaterialAction,
} from "../js/data/materialAccess.js";
import { filterMaterials } from "../js/data/materialFilters.js";
import { materials } from "../js/data/materials.js";
import {
  PACKAGE_KEYS,
  packageList,
  packages,
  packagesSectionHref,
} from "../js/data/packages.js";

const createMarkers = (name) =>
  Object.freeze({
    start: `            <!-- ${name}:start -->`,
    end: `            <!-- ${name}:end -->`,
  });

export const CONTENT_MARKERS = Object.freeze({
  homePackages: createMarkers("package-cards:home"),
  homePackagesLink: createMarkers("package-link:home"),
  packagePage: createMarkers("package-cards:page"),
  homeMaterials: createMarkers("materials-home"),
  materialsCatalog: createMarkers("materials-catalog"),
});

const HOME_MATERIAL_CATEGORIES = Object.freeze([
  "grammar",
  "vocabulary",
  "exam",
  "business",
]);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const wrapRegion = (markers, content) =>
  `${markers.start}\n${content}\n${markers.end}`;

const renderBenefits = (benefits) =>
  benefits
    .map((benefit) => `                <li>${escapeHtml(benefit)}</li>`)
    .join("\n");

const renderPackagePrice = (packageRecord) =>
  packageRecord.priceLabel
    ? `\n              <p class="card__price">${escapeHtml(packageRecord.priceLabel)}</p>`
    : "";

const renderPackageEyebrow = (packageRecord) =>
  packageRecord.emphasisLabel
    ? `\n              <p class="card__eyebrow">${escapeHtml(packageRecord.emphasisLabel)}</p>`
    : "";

const getPackageCardClass = (packageRecord) =>
  `card card--pricing${packageRecord.emphasisLabel ? " card--highlight" : ""}`;

const getPackageButtonClass = (packageRecord) =>
  packageRecord.emphasisLabel ? "button--primary" : "button--secondary";

const renderHomePackageCard = (packageRecord) =>
  `            <article class="${getPackageCardClass(packageRecord)}" data-package-key="${escapeHtml(packageRecord.key)}" data-reveal>${renderPackageEyebrow(packageRecord)}
              <h3 class="card__title">${escapeHtml(packageRecord.label)}</h3>${renderPackagePrice(packageRecord)}
              <p class="card__text">${escapeHtml(packageRecord.summary)}</p>
              <ul class="list" role="list">
${renderBenefits(packageRecord.benefits)}
              </ul>
              <a class="button ${getPackageButtonClass(packageRecord)}" href="${escapeHtml(packageRecord.cta.href)}">${escapeHtml(packageRecord.cta.label)}</a>
            </article>`;

const renderFullPackageCard = (packageRecord) =>
  `            <article class="${getPackageCardClass(packageRecord)}" id="pakiet-${escapeHtml(packageRecord.key)}" data-package-key="${escapeHtml(packageRecord.key)}" tabindex="-1" data-reveal>${renderPackageEyebrow(packageRecord)}
              <h3 class="card__title">${escapeHtml(packageRecord.label)}</h3>${renderPackagePrice(packageRecord)}
              <p class="card__text">${escapeHtml(packageRecord.summary)}</p>
              <ul class="list" role="list">
${renderBenefits(packageRecord.benefits)}
              </ul>
              <p class="card__text"><strong>Dla kogo:</strong> ${escapeHtml(packageRecord.audience)}</p>
              <a class="button ${getPackageButtonClass(packageRecord)}" href="${escapeHtml(packageRecord.cta.href)}">${escapeHtml(packageRecord.cta.label)}</a>
            </article>`;

export const renderHomePackageCards = () =>
  wrapRegion(
    CONTENT_MARKERS.homePackages,
    renderHomePackageCard(packages.regular),
  );

export const renderHomePackagesLink = () =>
  wrapRegion(
    CONTENT_MARKERS.homePackagesLink,
    `            <a class="button button--secondary" href="${escapeHtml(packagesSectionHref)}">Zobacz pakiety</a>`,
  );

export const renderPackagePageCards = () =>
  wrapRegion(
    CONTENT_MARKERS.packagePage,
    packageList.map(renderFullPackageCard).join("\n"),
  );

const renderAccessBadge = (item, presentation) =>
  `<span class="badge badge--access badge--${escapeHtml(item.access)}" aria-label="Dostęp: ${escapeHtml(presentation.accessLabel)}">${escapeHtml(presentation.accessLabel)}</span>`;

const renderMaterialAction = (item, presentation, { summary = false } = {}) => {
  const { action } = presentation;
  if (action.kind !== "link") {
    return `<span class="materials__availability">${escapeHtml(action.label)}</span>`;
  }

  const buttonClass = summary ? "button--ghost" : action.buttonClass;
  const ariaLabel = summary
    ? ` aria-label="${escapeHtml(`${action.label}: ${item.title}`)}"`
    : "";
  return `<a class="button ${escapeHtml(buttonClass)}" href="${escapeHtml(action.href)}"${ariaLabel}>${escapeHtml(action.label)}</a>`;
};

const renderHomeMaterialCard = (item) => {
  const presentation = getMaterialPresentation(item);
  return `              <article class="card card--resource" data-material-id="${escapeHtml(item.id)}" data-category="${escapeHtml(item.category)}" data-reveal>
                <h3 class="card__title">${escapeHtml(item.title)}</h3>
                <p class="card__text">${escapeHtml(item.description)}</p>
                <div class="card__tags">
                  <span class="badge">${escapeHtml(item.format)}</span>
                  <span class="badge">${escapeHtml(presentation.categoryLabel)}</span>
                  ${renderAccessBadge(item, presentation)}
                </div>
                ${renderMaterialAction(item, presentation, { summary: true })}
              </article>`;
};

const renderHomeMaterialPanel = (name, items) => {
  const hidden = name === "all" ? "" : " hidden";
  return `            <div class="grid grid--resources" data-tab-panel="${escapeHtml(name)}"${hidden}>
${items.map(renderHomeMaterialCard).join("\n")}
            </div>`;
};

export const renderHomeMaterialPanels = () => {
  const featuredMaterials = materials.filter((item) => item.featured === true);
  const panels = [renderHomeMaterialPanel("all", featuredMaterials)];

  HOME_MATERIAL_CATEGORIES.forEach((category) => {
    panels.push(
      renderHomeMaterialPanel(
        category,
        featuredMaterials.filter((item) => item.category === category),
      ),
    );
  });

  return wrapRegion(CONTENT_MARKERS.homeMaterials, panels.join("\n"));
};

const renderCatalogMaterialCard = (item) => {
  const presentation = getMaterialPresentation(item);
  const durationBadge = item.duration
    ? `\n                <span class="badge">${escapeHtml(item.duration)}</span>`
    : "";

  return `            <article class="card card--resource materials__card" data-material-id="${escapeHtml(item.id)}">
              <h3 class="card__title">${escapeHtml(item.title)}</h3>
              <div class="card__tags materials__meta">
                <span class="badge">${escapeHtml(presentation.categoryLabel)}</span>
                <span class="badge">${escapeHtml(presentation.levelLabel)}</span>
                <span class="badge">${escapeHtml(item.format)}</span>${durationBadge}
              </div>
              <p class="card__text">${escapeHtml(item.description)}</p>
              <div class="materials__footer">
                ${renderAccessBadge(item, presentation)}
                ${renderMaterialAction(item, presentation)}
              </div>
            </article>`;
};

export const renderMaterialsCatalog = () =>
  wrapRegion(
    CONTENT_MARKERS.materialsCatalog,
    materials.map(renderCatalogMaterialCard).join("\n"),
  );

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const isUsableHref = (href) =>
  typeof href === "string" && href.trim() !== "" && href.trim() !== "#";

const assertExactCount = (label, actual, expected) => {
  assert(
    actual === expected,
    `${label}: expected ${expected}, received ${actual}`,
  );
};

export const validateContentData = () => {
  assert(
    JSON.stringify(PACKAGE_KEYS) ===
      JSON.stringify(["start", "regular", "intensive"]),
    "Package keys must be start, regular, intensive",
  );
  assert(
    JSON.stringify(Object.keys(packages)) === JSON.stringify(PACKAGE_KEYS),
    "Package records do not match the canonical key order",
  );
  assert(isUsableHref(packagesSectionHref), "Invalid packages section route");

  packageList.forEach((packageRecord) => {
    assert(
      packageRecord.key && packages[packageRecord.key] === packageRecord,
      "Invalid package record",
    );
    assert(packageRecord.label, `${packageRecord.key}: missing public label`);
    assert(
      packageRecord.href === `/pakiety.html#pakiet-${packageRecord.key}`,
      `${packageRecord.key}: invalid package route`,
    );
    assert(packageRecord.summary, `${packageRecord.key}: missing summary`);
    assert(
      packageRecord.benefits.length > 0,
      `${packageRecord.key}: missing benefits`,
    );
    assert(packageRecord.audience, `${packageRecord.key}: missing audience`);
    assert(
      packageRecord.priceLabel === null ||
        (typeof packageRecord.priceLabel === "string" &&
          packageRecord.priceLabel.trim() !== ""),
      `${packageRecord.key}: invalid price state`,
    );
    assert(packageRecord.cta.label, `${packageRecord.key}: missing CTA label`);
    assert(
      isUsableHref(packageRecord.cta.href),
      `${packageRecord.key}: invalid CTA route`,
    );
  });

  const materialIds = materials.map((item) => item.id);
  assert(
    new Set(materialIds).size === materialIds.length,
    "Material IDs must be unique",
  );

  materials.forEach((item) => {
    assert(
      item.id && item.title && item.description,
      "Material content is incomplete",
    );
    assert(
      item.category && item.level && item.format,
      `${item.id}: metadata is incomplete`,
    );
    assert(
      item.access === "free" || item.access === "premium",
      `${item.id}: invalid access type`,
    );
    assert(
      !Object.hasOwn(item, "url"),
      `${item.id}: legacy url field is not allowed`,
    );
    assert(
      !Object.hasOwn(item, "ctaLabel"),
      `${item.id}: legacy ctaLabel field is not allowed`,
    );

    if (item.access === "premium") {
      assert(
        PACKAGE_KEYS.includes(item.packageKey),
        `${item.id}: invalid premium package key`,
      );
      assert(
        item.action.type === "package",
        `${item.id}: premium action must use a package route`,
      );
    }

    const action = resolveMaterialAction(item);
    assert(
      action.isValid,
      `${item.id}: invalid resolved action (${action.reason})`,
    );
    if (action.kind === "link") {
      assert(
        isUsableHref(action.href),
        `${item.id}: invalid operational destination`,
      );
    } else {
      assert(
        action.href === null,
        `${item.id}: informational action must not expose a link`,
      );
    }
  });

  const featuredMaterials = materials.filter((item) => item.featured === true);
  assertExactCount("Featured materials", featuredMaterials.length, 4);
  assert(
    JSON.stringify(featuredMaterials.map((item) => item.category)) ===
      JSON.stringify(HOME_MATERIAL_CATEGORIES),
    "Homepage material categories must match the existing tab contract",
  );

  const filterResults = Object.freeze({
    grammar: filterMaterials(materials, { category: "grammar" }).length,
    b2IncludingAll: filterMaterials(materials, { level: "B2" }).length,
    pdf: filterMaterials(materials, { format: "PDF" }).length,
    free: filterMaterials(materials, { access: "free" }).length,
    freeOnly: filterMaterials(materials, { freeOnly: true }).length,
    combined: filterMaterials(materials, {
      category: "speaking",
      level: "B2",
      format: "Video",
      access: "premium",
    }).length,
  });

  assertExactCount("Grammar filter", filterResults.grammar, 3);
  assertExactCount("B2 filter", filterResults.b2IncludingAll, 6);
  assertExactCount("PDF filter", filterResults.pdf, 9);
  assertExactCount("Free access filter", filterResults.free, 6);
  assertExactCount("Free-only filter", filterResults.freeOnly, 6);
  assertExactCount("Combined filter", filterResults.combined, 1);

  const contactAction = resolveMaterialAction({
    access: "free",
    action: { type: "contact", label: "Zapytaj o materiał" },
  });
  assert(
    contactAction.isValid && contactAction.href === "/index.html#contact",
    "Contact route failed",
  );

  const invalidHashAction = resolveMaterialAction({
    access: "free",
    action: { type: "link", label: "Otwórz", href: "#" },
  });
  assert(
    !invalidHashAction.isValid,
    "Hash-only material actions must be rejected",
  );

  return Object.freeze({
    packageKeys: [...PACKAGE_KEYS],
    packageCount: packageList.length,
    materialCount: materials.length,
    freeCount: filterResults.free,
    premiumCount: filterMaterials(materials, { access: "premium" }).length,
    featuredCount: featuredMaterials.length,
    filterResults,
  });
};
