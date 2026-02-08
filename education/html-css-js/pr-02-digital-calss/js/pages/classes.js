import { createEl } from "../utils/dom.js";
import { selectClassesForUser } from "../core/selectors.js";
import { renderEmptyState } from "../ui/emptyState.js";
import { createClass } from "../core/actions.js";
import { showToast } from "../ui/toast.js";

export const renderClasses = (state, user, store) => {
  const wrapper = createEl("div");
  const header = createEl("div", { className: "page-header" });
  header.appendChild(createEl("h1", { text: "Klasy" }));
  if (user.role === "admin") {
    const button = createEl("button", { className: "button", text: "Dodaj klasę" });
    button.addEventListener("click", () => {
      const name = prompt("Nazwa klasy");
      if (!name) return;
      store.dispatch(createClass({ name, userId: user.id }));
      showToast("Dodano klasę");
    });
    header.appendChild(button);
  }
  wrapper.appendChild(header);

  const classes = selectClassesForUser(state, user);
  if (!classes.length) {
    wrapper.appendChild(
      renderEmptyState({
        title: "Brak klas",
        body: "Nie masz przypisanych klas.",
      })
    );
    return wrapper;
  }
  const list = createEl("div", { className: "list" });
  classes.forEach((cls) => {
    const card = createEl("a", { className: "card", attrs: { href: `#/classes/${cls.id}` } });
    card.innerHTML = `<h3>${cls.name}</h3><p>ID: ${cls.id}</p>`;
    list.appendChild(card);
  });
  wrapper.appendChild(list);
  return wrapper;
};
