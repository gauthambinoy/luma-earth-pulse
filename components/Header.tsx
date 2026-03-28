"use client";

import { useState, useEffect } from "react";
import LiveBadge from "@/components/ui/LiveBadge";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { BASE_POPULATION, BASE_TIMESTAMP, GROWTH_PER_SECOND } from "@/lib/constants";
import { API_COUNT } from "@/lib/api-catalog";

function livePop() {
  return Math.floor(BASE_POPULATION + ((Date.now() - BASE_TIMESTAMP) / 1000) * GROWTH_PER_SECOND);
}

export default function Header() {
  const [pop, setPop] = useState(0);
  const [utc, setUtc] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPop(livePop());
    setUtc(new Date().toUTCString().slice(0, -4));
    const t = setInterval(() => { setPop(livePop()); setUtc(new Date().toUTCString().slice(0, -4)); }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="animate-slideDown mb-6 flex flex-wrap items-center justify-between gap-2.5">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-gradient">UNIFIED</span>{" "}
          <span style={{ color: "var(--text-primary)" }}>WORLD DATA</span>
        </h1>
        <LiveBadge />
        <span className="hidden text-xs tracking-[0.5px] md:inline" style={{ color: "var(--text-muted)" }}>
          {API_COUNT}+ APIs · 15 tabs
        </span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-sm tabular-nums"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--accent)" }}>
          <span>🌍</span>
          {mounted ? (
            <AnimatedNumber value={pop} format={(n) => n.toLocaleString()} duration={800} />
          ) : (
            <span style={{ color: "var(--text-muted)" }}>—</span>
          )}
        </div>
        <div className="rounded-xl border px-3 py-1.5 font-mono text-sm tabular-nums tracking-[0.5px]"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          {mounted ? `${utc} UTC` : "— UTC"}
        </div>
      </div>
    </header>
  );
}
