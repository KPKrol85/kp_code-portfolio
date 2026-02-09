import { DEFAULT_GOALS, STORAGE_KEY, TRACKS } from '../data/progress.js';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAYS_TO_KEEP = 14;

const getTrackIds = () => TRACKS.map((track) => track.id);

const createDefaultState = () => ({
  goals: { ...DEFAULT_GOALS },
  checkIns: {},
  updatedAt: new Date().toISOString()
});

const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDateKey = (key) => {
  if (!DATE_KEY_PATTERN.test(key)) return null;
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

const sanitizeGoals = (goals) => {
  const sanitized = { ...DEFAULT_GOALS };
  if (!goals || typeof goals !== 'object') return sanitized;
  const trackIds = getTrackIds();
  trackIds.forEach((trackId) => {
    const value = Number(goals[trackId]);
    if (Number.isInteger(value) && value >= 1 && value <= 7) {
      sanitized[trackId] = value;
    }
  });
  return sanitized;
};

const sanitizeCheckIns = (checkIns) => {
  const sanitized = {};
  if (!checkIns || typeof checkIns !== 'object') return sanitized;
  const trackIds = getTrackIds();

  Object.entries(checkIns).forEach(([dateKey, entries]) => {
    if (!DATE_KEY_PATTERN.test(dateKey) || typeof entries !== 'object') return;
    const cleanEntry = {};
    trackIds.forEach((trackId) => {
      if (typeof entries[trackId] === 'boolean') {
        cleanEntry[trackId] = entries[trackId];
      }
    });
    sanitized[dateKey] = cleanEntry;
  });

  return sanitized;
};

const pruneCheckIns = (checkIns) => {
  const today = new Date();
  const earliest = new Date(today);
  earliest.setDate(today.getDate() - (MAX_DAYS_TO_KEEP - 1));

  const pruned = {};
  Object.entries(checkIns).forEach(([dateKey, value]) => {
    const date = parseLocalDateKey(dateKey);
    if (!date) return;
    if (date >= earliest) {
      pruned[dateKey] = value;
    }
  });
  return pruned;
};

const normalizeState = (state) => {
  const safeState = state && typeof state === 'object' ? state : {};
  const goals = sanitizeGoals(safeState.goals);
  const checkIns = pruneCheckIns(sanitizeCheckIns(safeState.checkIns));

  return {
    goals,
    checkIns,
    updatedAt: new Date().toISOString()
  };
};

export const loadProgressState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch (error) {
    return createDefaultState();
  }
};

export const saveProgressState = (state) => {
  const normalized = normalizeState(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const resetProgressState = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportProgressState = (state) =>
  JSON.stringify({
    ...state,
    updatedAt: new Date().toISOString(),
    exportedAt: new Date().toISOString()
  }, null, 2);

export const getRecentDateKeys = (days) => {
  const result = [];
  const today = new Date();
  for (let i = 0; i < days; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    result.push(toLocalDateKey(date));
  }
  return result;
};
