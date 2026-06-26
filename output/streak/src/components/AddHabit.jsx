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
