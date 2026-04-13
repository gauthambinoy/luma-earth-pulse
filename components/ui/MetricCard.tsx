"use client";

import { useRef, useCallback } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="card-glow spotlight-card group relative overflow-hidden rounded-2xl border p-5"
      style={{
        background: "var(--bg-card)",
        borderColor: glow ? `${accent}30` : "var(--border)",
      }}
    >
      {/* Aurora top line */}
      {glow && (
        <div
          className="absolute left-0 right-0 top-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, rgba(34,211,238,0.7), transparent)`,
            boxShadow: `0 0 12px ${accent}40`,
          }}
        />
      )}

      {/* Hover gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accent}08, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div
          className="mb-2 text-sm font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-tertiary)" }}
        >
          {label}
        </div>
        <div
          className="text-3xl font-bold tracking-tight"
          style={{ color: accent, fontVariantNumeric: "tabular-nums" }}
        >
          {numeric != null ? <AnimatedNumber value={numeric} format={format} /> : value}
        </div>
        {sub && (
          <div className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
