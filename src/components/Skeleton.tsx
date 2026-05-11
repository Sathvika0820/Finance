export function BankCardSkeleton() {
  return (
    <div className="glass shadow-soft rounded-2xl p-4 flex items-center gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="h-2.5 w-1/3 rounded bg-muted" />
      </div>
    </div>
  );
}

export function BankTileSkeleton() {
  return (
    <div className="glass shadow-soft rounded-2xl p-4 flex flex-col items-center gap-2 min-w-[110px] animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-muted" />
      <div className="h-2.5 w-10 rounded bg-muted" />
    </div>
  );
}