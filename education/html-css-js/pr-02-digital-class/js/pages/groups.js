import { createEl } from "../utils/dom.js";
import { selectGroupsForUser } from "../core/selectors.js";
import { renderEmptyState } from "../ui/emptyState.js";
import { createGroup } from "../core/actions.js";
import { showToast } from "../ui/toast.js";

export const renderGroups = (state, user, store) => {
  const wrapper = createEl("div");
  const header = createEl("div", { className: "page-header" });
  header.appendChild(createEl("h1", { text: "Grupy" }));
  if (user.role === "admin") {
    const button = createEl("button", { className: "button", text: "Dodaj grupę" });
    button.addEventListener("click", () => {
      const name = prompt("Nazwa grupy");
      if (!name) return;
      store.dispatch(createGroup({ name }));
      showToast("Dodano grupę");
    });
    header.appendChild(button);
  }
  wrapper.appendChild(header);
  const groups = selectGroupsForUser(state, user);
  if (!groups.length) {
    wrapper.appendChild(renderEmptyState({ title: "Brak grup", body: "Brak przypisanych grup." }));
    return wrapper;
  }
  const list = createEl("div", { className: "list" });
  groups.forEach((group) => {
    const card = createEl("a", { className: "card", attrs: { href: `#/groups/${group.id}` } });
    card.innerHTML = `<h3>${group.name}</h3><p>${group.classId ? `Klasa: ${group.classId}` : "Międzyklasowa"}</p>`;
    list.appendChild(card);
  });
  wrapper.appendChild(list);
  return wrapper;
};
