import { t } from "../i18n.js";
import { createEl, setChildren } from "../ui/dom.js";

/* === PACK DOWNLOAD ICON (SVG) === */
const ICON_PACK_DOWNLOAD = `
<svg xmlns="http://www.w3.org/2000/svg"
  width="22" height="22"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true">
  <path d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
</svg>
`;

const createPackDownloadButton = (packId) => {
  const btn = createEl("button", {
    className: "pack-download",
    attrs: {
      type: "button",
      "aria-label": `${t("common.downloadCss")} ${packId}`,
      title: `${t("common.downloadCss")} ${packId}`,
    },
  });

  btn.innerHTML = ICON_PACK_DOWNLOAD;

  btn.addEventListener("click", () => {
    console.log(`Download clicked: ${packId}`);
  });

  return btn;
};

const section = (title, content) => {
  const wrap = createEl("section", { className: "ui-section" });
  setChildren(wrap, [createEl("h3", { className: "ui-section-title", text: title }), content]);
  return wrap;
};

const buttonRow = (buttons) => {
  const row = createEl("div", { className: "btn-row" });
  setChildren(
    row,
    buttons.map(({ label, variant }) =>
      createEl("button", {
        className: `btn btn-${variant}`,
        text: label,
      })
    )
  );
  return row;
};

const pack = ({ title, description, sections, packId }) => {
  const wrap = createEl("section", { className: "ui-pack" });

  const header = createEl("div", { className: "ui-pack-header" });

  const meta = createEl("div", { className: "ui-pack-meta" });
  setChildren(meta, [createEl("h2", { text: title }), createEl("p", { text: description })]);

  const downloadBtn = createPackDownloadButton(packId);

  setChildren(header, [meta, downloadBtn]);

  const grid = createEl("div", { className: "ui-pack-grid" });
  setChildren(grid, sections);

  setChildren(wrap, [header, grid]);
  return wrap;
};

export const renderButtons = () => {
  /* Buttons Pack 01 */
  const p1_sizes = section(
    t("buttons.sectionButtonSize"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p1_sizes.lastChild, [
    buttonRow([
      { label: t("buttons.labels.small"), variant: "primary sm" },
      { label: t("buttons.labels.medium"), variant: "primary md" },
      { label: t("buttons.labels.large"), variant: "primary lg" },
    ]),
  ]);

  const p1_labels = section(
    t("buttons.sectionButtonLabelStyle"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p1_labels.lastChild, [
    buttonRow([
      { label: t("buttons.labels.button"), variant: "primary" },
      { label: t("buttons.labels.create"), variant: "secondary" },
      { label: t("buttons.labels.download"), variant: "ghost" },
    ]),
  ]);

  const p1_states = section(
    t("buttons.sectionStates"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p1_states.lastChild, [
    buttonRow([
      { label: t("buttons.labels.apply"), variant: "success" },
      { label: t("buttons.labels.delete"), variant: "danger" },
      { label: t("buttons.labels.disabled"), variant: "disabled" },
    ]),
  ]);

  const p1_mobile = section(
    t("buttons.sectionMobileSizeExample"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p1_mobile.lastChild, [
    createEl("button", {
      className: "btn btn-primary btn-mobile",
      text: t("buttons.labels.mainCta"),
    }),
  ]);

  const p1_icons = section(
    t("buttons.sectionIconButtons"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p1_icons.lastChild, [
    buttonRow([
      { label: t("buttons.labels.add"), variant: "secondary md" },
      { label: t("buttons.labels.upload"), variant: "ghost md" },
      { label: t("buttons.labels.onlyIcon"), variant: "outline md" },
    ]),
  ]);

  const p1_loading = section(
    t("buttons.sectionLoadingFeedback"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p1_loading.lastChild, [
    buttonRow([
      { label: t("buttons.labels.saving"), variant: "secondary md" },
      { label: t("buttons.labels.success"), variant: "success md" },
      { label: t("buttons.labels.retry"), variant: "danger md" },
    ]),
  ]);

  const pack01 = pack({
    title: t("buttons.pack01Title"),
    description: t("buttons.pack01Description"),
    sections: [p1_sizes, p1_labels, p1_states, p1_icons, p1_loading, p1_mobile],
    packId: "Buttons Pack 01",
  });

  /* Buttons Pack 02 */
  const p2_variants = section(
    t("buttons.sectionVariants"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p2_variants.lastChild, [
    buttonRow([
      { label: t("buttons.labels.primary"), variant: "primary md" },
      { label: t("buttons.labels.outline"), variant: "outline md" },
      { label: t("buttons.labels.ghost"), variant: "ghost md" },
    ]),
  ]);

  const p2_iconLike = section(
    t("buttons.sectionLabelPatterns"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p2_iconLike.lastChild, [
    buttonRow([
      { label: t("buttons.labels.save"), variant: "secondary md" },
      { label: t("buttons.labels.export"), variant: "secondary md" },
      { label: t("buttons.labels.share"), variant: "secondary md" },
    ]),
  ]);

  const p2_states = section(
    t("buttons.sectionStates"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p2_states.lastChild, [
    buttonRow([
      { label: t("buttons.labels.confirm"), variant: "success md" },
      { label: t("buttons.labels.remove"), variant: "danger md" },
      { label: t("buttons.labels.disabled"), variant: "disabled md" },
    ]),
  ]);

  const p2_mobile = section(
    t("buttons.sectionMobile"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p2_mobile.lastChild, [
    createEl("button", {
      className: "btn btn-primary btn-mobile",
      text: t("buttons.labels.continue"),
    }),
  ]);

  const pack02 = pack({
    title: t("buttons.pack02Title"),
    description: t("buttons.pack02Description"),
    sections: [p2_variants, p2_iconLike, p2_states, p2_mobile],
    packId: "Buttons Pack 02",
  });

  /* Buttons Pack 03 */
  const p3_sizes = section(t("buttons.sectionSizes"), createEl("div", { className: "btn-group" }));
  setChildren(p3_sizes.lastChild, [
    buttonRow([
      { label: "S", variant: "ghost sm" },
      { label: "M", variant: "ghost md" },
      { label: "L", variant: "ghost lg" },
    ]),
  ]);

  const p3_actions = section(
    t("buttons.sectionProgressiveActions"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p3_actions.lastChild, [
    buttonRow([
      { label: t("buttons.labels.loading"), variant: "secondary md" },
      { label: t("buttons.labels.next"), variant: "primary md" },
      { label: t("buttons.labels.finish"), variant: "success md" },
    ]),
  ]);

  const p3_destructive = section(
    t("buttons.sectionDestructive"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p3_destructive.lastChild, [
    buttonRow([
      { label: t("buttons.labels.archive"), variant: "danger md" },
      { label: t("buttons.labels.delete"), variant: "danger md" },
      { label: t("buttons.labels.disabled"), variant: "disabled md" },
    ]),
  ]);

  const p3_mobile = section(
    t("buttons.sectionMobile"),
    createEl("div", { className: "btn-group" })
  );
  setChildren(p3_mobile.lastChild, [
    createEl("button", {
      className: "btn btn-primary btn-mobile",
      text: t("buttons.labels.start"),
    }),
  ]);

  const pack03 = pack({
    title: t("buttons.pack03Title"),
    description: t("buttons.pack03Description"),
    sections: [p3_sizes, p3_actions, p3_destructive, p3_mobile],
    packId: "Buttons Pack 03",
  });

  /* === BODY: packi jeden pod drugim === */
  const body = createEl("div", { className: "main" });
  setChildren(body, [pack01, pack02, pack03]);

  return {
    title: t("buttons.title"),
    description: t("buttons.description"),
    body,
  };
};
