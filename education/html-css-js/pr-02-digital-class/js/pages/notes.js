import { createEl } from "../utils/dom.js";
import { selectNotesForUser, selectClassesForUser, selectGroupsForUser } from "../core/selectors.js";
import { createNote, deleteNote } from "../core/actions.js";
import { showToast } from "../ui/toast.js";

export const renderNotes = (state, user, store) => {
  const wrapper = createEl("div");
  const header = createEl("div", { className: "page-header" });
  header.appendChild(createEl("h1", { text: "Notatki" }));
  wrapper.appendChild(header);

  const form = createEl("form", { className: "card" });
  form.innerHTML = `
    <h3>Nowa notatka</h3>
    <input class="input" name="title" placeholder="Tytuł" required />
    <textarea class="input" name="body" rows="3" placeholder="Treść"></textarea>
  `;
  let scopeSelect;
  if (user.role !== "student") {
    scopeSelect = createEl("select", { className: "input", attrs: { name: "scope" } });
    scopeSelect.innerHTML = `<option value="">Wybierz scope</option>`;
    selectClassesForUser(state, user).forEach((cls) => {
      const option = createEl("option", { text: `Klasa ${cls.name}`, attrs: { value: `class:${cls.id}` } });
      scopeSelect.appendChild(option);
    });
    selectGroupsForUser(state, user).forEach((grp) => {
      const option = createEl("option", { text: `Grupa ${grp.name}`, attrs: { value: `group:${grp.id}` } });
      scopeSelect.appendChild(option);
    });
    form.appendChild(scopeSelect);
  }
  const button = createEl("button", { className: "button", text: "Zapisz" });
  button.type = "submit";
  form.appendChild(button);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = form.title.value;
    const body = form.body.value;
    let scopeType = "private";
    let scopeId = null;
    if (scopeSelect && scopeSelect.value) {
      const [type, id] = scopeSelect.value.split(":");
      scopeType = type;
      scopeId = id;
    }
    store.dispatch(
      createNote({
        title,
        body,
        scopeType,
        scopeId,
        ownerId: user.id,
      })
    );
    showToast("Dodano notatkę");
    form.reset();
  });
  wrapper.appendChild(form);

  const notes = selectNotesForUser(state, user);
  const list = createEl("div", { className: "list" });
  notes.forEach((note) => {
    const card = createEl("div", { className: "card" });
    card.innerHTML = `<h3>${note.title}</h3><p>${note.body}</p>`;
    if (note.ownerId === user.id || user.role === "admin") {
      const del = createEl("button", { className: "button button-secondary", text: "Usuń" });
      del.addEventListener("click", () => {
        store.dispatch(deleteNote(note.id));
        showToast("Usunięto notatkę");
      });
      card.appendChild(del);
    }
    list.appendChild(card);
  });
  wrapper.appendChild(list);
  return wrapper;
};
