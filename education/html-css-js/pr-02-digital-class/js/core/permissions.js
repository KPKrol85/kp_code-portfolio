import { ROLES } from "./constants.js";

export const canManageScope = (user, scopeId, scopeType, relations) => {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.TEACHER) {
    return relations.instructorOf.some(
      (rel) => rel.scopeId === scopeId && rel.scopeType === scopeType && rel.userId === user.id
    );
  }
  return false;
};

export const canAccessScope = (user, scopeId, scopeType, relations) => {
  if (!user) return false;
  if (user.role === ROLES.ADMIN) return true;
  if (user.role === ROLES.TEACHER) {
    return relations.instructorOf.some(
      (rel) => rel.scopeId === scopeId && rel.scopeType === scopeType && rel.userId === user.id
    );
  }
  return relations.memberOf.some(
    (rel) => rel.scopeId === scopeId && rel.scopeType === scopeType && rel.userId === user.id
  );
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isTeacher = (user) => user?.role === ROLES.TEACHER;
export const isStudent = (user) => user?.role === ROLES.STUDENT;
