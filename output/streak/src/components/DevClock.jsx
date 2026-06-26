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
