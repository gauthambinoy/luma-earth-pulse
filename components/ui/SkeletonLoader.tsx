"use client";

interface SkeletonLoaderProps {
  height?: number;
  message?: string;
  variant?: "default" | "cards" | "chart" | "table";
}

export default function SkeletonLoader({ height = 120, message = "Loading data...", variant = "default" }: SkeletonLoaderProps) {
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="skeleton-shimmer mb-2 h-3 w-20 rounded" />
            <div className="skeleton-shimmer mb-1 h-7 w-24 rounded" />
            <div className="skeleton-shimmer h-2 w-16 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className="rounded-2xl border p-4" style={{ height, background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="skeleton-shimmer mb-3 h-3 w-32 rounded" />
        <div className="flex items-end gap-2" style={{ height: height - 60 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer flex-1 rounded-t" style={{ height: `${30 + Math.random() * 60}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="rounded-2xl border p-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="skeleton-shimmer mb-4 h-3 w-40 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="mb-3 flex items-center gap-4">
            <div className="skeleton-shimmer h-3 w-12 rounded" />
            <div className="skeleton-shimmer h-3 flex-1 rounded" />
            <div className="skeleton-shimmer h-3 w-16 rounded" />
            <div className="skeleton-shimmer h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3" style={{ height }}>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--accent)", animation: `pulseSlow 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{message}</span>
    </div>
  );
}
