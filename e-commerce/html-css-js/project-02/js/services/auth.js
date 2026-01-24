import { storage } from "./storage.js";
import { simpleHash } from "../utils/hash.js";

/**
 * DEMO / FRONTEND-ONLY:
 * Ten moduł zarządza sesją po stronie klienta (localStorage) wyłącznie do celów demonstracyjnych.
 * Tryb demo nie oferuje realnej weryfikacji ról/administracji — wszystko jest traktowane jako zwykły użytkownik.
 */
const STORAGE_KEYS = {
  USERS: "kp_users",
  SESSION: "kp_session",
  RETURN_TO: "kp_returnTo",
};

const listeners = new Set();
const createToken = () => Math.random().toString(36).slice(2);

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: "user",
  createdAt: user.createdAt,
});

const normalizeUser = (user) => {
  if (!isPlainObject(user) || typeof user.id !== "string" || typeof user.email !== "string") {
    return null;
  }
  return {
    id: user.id,
    name: user.name || "Użytkownik",
    email: user.email,
    role: "user",
    createdAt: user.createdAt || null,
  };
};

const isValidSession = (session) => {
  if (!isPlainObject(session)) {
    return false;
  }
  if (typeof session.expiresAt !== "number") {
    return false;
  }
  return Boolean(normalizeUser(session.user));
};

const notifyAuthChange = (session) => {
  const user = session?.user ?? null;
  listeners.forEach((callback) => {
    callback({ session, user });
  });
};

const buildSession = (user) => ({
  token: createToken(),
  user: toPublicUser(user),
  expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
});

export const authService = {
  register({ name, email, password }) {
    const users = storage.get(STORAGE_KEYS.USERS, []);
    if (users.find((user) => user.email === email)) {
      throw new Error("Użytkownik z tym adresem e-mail już istnieje.");
    }
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: simpleHash(password),
      role: "user",
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    storage.set(STORAGE_KEYS.USERS, users);
    return user;
  },
  signIn(credentialsOrUser) {
    const isCredentials =
      isPlainObject(credentialsOrUser) &&
      typeof credentialsOrUser.email === "string" &&
      typeof credentialsOrUser.password === "string";
    const isUser = isPlainObject(credentialsOrUser) && typeof credentialsOrUser.id === "string";

    if (isCredentials) {
      const users = storage.get(STORAGE_KEYS.USERS, []);
      const user = users.find((item) => item.email === credentialsOrUser.email);
      if (!user || user.passwordHash !== simpleHash(credentialsOrUser.password)) {
        throw new Error("Nieprawidłowy e-mail lub hasło.");
      }
      const session = buildSession(user);
      storage.set(STORAGE_KEYS.SESSION, session);
      notifyAuthChange(session);
      return { user: session.user, session };
    }

    if (isUser) {
      const session = buildSession(credentialsOrUser);
      storage.set(STORAGE_KEYS.SESSION, session);
      notifyAuthChange(session);
      return { user: session.user, session };
    }

    throw new Error("Nieprawidłowe dane logowania.");
  },
  signOut() {
    storage.remove(STORAGE_KEYS.SESSION);
    storage.remove(STORAGE_KEYS.RETURN_TO);
    notifyAuthChange(null);
  },
  getSession() {
    const session = storage.get(STORAGE_KEYS.SESSION, null);
    if (!session || !isValidSession(session)) {
      if (session) {
        storage.remove(STORAGE_KEYS.SESSION);
      }
      return null;
    }
    if (Date.now() > session.expiresAt) {
      storage.remove(STORAGE_KEYS.SESSION);
      return null;
    }
    const user = normalizeUser(session.user);
    if (!user) {
      storage.remove(STORAGE_KEYS.SESSION);
      return null;
    }
    return { ...session, user };
  },
  getUser() {
    const session = this.getSession();
    return session?.user ?? null;
  },
  isAuthenticated() {
    return Boolean(this.getSession());
  },
  onAuthChange(callback) {
    if (typeof callback !== "function") {
      return () => {};
    }
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  setReturnTo(path) {
    if (!path) {
      return;
    }
    storage.set(STORAGE_KEYS.RETURN_TO, path);
  },
  consumeReturnTo() {
    const value = storage.get(STORAGE_KEYS.RETURN_TO, null);
    storage.remove(STORAGE_KEYS.RETURN_TO);
    return value;
  },
  updateProfile({ name } = {}) {
    const session = this.getSession();
    if (!session) {
      throw new Error("Brak aktywnej sesji.");
    }
    const nextName = typeof name === "string" ? name.trim() : "";
    if (nextName && nextName.length < 2) {
      throw new Error("Imie musi miec co najmniej 2 znaki.");
    }
    const updatedUser = {
      ...session.user,
      name: nextName || session.user.name,
    };
    const nextSession = { ...session, user: updatedUser };
    storage.set(STORAGE_KEYS.SESSION, nextSession);
    const users = storage.get(STORAGE_KEYS.USERS, []);
    const index = users.findIndex((user) => user?.id === updatedUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], name: updatedUser.name };
      storage.set(STORAGE_KEYS.USERS, users);
    }
    notifyAuthChange(nextSession);
    return updatedUser;
  },
};
