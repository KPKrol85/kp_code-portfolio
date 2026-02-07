import { TRACKS, WEEKDAY_LABELS } from '../data/progress.js';
import {
  exportProgressState,
  loadProgressState,
  resetProgressState,
  saveProgressState
} from '../state/storage.js';

const MAX_STREAK_DAYS = 60;

const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatShortDate = (date) =>
  date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });

const getWeekStart = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = (day + 6) % 7;
  start.setDate(start.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

const getWeekDates = (date) => {
  const start = getWeekStart(date);
  return Array.from({ length: 7 }, (_, index) => {
    const next = new Date(start);
    next.setDate(start.getDate() + index);
    return next;
  });
};

const countWeekCheckIns = (checkIns, weekDates, trackId) =>
  weekDates.reduce((total, date) => {
    const key = toLocalDateKey(date);
    return total + (checkIns[key]?.[trackId] ? 1 : 0);
  }, 0);

const hasAnyActivity = (checkIns, dateKey) => {
  const entry = checkIns[dateKey];
  if (!entry) return false;
  return Object.values(entry).some(Boolean);
};

const calculateStreak = (checkIns) => {
  let streak = 0;
  const today = new Date();
  for (let offset = 0; offset < MAX_STREAK_DAYS; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const key = toLocalDateKey(date);
    if (!hasAnyActivity(checkIns, key)) break;
    streak += 1;
  }
  return streak;
};

const buildGoalOptions = (selected) =>
  Array.from({ length: 7 }, (_, index) => {
    const value = index + 1;
    return `<option value="${value}" ${value === selected ? 'selected' : ''}>${value}</option>`;
  }).join('');

const renderTracks = ({ container, state, todayKey, weekDates }) => {
  container.innerHTML = TRACKS.map((track) => {
    const goal = state.goals[track.id];
    const todayDone = state.checkIns[todayKey]?.[track.id] === true;
    const weekCount = countWeekCheckIns(state.checkIns, weekDates, track.id);

    return `
      <article class="card card--soft progress-card">
        <div class="progress-card__header">
          <h3 class="card__title">${track.label}</h3>
          <p class="card__text">${track.description}</p>
        </div>
        <div class="progress-card__controls">
          <label class="form__label" for="goal-${track.id}">Cel tygodniowy (sesje)</label>
          <select
            id="goal-${track.id}"
            class="form__input"
            data-goal-select
            data-track-id="${track.id}"
            data-focus-id="goal-${track.id}"
          >
            ${buildGoalOptions(goal)}
          </select>
          <div class="progress-card__checkin">
            <span class="progress-card__label">Dziś:</span>
            <button
              class="button button--ghost progress-card__toggle"
              type="button"
              aria-pressed="${todayDone}"
              data-checkin-toggle
              data-track-id="${track.id}"
              data-focus-id="checkin-${track.id}"
            >
              <span aria-hidden="true">${todayDone ? '✓' : '○'}</span>
              <span>${todayDone ? 'Wykonane' : 'Nie'}</span>
            </button>
          </div>
        </div>
        <p class="progress-card__summary">W tym tygodniu: ${weekCount}/${goal}</p>
      </article>
    `;
  }).join('');
};

const renderWeekGrid = ({ container, state, weekDates }) => {
  const headerCells = weekDates
    .map((date, index) => {
      const label = WEEKDAY_LABELS[index];
      return `
        <th scope="col">
          <span class="progress-week__day">${label}</span>
          <span class="progress-week__date">${formatShortDate(date)}</span>
        </th>
      `;
    })
    .join('');

  const bodyRows = TRACKS.map((track) => {
    const cells = weekDates
      .map((date) => {
        const key = toLocalDateKey(date);
        const done = state.checkIns[key]?.[track.id] === true;
        return `
          <td class="progress-week__cell">
            <span class="progress-week__dot ${done ? 'is-done' : ''}" aria-hidden="true"></span>
            <span class="sr-only">${done ? 'Wykonane' : 'Brak'}</span>
          </td>
        `;
      })
      .join('');

    return `
      <tr>
        <th scope="row" class="progress-week__track">${track.label}</th>
        ${cells}
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="progress-week">
      <table class="progress-week__table">
        <thead>
          <tr>
            <th scope="col">Track</th>
            ${headerCells}
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </div>
  `;
};

const renderStats = ({ container, state, weekDates }) => {
  const trackCards = TRACKS.map((track) => {
    const goal = state.goals[track.id];
    const count = countWeekCheckIns(state.checkIns, weekDates, track.id);
    const percent = Math.min(Math.round((count / goal) * 100), 100);

    return `
      <article class="card card--soft progress-stat">
        <h3 class="card__title">${track.label}</h3>
        <p class="progress-stat__value">${percent}%</p>
        <p class="card__text">Realizacja celu tygodniowego (${count}/${goal}).</p>
      </article>
    `;
  }).join('');

  const streak = calculateStreak(state.checkIns);

  container.innerHTML = `
    <div class="grid grid--cards">
      ${trackCards}
      <article class="card card--soft progress-stat">
        <h3 class="card__title">Streak</h3>
        <p class="progress-stat__value">${streak} dni</p>
        <p class="card__text">Dni z przynajmniej jedną aktywnością z rzędu.</p>
      </article>
    </div>
  `;
};

export const initProgressPage = () => {
  const root = document.querySelector('#progress-root');
  if (!root) return;

  let state = loadProgressState();
  let statusTimeout;

  const statusEl = root.querySelector('[data-progress-status]');
  const tracksContainer = root.querySelector('[data-progress-tracks]');
  const weekContainer = root.querySelector('[data-progress-week]');
  const statsContainer = root.querySelector('[data-progress-stats]');

  const setStatus = (message) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    if (statusTimeout) window.clearTimeout(statusTimeout);
    statusTimeout = window.setTimeout(() => {
      statusEl.textContent = '';
    }, 2500);
  };

  const render = () => {
    const todayKey = toLocalDateKey(new Date());
    const weekDates = getWeekDates(new Date());
    const activeFocusId = document.activeElement?.dataset?.focusId;

    if (tracksContainer) {
      renderTracks({ container: tracksContainer, state, todayKey, weekDates });
    }
    if (weekContainer) {
      renderWeekGrid({ container: weekContainer, state, weekDates });
    }
    if (statsContainer) {
      renderStats({ container: statsContainer, state, weekDates });
    }

    if (activeFocusId) {
      const nextFocus = root.querySelector(`[data-focus-id="${activeFocusId}"]`);
      if (nextFocus) nextFocus.focus();
    }
  };

  const handleGoalChange = (event) => {
    const select = event.target.closest('[data-goal-select]');
    if (!select) return;
    const trackId = select.dataset.trackId;
    const value = Number(select.value);
    if (!trackId || !Number.isInteger(value)) return;
    state = saveProgressState({
      ...state,
      goals: {
        ...state.goals,
        [trackId]: value
      }
    });
    render();
    setStatus('Zaktualizowano cel tygodniowy.');
  };

  const handleToggle = (event) => {
    const button = event.target.closest('[data-checkin-toggle]');
    if (!button) return;
    const trackId = button.dataset.trackId;
    if (!trackId) return;
    const todayKey = toLocalDateKey(new Date());
    const currentEntry = state.checkIns[todayKey] ?? {};
    const isDone = currentEntry[trackId] === true;

    const nextCheckIns = {
      ...state.checkIns,
      [todayKey]: {
        ...currentEntry,
        [trackId]: !isDone
      }
    };

    state = saveProgressState({
      ...state,
      checkIns: nextCheckIns
    });
    render();
    setStatus(isDone ? 'Cofnięto dzisiejszy check-in.' : 'Zapisano dzisiejszy check-in.');
  };

  const handleReset = () => {
    const confirmed = window.confirm('Czy na pewno chcesz wyczyścić wszystkie dane postępów?');
    if (!confirmed) return;
    resetProgressState();
    state = loadProgressState();
    render();
    setStatus('Dane zostały wyczyszczone.');
  };

  const handleExport = () => {
    const json = exportProgressState(state);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `postepy-${toLocalDateKey(new Date())}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Wyeksportowano dane do pliku JSON.');
  };

  root.addEventListener('change', handleGoalChange);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-progress-action]');
    if (action) {
      if (action.dataset.progressAction === 'reset') {
        handleReset();
      }
      if (action.dataset.progressAction === 'export') {
        handleExport();
      }
    }
    handleToggle(event);
  });

  render();
};
