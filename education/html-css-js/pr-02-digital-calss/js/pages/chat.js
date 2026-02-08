import { createEl } from "../utils/dom.js";
import { selectThreadsForUser } from "../core/selectors.js";
import { selectThreadById, selectMessagesForThread } from "../domain/chat/selectors.js";
import { createChatMessage } from "../core/actions.js";
import { formatDateTime } from "../utils/format.js";

export const renderChat = (state, user, params, store) => {
  const wrapper = createEl("div", { className: "page-grid two" });

  const threads = selectThreadsForUser(state, user);
  const listCard = createEl("div", { className: "card" });
  listCard.appendChild(createEl("h3", { text: "Wątki" }));
  threads.forEach((thread) => {
    const link = createEl("a", { text: thread.name, attrs: { href: `#/chat/${thread.id}` } });
    listCard.appendChild(link);
  });

  const threadId = params.threadId || threads[0]?.id;
  const thread = selectThreadById(state, threadId);
  const detailCard = createEl("div", { className: "card" });
  if (!thread) {
    detailCard.appendChild(createEl("p", { text: "Wybierz wątek" }));
  } else {
    detailCard.appendChild(createEl("h3", { text: thread.name }));
    const messages = selectMessagesForThread(state, thread.id);
    const windowEl = createEl("div", { className: "chat-window" });
    messages.forEach((msg) => {
      const author = state.users.find((u) => u.id === msg.authorId);
      const bubble = createEl("div", { className: "chat-message" });
      bubble.innerHTML = `<strong>${author?.name || "Anon"}</strong><p>${msg.body}</p><span class="footer-note">${formatDateTime(msg.createdAt)}</span>`;
      windowEl.appendChild(bubble);
    });
    detailCard.appendChild(windowEl);

    const form = createEl("form");
    form.innerHTML = `
      <label>Nowa wiadomość
        <input class="input" name="body" required />
      </label>
      <button class="button" type="submit">Wyślij</button>
    `;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const body = form.body.value;
      if (!body) return;
      store.dispatch(createChatMessage({ threadId: thread.id, authorId: user.id, body }));
      form.reset();
    });
    detailCard.appendChild(form);
  }

  wrapper.appendChild(listCard);
  wrapper.appendChild(detailCard);
  return wrapper;
};
