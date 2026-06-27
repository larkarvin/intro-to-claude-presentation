# Streak Habit Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Streak MVP (add, toggle done-today, derived streak, delete, persist) into the existing blank scaffold, plus a dev-only date simulator.

**Architecture:** A single `App` owns `habits` and `simDate` state and persists both to localStorage. All "what day is it" questions route through one `getToday()` function so a dev date simulator can drive every streak and toggle. The streak number is derived (never stored) from each habit's `doneDates` via a pure function.

**Tech Stack:** React 19, Vite 8, Tailwind v4, browser localStorage. No backend, no new dependencies.

## Global Constraints

- Stack is fixed: React + Vite + Tailwind. No new dependencies.
- Persistence is browser localStorage only. No backend, no accounts, no sync.
- localStorage keys: `streak.habits` (real data), `streak.devDate` (dev-only sim date).
- All dates are local-time `"YYYY-MM-DD"` strings. Never use UTC date parts.
- The date simulator must only render/run under `import.meta.env.DEV`. The `streak.devDate` key must never be read in production.
- Streak = consecutive days ending at today, with a grace window for "yesterday done, today not marked yet."
- Do not build: accounts, sync, charts, reminders, categories, notifications.

---

### Task 1: Date utilities (`lib/date.js`)

**Files:**
- Create: `src/lib/date.js`
- Test: `src/lib/date.check.mjs` (throwaway node assertion script, not shipped runtime code)

**Interfaces:**
- Produces:
  - `toKey(date: Date) => string` — local-time `"YYYY-MM-DD"`.
  - `keyToDate(key: string) => Date` — local midnight Date from a `"YYYY-MM-DD"` key.
  - `addDays(key: string, n: number) => string` — key shifted by `n` days.
  - `getToday() => string` — effective today key. In dev, returns `localStorage["streak.devDate"]` if set, else real today. In prod, always real today.

- [ ] **Step 1: Write the assertion script**

Create `src/lib/date.check.mjs`:

```js
import assert from 'node:assert/strict'
import { toKey, keyToDate, addDays } from './date.js'

// toKey formats local date parts, zero-padded
const d = new Date(2026, 0, 5) // Jan 5 2026 local
assert.equal(toKey(d), '2026-01-05')

// keyToDate round-trips
assert.equal(toKey(keyToDate('2026-01-05')), '2026-01-05')

// addDays crosses month/year boundaries
assert.equal(addDays('2026-01-31', 1), '2026-02-01')
assert.equal(addDays('2026-12-31', 1), '2027-01-01')
assert.equal(addDays('2026-03-01', -1), '2026-02-28')

console.log('date.js OK')
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node src/lib/date.check.mjs`
Expected: FAIL — `Cannot find module './date.js'` (or import error).

- [ ] **Step 3: Implement `src/lib/date.js`**

```js
const DEV_DATE_KEY = 'streak.devDate'

export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key, n) {
  const date = keyToDate(key)
  date.setDate(date.getDate() + n)
  return toKey(date)
}

export function getToday() {
  const real = toKey(new Date())
  if (import.meta.env.DEV) {
    const sim = localStorage.getItem(DEV_DATE_KEY)
    if (sim) return sim
  }
  return real
}
```

Note: `date.check.mjs` imports only the pure helpers (`toKey`, `keyToDate`, `addDays`), not `getToday` (which touches `import.meta.env`/`localStorage`).

- [ ] **Step 4: Run it to verify it passes**

Run: `node src/lib/date.check.mjs`
Expected: PASS — prints `date.js OK`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/date.js src/lib/date.check.mjs
git commit -m "feat: add local-date utilities and getToday"
```

---

### Task 2: Streak computation (`lib/streak.js`)

**Files:**
- Create: `src/lib/streak.js`
- Test: `src/lib/streak.check.mjs` (throwaway node assertion script)

**Interfaces:**
- Consumes: `addDays` from `lib/date.js`.
- Produces: `computeStreak(doneDates: string[], today: string) => number`.

- [ ] **Step 1: Write the assertion script**

Create `src/lib/streak.check.mjs`:

```js
import assert from 'node:assert/strict'
import { computeStreak } from './streak.js'

const today = '2026-06-27'

// no dates -> 0
assert.equal(computeStreak([], today), 0)

// done today + 4 prior consecutive days -> 5
assert.equal(
  computeStreak(
    ['2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27'],
    today
  ),
  5
)

// done yesterday, not today yet (grace) -> counts from yesterday
assert.equal(computeStreak(['2026-06-25', '2026-06-26'], today), 2)

// gap breaks the chain below the gap (only today counts)
assert.equal(computeStreak(['2026-06-24', '2026-06-27'], today), 1)

// neither today nor yesterday -> 0 even if older run exists
assert.equal(computeStreak(['2026-06-20', '2026-06-21'], today), 0)

// order/duplicates don't matter
assert.equal(computeStreak(['2026-06-27', '2026-06-27', '2026-06-26'], today), 2)

console.log('streak.js OK')
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node src/lib/streak.check.mjs`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/streak.js`**

```js
import { addDays } from './date.js'

export function computeStreak(doneDates, today) {
  const done = new Set(doneDates)

  let cursor
  if (done.has(today)) {
    cursor = today
  } else if (done.has(addDays(today, -1))) {
    cursor = addDays(today, -1)
  } else {
    return 0
  }

  let count = 0
  while (done.has(cursor)) {
    count += 1
    cursor = addDays(cursor, -1)
  }
  return count
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `node src/lib/streak.check.mjs`
Expected: PASS — prints `streak.js OK`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/streak.js src/lib/streak.check.mjs
git commit -m "feat: add computeStreak with grace window"
```

---

### Task 3: Storage helpers (`lib/storage.js`)

**Files:**
- Create: `src/lib/storage.js`

**Interfaces:**
- Produces:
  - `loadHabits() => Habit[]` — parse `streak.habits`; `[]` on missing/corrupt.
  - `saveHabits(habits: Habit[]) => void`.
  - `loadDevDate() => string | null` — read `streak.devDate`.
  - `saveDevDate(key: string | null) => void` — write key, or remove if `null`.
  - `Habit` shape: `{ id: string, name: string, doneDates: string[] }`.

- [ ] **Step 1: Implement `src/lib/storage.js`**

```js
const HABITS_KEY = 'streak.habits'
const DEV_DATE_KEY = 'streak.devDate'

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function loadDevDate() {
  return localStorage.getItem(DEV_DATE_KEY)
}

export function saveDevDate(key) {
  if (key) localStorage.setItem(DEV_DATE_KEY, key)
  else localStorage.removeItem(DEV_DATE_KEY)
}
```

- [ ] **Step 2: Verify it parses in the browser console (no UI yet)**

Run: `npm run dev`, open http://localhost:5173, open devtools console, run:

```js
localStorage.setItem('streak.habits', 'not json')
```

Then reload and in console paste:

```js
const m = await import('/src/lib/storage.js'); m.loadHabits()
```

Expected: returns `[]` (corrupt data does not throw). Clean up: `localStorage.removeItem('streak.habits')`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/storage.js
git commit -m "feat: add localStorage helpers for habits and dev date"
```

---

### Task 4: Add / list / delete habits + persistence

**Files:**
- Create: `src/components/AddHabit.jsx`
- Create: `src/components/HabitItem.jsx`
- Create: `src/components/HabitList.jsx`
- Modify: `src/App.jsx` (replace placeholder)

**Interfaces:**
- Consumes: `loadHabits`, `saveHabits` from `lib/storage.js`.
- `AddHabit` props: `{ onAdd(name: string): void }`.
- `HabitList` props: `{ habits: Habit[], onDelete(id): void }`.
- `HabitItem` props: `{ habit: Habit, onDelete(id): void }`.
- Produces: `App` holds `habits` state and an `addHabit(name)` / `deleteHabit(id)` pair. Later tasks add a `toggleDone(id)` prop into `HabitItem`.

- [ ] **Step 1: Implement `src/components/AddHabit.jsx`**

```jsx
import { useState } from 'react'

export default function AddHabit({ onAdd }) {
  const [name, setName] = useState('')
  const trimmed = name.trim()

  function submit(e) {
    e.preventDefault()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New habit"
        className="flex-1 rounded border border-neutral-300 px-3 py-2"
      />
      <button
        type="submit"
        disabled={!trimmed}
        className="rounded bg-neutral-900 px-4 py-2 text-white disabled:opacity-40"
      >
        Add
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Implement `src/components/HabitItem.jsx`**

```jsx
export default function HabitItem({ habit, onDelete }) {
  return (
    <li className="flex items-center justify-between rounded border border-neutral-200 px-3 py-2">
      <span className="font-medium">{habit.name}</span>
      <button
        onClick={() => onDelete(habit.id)}
        className="text-sm text-neutral-400 hover:text-red-600"
      >
        Delete
      </button>
    </li>
  )
}
```

- [ ] **Step 3: Implement `src/components/HabitList.jsx`**

```jsx
import HabitItem from './HabitItem.jsx'

export default function HabitList({ habits, onDelete }) {
  if (habits.length === 0) {
    return <p className="text-neutral-400">No habits yet. Add one above.</p>
  }
  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onDelete={onDelete} />
      ))}
    </ul>
  )
}
```

- [ ] **Step 4: Rewrite `src/App.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { loadHabits, saveHabits } from './lib/storage.js'
import AddHabit from './components/AddHabit.jsx'
import HabitList from './components/HabitList.jsx'

export default function App() {
  const [habits, setHabits] = useState(loadHabits)

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  function addHabit(name) {
    setHabits((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, doneDates: [] },
    ])
  }

  function deleteHabit(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Streak</h1>
        <p className="mt-1 text-neutral-500">a habit tracker</p>
        <div className="mt-8 flex flex-col gap-6">
          <AddHabit onAdd={addHabit} />
          <HabitList habits={habits} onDelete={deleteHabit} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run and verify in the browser**

Run: `npm run dev`, open http://localhost:5173.
Verify: (1) type a name, click Add — it appears in the list. (2) Add a second. (3) Click Delete on one — it disappears. (4) **Refresh the page — the remaining habits are still there.** (5) Empty/whitespace name — Add button is disabled.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/components/AddHabit.jsx src/components/HabitItem.jsx src/components/HabitList.jsx
git commit -m "feat: add, list, delete habits with persistence"
```

---

### Task 5: "Done today" toggle

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/HabitItem.jsx`
- Modify: `src/components/HabitList.jsx` (thread `onToggle` through)

**Interfaces:**
- Consumes: `getToday` from `lib/date.js`.
- `App` adds `toggleDone(id)`: adds/removes `getToday()` in that habit's `doneDates`.
- `HabitList` props gain `onToggle(id)`.
- `HabitItem` props gain `onToggle(id)` and computes `doneToday` from `habit.doneDates.includes(getToday())`.

- [ ] **Step 1: Add `toggleDone` to `src/App.jsx`**

Add the import:

```jsx
import { getToday } from './lib/date.js'
```

Add the handler inside `App` (after `deleteHabit`):

```jsx
  function toggleDone(id) {
    const today = getToday()
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const done = h.doneDates.includes(today)
        return {
          ...h,
          doneDates: done
            ? h.doneDates.filter((d) => d !== today)
            : [...h.doneDates, today],
        }
      })
    )
  }
```

Pass it down — replace the `<HabitList .../>` line:

```jsx
          <HabitList habits={habits} onDelete={deleteHabit} onToggle={toggleDone} />
```

- [ ] **Step 2: Thread `onToggle` through `src/components/HabitList.jsx`**

Replace the component body's signature and map call:

```jsx
export default function HabitList({ habits, onDelete, onToggle }) {
  if (habits.length === 0) {
    return <p className="text-neutral-400">No habits yet. Add one above.</p>
  }
  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </ul>
  )
}
```

- [ ] **Step 3: Add the toggle control to `src/components/HabitItem.jsx`**

```jsx
import { getToday } from '../lib/date.js'

export default function HabitItem({ habit, onDelete, onToggle }) {
  const doneToday = habit.doneDates.includes(getToday())

  return (
    <li className="flex items-center justify-between rounded border border-neutral-200 px-3 py-2">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(habit.id)}
          aria-pressed={doneToday}
          className={
            'h-6 w-6 rounded-full border ' +
            (doneToday
              ? 'border-green-600 bg-green-600 text-white'
              : 'border-neutral-300')
          }
        >
          {doneToday ? '✓' : ''}
        </button>
        <span className="font-medium">{habit.name}</span>
      </div>
      <button
        onClick={() => onDelete(habit.id)}
        className="text-sm text-neutral-400 hover:text-red-600"
      >
        Delete
      </button>
    </li>
  )
}
```

- [ ] **Step 4: Run and verify in the browser**

Run: `npm run dev`, open http://localhost:5173.
Verify: (1) click the circle next to a habit — it fills green with a check. (2) Click again — it empties. (3) Toggle done, **refresh — the done state persists.**

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/HabitList.jsx src/components/HabitItem.jsx
git commit -m "feat: toggle done-today per habit"
```

---

### Task 6: Show streak "N"

**Files:**
- Modify: `src/components/HabitItem.jsx`

**Interfaces:**
- Consumes: `computeStreak` from `lib/streak.js`, `getToday` from `lib/date.js`.

- [ ] **Step 1: Display the streak in `src/components/HabitItem.jsx`**

Add the import at the top:

```jsx
import { computeStreak } from '../lib/streak.js'
```

Inside the component, after `doneToday`:

```jsx
  const streak = computeStreak(habit.doneDates, getToday())
```

Replace the name `<span>` with name + streak badge:

```jsx
        <span className="font-medium">{habit.name}</span>
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-sm text-neutral-600">
          🔥 {streak}
        </span>
```

(Place both spans inside the existing left-hand `<div className="flex items-center gap-3">`.)

- [ ] **Step 2: Run and verify in the browser**

Run: `npm run dev`, open http://localhost:5173.
Verify: (1) a fresh habit shows `🔥 0`. (2) Mark it done today — it shows `🔥 1`. (3) Un-mark — back to `🔥 0`. (Multi-day streaks are verified in Task 7 with the date simulator.)

- [ ] **Step 3: Commit**

```bash
git add src/components/HabitItem.jsx
git commit -m "feat: show derived streak count per habit"
```

---

### Task 7: Dev-only date simulator (`DevDateBar`)

**Files:**
- Create: `src/components/DevDateBar.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `getToday`, `addDays` from `lib/date.js`; `loadDevDate`, `saveDevDate` from `lib/storage.js`.
- `App` adds `simDate` state (the override key or `null`) and a `setSim(key | null)` that writes through `saveDevDate` and forces re-render so streaks/toggles recompute.
- `DevDateBar` props: `{ today: string, onJump(key): void, onNextDay(): void, onReset(): void }`.
- Rendered only when `import.meta.env.DEV`.

- [ ] **Step 1: Implement `src/components/DevDateBar.jsx`**

```jsx
export default function DevDateBar({ today, onJump, onNextDay, onReset }) {
  return (
    <div className="rounded border border-dashed border-amber-400 bg-amber-50 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-amber-700">DEV</span>
        <span className="text-neutral-600">Simulated today:</span>
        <input
          type="date"
          value={today}
          onChange={(e) => e.target.value && onJump(e.target.value)}
          className="rounded border border-neutral-300 px-2 py-1"
        />
        <button
          onClick={onNextDay}
          className="rounded bg-amber-600 px-2 py-1 text-white"
        >
          +1 day
        </button>
        <button
          onClick={onReset}
          className="rounded border border-neutral-300 px-2 py-1"
        >
          Reset to real today
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire it into `src/App.jsx`**

Update imports:

```jsx
import { getToday, addDays } from './lib/date.js'
import { loadHabits, saveHabits, loadDevDate, saveDevDate } from './lib/storage.js'
import DevDateBar from './components/DevDateBar.jsx'
```

Add sim state (after the `habits` state):

```jsx
  const [simDate, setSimDate] = useState(loadDevDate)

  function setSim(key) {
    saveDevDate(key)
    setSimDate(key)
  }
```

Note: `getToday()` already reads `streak.devDate` from localStorage; `saveDevDate` is called before `setSimDate` so the re-render reads the fresh value. `simDate` state exists to trigger that re-render.

Add the bar at the top of the inner content (right after the `<p>` tagline, before the `AddHabit` block), guarded by the dev flag:

```jsx
        {import.meta.env.DEV && (
          <div className="mt-6">
            <DevDateBar
              today={getToday()}
              onJump={(key) => setSim(key)}
              onNextDay={() => setSim(addDays(getToday(), 1))}
              onReset={() => setSim(null)}
            />
          </div>
        )}
```

- [ ] **Step 3: Run and verify the full streak lifecycle in the browser**

Run: `npm run dev`, open http://localhost:5173.
Verify:
1. Add a habit, mark it done — `🔥 1`. The DEV bar shows today's date.
2. Click **+1 day** — streak still `🔥 1` (yesterday done, grace window), circle now empty (not done on the new day).
3. Mark done on the new day — `🔥 2`.
4. Click **+1 day** twice without marking — streak drops to `🔥 0` (gap of 2 breaks it).
5. Use the **calendar** to jump back to a done date — streak reflects that date.
6. **Refresh** — the simulated date persists (DEV bar still shows the traveled date).
7. Click **Reset to real today** — date returns to the real current date.

- [ ] **Step 4: Verify the simulator is absent in a production build**

Run: `npm run build && npm run preview`, open the preview URL.
Verify: the DEV bar is **not** rendered. In devtools console, `localStorage.getItem('streak.devDate')` is irrelevant — `getToday()` ignores it in prod. Habits, toggle, streak, delete, and refresh-persistence all still work.

- [ ] **Step 5: Commit**

```bash
git add src/components/DevDateBar.jsx src/App.jsx
git commit -m "feat: add dev-only date simulator for streak testing"
```

---

## Self-Review

**Spec coverage:**
- Add a habit → Task 4. Toggle done-today → Task 5. Show streak N → Task 6. Delete → Task 4. Persists on refresh → Task 4 (habits) + Task 7 (sim date). ✓
- Data model `{id, name, doneDates}` → Tasks 3, 4. ✓
- Two separate localStorage keys → Task 3. ✓
- Local-time date keys → Task 1. ✓
- `getToday()` keystone, dev-walled → Task 1, used everywhere. ✓
- Streak with grace window → Task 2. ✓
- Dev simulator: calendar + "+1 day" + reset, persists, dev-only → Task 7. ✓
- Corrupt-storage fallback → Task 3. Empty-name guard → Task 4. ✓
- Out-of-scope features → none added. ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code; no "add error handling" hand-waves. ✓

**Type consistency:** `toKey`/`keyToDate`/`addDays`/`getToday` (Task 1) used consistently in Tasks 2, 5, 7. `computeStreak(doneDates, today)` defined Task 2, used Task 6. Habit shape `{id, name, doneDates}` consistent across Tasks 3-7. `saveDevDate(key|null)`/`loadDevDate` consistent Tasks 3, 7. ✓
