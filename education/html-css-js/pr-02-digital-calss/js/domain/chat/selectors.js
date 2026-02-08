export const selectThreadById = (state, id) => state.chatThreads.find((thread) => thread.id === id);
export const selectMessagesForThread = (state, id) => state.chatMessages.filter((msg) => msg.threadId === id);
