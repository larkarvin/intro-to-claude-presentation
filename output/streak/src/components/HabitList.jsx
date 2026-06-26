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
