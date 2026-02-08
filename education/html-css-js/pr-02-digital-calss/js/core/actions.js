import { uuid } from "../utils/uuid.js";
import { canManageScope } from "./permissions.js";

const requireTitle = (title) => {
  if (!title?.trim()) {
    throw new Error("Tytuł nie może być pusty.");
  }
};

export const setCurrentUser = (userId) => (state) => ({
  ...state,
  session: {
    ...state.session,
    currentUserId: userId,
  },
});

export const toggleTheme = () => (state) => ({
  ...state,
  ui: {
    ...state.ui,
    theme: state.ui.theme === "dark" ? "light" : "dark",
  },
});

export const toggleReducedMotion = () => (state) => ({
  ...state,
  ui: {
    ...state.ui,
    reducedMotion: !state.ui.reducedMotion,
  },
});

export const setSearchQuery = (query) => (state) => ({
  ...state,
  ui: {
    ...state.ui,
    searchQuery: query,
  },
});

export const createAnnouncement = ({ title, body, scopeType, scopeId, authorId }) => (state) => {
  requireTitle(title);
  const now = new Date().toISOString();
  return {
    ...state,
    announcements: [
      {
        id: uuid(),
        title,
        body,
        scopeType,
        scopeId,
        authorId,
        tenantId: state.session.tenantId,
        createdAt: now,
        updatedAt: now,
      },
      ...state.announcements,
    ],
    activityLog: [{ id: uuid(), type: "create", label: "Nowe ogłoszenie", userId: authorId, createdAt: now }, ...state.activityLog],
  };
};

export const createMaterial = ({ title, tag, scopeType, scopeId, authorId }) => (state) => {
  requireTitle(title);
  const now = new Date().toISOString();
  return {
    ...state,
    materials: [
      {
        id: uuid(),
        title,
        tag,
        scopeType,
        scopeId,
        authorId,
        tenantId: state.session.tenantId,
        createdAt: now,
        updatedAt: now,
      },
      ...state.materials,
    ],
    activityLog: [{ id: uuid(), type: "create", label: "Nowy materiał", userId: authorId, createdAt: now }, ...state.activityLog],
  };
};

export const createAssignment = ({ title, description, dueDate, scopeType, scopeId, authorId }) => (state) => {
  requireTitle(title);
  if (!dueDate) {
    throw new Error("Termin jest wymagany.");
  }
  const now = new Date().toISOString();
  return {
    ...state,
    assignments: [
      {
        id: uuid(),
        title,
        description,
        dueDate,
        scopeType,
        scopeId,
        authorId,
        tenantId: state.session.tenantId,
        createdAt: now,
        updatedAt: now,
      },
      ...state.assignments,
    ],
    activityLog: [{ id: uuid(), type: "create", label: "Nowe zadanie", userId: authorId, createdAt: now }, ...state.activityLog],
  };
};

export const submitAssignment = ({ assignmentId, studentId, content }) => (state) => {
  const now = new Date().toISOString();
  return {
    ...state,
    submissions: [
      {
        id: uuid(),
        assignmentId,
        studentId,
        content,
        attachment: "",
        status: "submitted",
        createdAt: now,
        updatedAt: now,
      },
      ...state.submissions,
    ],
    activityLog: [{ id: uuid(), type: "submit", label: "Oddano zadanie", userId: studentId, createdAt: now }, ...state.activityLog],
  };
};

export const gradeSubmission = ({ submissionId, grade, feedback, teacherId }) => (state) => {
  const now = new Date().toISOString();
  return {
    ...state,
    submissions: state.submissions.map((sub) =>
      sub.id === submissionId
        ? { ...sub, grade, feedback, status: "graded", updatedAt: now }
        : sub
    ),
    activityLog: [{ id: uuid(), type: "grade", label: "Ocena wystawiona", userId: teacherId, createdAt: now }, ...state.activityLog],
  };
};

export const createNote = ({ title, body, scopeType, scopeId, ownerId }) => (state) => {
  requireTitle(title);
  const now = new Date().toISOString();
  return {
    ...state,
    notes: [
      {
        id: uuid(),
        title,
        body,
        scopeType,
        scopeId,
        ownerId,
        tenantId: state.session.tenantId,
        createdAt: now,
        updatedAt: now,
      },
      ...state.notes,
    ],
  };
};

export const deleteNote = (noteId) => (state) => ({
  ...state,
  notes: state.notes.filter((note) => note.id !== noteId),
});

export const createChatMessage = ({ threadId, authorId, body }) => (state) => {
  const now = new Date().toISOString();
  return {
    ...state,
    chatMessages: [
      ...state.chatMessages,
      { id: uuid(), threadId, authorId, body, createdAt: now, updatedAt: now },
    ],
    activityLog: [{ id: uuid(), type: "message", label: "Nowa wiadomość", userId: authorId, createdAt: now }, ...state.activityLog],
  };
};

export const createClass = ({ name, userId }) => (state) => {
  requireTitle(name);
  const now = new Date().toISOString();
  return {
    ...state,
    classes: [
      { id: uuid(), name, tenantId: state.session.tenantId, createdAt: now, updatedAt: now },
      ...state.classes,
    ],
  };
};

export const createGroup = ({ name, classId }) => (state) => {
  requireTitle(name);
  const now = new Date().toISOString();
  return {
    ...state,
    groups: [
      { id: uuid(), name, classId: classId || null, tenantId: state.session.tenantId, createdAt: now, updatedAt: now },
      ...state.groups,
    ],
  };
};

export const assignUserToScope = ({ userId, scopeType, scopeId }) => (state) => {
  const exists = state.relations.memberOf.some(
    (rel) => rel.userId === userId && rel.scopeType === scopeType && rel.scopeId === scopeId
  );
  if (exists) return state;
  return {
    ...state,
    relations: {
      ...state.relations,
      memberOf: [...state.relations.memberOf, { userId, scopeType, scopeId }],
    },
  };
};

export const assignInstructorToScope = ({ userId, scopeType, scopeId }) => (state) => {
  const exists = state.relations.instructorOf.some(
    (rel) => rel.userId === userId && rel.scopeType === scopeType && rel.scopeId === scopeId
  );
  if (exists) return state;
  return {
    ...state,
    relations: {
      ...state.relations,
      instructorOf: [...state.relations.instructorOf, { userId, scopeType, scopeId }],
    },
  };
};

export const deleteClass = (classId) => (state) => ({
  ...state,
  classes: state.classes.filter((cls) => cls.id !== classId),
});

export const deleteGroup = (groupId) => (state) => ({
  ...state,
  groups: state.groups.filter((grp) => grp.id !== groupId),
});

export const updateAssignment = ({ assignmentId, title, description, dueDate, user }) => (state) => {
  requireTitle(title);
  const assignment = state.assignments.find((item) => item.id === assignmentId);
  if (!assignment) return state;
  if (!canManageScope(user, assignment.scopeId, assignment.scopeType, state.relations)) return state;
  const now = new Date().toISOString();
  return {
    ...state,
    assignments: state.assignments.map((item) =>
      item.id === assignmentId ? { ...item, title, description, dueDate, updatedAt: now } : item
    ),
  };
};
