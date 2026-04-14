"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const CesiumGlobe = dynamic(() => import("@/components/hero/CesiumGlobe"), { ssr: false });

interface HeroSectionProps {
  onEnter: () => void;
}

const STATS = [
  { label: "Live APIs", value: "200+", icon: "⚡" },
  { label: "Planetary Feeds", value: "80+", icon: "🛰️" },
  { label: "Countries", value: "195", icon: "🌍" },
  { label: "Updates / min", value: "500+", icon: "🔄" },
];

const FEATURES = [
  "Satellite weather intelligence",
  "Planetary energy monitoring",
  "Live seismic and atmospheric streams",
  "Markets, health, climate and space",
];

export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [featureIdx, setFeatureIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setFeatureIdx((i) => (i + 1) % FEATURES.length), 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-container overflow-hidden" style={{ background: "#02050b" }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=2200&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.42,
        }}
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(circle at 72% 40%, rgba(8,145,178,0.2) 0%, transparent 24%), radial-gradient(circle at 22% 24%, rgba(96,165,250,0.15) 0%, transparent 20%), linear-gradient(180deg, rgba(2,6,23,0.38) 0%, rgba(2,6,23,0.74) 42%, rgba(2,6,23,0.96) 100%)",
        }}
      />

      <nav className="relative z-20 flex w-full items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(110,231,183,0.15), rgba(34,211,238,0.1))", border: "1px solid rgba(110,231,183,0.2)" }}
          >
            <span className="text-lg">🌍</span>
          </div>
          <span className="text-base font-bold tracking-wider text-white">
            <span style={{ color: "#6EE7B7" }}>SAPIEN</span> SIGNAL
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onEnter} className="hidden rounded-lg px-4 py-2 text-xs font-semibold tracking-wider text-white/60 transition-all hover:text-white sm:block">
            LOGIN
          </button>
          <button
            onClick={onEnter}
            className="rounded-xl px-5 py-2.5 text-xs font-bold tracking-wider text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(110,231,183,0.15), rgba(34,211,238,0.1))",
              border: "1px solid rgba(110,231,183,0.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            GET STARTED
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-all hover:text-white sm:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute right-4 top-16 z-30 rounded-xl p-2"
            style={{ background: "rgba(10,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button onClick={onEnter} className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5">
              Dashboard
            </button>
            <button onClick={onEnter} className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5">
              Live Data
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-16 pt-8 md:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="text-left"
          >
            <div
              className="mb-5 inline-flex rounded-full px-4 py-2 text-[11px] font-bold tracking-[0.26em]"
              style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.16)", color: "#6EE7B7" }}
            >
              REAL EARTH / LIVE CIVILIZATION
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] text-white md:text-7xl">
              A{" "}
              <span style={{ color: "#bae6fd", textShadow: "0 0 35px rgba(56,189,248,0.22)" }}>
                real Earth
              </span>{" "}
              view of a living planet.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/58 md:text-lg">
              Orbital-grade monitoring across energy, weather, quakes, markets, health and space, with a landing view built around real Earth imagery instead of a stylized synthetic globe.
            </p>

            <div className="mt-5 h-6">
              <AnimatePresence mode="wait">
                <motion.span
                  key={featureIdx}
                  className="inline-block text-sm font-semibold tracking-[0.18em]"
                  style={{ color: "rgba(125,211,252,0.86)" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                >
                  {FEATURES[featureIdx].toUpperCase()}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onEnter}
                className="group flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold tracking-wider text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(110,231,183,0.2), rgba(34,211,238,0.14))",
                  border: "1px solid rgba(110,231,183,0.3)",
                  boxShadow: "0 0 30px rgba(110,231,183,0.12), 0 10px 40px rgba(0,0,0,0.35)",
                  backdropFilter: "blur(10px)",
                }}
              >
                Enter Dashboard
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href="https://github.com/gauthambinoy/luma-earth-pulse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-white/60 transition-all hover:text-white/85"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(18px)",
                  }}
                >
                  <div className="text-lg">{stat.icon}</div>
                  <div className="mt-2 text-xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/32">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-[620px]"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <div
              className="absolute left-3 top-8 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.22em] text-white/80"
              style={{ background: "rgba(5,10,20,0.72)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(14px)" }}
            >
              ORBITAL SURFACE VIEW
            </div>
            <div
              className="absolute bottom-10 right-0 rounded-2xl px-4 py-3"
              style={{ background: "rgba(5,10,20,0.72)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(18px)" }}
            >
              <div className="text-[10px] font-bold tracking-[0.24em] text-cyan-200/80">CURRENT FOCUS</div>
              <div className="mt-1 text-sm font-semibold text-white/90">Weather, energy, quakes, markets</div>
              <div className="mt-1 text-xs text-white/45">Satellite-first planetary dashboard</div>
            </div>
            <div className="ml-auto h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] lg:h-[540px] lg:w-[540px]">
              <CesiumGlobe />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-24" style={{ background: "linear-gradient(to top, #02050b, transparent)" }} />
    </div>
  );
}
