"use client";

import { useEffect, useState, useCallback } from "react";

export type TimePhase = "dawn" | "morning" | "afternoon" | "sunset" | "evening" | "night";

interface AmbientColors {
  accent: string;
  accentGlow: string;
  auroraFrom: string;
  auroraTo: string;
  ambientOverlay: string;
  phase: TimePhase;
}

const PHASES: Record<TimePhase, AmbientColors> = {
  dawn: {
    accent: "#F59E0B",
    accentGlow: "rgba(245, 158, 11, 0.15)",
    auroraFrom: "#FDE68A",
    auroraTo: "#F59E0B",
    ambientOverlay: "rgba(245, 158, 11, 0.03)",
    phase: "dawn",
  },
  morning: {
    accent: "#6EE7B7",
    accentGlow: "rgba(110, 231, 183, 0.15)",
    auroraFrom: "#6EE7B7",
    auroraTo: "#22D3EE",
    ambientOverlay: "rgba(110, 231, 183, 0.02)",
    phase: "morning",
  },
  afternoon: {
    accent: "#60A5FA",
    accentGlow: "rgba(96, 165, 250, 0.15)",
    auroraFrom: "#60A5FA",
    auroraTo: "#818CF8",
    ambientOverlay: "rgba(96, 165, 250, 0.02)",
    phase: "afternoon",
  },
  sunset: {
    accent: "#FB923C",
    accentGlow: "rgba(251, 146, 60, 0.15)",
    auroraFrom: "#FB923C",
    auroraTo: "#F472B6",
    ambientOverlay: "rgba(251, 146, 60, 0.03)",
    phase: "sunset",
  },
  evening: {
    accent: "#C4B5FD",
    accentGlow: "rgba(196, 181, 253, 0.15)",
    auroraFrom: "#C4B5FD",
    auroraTo: "#818CF8",
    ambientOverlay: "rgba(196, 181, 253, 0.03)",
    phase: "evening",
  },
  night: {
    accent: "#22D3EE",
    accentGlow: "rgba(34, 211, 238, 0.15)",
    auroraFrom: "#22D3EE",
    auroraTo: "#6366F1",
    ambientOverlay: "rgba(34, 211, 238, 0.02)",
    phase: "night",
  },
};

function getPhase(hour: number): TimePhase {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 16) return "afternoon";
  if (hour >= 16 && hour < 19) return "sunset";
  if (hour >= 19 && hour < 22) return "evening";
  return "night";
}

export function useAmbientLight() {
  const [colors, setColors] = useState<AmbientColors>(PHASES.night);

  const update = useCallback(() => {
    const hour = new Date().getHours();
    setColors(PHASES[getPhase(hour)]);
  }, []);

  useEffect(() => {
    update();
    const interval = setInterval(update, 60_000); // check every minute
    return () => clearInterval(interval);
  }, [update]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--ambient-accent", colors.accent);
    root.style.setProperty("--ambient-glow", colors.accentGlow);
    root.style.setProperty("--ambient-from", colors.auroraFrom);
    root.style.setProperty("--ambient-to", colors.auroraTo);
    root.style.setProperty("--ambient-overlay", colors.ambientOverlay);
  }, [colors]);

  return colors;
}
