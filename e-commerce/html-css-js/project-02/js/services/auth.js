import { storage } from "./storage.js";
import { simpleHash } from "../utils/hash.js";

const USERS_KEY = "kp_users";
const SESSION_KEY = "kp_session";
const RETURN_TO_KEY = "kp_returnTo";

const createToken = () => Math.random().toString(36).slice(2);

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role || "user",
  createdAt: user.createdAt,
});

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
      role: "user",
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
      user: toPublicUser(user),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    storage.set(SESSION_KEY, session);
    return { user: toPublicUser(user), session };
  },
  logout(store) {
    storage.remove(SESSION_KEY);
    storage.remove(RETURN_TO_KEY);
    if (store?.setState) {
      store.setState({ user: null, session: null });
    }
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
    return session.user || null;
  },
  setReturnTo(path) {
    if (!path) {
      return;
    }
    storage.set(RETURN_TO_KEY, path);
  },
  consumeReturnTo() {
    const value = storage.get(RETURN_TO_KEY, null);
    storage.remove(RETURN_TO_KEY);
    return value;
  },
};
