const HABITS_KEY = 'streak.habits';
const DEV_DATE_KEY = 'streak.devDate';

function normalizeHabit(h) {
  if (!h || typeof h !== 'object') return null;
  if (typeof h.name !== 'string') return null;
  return {
    id: typeof h.id === 'string' ? h.id : crypto.randomUUID(),
    name: h.name,
    completedDates: Array.isArray(h.completedDates) ? h.completedDates : [],
  };
}

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeHabit).filter(Boolean);
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function loadDevDate() {
  return localStorage.getItem(DEV_DATE_KEY);
}

export function saveDevDate(dateStr) {
  if (dateStr == null) localStorage.removeItem(DEV_DATE_KEY);
  else localStorage.setItem(DEV_DATE_KEY, dateStr);
}
