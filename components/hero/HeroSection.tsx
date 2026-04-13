"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const CesiumGlobe = dynamic(() => import("@/components/hero/CesiumGlobe"), { ssr: false });

interface HeroSectionProps {
  onEnter: () => void;
}

const STATS = [
  { label: "Live APIs", value: "200+", icon: "⚡" },
  { label: "Countries", value: "195", icon: "🌍" },
  { label: "Data Points", value: "1M+", icon: "📊" },
  { label: "Updates/min", value: "500+", icon: "🔄" },
];

const FEATURES = [
  "Real-Time Earthquakes",
  "Global Markets & Crypto",
  "Weather Intelligence",
  "Space & ISS Tracker",
  "AI Anomaly Detection",
  "Voice Commands",
];

export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [featureIdx, setFeatureIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Rotating feature text
  useEffect(() => {
    const t = setInterval(() => setFeatureIdx((i) => (i + 1) % FEATURES.length), 2500);
    return () => clearInterval(t);
  }, []);

  // Starfield canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    let t = 0;
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Nebula glow
      const g1 = ctx.createRadialGradient(canvas.width * 0.3, canvas.height * 0.4, 0, canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.4);
      g1.addColorStop(0, "rgba(110, 231, 183, 0.03)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const g2 = ctx.createRadialGradient(canvas.width * 0.7, canvas.height * 0.6, 0, canvas.width * 0.7, canvas.height * 0.6, canvas.width * 0.35);
      g2.addColorStop(0, "rgba(96, 165, 250, 0.025)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach((s) => {
        const twinkle = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * twinkle})`;
        ctx.fill();

        // Star glow
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(110, 231, 183, ${0.05 * twinkle})`;
          ctx.fill();
        }

        s.y -= s.speed;
        if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="hero-container" style={{ background: "#030810" }}>
      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(110,231,183,0.04) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 60% 40% at 30% 60%, rgba(96,165,250,0.03) 0%, transparent 60%)" }} />

      {/* Navigation */}
      <nav className="relative z-20 flex w-full items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(110,231,183,0.15), rgba(34,211,238,0.1))", border: "1px solid rgba(110,231,183,0.2)" }}>
            <span className="text-lg">🌍</span>
          </div>
          <span className="text-base font-bold tracking-wider text-white">
            <span className="text-aurora">SAPIEN</span> SIGNAL
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
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute right-4 top-16 z-30 rounded-xl p-2"
            style={{ background: "rgba(10,15,26,0.95)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          >
            <button onClick={onEnter} className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5">Dashboard</button>
            <button onClick={onEnter} className="block w-full rounded-lg px-4 py-3 text-left text-sm text-white/80 hover:bg-white/5">Live Data</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center" style={{ marginTop: "-3rem" }}>
        {/* Badge */}
        <motion.div
          className="mb-6 rounded-full px-5 py-2"
          style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.15)" }}
          initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-wider" style={{ color: "#6EE7B7" }}>
            ⚡ LIVE DATA FROM 200+ APIs
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          className="mb-2 text-sm font-medium tracking-[8px] text-white/50 md:text-base"
          initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.8 }}
        >
          EXPLORE YOUR
        </motion.div>

        {/* W [GLOBE] RLD */}
        <div className="flex items-center justify-center">
          <motion.span
            className="select-none text-[5rem] font-black leading-none text-white md:text-[8rem] lg:text-[10rem]"
            style={{ letterSpacing: "-3px", textShadow: "0 0 80px rgba(110,231,183,0.1)" }}
            initial={{ opacity: 0, x: -40 }} animate={mounted ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5, duration: 0.8 }}
          >
            W
          </motion.span>

          <motion.div
            className="hero-globe-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <CesiumGlobe />
          </motion.div>

          <motion.span
            className="select-none text-[5rem] font-black leading-none text-white md:text-[8rem] lg:text-[10rem]"
            style={{ letterSpacing: "-3px", textShadow: "0 0 80px rgba(96,165,250,0.1)" }}
            initial={{ opacity: 0, x: 40 }} animate={mounted ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5, duration: 0.8 }}
          >
            RLD
          </motion.span>
        </div>

        {/* Rotating feature text */}
        <motion.div
          className="mt-4 h-6"
          initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={featureIdx}
              className="inline-block text-sm font-medium tracking-wider"
              style={{ color: "rgba(110,231,183,0.6)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {FEATURES[featureIdx]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-3 max-w-lg text-sm leading-relaxed text-white/40 md:text-base"
          initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.9, duration: 0.8 }}
        >
          The pulse of human civilization — real-time intelligence across weather, seismology, markets, health, space, and more.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1, duration: 0.8 }}
        >
          <button
            onClick={onEnter}
            className="group flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold tracking-wider text-white transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(110,231,183,0.2), rgba(34,211,238,0.15))",
              border: "1px solid rgba(110,231,183,0.3)",
              boxShadow: "0 0 30px rgba(110,231,183,0.1), 0 8px 32px rgba(0,0,0,0.3)",
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
            className="flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold text-white/50 transition-all hover:text-white/80"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.3, duration: 0.8 }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <span className="text-lg">{s.icon}</span>
              <div>
                <div className="text-lg font-bold text-white">{s.value}</div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-white/30">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-24" style={{ background: "linear-gradient(to top, #030810, transparent)" }} />
    </div>
  );
}
