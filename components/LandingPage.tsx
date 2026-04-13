"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { BASE_POPULATION, BASE_TIMESTAMP, GROWTH_PER_SECOND } from "@/lib/constants";
import { API_COUNT } from "@/lib/api-catalog";

const InteractiveGlobe = dynamic(() => import("@/components/globe/InteractiveGlobe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-6xl">🌍</div>
        <div className="text-sm text-gray-400">Loading Earth...</div>
        <div className="mx-auto mt-3 h-1 w-48 overflow-hidden rounded-full bg-gray-800">
          <div className="h-full animate-pulse rounded-full bg-emerald-500/50" style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  ),
});

function livePop() {
  return Math.floor(BASE_POPULATION + ((Date.now() - BASE_TIMESTAMP) / 1000) * GROWTH_PER_SECOND);
}

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const [pop, setPop] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [utc, setUtc] = useState("");

  useEffect(() => {
    setMounted(true);
    setPop(livePop());
    setUtc(new Date().toUTCString().slice(0, -4));
    const t = setInterval(() => {
      setPop(livePop());
      setUtc(new Date().toUTCString().slice(0, -4));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden" style={{ background: "#030508" }}>
      {/* 3D Globe — fills entire viewport */}
      <div className="absolute inset-0">
        <InteractiveGlobe
          className="h-full w-full"
          onEnterDashboard={onEnterDashboard}
          showControls={true}
        />
      </div>

      {/* Top Header Overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-between px-6 py-5"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(110,231,183,0.1)", backdropFilter: "blur(8px)" }}>
              <span className="text-xl">🌍</span>
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">
                <span style={{
                  background: "linear-gradient(135deg, #059669 0%, #3b82f6 50%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  LUMA
                </span>{" "}
                <span className="text-white/90">Earth Pulse</span>
              </div>
              <div className="text-[10px] tracking-widest text-gray-500">
                {API_COUNT}+ APIs · Real-time Global Data
              </div>
            </div>
          </div>

          {/* Live stats */}
          <div className="pointer-events-auto flex items-center gap-4">
            {/* Population counter */}
            <div className="flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-sm tabular-nums"
              style={{
                background: "rgba(10,15,26,0.7)",
                borderColor: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}>
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" style={{ animation: "pulseSlow 1.5s infinite" }} />
              <span className="text-xs text-gray-500">LIVE</span>
              <span className="text-emerald-400">🌍</span>
              {mounted ? (
                <AnimatedNumber value={pop} format={(n) => n.toLocaleString()} duration={800} />
              ) : (
                <span className="text-gray-500">—</span>
              )}
            </div>

            {/* UTC Clock */}
            <div className="hidden rounded-xl border px-3 py-2 font-mono text-sm tabular-nums tracking-wide sm:block"
              style={{
                background: "rgba(10,15,26,0.7)",
                borderColor: "rgba(255,255,255,0.08)",
                color: "#94a3b8",
                backdropFilter: "blur(8px)",
              }}>
              {mounted ? `${utc} UTC` : "— UTC"}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Title Overlay — centered above the globe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="pointer-events-none absolute left-1/2 top-[14%] z-20 -translate-x-1/2 text-center"
      >
        <h1 className="mb-3 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          <span style={{
            background: "linear-gradient(135deg, #6ee7b7 0%, #60a5fa 50%, #c4b5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Earth Pulse
          </span>
        </h1>
        <p className="mx-auto max-w-lg text-base text-gray-400 sm:text-lg">
          Real-time data from <span className="font-semibold text-emerald-400">{API_COUNT}+ APIs</span>.
          Every heartbeat of our planet, live.
        </p>
      </motion.div>

      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="flex gap-6 rounded-2xl border px-6 py-3"
          style={{
            background: "rgba(10,15,26,0.7)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}>
          {[
            { label: "Data Categories", value: "16", icon: "📊" },
            { label: "Live Counters", value: "47+", icon: "⚡" },
            { label: "Countries", value: "195", icon: "🗺" },
            { label: "Update Rate", value: "1s", icon: "🔄" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg">{stat.icon}</div>
              <div className="font-mono text-lg font-bold text-white">{stat.value}</div>
              <div className="text-[10px] text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
