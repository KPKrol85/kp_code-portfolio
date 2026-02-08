import { createEl } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import { selectClassById } from "../domain/classes/selectors.js";
import { initTabs } from "../ui/tabs.js";
import { selectAnnouncementsForUser, selectMaterialsForUser, selectAssignmentsForUser, selectNotesForUser } from "../core/selectors.js";

export const renderClassDetail = (state, user, params) => {
  const cls = selectClassById(state, params.classId);
  const wrapper = createEl("div");
  if (!cls) {
    wrapper.appendChild(createEl("p", { text: "Nie znaleziono klasy." }));
    return wrapper;
  }
  wrapper.appendChild(createEl("h1", { text: `Klasa ${cls.name}` }));

  const tabList = createEl("div", { className: "tabs", attrs: { role: "tablist" } });
  [
    { id: "announcements", label: "Announcements" },
    { id: "materials", label: "Materials" },
    { id: "assignments", label: "Assignments" },
    { id: "people", label: "People" },
    { id: "notes", label: "Notes" },
  ].forEach((tab, index) => {
    const button = createEl("button", {
      className: "tab",
      text: tab.label,
      attrs: {
        role: "tab",
        "aria-selected": index === 0 ? "true" : "false",
        "data-tab": tab.id,
        tabIndex: index === 0 ? 0 : -1,
      },
    });
    tabList.appendChild(button);
  });
  wrapper.appendChild(tabList);

  const panel = createEl("div", { className: "card" });
  wrapper.appendChild(panel);

  const renderTab = (tabId) => {
    panel.innerHTML = "";
    if (tabId === "announcements") {
      const items = selectAnnouncementsForUser(state, user).filter((item) => item.scopeId === cls.id);
      items.forEach((item) => panel.appendChild(createEl("div", { text: `${item.title} • ${formatDate(item.createdAt)}` })));
    }
    if (tabId === "materials") {
      const items = selectMaterialsForUser(state, user).filter((item) => item.scopeId === cls.id);
      items.forEach((item) => panel.appendChild(createEl("div", { text: `${item.title} • ${item.tag}` })));
    }
    if (tabId === "assignments") {
      const items = selectAssignmentsForUser(state, user).filter((item) => item.scopeId === cls.id);
      items.forEach((item) => panel.appendChild(createEl("div", { text: `${item.title} • termin ${formatDate(item.dueDate)}` })));
    }
    if (tabId === "people") {
      const members = state.relations.memberOf.filter((rel) => rel.scopeId === cls.id && rel.scopeType === "class");
      const instructors = state.relations.instructorOf.filter((rel) => rel.scopeId === cls.id && rel.scopeType === "class");
      panel.appendChild(createEl("h3", { text: "Instruktorzy" }));
      instructors.forEach((rel) => {
        const userItem = state.users.find((u) => u.id === rel.userId);
        panel.appendChild(createEl("div", { text: userItem?.name || rel.userId }));
      });
      panel.appendChild(createEl("h3", { text: "Uczniowie" }));
      members.forEach((rel) => {
        const userItem = state.users.find((u) => u.id === rel.userId);
        panel.appendChild(createEl("div", { text: userItem?.name || rel.userId }));
      });
    }
    if (tabId === "notes") {
      const notes = selectNotesForUser(state, user).filter((note) => note.scopeId === cls.id);
      notes.forEach((note) => panel.appendChild(createEl("div", { text: `${note.title} • ${note.body}` })));
    }
  };

  initTabs(tabList, renderTab);
  return wrapper;
};
