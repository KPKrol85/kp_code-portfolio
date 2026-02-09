import { createEl } from "../utils/dom.js";
import { formatDate } from "../utils/format.js";
import {
  selectAnnouncementsForUser,
  selectAssignmentsForUser,
  selectMaterialsForUser,
  selectActivityLog,
} from "../core/selectors.js";

const withinDays = (iso, days) => {
  const target = new Date(iso);
  const now = new Date();
  const diff = (target - now) / (1000 * 60 * 60 * 24);
  return diff <= days && diff >= -days;
};

export const renderDashboard = (state, user) => {
  const wrapper = createEl("div");
  const header = createEl("div", { className: "page-header" });
  header.appendChild(createEl("h1", { text: "Dashboard" }));
  header.appendChild(createEl("span", { className: "badge", text: `Witaj, ${user.name}` }));
  wrapper.appendChild(header);

  const grid = createEl("div", { className: "page-grid two" });

  const recentAnnouncements = selectAnnouncementsForUser(state, user).filter((item) => withinDays(item.createdAt, 7));
  const upcomingAssignments = selectAssignmentsForUser(state, user).filter((item) => {
    const due = new Date(item.dueDate);
    const now = new Date();
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  });
  const recentMaterials = selectMaterialsForUser(state, user).slice(0, 3);
  const activity = selectActivityLog(state);

  const card = (title, items, renderer) => {
    const container = createEl("div", { className: "card" });
    container.appendChild(createEl("h3", { text: title }));
    if (!items.length) {
      container.appendChild(createEl("p", { text: "Brak danych" }));
      return container;
    }
    items.forEach((item) => container.appendChild(renderer(item)));
    return container;
  };

  grid.appendChild(
    card("Today", recentAnnouncements, (item) => {
      const el = createEl("div");
      el.innerHTML = `<strong>${item.title}</strong><p>${item.body}</p>`;
      return el;
    })
  );

  grid.appendChild(
    card("Upcoming", upcomingAssignments, (item) => {
      const el = createEl("div");
      el.innerHTML = `<strong>${item.title}</strong><p>Termin: ${formatDate(item.dueDate)}</p>`;
      return el;
    })
  );

  grid.appendChild(
    card("Recent materials", recentMaterials, (item) => {
      const el = createEl("div");
      el.innerHTML = `<strong>${item.title}</strong><p>Tag: ${item.tag}</p>`;
      return el;
    })
  );

  grid.appendChild(
    card("Activity log", activity, (item) => {
      const el = createEl("div");
      el.innerHTML = `<strong>${item.label}</strong><p>${formatDate(item.createdAt)}</p>`;
      return el;
    })
  );

  wrapper.appendChild(grid);
  return wrapper;
};
