"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const HeroGlobe = dynamic(() => import("@/components/hero/HeroGlobe"), { ssr: false });

interface HeroSectionProps {
  onEnter: () => void;
}

export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="hero-container">
      {/* Background gradient */}
      <div className="hero-bg" />

      {/* Navigation Bar */}
      <nav className="hero-nav">
        <div className="hero-nav-brand">
          <span className="hero-brand-icon">🌍</span>
          <span className="hero-brand-text">EARTH PULSE</span>
        </div>

        <div className="hero-nav-links">
          <button
            onClick={onEnter}
            className="hero-nav-link"
          >
            LOGIN
          </button>
          <button
            onClick={onEnter}
            className="hero-nav-btn"
          >
            SIGN UP
          </button>
          <button className="hero-nav-icon" aria-label="Search">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            className="hero-nav-icon"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="hero-mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button onClick={onEnter} className="hero-mobile-link">
              Dashboard
            </button>
            <button onClick={onEnter} className="hero-mobile-link">
              Live Data
            </button>
            <button onClick={onEnter} className="hero-mobile-link">
              API Sources
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center content: Globe + Text */}
      <div className="hero-center">
        {/* "EXPLORE YOUR" subtitle */}
        <motion.div
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          EXPLORE YOUR
        </motion.div>

        {/* W [GLOBE] RLD */}
        <div className="hero-world-row">
          <motion.span
            className="hero-world-letter"
            initial={{ opacity: 0, x: -40 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            W
          </motion.span>

          <motion.div
            className="hero-globe-container"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={mounted ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
          >
            <HeroGlobe />
          </motion.div>

          <motion.span
            className="hero-world-letter"
            initial={{ opacity: 0, x: 40 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            RLD
          </motion.span>
        </div>

        {/* CTA */}
        <motion.div
          className="hero-cta-area"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
        >
          <p className="hero-description">
            Real-time global data — weather, earthquakes, markets, health, space &amp; more
          </p>
          <button onClick={onEnter} className="hero-cta-btn">
            <span>Enter Dashboard</span>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="hero-bottom-fade" />
    </div>
  );
}
