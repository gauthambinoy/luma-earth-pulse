"use client";

import { ReactNode } from "react";

interface SkeletonLoaderProps {
  height?: number;
  message?: string;
  variant?: "default" | "cards" | "chart" | "table";
}

/** Wrapper that morphs skeleton into content with crossfade */
export function SkeletonMorph({ loading, skeleton, children }: { loading: boolean; skeleton: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      <div
        className="transition-all duration-500 ease-out"
        style={{
          opacity: loading ? 1 : 0,
          transform: loading ? "scale(1)" : "scale(0.98)",
          filter: loading ? "blur(0px)" : "blur(4px)",
          position: loading ? "relative" : "absolute",
          inset: loading ? undefined : 0,
          pointerEvents: loading ? "auto" : "none",
        }}
      >
        {skeleton}
      </div>
      <div
        className="transition-all duration-500 ease-out"
        style={{
          opacity: loading ? 0 : 1,
          transform: loading ? "scale(1.02) translateY(8px)" : "scale(1) translateY(0)",
          filter: loading ? "blur(6px)" : "blur(0px)",
        }}
      >
        {!loading && children}
      </div>
    </div>
  );
}

export default function SkeletonLoader({ height = 120, message = "Loading data...", variant = "default" }: SkeletonLoaderProps) {
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-morph-item rounded-2xl border p-4"
            style={{
              background: "var(--bg-card)",
              borderColor: "rgba(255,255,255,0.06)",
              animation: `skeletonMorphIn 0.5s ease-out ${i * 0.08}s both`,
            }}
          >
            <div className="skeleton-shimmer-enhanced mb-2 h-3 w-20 rounded-lg" />
            <div className="skeleton-shimmer-enhanced mb-1 h-7 w-24 rounded-lg" style={{ animationDelay: "0.1s" }} />
            <div className="skeleton-shimmer-enhanced h-2 w-16 rounded-lg" style={{ animationDelay: "0.2s" }} />
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
        <div className="skeleton-shimmer-enhanced mb-3 h-3 w-32 rounded-lg" />
        <div className="flex items-end gap-2" style={{ height: height - 60 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer-enhanced flex-1 rounded-t-lg"
              style={{
                height: `${30 + Math.random() * 60}%`,
                animation: `skeletonGrow 0.6s ease-out ${i * 0.08}s both, shimmerEnhanced 2s ease-in-out infinite`,
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
        <div className="skeleton-shimmer-enhanced mb-4 h-3 w-40 rounded-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="mb-3 flex items-center gap-4"
            style={{ animation: `skeletonMorphIn 0.4s ease-out ${i * 0.06}s both` }}
          >
            <div className="skeleton-shimmer-enhanced h-3 w-12 rounded-lg" />
            <div className="skeleton-shimmer-enhanced h-3 flex-1 rounded-lg" />
            <div className="skeleton-shimmer-enhanced h-3 w-16 rounded-lg" />
            <div className="skeleton-shimmer-enhanced h-3 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Default — premium orbiting dots with glow
  return (
    <div className="flex flex-col items-center justify-center gap-5" style={{ height }}>
      <div className="relative flex items-center justify-center">
        {/* Orbiting ring */}
        <div
          className="absolute h-12 w-12 rounded-full"
          style={{
            border: "2px solid rgba(110,231,183,0.1)",
            animation: "spin 3s linear infinite",
          }}
        />
        <div
          className="absolute h-8 w-8 rounded-full"
          style={{
            border: "2px solid rgba(34,211,238,0.15)",
            animation: "spin 2s linear infinite reverse",
          }}
        />
        {/* Center dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full"
              style={{
                background: ["#6EE7B7", "#22D3EE", "#60A5FA"][i],
                animation: `skeletonDotBounce 1.4s ease-in-out ${i * 0.15}s infinite`,
                boxShadow: `0 0 12px ${["rgba(110,231,183,0.5)", "rgba(34,211,238,0.5)", "rgba(96,165,250,0.5)"][i]}`,
              }}
            />
          ))}
        </div>
      </div>
      <span className="text-[11px] font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>{message}</span>
    </div>
  );
}
