import { createEl } from "../utils/dom.js";
import { selectMaterialsForUser } from "../core/selectors.js";
import { createMaterial } from "../core/actions.js";
import { showToast } from "../ui/toast.js";

export const renderMaterials = (state, user, store) => {
  const wrapper = createEl("div");
  const header = createEl("div", { className: "page-header" });
  header.appendChild(createEl("h1", { text: "Materiały" }));
  if (user.role !== "student") {
    const button = createEl("button", { className: "button", text: "Dodaj materiał" });
    button.addEventListener("click", () => {
      const title = prompt("Tytuł materiału");
      if (!title) return;
      store.dispatch(
        createMaterial({
          title,
          tag: "general",
          scopeType: "class",
          scopeId: state.classes[0]?.id,
          authorId: user.id,
        })
      );
      showToast("Dodano materiał");
    });
    header.appendChild(button);
  }
  wrapper.appendChild(header);

  const filterRow = createEl("div", { className: "filter-row" });
  const searchInput = createEl("input", { className: "input", attrs: { placeholder: "Szukaj...", value: state.ui.searchQuery } });
  filterRow.appendChild(searchInput);
  wrapper.appendChild(filterRow);

  const list = createEl("div", { className: "list" });
  const renderList = (query = "") => {
    list.innerHTML = "";
    const materials = selectMaterialsForUser(state, user).filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    materials.forEach((item) => {
      const card = createEl("a", { className: "card", attrs: { href: `#/materials/${item.id}` } });
      card.innerHTML = `<h3>${item.title}</h3><p>${item.tag} • ${item.scopeType}</p>`;
      list.appendChild(card);
    });
  };
  searchInput.addEventListener("input", (event) => renderList(event.target.value));
  renderList(state.ui.searchQuery);
  wrapper.appendChild(list);
  return wrapper;
};
