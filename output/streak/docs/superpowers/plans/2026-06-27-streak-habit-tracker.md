# Streak Habit Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A local-only habit tracker — add habits, mark done today, see a flame streak, delete — that persists across refresh, plus a dev-only clock to simulate days.

**Architecture:** A single `App` owns `habits` and `today` state and persists them to localStorage. Streak math lives in a pure, unit-tested `lib/streak.js`. Persistence lives in `lib/storage.js`. Each piece of UI (AddHabit, HabitList/HabitRow, DevClock) is a self-contained component built against a fixed prop contract, so all of Wave 1 is built in parallel and `App` (Wave 2) wires them together.

**Tech Stack:** React 19, Vite, Tailwind 4, browser localStorage. Tests run on Node's built-in `node:test` runner (zero new dependencies).

## Global Constraints

- Stack is fixed: React 19 + Vite + Tailwind 4. No backend, no accounts, **no new npm dependencies**.
- Persistence is browser localStorage only. Key `streak.habits` for habits, key `streak.devDate` for the simulated date.
- Dates are `"YYYY-MM-DD"` strings everywhere.
- IDs via the browser built-in `crypto.randomUUID()` (no dependency).
- Tests run with `node --test` against `*.test.js` files (Node built-in `node:test` + `node:assert`). No test framework is installed or added.
- The dev clock UI must be gated behind `import.meta.env.DEV` so it is absent from production builds.
- Flame cap constant is `7`.
- Build out of scope: accounts, sync, charts, reminders, categories, notifications, renaming a habit, marking arbitrary past days done (other than via the dev clock).

## Shared Contracts (every task builds against these exact signatures)

**`src/lib/streak.js`** exports:
- `todayStr(date = new Date()) -> "YYYY-MM-DD"` — local-date string for a `Date`.
- `addDays(dateStr, n) -> "YYYY-MM-DD"` — `dateStr` shifted by `n` days (n may be negative).
- `computeStreak(completedDates, today) -> number` — `completedDates: string[]`, `today: "YYYY-MM-DD"`. Returns the count of consecutive completed days ending at `today`, or ending at yesterday if `today` is not yet done. `0` if neither today nor yesterday is done.

**`src/lib/storage.js`** exports:
- `loadHabits() -> Habit[]` — reads `streak.habits`; returns `[]` on missing/corrupt.
- `saveHabits(habits) -> void` — writes `streak.habits`.
- `loadDevDate() -> string | null` — reads `streak.devDate`; `null` if absent.
- `saveDevDate(dateStr | null) -> void` — writes `streak.devDate`; `null` removes the key.

**`Habit` shape:** `{ id: string, name: string, completedDates: string[] }`

**Component prop contracts:**
- `AddHabit({ onAdd })` — `onAdd(name: string)`. Trims; ignores empty.
- `HabitList({ habits, today, onToggle, onDelete })` — maps to `HabitRow`.
- `HabitRow({ habit, today, onToggle, onDelete })` — `onToggle(id)`, `onDelete(id)`. Done-today = `habit.completedDates.includes(today)`.
- `DevClock({ today, onSetDate, onAdvance, onReset })` — `onSetDate(dateStr)`, `onAdvance()`, `onReset()`. Renders only under `import.meta.env.DEV`.

---

## Parallel Execution

- **Wave 1 (parallel):** Tasks 1–5. Each creates its own disjoint files (`lib/streak.js`, `lib/storage.js`, `components/AddHabit.jsx`, `components/HabitList.jsx`+`HabitRow.jsx`, `components/DevClock.jsx`). No task in Wave 1 imports another Wave-1 task's file, so they have no ordering dependency and can run concurrently.
- **Wave 2 (after Wave 1 completes):** Task 6 rewrites `App.jsx` to import and wire all five. It is the only join point.

---

### Task 1: Streak math (`lib/streak.js`)

**Files:**
- Create: `src/lib/streak.js`
- Test: `src/lib/streak.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `todayStr(date?)`, `addDays(dateStr, n)`, `computeStreak(completedDates, today)` as specified in Shared Contracts.

- [ ] **Step 1: Write the failing test**

```js
// src/lib/streak.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays, computeStreak, todayStr } from './streak.js';

test('addDays shifts across month boundary', () => {
  assert.equal(addDays('2026-01-31', 1), '2026-02-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
});

test('todayStr formats a Date as YYYY-MM-DD', () => {
  assert.equal(todayStr(new Date(2026, 5, 27)), '2026-06-27');
});

test('consecutive days ending today count up', () => {
  const dates = ['2026-06-25', '2026-06-26', '2026-06-27'];
  assert.equal(computeStreak(dates, '2026-06-27'), 3);
});

test('a gap resets the streak', () => {
  const dates = ['2026-06-23', '2026-06-25', '2026-06-26', '2026-06-27'];
  assert.equal(computeStreak(dates, '2026-06-27'), 3);
});

test('today undone but yesterday done shows yesterday count', () => {
  const dates = ['2026-06-25', '2026-06-26'];
  assert.equal(computeStreak(dates, '2026-06-27'), 2);
});

test('neither today nor yesterday done is 0', () => {
  const dates = ['2026-06-20'];
  assert.equal(computeStreak(dates, '2026-06-27'), 0);
});

test('streak above the flame cap still computes true N', () => {
  const dates = Array.from({ length: 10 }, (_, i) => addDays('2026-06-27', -i));
  assert.equal(computeStreak(dates, '2026-06-27'), 10);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/lib/streak.test.js`
Expected: FAIL — cannot import `./streak.js` / functions not defined.

- [ ] **Step 3: Write minimal implementation**

```js
// src/lib/streak.js
export function todayStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + n);
  return todayStr(date);
}

export function computeStreak(completedDates, today) {
  const done = new Set(completedDates);
  let cursor = done.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (done.has(cursor)) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/lib/streak.test.js`
Expected: PASS (all tests).

- [ ] **Step 5: Commit** (skip if repo is not git-initialized)

```bash
git add src/lib/streak.js src/lib/streak.test.js
git commit -m "feat: pure streak math with tests"
```

---

### Task 2: Persistence (`lib/storage.js`)

**Files:**
- Create: `src/lib/storage.js`
- Test: `src/lib/storage.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `loadHabits()`, `saveHabits(habits)`, `loadDevDate()`, `saveDevDate(dateStr|null)` as specified in Shared Contracts.

- [ ] **Step 1: Write the failing test**

`localStorage` does not exist in Node, so the test installs a tiny in-memory stub on `globalThis` before importing.

```js
// src/lib/storage.test.js
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

globalThis.localStorage = {
  _d: {},
  getItem(k) { return k in this._d ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); },
  removeItem(k) { delete this._d[k]; },
};

const { loadHabits, saveHabits, loadDevDate, saveDevDate } =
  await import('./storage.js');

beforeEach(() => { globalThis.localStorage._d = {}; });

test('loadHabits returns [] when nothing stored', () => {
  assert.deepEqual(loadHabits(), []);
});

test('saveHabits then loadHabits round-trips', () => {
  const habits = [{ id: 'a', name: 'Read', completedDates: ['2026-06-27'] }];
  saveHabits(habits);
  assert.deepEqual(loadHabits(), habits);
});

test('loadHabits returns [] on corrupt JSON', () => {
  globalThis.localStorage.setItem('streak.habits', '{not json');
  assert.deepEqual(loadHabits(), []);
});

test('dev date round-trips and clears with null', () => {
  saveDevDate('2026-06-30');
  assert.equal(loadDevDate(), '2026-06-30');
  saveDevDate(null);
  assert.equal(loadDevDate(), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/lib/storage.test.js`
Expected: FAIL — cannot import `./storage.js`.

- [ ] **Step 3: Write minimal implementation**

```js
// src/lib/storage.js
const HABITS_KEY = 'streak.habits';
const DEV_DATE_KEY = 'streak.devDate';

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/lib/storage.test.js`
Expected: PASS.

- [ ] **Step 5: Commit** (skip if repo is not git-initialized)

```bash
git add src/lib/storage.js src/lib/storage.test.js
git commit -m "feat: localStorage persistence helpers with tests"
```

---

### Task 3: Add-habit form (`components/AddHabit.jsx`)

**Files:**
- Create: `src/components/AddHabit.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: default export `AddHabit({ onAdd })`. Calls `onAdd(trimmedName)` on submit; clears the input; ignores empty/whitespace names.

No automated test (UI; verified by hand via the running app in Task 6).

- [ ] **Step 1: Write the component**

```jsx
// src/components/AddHabit.jsx
import { useState } from 'react';

export default function AddHabit({ onAdd }) {
  const [name, setName] = useState('');

  function submit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit…"
        className="flex-1 rounded-lg border border-neutral-300 px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        type="submit"
        className="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white
                   hover:bg-orange-600"
      >
        Add
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Verify it parses**

Run: `npx vite build` (or rely on the dev server in Task 6).
Expected: no build error referencing `AddHabit.jsx`.

- [ ] **Step 3: Commit** (skip if repo is not git-initialized)

```bash
git add src/components/AddHabit.jsx
git commit -m "feat: AddHabit form component"
```

---

### Task 4: Habit list, rows, and flames (`components/HabitList.jsx`, `components/HabitRow.jsx`)

**Files:**
- Create: `src/components/HabitRow.jsx`
- Create: `src/components/HabitList.jsx`

**Interfaces:**
- Consumes: `computeStreak` from `../lib/streak.js` (signature in Shared Contracts).
- Produces: default export `HabitList({ habits, today, onToggle, onDelete })` and default export `HabitRow({ habit, today, onToggle, onDelete })`.

No automated test (UI; verified by hand via the running app in Task 6).

- [ ] **Step 1: Write `HabitRow.jsx` (includes flame display, cap 7)**

```jsx
// src/components/HabitRow.jsx
import { computeStreak } from '../lib/streak.js';

const FLAME_CAP = 7;

function Flames({ streak }) {
  if (streak === 0) {
    return <span className="text-neutral-300">no streak yet</span>;
  }
  if (streak <= FLAME_CAP) {
    return <span className="tracking-tight">{'🔥'.repeat(streak)}</span>;
  }
  return <span className="tracking-tight">🔥×{streak}</span>;
}

export default function HabitRow({ habit, today, onToggle, onDelete }) {
  const streak = computeStreak(habit.completedDates, today);
  const doneToday = habit.completedDates.includes(today);

  return (
    <li className="flex items-center gap-3 rounded-lg border border-neutral-200
                   bg-white px-4 py-3">
      <div className="flex-1">
        <div className="font-medium">{habit.name}</div>
        <div className="text-sm"><Flames streak={streak} /></div>
      </div>
      <button
        onClick={() => onToggle(habit.id)}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
          doneToday
            ? 'bg-green-100 text-green-700'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
        }`}
      >
        {doneToday ? 'Done ✓' : 'Done today'}
      </button>
      <button
        onClick={() => onDelete(habit.id)}
        className="rounded-lg px-2 py-1.5 text-sm text-neutral-400
                   hover:text-red-500"
        aria-label={`Delete ${habit.name}`}
      >
        ✕
      </button>
    </li>
  );
}
```

- [ ] **Step 2: Write `HabitList.jsx`**

```jsx
// src/components/HabitList.jsx
import HabitRow from './HabitRow.jsx';

export default function HabitList({ habits, today, onToggle, onDelete }) {
  if (habits.length === 0) {
    return <p className="text-center text-neutral-400">No habits yet. Add one above.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          today={today}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Verify it parses**

Run: `npx vite build` (or rely on the dev server in Task 6).
Expected: no build error referencing `HabitList.jsx` / `HabitRow.jsx`.

- [ ] **Step 4: Commit** (skip if repo is not git-initialized)

```bash
git add src/components/HabitRow.jsx src/components/HabitList.jsx
git commit -m "feat: HabitList and HabitRow with flame streak display"
```

---

### Task 5: Dev clock (`components/DevClock.jsx`)

**Files:**
- Create: `src/components/DevClock.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces: default export `DevClock({ today, onSetDate, onAdvance, onReset })`. The parent renders it only under `import.meta.env.DEV`; the component itself assumes it is in dev.

No automated test (UI; verified by hand via the running app in Task 6).

- [ ] **Step 1: Write the component**

```jsx
// src/components/DevClock.jsx
export default function DevClock({ today, onSetDate, onAdvance, onReset }) {
  return (
    <div className="rounded-lg border border-dashed border-amber-400
                    bg-amber-50 px-4 py-3 text-sm">
      <div className="mb-2 font-semibold text-amber-700">
        Dev clock — simulated today: {today}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={today}
          onChange={(e) => onSetDate(e.target.value)}
          className="rounded border border-amber-300 px-2 py-1"
        />
        <button
          onClick={onAdvance}
          className="rounded bg-amber-500 px-3 py-1 font-medium text-white
                     hover:bg-amber-600"
        >
          +1 Day
        </button>
        <button
          onClick={onReset}
          className="rounded bg-white px-3 py-1 font-medium text-amber-700
                     ring-1 ring-amber-300 hover:bg-amber-100"
        >
          Reset to real today
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it parses**

Run: `npx vite build` (or rely on the dev server in Task 6).
Expected: no build error referencing `DevClock.jsx`.

- [ ] **Step 3: Commit** (skip if repo is not git-initialized)

```bash
git add src/components/DevClock.jsx
git commit -m "feat: dev-only clock controls"
```

---

### Task 6 (Wave 2): Wire it together in `App.jsx`

**Files:**
- Modify: `src/App.jsx` (full rewrite of the placeholder)

**Interfaces:**
- Consumes: everything from Tasks 1–5 — `loadHabits/saveHabits/loadDevDate/saveDevDate` (`lib/storage.js`), `todayStr/addDays` (`lib/streak.js`), and the four components.
- Produces: the running app.

- [ ] **Step 1: Rewrite `App.jsx`**

```jsx
// src/App.jsx
import { useEffect, useState } from 'react';
import { addDays, todayStr } from './lib/streak.js';
import {
  loadHabits, saveHabits, loadDevDate, saveDevDate,
} from './lib/storage.js';
import AddHabit from './components/AddHabit.jsx';
import HabitList from './components/HabitList.jsx';
import DevClock from './components/DevClock.jsx';

export default function App() {
  const [habits, setHabits] = useState(loadHabits);
  const [devDate, setDevDate] = useState(loadDevDate);

  const today = devDate ?? todayStr();

  useEffect(() => { saveHabits(habits); }, [habits]);
  useEffect(() => { saveDevDate(devDate); }, [devDate]);

  function addHabit(name) {
    setHabits((hs) => [
      ...hs,
      { id: crypto.randomUUID(), name, completedDates: [] },
    ]);
  }

  function toggleHabit(id) {
    setHabits((hs) =>
      hs.map((h) => {
        if (h.id !== id) return h;
        const done = h.completedDates.includes(today);
        return {
          ...h,
          completedDates: done
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        };
      }),
    );
  }

  function deleteHabit(id) {
    setHabits((hs) => hs.filter((h) => h.id !== id));
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Streak</h1>
          <p className="mt-1 text-neutral-500">a habit tracker</p>
        </header>

        {import.meta.env.DEV && (
          <DevClock
            today={today}
            onSetDate={(d) => setDevDate(d)}
            onAdvance={() => setDevDate(addDays(today, 1))}
            onReset={() => setDevDate(null)}
          />
        )}

        <AddHabit onAdd={addHabit} />
        <HabitList
          habits={habits}
          today={today}
          onToggle={toggleHabit}
          onDelete={deleteHabit}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run the app and verify by hand**

Run: `npm run dev`, open http://localhost:5173

Verify:
1. Add a habit → it appears with "no streak yet".
2. Click "Done today" → button shows "Done ✓", one 🔥 appears.
3. Dev clock "+1 Day", then "Done today" again → 🔥🔥 (streak 2).
4. "+1 Day" twice without marking done, then check the habit → streak shows "no streak yet" / 0 (gap reset).
5. Build a streak past 7 days → display collapses to "🔥×N".
6. Refresh the page → habits and completion state persist.
7. Delete a habit → it disappears and stays gone after refresh.
8. "Reset to real today" → simulated date returns to the real date.

- [ ] **Step 3: Confirm the full test suite passes**

Run: `node --test src/lib/*.test.js`  (use the glob — `node --test src/lib/` tries to execute the directory as a module on Node 24)
Expected: all streak + storage tests PASS (11 total).

- [ ] **Step 4: Commit** (skip if repo is not git-initialized)

```bash
git add src/App.jsx
git commit -m "feat: wire habits, persistence, flames, and dev clock into App"
```

---

## Self-Review Notes

- **Spec coverage:** add habit (Task 3/6), toggle done today (Task 4/6), streak rule (Task 1), flame display cap 7 (Task 4), delete (Task 4/6), persistence (Task 2/6), dev clock +1/picker/reset gated to DEV (Task 5/6). All covered.
- **Type consistency:** `computeStreak(completedDates, today)`, `addDays(dateStr, n)`, `todayStr(date?)`, and the four prop contracts are used identically across tasks.
- **No new dependencies:** tests use Node built-in `node:test`; IDs use built-in `crypto.randomUUID()`.
- **Parallelism:** Wave 1 (Tasks 1–5) writes disjoint files with no cross-imports; Wave 2 (Task 6) is the sole integration point.
```

