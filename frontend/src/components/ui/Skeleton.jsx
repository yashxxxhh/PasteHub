export function PasteCardSkeleton() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="h-5 bg-bg-tertiary rounded w-1/3" />
        <div className="h-5 bg-bg-tertiary rounded w-16" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-bg-tertiary rounded w-full" />
        <div className="h-3 bg-bg-tertiary rounded w-4/5" />
        <div className="h-3 bg-bg-tertiary rounded w-3/5" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-bg-tertiary rounded w-16" />
        <div className="h-5 bg-bg-tertiary rounded w-12" />
      </div>
    </div>
  )
}

export function StatsSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-4 bg-bg-tertiary rounded w-1/3 mb-3" />
      <div className="h-8 bg-bg-tertiary rounded w-1/4" />
    </div>
  )
}

export function PasteViewSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-bg-secondary rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-6 bg-bg-secondary rounded w-20" />
        <div className="h-6 bg-bg-secondary rounded w-16" />
      </div>
      <div className="card p-6 space-y-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-4 bg-bg-tertiary rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
        ))}
      </div>
    </div>
  )
}
