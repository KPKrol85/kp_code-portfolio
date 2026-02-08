import { createEl } from "../utils/dom.js";
import { selectMaterialById } from "../domain/materials/selectors.js";
import { formatDate } from "../utils/format.js";

export const renderMaterialDetail = (state, params) => {
  const material = selectMaterialById(state, params.materialId);
  const wrapper = createEl("div");
  if (!material) {
    wrapper.appendChild(createEl("p", { text: "Brak materiału" }));
    return wrapper;
  }
  wrapper.appendChild(createEl("h1", { text: material.title }));
  wrapper.appendChild(createEl("p", { text: `Tag: ${material.tag}` }));
  wrapper.appendChild(createEl("p", { text: `Dodano: ${formatDate(material.createdAt)}` }));
  wrapper.appendChild(createEl("div", { className: "card", text: "Opis materiału (demo)" }));
  return wrapper;
};
