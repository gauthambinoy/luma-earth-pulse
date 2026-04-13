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
          <div
            key={i}
            className="rounded-2xl border p-4"
            style={{
              background: "var(--bg-card)",
              borderColor: "rgba(255,255,255,0.06)",
              animation: `fadeIn 0.4s ease-out ${i * 0.08}s both`,
            }}
          >
            <div className="skeleton-shimmer mb-2 h-3 w-20 rounded" style={{ animationDelay: `${i * 0.1}s` }} />
            <div className="skeleton-shimmer mb-1 h-7 w-24 rounded" style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
            <div className="skeleton-shimmer h-2 w-16 rounded" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div
        className="rounded-2xl border p-4"
        style={{ height, background: "var(--bg-card)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="skeleton-shimmer mb-3 h-3 w-32 rounded" />
        <div className="flex items-end gap-2" style={{ height: height - 60 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer flex-1 rounded-t"
              style={{
                height: `${30 + Math.random() * 60}%`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="rounded-2xl border p-4" style={{ background: "var(--bg-card)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="skeleton-shimmer mb-4 h-3 w-40 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="mb-3 flex items-center gap-4"
            style={{ animation: `fadeIn 0.3s ease-out ${i * 0.06}s both` }}
          >
            <div className="skeleton-shimmer h-3 w-12 rounded" />
            <div className="skeleton-shimmer h-3 flex-1 rounded" />
            <div className="skeleton-shimmer h-3 w-16 rounded" />
            <div className="skeleton-shimmer h-3 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Default — premium pulsing dots
  return (
    <div className="flex flex-col items-center justify-center gap-4" style={{ height }}>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2.5 w-2.5 rounded-full"
            style={{
              background: ["#6EE7B7", "#22D3EE", "#60A5FA"][i],
              animation: `pulseSlow 1.4s ease-in-out ${i * 0.2}s infinite`,
              boxShadow: `0 0 10px ${["rgba(110,231,183,0.4)", "rgba(34,211,238,0.4)", "rgba(96,165,250,0.4)"][i]}`,
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>{message}</span>
    </div>
  );
}
