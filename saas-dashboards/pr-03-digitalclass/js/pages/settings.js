import { createEl } from "../utils/dom.js";
import { toggleTheme, toggleReducedMotion } from "../core/actions.js";

export const renderSettings = (state, user, store) => {
  const wrapper = createEl("div");
  wrapper.appendChild(createEl("h1", { text: "Ustawienia" }));

  const themeCard = createEl("div", { className: "card" });
  themeCard.appendChild(createEl("h3", { text: "Wygląd" }));
  const themeButton = createEl("button", { className: "button", text: "Przełącz motyw" });
  themeButton.addEventListener("click", () => store.dispatch(toggleTheme()));
  themeCard.appendChild(themeButton);
  const motionButton = createEl("button", { className: "button button-secondary", text: "Reduced motion" });
  motionButton.addEventListener("click", () => store.dispatch(toggleReducedMotion()));
  themeCard.appendChild(motionButton);
  wrapper.appendChild(themeCard);

  const profile = createEl("div", { className: "card" });
  profile.appendChild(createEl("h3", { text: "Profil" }));
  profile.appendChild(createEl("p", { text: `Użytkownik: ${user.name}` }));
  profile.appendChild(createEl("p", { text: `Rola: ${user.role}` }));
  wrapper.appendChild(profile);
  return wrapper;
};
