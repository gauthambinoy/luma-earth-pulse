"use client";

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border p-8"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full text-xl"
        style={{ background: "rgba(239,68,68,0.08)" }}>
        ⚠
      </div>
      <div className="text-sm font-medium" style={{ color: "#ef4444" }}>{message}</div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>The data source may be temporarily unavailable.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-xl border px-5 py-2 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444", background: "rgba(239,68,68,0.06)" }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
