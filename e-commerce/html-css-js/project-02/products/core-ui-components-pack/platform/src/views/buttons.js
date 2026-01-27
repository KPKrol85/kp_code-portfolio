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

/* === PACK DOWNLOAD BUTTON (demo) === */
const createPackDownloadButton = (packId) => {
  const btn = createEl("button", {
    className: "pack-download",
    attrs: {
      type: "button",
      "aria-label": `Download ${packId}`,
      title: `Download ${packId}`,
    },
  });

  btn.innerHTML = ICON_PACK_DOWNLOAD;

  btn.addEventListener("click", () => {
    // DEMO: później podepniesz realny plik CSS dla packa
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

// builder dla całego packa (wrapper + header + grid)
const pack = ({ title, description, sections, packId }) => {
  const wrap = createEl("section", { className: "ui-pack" });

  const header = createEl("div", { className: "ui-pack-header" });

  const meta = createEl("div", { className: "ui-pack-meta" });
  setChildren(meta, [createEl("h2", { text: title }), createEl("p", { text: description })]);

  // pack download (prawy górny róg packa)
  const downloadBtn = createPackDownloadButton(packId);

  setChildren(header, [meta, downloadBtn]);

  const grid = createEl("div", { className: "ui-pack-grid" });
  setChildren(grid, sections);

  setChildren(wrap, [header, grid]);
  return wrap;
};

export const renderButtons = () => {
  /* Buttons Pack 01 */
  const p1_sizes = section("Button size", createEl("div", { className: "btn-group" }));
  setChildren(p1_sizes.lastChild, [
    buttonRow([
      { label: "Small", variant: "primary sm" },
      { label: "Medium", variant: "primary md" },
      { label: "Large", variant: "primary lg" },
    ]),
  ]);

  const p1_labels = section("Button label style", createEl("div", { className: "btn-group" }));
  setChildren(p1_labels.lastChild, [
    buttonRow([
      { label: "Button", variant: "primary" },
      { label: "Create", variant: "secondary" },
      { label: "Download", variant: "ghost" },
    ]),
  ]);

  const p1_states = section("States", createEl("div", { className: "btn-group" }));
  setChildren(p1_states.lastChild, [
    buttonRow([
      { label: "Apply", variant: "success" },
      { label: "Delete", variant: "danger" },
      { label: "Disabled", variant: "disabled" },
    ]),
  ]);

  const p1_mobile = section("Mobile size example", createEl("div", { className: "btn-group" }));
  setChildren(p1_mobile.lastChild, [
    createEl("button", { className: "btn btn-primary btn-mobile", text: "Main CTA" }),
  ]);

  const pack01 = pack({
    title: "Buttons Pack 01",
    description: "Primary button styles, sizes, states and mobile usage.",
    sections: [p1_sizes, p1_labels, p1_states, p1_mobile],
    packId: "Buttons Pack 01",
  });

  /* Buttons Pack 02 */
  const p2_variants = section("Variants", createEl("div", { className: "btn-group" }));
  setChildren(p2_variants.lastChild, [
    buttonRow([
      { label: "Primary", variant: "primary md" },
      { label: "Outline", variant: "outline md" },
      { label: "Ghost", variant: "ghost md" },
    ]),
  ]);

  const p2_iconLike = section("Label patterns", createEl("div", { className: "btn-group" }));
  setChildren(p2_iconLike.lastChild, [
    buttonRow([
      { label: "Save", variant: "secondary md" },
      { label: "Export", variant: "secondary md" },
      { label: "Share", variant: "secondary md" },
    ]),
  ]);

  const p2_states = section("States", createEl("div", { className: "btn-group" }));
  setChildren(p2_states.lastChild, [
    buttonRow([
      { label: "Confirm", variant: "success md" },
      { label: "Remove", variant: "danger md" },
      { label: "Disabled", variant: "disabled md" },
    ]),
  ]);

  const p2_mobile = section("Mobile CTA", createEl("div", { className: "btn-group" }));
  setChildren(p2_mobile.lastChild, [
    createEl("button", { className: "btn btn-primary btn-mobile", text: "Continue" }),
  ]);

  const pack02 = pack({
    title: "Buttons Pack 02",
    description: "Alternate variants and label patterns (work in progress).",
    sections: [p2_variants, p2_iconLike, p2_states, p2_mobile],
    packId: "Buttons Pack 02",
  });

  /* Buttons Pack 03 */
  const p3_sizes = section("Sizes", createEl("div", { className: "btn-group" }));
  setChildren(p3_sizes.lastChild, [
    buttonRow([
      { label: "S", variant: "ghost sm" },
      { label: "M", variant: "ghost md" },
      { label: "L", variant: "ghost lg" },
    ]),
  ]);

  const p3_actions = section("Progressive actions", createEl("div", { className: "btn-group" }));
  setChildren(p3_actions.lastChild, [
    buttonRow([
      { label: "Loading", variant: "secondary md" },
      { label: "Next", variant: "primary md" },
      { label: "Finish", variant: "success md" },
    ]),
  ]);

  const p3_destructive = section("Destructive", createEl("div", { className: "btn-group" }));
  setChildren(p3_destructive.lastChild, [
    buttonRow([
      { label: "Archive", variant: "danger md" },
      { label: "Delete", variant: "danger md" },
      { label: "Disabled", variant: "disabled md" },
    ]),
  ]);

  const p3_mobile = section("Mobile", createEl("div", { className: "btn-group" }));
  setChildren(p3_mobile.lastChild, [
    createEl("button", { className: "btn btn-primary btn-mobile", text: "Start" }),
  ]);

  const pack03 = pack({
    title: "Buttons Pack 03",
    description: "Progressive + destructive patterns (work in progress).",
    sections: [p3_sizes, p3_actions, p3_destructive, p3_mobile],
    packId: "Buttons Pack 03",
  });

  /* === BODY: packi jeden pod drugim === */
  const body = createEl("div", { className: "main" });
  setChildren(body, [pack01, pack02, pack03]);

  return {
    title: "Buttons",
    description: "Button system packs and usage examples.",
    body,
  };
};
