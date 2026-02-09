export const selectNoteById = (state, id) => state.notes.find((note) => note.id === id);
