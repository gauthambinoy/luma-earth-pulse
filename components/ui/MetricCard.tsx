"use client";

import { useRef, useCallback, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

interface MetricCardProps {
  label: string;
  value: string;
  numeric?: number;
  format?: (n: number) => string;
  sub?: string;
  accent?: string;
  glow?: boolean;
  insight?: string;
}

export default function MetricCard({
  label,
  value,
  numeric,
  format,
  sub,
  accent = "#059669",
  glow = false,
  insight,
}: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showInsight, setShowInsight] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);

    // Parallax tilt
    const tiltX = ((y / 100) - 0.5) * -6;
    const tiltY = ((x / 100) - 0.5) * 6;
    setTilt({ x: tiltX, y: tiltY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setShowInsight(false);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => insight && setShowInsight(true)}
      className="card-glow spotlight-card group relative overflow-hidden rounded-2xl border p-5"
      style={{
        background: "var(--bg-card)",
        borderColor: glow ? `${accent}30` : "var(--border)",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
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

        {/* AI Insight tooltip */}
        {insight && showInsight && (
          <div
            className="absolute -bottom-1 left-0 right-0 translate-y-full pt-2"
            style={{ zIndex: 20 }}
          >
            <div
              className="rounded-lg px-3 py-2"
              style={{
                background: "rgba(10,15,26,0.9)",
                border: "1px solid rgba(110,231,183,0.15)",
                backdropFilter: "blur(12px)",
                animation: "tooltipIn 0.2s ease-out",
              }}
            >
              <div className="flex items-start gap-1.5">
                <span className="text-[10px]">🧠</span>
                <span className="text-[10px] leading-relaxed" style={{ color: "rgba(110,231,183,0.8)" }}>{insight}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
