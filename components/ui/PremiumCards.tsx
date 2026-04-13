"use client";

import { useRef, useState, useCallback, ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  spotlight?: boolean;
  magnetic?: boolean;
  aurora?: boolean;
}

/** Premium glass card with parallax tilt, spotlight tracking, and magnetic snap */
export function GlassCard({ children, className = "", tilt = true, spotlight = true, magnetic = false, aurora = false }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Spotlight
    if (spotlight) {
      el.style.setProperty("--mouse-x", `${x * 100}%`);
      el.style.setProperty("--mouse-y", `${y * 100}%`);
    }

    // Tilt
    if (tilt) {
      const tiltX = (y - 0.5) * -8;
      const tiltY = (x - 0.5) * 8;
      setTransform(`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`);
    }
  }, [tilt, spotlight]);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)");
  }, []);

  return (
    <div
      ref={ref}
      className={`glass-card-premium ${aurora ? "card-aurora" : "card-glow"} spotlight-card ${className}`}
      style={{ transform, transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

interface SmartTooltipProps {
  content: string;
  insight?: string;
  children: ReactNode;
  position?: "top" | "bottom";
}

/** AI-enriched tooltip that shows contextual insights */
export function SmartTooltip({ content, insight, children, position = "top" }: SmartTooltipProps) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: position === "top" ? rect.top : rect.bottom,
    });
    setShow(true);
  }, [position]);

  return (
    <div className="relative inline-block" onMouseEnter={handleEnter} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          ref={ref}
          className="pointer-events-none fixed z-[100]"
          style={{
            left: coords.x,
            top: position === "top" ? coords.y - 8 : coords.y + 8,
            transform: `translate(-50%, ${position === "top" ? "-100%" : "0"})`,
          }}
        >
          <div
            className="max-w-xs rounded-xl px-4 py-3"
            style={{
              background: "rgba(10, 15, 26, 0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(110,231,183,0.05)",
              animation: "tooltipIn 0.2s ease-out",
            }}
          >
            <div className="text-xs font-medium" style={{ color: "#f1f5f9" }}>{content}</div>
            {insight && (
              <div className="mt-1.5 flex items-start gap-1.5 border-t pt-1.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <span className="text-[10px]">🧠</span>
                <span className="text-[10px] leading-relaxed" style={{ color: "rgba(110,231,183,0.8)" }}>{insight}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Liquid morphing container — animates between layouts */
export function LiquidContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`liquid-morph ${className}`}>
      {children}
    </div>
  );
}
