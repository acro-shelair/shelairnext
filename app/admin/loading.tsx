export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title skeleton */}
      <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md" />

      {/* Content card skeleton */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
        <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
