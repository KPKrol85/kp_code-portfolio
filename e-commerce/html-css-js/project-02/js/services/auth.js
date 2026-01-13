import { storage } from "./storage.js";
import { simpleHash } from "../utils/hash.js";

const USERS_KEY = "kp_users";
const SESSION_KEY = "kp_session";

const createToken = () => Math.random().toString(36).slice(2);

export const authService = {
  register({ name, email, password }) {
    const users = storage.get(USERS_KEY, []);
    if (users.find((user) => user.email === email)) {
      throw new Error("Użytkownik z tym adresem e-mail już istnieje.");
    }
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    storage.set(USERS_KEY, users);
    return user;
  },
  login({ email, password }) {
    const users = storage.get(USERS_KEY, []);
    const user = users.find((item) => item.email === email);
    if (!user || user.passwordHash !== simpleHash(password)) {
      throw new Error("Nieprawidłowy e-mail lub hasło.");
    }
    const session = {
      token: createToken(),
      userId: user.id,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    storage.set(SESSION_KEY, session);
    return { user, session };
  },
  logout() {
    storage.remove(SESSION_KEY);
  },
  getSession() {
    const session = storage.get(SESSION_KEY, null);
    if (!session) {
      return null;
    }
    if (Date.now() > session.expiresAt) {
      storage.remove(SESSION_KEY);
      return null;
    }
    return session;
  },
  getCurrentUser() {
    const session = this.getSession();
    if (!session) {
      return null;
    }
    const users = storage.get(USERS_KEY, []);
    return users.find((user) => user.id === session.userId) || null;
  },
};
