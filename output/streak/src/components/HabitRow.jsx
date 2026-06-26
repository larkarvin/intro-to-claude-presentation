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
