# Streak — Habit Tracker Design

**Date:** 2026-06-27
**Status:** Approved, ready for implementation planning

## Purpose

A local-only habit tracker. Add habits, mark them done today, see a streak
rendered as flames, delete habits. Everything persists across refresh via
localStorage. Includes a **dev-only** clock control to simulate the passage of
days so streak behavior can be exercised without waiting for real time.

## Stack (fixed — do not change)

React 19 + Vite + Tailwind 4. localStorage for persistence. No backend, no
accounts, no new dependencies.

## Data Model

Persisted under a single localStorage key `streak.habits`:

```js
habits: [
  {
    id: string,             // unique id
    name: string,           // habit label
    completedDates: string[] // ["YYYY-MM-DD", ...] days the habit was done
  }
]
```

The streak is **not** stored. It is computed from `completedDates` relative to
"today". Storing dates (not a counter) makes reset-on-miss and time-travel fall
out naturally.

The simulated dev date persists separately under `streak.devDate` (a single
`YYYY-MM-DD` string, or absent when using the real date).

## "Today" and the Dev Clock

A single `today` value (a `YYYY-MM-DD` string) drives all streak logic.

- **Production:** `today` is the real current date.
- **Dev:** a dev-only panel overrides `today`:
  - **+1 Day** — advance the simulated date by one day.
  - **Date picker** — jump to any date.
  - **Reset** — return to the real today (clears `streak.devDate`).

The simulated date persists in localStorage so a refresh keeps the simulated
day. The entire dev panel is gated behind `import.meta.env.DEV`, so it is
absent from a production build.

## Streak Rule

Classic "don't break the chain":

- Walk backwards from `today`, counting consecutive completed days. Stop at the
  first gap.
- If `today` is not yet marked done but yesterday was, the streak shows
  yesterday's count (an undone "today" does not read as broken until the day
  passes).
- Missing a full day resets the streak to 0 on the next computation — this is a
  natural consequence of the gap-stops-the-walk rule, not special-cased.

Implemented as a pure function `computeStreak(completedDates, today)`.

## Flame Display

Given streak `N` and a cap of `7` (configurable constant):

- `N === 0` → muted/empty state (no flames).
- `1 <= N <= 7` → a row of `N` flame icons.
- `N > 7` → one flame icon followed by `×N`.

## Components

- **`App`** — owns `habits` and `today` state; handles load/save to
  localStorage.
- **`AddHabit`** — text input + add button. Trims input; ignores empty names.
- **`HabitList` / `HabitRow`** — renders habit name, flame display, a
  "Done today" toggle (adds/removes `today` from `completedDates`), and a
  delete button.
- **`DevClock`** — dev-only date controls (+1 Day, date picker, Reset). Rendered
  only when `import.meta.env.DEV`.
- **`lib/streak.js`** — pure `computeStreak(completedDates, today)` plus date
  helpers (e.g. add-days, format `YYYY-MM-DD`). No React, independently testable.

## Persistence

- On startup: read `streak.habits` and `streak.devDate` from localStorage.
- On every change to habits or the dev date: write back.
- Tolerate missing/corrupt localStorage by falling back to an empty habit list
  and the real today.

## Testing

`lib/streak.js` is pure and gets unit tests covering:

- Consecutive completed days produce the right count.
- A gap resets the streak to 0.
- `today` undone but yesterday done → shows yesterday's count.
- Streak greater than the cap (>7) still computes the true N (flame display
  handles the visual capping).
- Date helpers handle month/year boundaries.

UI is wired by hand and exercised using the dev clock.

## Out of Scope (do not build unless asked)

Accounts, sync, charts, reminders, categories, notifications, editing a habit's
name, marking past days done other than via the dev clock.
```

