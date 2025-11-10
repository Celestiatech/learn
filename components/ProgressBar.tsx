export default function ProgressBar({ value, max }: { value: number; max: number }){
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between text-xs tracking-[0.16em] text-secondary">
        <span>Progress</span>
        <span className="text-heading">{pct}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-soft bg-progress">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-500 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-sm text-secondary">
        {value} of {max} lessons completed
      </div>
    </div>
  )
}
