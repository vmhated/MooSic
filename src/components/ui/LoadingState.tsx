export interface LoadingStateProps {
  type?: 'cards' | 'tracklist' | 'hero' | 'spinner';
  count?: number;
  className?: string;
}

export function LoadingState({
  type = 'cards',
  count = 4,
  className = '',
}: LoadingStateProps) {
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center p-12 space-y-3 ${className}`}>
        <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-text-muted">Sintonizando frequências sonoras...</p>
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className={`w-full h-72 sm:h-96 rounded-4xl bg-[#0D0E14] border border-white/[0.08] animate-pulse p-8 flex flex-col justify-end space-y-4 ${className}`}>
        <div className="h-5 w-32 bg-white/10 rounded-full" />
        <div className="h-10 w-2/3 max-w-md bg-white/15 rounded-2xl" />
        <div className="h-4 w-1/3 bg-white/10 rounded-lg" />
      </div>
    );
  }

  if (type === 'tracklist') {
    return (
      <div className={`space-y-2.5 w-full ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-white/10 rounded" />
              <div className="h-3 w-32 bg-white/5 rounded" />
            </div>
            <div className="h-3 w-12 bg-white/5 rounded hidden sm:block" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-3 rounded-3xl bg-[#0D0E14]/80 border border-white/[0.06] animate-pulse space-y-3"
        >
          <div className="aspect-square w-full rounded-2xl bg-white/10" />
          <div className="space-y-1.5 px-1">
            <div className="h-4 w-4/5 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
