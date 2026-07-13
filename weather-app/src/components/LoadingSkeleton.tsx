export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Loading weather data">
      <div className="space-y-3">
        <div className="h-3 w-40 bg-white/10 rounded" />
        <div className="h-3 w-56 bg-white/10 rounded" />
        <div className="flex items-center gap-4 mt-4">
          <div className="w-24 h-24 rounded-full bg-white/10" />
          <div className="h-20 w-40 bg-white/10 rounded-2xl" />
        </div>
      </div>
      <div className="h-24 glass-light rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 glass-light rounded-2xl" />
        ))}
      </div>
      <div className="h-56 glass-light rounded-2xl" />
      <div className="h-64 glass-light rounded-2xl" />
      <span className="sr-only">Loading weather data…</span>
    </div>
  );
}
