import { createEl } from "../utils/dom.js";
import {
  createClass,
  createGroup,
  assignUserToScope,
  assignInstructorToScope,
  deleteClass,
  deleteGroup,
} from "../core/actions.js";
import { showToast } from "../ui/toast.js";
import { selectUsersByRole } from "../core/selectors.js";

export const renderAdmin = (state, store) => {
  const wrapper = createEl("div");
  wrapper.appendChild(createEl("h1", { text: "Panel admina" }));

  const classCard = createEl("div", { className: "card" });
  classCard.appendChild(createEl("h3", { text: "Klasy" }));
  const classForm = createEl("form");
  classForm.innerHTML = `<input class="input" name="name" placeholder="Nazwa klasy" /> <button class="button" type="submit">Dodaj</button>`;
  classForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!classForm.name.value) return;
    store.dispatch(createClass({ name: classForm.name.value }));
    showToast("Dodano klasę");
    classForm.reset();
  });
  classCard.appendChild(classForm);
  state.classes.forEach((cls) => {
    const row = createEl("div");
    row.innerHTML = `<strong>${cls.name}</strong>`;
    const del = createEl("button", { className: "button button-secondary", text: "Usuń" });
    del.addEventListener("click", () => store.dispatch(deleteClass(cls.id)));
    row.appendChild(del);
    classCard.appendChild(row);
  });
  wrapper.appendChild(classCard);

  const groupCard = createEl("div", { className: "card" });
  groupCard.appendChild(createEl("h3", { text: "Grupy" }));
  const groupForm = createEl("form");
  groupForm.innerHTML = `<input class="input" name="name" placeholder="Nazwa grupy" /> <button class="button" type="submit">Dodaj</button>`;
  groupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!groupForm.name.value) return;
    store.dispatch(createGroup({ name: groupForm.name.value }));
    showToast("Dodano grupę");
    groupForm.reset();
  });
  groupCard.appendChild(groupForm);
  state.groups.forEach((grp) => {
    const row = createEl("div");
    row.innerHTML = `<strong>${grp.name}</strong>`;
    const del = createEl("button", { className: "button button-secondary", text: "Usuń" });
    del.addEventListener("click", () => store.dispatch(deleteGroup(grp.id)));
    row.appendChild(del);
    groupCard.appendChild(row);
  });
  wrapper.appendChild(groupCard);

  const assignCard = createEl("div", { className: "card" });
  assignCard.appendChild(createEl("h3", { text: "Przypisania" }));
  const assignForm = createEl("form");
  const students = selectUsersByRole(state, "student");
  const teachers = selectUsersByRole(state, "teacher");
  assignForm.innerHTML = `
    <label>Użytkownik
      <select class="input" name="userId">
        ${[...students, ...teachers]
          .map((user) => `<option value="${user.id}">${user.name} (${user.role})</option>`)
          .join("")}
      </select>
    </label>
    <label>Scope
      <select class="input" name="scope">
        ${state.classes.map((cls) => `<option value="class:${cls.id}">Klasa ${cls.name}</option>`).join("")}
        ${state.groups.map((grp) => `<option value="group:${grp.id}">Grupa ${grp.name}</option>`).join("")}
      </select>
    </label>
    <label>Rola
      <select class="input" name="role">
        <option value="member">Uczeń</option>
        <option value="instructor">Instruktor</option>
      </select>
    </label>
    <button class="button" type="submit">Przypisz</button>
  `;
  assignForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const [scopeType, scopeId] = assignForm.scope.value.split(":");
    if (assignForm.role.value === "instructor") {
      store.dispatch(assignInstructorToScope({ userId: assignForm.userId.value, scopeType, scopeId }));
    } else {
      store.dispatch(assignUserToScope({ userId: assignForm.userId.value, scopeType, scopeId }));
    }
    showToast("Zapisano przypisanie");
  });
  assignCard.appendChild(assignForm);
  wrapper.appendChild(assignCard);

  return wrapper;
};
