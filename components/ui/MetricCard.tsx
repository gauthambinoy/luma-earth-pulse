"use client";

import AnimatedNumber from "./AnimatedNumber";

interface MetricCardProps {
  label: string;
  value: string;
  numeric?: number;
  format?: (n: number) => string;
  sub?: string;
  accent?: string;
  glow?: boolean;
}

export default function MetricCard({
  label,
  value,
  numeric,
  format,
  sub,
  accent = "#059669",
  glow = false,
}: MetricCardProps) {
  return (
    <div
      className="card-glow group relative overflow-hidden rounded-2xl border p-5"
      style={{
        background: "var(--bg-card)",
        borderColor: glow ? `${accent}40` : "var(--border)",
      }}
    >
      {glow && (
        <div className="absolute left-0 right-0 top-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      )}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}0A, transparent 70%)` }} />
      <div className="relative">
        <div className="mb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
          {label}
        </div>
        <div className="text-3xl font-bold tracking-tight" style={{ color: accent, fontVariantNumeric: "tabular-nums" }}>
          {numeric != null ? <AnimatedNumber value={numeric} format={format} /> : value}
        </div>
        {sub && <div className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{sub}</div>}
      </div>
    </div>
  );
}
