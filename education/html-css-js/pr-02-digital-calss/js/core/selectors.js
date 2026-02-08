import { canAccessScope } from "./permissions.js";

export const selectCurrentUser = (state) => state.users.find((user) => user.id === state.session.currentUserId);

export const selectTenant = (state) => state.tenants.find((tenant) => tenant.id === state.session.tenantId);

export const selectUsersByRole = (state, role) => state.users.filter((user) => user.role === role);

export const selectClassesForUser = (state, user) => {
  if (!user) return [];
  if (user.role === "admin") return state.classes;
  const classIds = state.relations.memberOf
    .filter((rel) => rel.userId === user.id && rel.scopeType === "class")
    .map((rel) => rel.scopeId);
  const teacherIds = state.relations.instructorOf
    .filter((rel) => rel.userId === user.id && rel.scopeType === "class")
    .map((rel) => rel.scopeId);
  const ids = new Set([...classIds, ...teacherIds]);
  return state.classes.filter((cls) => ids.has(cls.id));
};

export const selectGroupsForUser = (state, user) => {
  if (!user) return [];
  if (user.role === "admin") return state.groups;
  const groupIds = state.relations.memberOf
    .filter((rel) => rel.userId === user.id && rel.scopeType === "group")
    .map((rel) => rel.scopeId);
  const teacherIds = state.relations.instructorOf
    .filter((rel) => rel.userId === user.id && rel.scopeType === "group")
    .map((rel) => rel.scopeId);
  const ids = new Set([...groupIds, ...teacherIds]);
  return state.groups.filter((group) => ids.has(group.id));
};

export const selectAnnouncementsForUser = (state, user) =>
  state.announcements.filter((item) => canAccessScope(user, item.scopeId, item.scopeType, state.relations));

export const selectMaterialsForUser = (state, user) =>
  state.materials.filter((item) => canAccessScope(user, item.scopeId, item.scopeType, state.relations));

export const selectAssignmentsForUser = (state, user) =>
  state.assignments.filter((item) => canAccessScope(user, item.scopeId, item.scopeType, state.relations));

export const selectNotesForUser = (state, user) => {
  if (!user) return [];
  if (user.role === "admin") return state.notes;
  if (user.role === "teacher") {
    return state.notes.filter(
      (note) => note.ownerId === user.id || canAccessScope(user, note.scopeId, note.scopeType, state.relations)
    );
  }
  return state.notes.filter((note) => note.ownerId === user.id);
};

export const selectThreadsForUser = (state, user) =>
  state.chatThreads.filter((thread) => canAccessScope(user, thread.scopeId, thread.scopeType, state.relations));

export const selectActivityLog = (state) => state.activityLog.slice(0, 6);
