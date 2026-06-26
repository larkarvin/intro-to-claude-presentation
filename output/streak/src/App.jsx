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
