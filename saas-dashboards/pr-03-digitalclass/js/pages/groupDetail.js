import { createEl } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import { selectGroupById } from "../domain/groups/selectors.js";
import { selectMaterialsForUser, selectAssignmentsForUser } from "../core/selectors.js";

export const renderGroupDetail = (state, user, params) => {
  const group = selectGroupById(state, params.groupId);
  const wrapper = createEl("div");
  if (!group) {
    wrapper.appendChild(createEl("p", { text: "Nie znaleziono grupy." }));
    return wrapper;
  }
  wrapper.appendChild(createEl("h1", { text: group.name }));
  const info = createEl("p", { text: group.classId ? `Powiązana klasa: ${group.classId}` : "Grupa międzyklasowa" });
  wrapper.appendChild(info);

  const materials = selectMaterialsForUser(state, user).filter((item) => item.scopeId === group.id);
  const assignments = selectAssignmentsForUser(state, user).filter((item) => item.scopeId === group.id);

  const section = (title, items, renderItem) => {
    const card = createEl("div", { className: "card" });
    card.appendChild(createEl("h3", { text: title }));
    items.forEach((item) => card.appendChild(renderItem(item)));
    return card;
  };

  wrapper.appendChild(
    section("Materiały", materials, (item) => createEl("div", { text: `${item.title} • ${item.tag}` }))
  );

  wrapper.appendChild(
    section("Zadania", assignments, (item) => createEl("div", { text: `${item.title} • ${formatDate(item.dueDate)}` }))
  );

  return wrapper;
};
