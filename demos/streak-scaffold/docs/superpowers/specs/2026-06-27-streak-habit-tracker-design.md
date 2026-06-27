# Streak — Habit Tracker Design

**Date:** 2026-06-27
**Status:** Approved design, pending spec review

## Goal

Build the MVP into the existing blank scaffold (React 19 + Vite + Tailwind v4,
localStorage, no backend, no new deps):

1. Add a habit
2. Toggle "done today"
3. Show streak "N"
4. Delete a habit
5. Persists on refresh

Plus a **dev-only date simulator** so days can be fast-forwarded to demo streaks
building and breaking without waiting in real time.

## Data Model & Storage

A habit:

```js
{ id, name, doneDates }   // doneDates: array of "YYYY-MM-DD" strings
```

- Marking done today adds today's date string to `doneDates`; un-marking removes it.
- The streak is **derived** from `doneDates`, never stored — it cannot fall out of sync.

Two localStorage keys, kept separate on purpose:

- `streak.habits` → the habits array (real data, MVP requirement #5)
- `streak.devDate` → the simulated "today", an absolute `"YYYY-MM-DD"` (dev-only)

Dates are stored as **local-time** `YYYY-MM-DD` strings to avoid timezone
off-by-one bugs (a habit done "today" must never shift to yesterday via UTC).

Storing the simulated date as an absolute date (not an offset from real today)
means a refresh lands on exactly the date traveled to — predictable.

## The "today" Abstraction (keystone)

One function, `getToday()`, is the only place the app asks what day it is:

- In dev (`import.meta.env.DEV`): if `streak.devDate` is set, return it; else real today.
- In production: always real today — the dev key is never read.

Everything — streak math, the "is it done today?" check, the toggle — routes
through `getToday()`. Time-traveling recomputes every streak and checkbox
instantly. The simulator effectively becomes the test harness for streak logic.

## Streak Logic (consecutive days, with grace)

Pure function `computeStreak(doneDates, today)`:

1. If `today` is in `doneDates`, start counting at today. Else if yesterday is in
   `doneDates`, start at yesterday (grace window — the streak doesn't read as
   broken just because today isn't marked yet). Else → `0`.
2. Walk backward day by day while each date is present; count them.

Examples:

- Done today + 4 prior consecutive days → `5`.
- Done yesterday, not today yet → still shows yesterday's streak (grace).
- A skipped day breaks the chain below the gap.

## Components & Files

```
src/
  lib/date.js      getToday(), addDays(), toKey()   ← dev key lives here, walled off
  lib/streak.js    computeStreak(doneDates, today)  ← pure, the heart of it
  lib/storage.js   load/save habits + sim date
  components/AddHabit.jsx
  components/HabitList.jsx + HabitItem.jsx   (name, streak "N", done toggle, delete)
  components/DevDateBar.jsx   ← rendered only when import.meta.env.DEV
  App.jsx          owns habits + simDate state, wires persistence
```

`DevDateBar` = calendar picker + "+1 day" button + "reset to real today".
It only mounts in dev, so it cannot ship to a real user.

## Data Flow

- `App` loads habits and sim date from storage via lazy `useState` initializers.
- Effects persist habits and sim date to localStorage whenever they change.
- Toggle done: compute today's key via `getToday()`, add/remove it from the
  habit's `doneDates`.
- Streak is derived per habit on render from `doneDates` + `getToday()`.
- Changing the sim date re-renders, recomputing every streak and toggle.

## Error Handling

- Corrupt/unparseable localStorage → fall back to empty list, never crash.
- Empty habit name → add button disabled.
- Duplicate names allowed (identity is `id`, via `crypto.randomUUID()`).

## Testing

No test framework is installed and `CLAUDE.md` forbids new deps, so verification
is manual after each step — the dev simulator is exactly the tool for it (build a
streak, skip a day, watch it break). `computeStreak` stays a pure function so it
is trivially testable if a runner is added later.

## Build Order (small, verifiable steps)

1. Add / list / delete habits + persistence on refresh.
2. "Done today" toggle.
3. Streak number "N".
4. Dev date bar (calendar + "+1 day" + reset).

Each step ships with run-and-verify instructions; nothing is "done" until confirmed.

## Out of Scope (per CLAUDE.md)

Accounts, sync, charts, reminders, categories, notifications. The date simulator
is a development tool only and never renders in production.
