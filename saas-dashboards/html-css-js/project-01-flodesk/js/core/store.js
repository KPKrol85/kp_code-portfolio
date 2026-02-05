import { seedData } from '../data/seed.js';
import { storage } from '../utils/storage.js';

const STORAGE_KEY = 'flowdesk_state_v1';

let state = storage.get(STORAGE_KEY, seedData);

const listeners = new Set();

const persist = () => storage.set(STORAGE_KEY, state);

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

const setState = (partial) => {
  state = { ...state, ...partial };
  persist();
  notify();
};

const updateCollection = (key, items) => {
  state = { ...state, [key]: items };
  persist();
  notify();
};

const createId = (prefix) => {
  if (crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

export const store = {
  getState() {
    return state;
  },
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  reset() {
    state = seedData;
    persist();
    notify();
  },
  export() {
    return JSON.stringify(state, null, 2);
  },
  setTheme(theme) {
    setState({ ui: { ...state.ui, theme } });
  },
  setReducedMotion(value) {
    setState({ ui: { ...state.ui, reducedMotion: value } });
  },
  addClient(payload) {
    const newClient = { id: createId('client'), ...payload };
    updateCollection('clients', [...state.clients, newClient]);
    return newClient;
  },
  updateClient(id, payload) {
    updateCollection(
      'clients',
      state.clients.map((client) => (client.id === id ? { ...client, ...payload } : client))
    );
  },
  deleteClient(id) {
    updateCollection('clients', state.clients.filter((client) => client.id !== id));
    updateCollection('projects', state.projects.filter((project) => project.clientId !== id));
  },
  addProject(payload) {
    const newProject = { id: createId('project'), ...payload };
    updateCollection('projects', [...state.projects, newProject]);
    return newProject;
  },
  updateProject(id, payload) {
    updateCollection(
      'projects',
      state.projects.map((project) => (project.id === id ? { ...project, ...payload } : project))
    );
  },
  deleteProject(id) {
    updateCollection('projects', state.projects.filter((project) => project.id !== id));
  },
  addEvent(payload) {
    const newEvent = { id: createId('event'), ...payload };
    updateCollection('events', [...state.events, newEvent]);
    return newEvent;
  },
  deleteEvent(id) {
    updateCollection('events', state.events.filter((event) => event.id !== id));
  }
};
