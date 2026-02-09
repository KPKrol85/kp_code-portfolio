export const selectUserById = (state, id) => state.users.find((user) => user.id === id);
