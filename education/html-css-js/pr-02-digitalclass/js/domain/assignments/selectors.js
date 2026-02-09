export const selectAssignmentById = (state, id) => state.assignments.find((item) => item.id === id);
export const selectSubmissionsForAssignment = (state, assignmentId) =>
  state.submissions.filter((sub) => sub.assignmentId === assignmentId);
