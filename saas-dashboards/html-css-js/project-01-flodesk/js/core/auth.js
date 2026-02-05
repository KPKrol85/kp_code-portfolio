import { storage } from '../utils/storage.js';

const SESSION_KEY = 'flowdesk_session_v1';

export const auth = {
  login({ email }) {
    const session = {
      email,
      name: 'Alicja Maj',
      role: 'Owner',
      lastLogin: new Date().toISOString()
    };
    storage.set(SESSION_KEY, session);
    return session;
  },
  logout() {
    storage.remove(SESSION_KEY);
  },
  getSession() {
    return storage.get(SESSION_KEY);
  },
  isAuthenticated() {
    return Boolean(storage.get(SESSION_KEY));
  }
};
