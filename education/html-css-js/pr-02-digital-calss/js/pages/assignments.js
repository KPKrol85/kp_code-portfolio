import { createEl } from "../utils/dom.js";
import { selectAssignmentsForUser } from "../core/selectors.js";
import { createAssignment } from "../core/actions.js";
import { formatDate } from "../utils/format.js";
import { showToast } from "../ui/toast.js";

export const renderAssignments = (state, user, store) => {
  const wrapper = createEl("div");
  const header = createEl("div", { className: "page-header" });
  header.appendChild(createEl("h1", { text: "Zadania" }));
  if (user.role !== "student") {
    const button = createEl("button", { className: "button", text: "Dodaj zadanie" });
    button.addEventListener("click", () => {
      const title = prompt("Tytuł zadania");
      if (!title) return;
      store.dispatch(
        createAssignment({
          title,
          description: "Opis zadania",
          dueDate: new Date().toISOString(),
          scopeType: "class",
          scopeId: state.classes[0]?.id,
          authorId: user.id,
        })
      );
      showToast("Dodano zadanie");
    });
    header.appendChild(button);
  }
  wrapper.appendChild(header);

  const filterRow = createEl("div", { className: "filter-row" });
  const statusSelect = createEl("select", { className: "input" });
  statusSelect.innerHTML = `<option value="">Status</option><option value="open">Open</option><option value="submitted">Submitted</option><option value="graded">Graded</option>`;
  filterRow.appendChild(statusSelect);
  wrapper.appendChild(filterRow);

  const list = createEl("div", { className: "list" });
  const renderList = () => {
    list.innerHTML = "";
    const assignments = selectAssignmentsForUser(state, user).filter((item) => {
      if (!statusSelect.value) return true;
      const submission = state.submissions.find((sub) => sub.assignmentId === item.id && sub.studentId === user.id);
      const status = submission?.status || "open";
      return status === statusSelect.value;
    });
    assignments.forEach((item) => {
      const card = createEl("a", { className: "card", attrs: { href: `#/assignments/${item.id}` } });
      card.innerHTML = `<h3>${item.title}</h3><p>Termin: ${formatDate(item.dueDate)}</p>`;
      list.appendChild(card);
    });
  };
  statusSelect.addEventListener("change", renderList);
  renderList();
  wrapper.appendChild(list);
  return wrapper;
};
