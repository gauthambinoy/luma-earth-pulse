"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Generates a daily AI briefing based on current data */
export function useDataNarration(data: {
  quakeCount?: number;
  maxMagnitude?: number;
  marketTrend?: "up" | "down" | "flat";
  avgTemp?: number;
  topNews?: string;
}) {
  const narration = useMemo(() => {
    const parts: string[] = [];
    const time = new Date();
    const greeting = time.getHours() < 12 ? "Good morning" : time.getHours() < 17 ? "Good afternoon" : "Good evening";
    parts.push(`${greeting}! Here's your Sapien Signal intelligence briefing.`);

    if (data.quakeCount !== undefined) {
      parts.push(`🌍 ${data.quakeCount} earthquakes detected in the past 24 hours${data.maxMagnitude ? `, strongest at M${data.maxMagnitude.toFixed(1)}` : ""}.`);
    }
    if (data.marketTrend) {
      const emoji = data.marketTrend === "up" ? "📈" : data.marketTrend === "down" ? "📉" : "📊";
      parts.push(`${emoji} Markets are trending ${data.marketTrend} with moderate volatility.`);
    }
    if (data.avgTemp !== undefined) {
      parts.push(`🌡️ Global average temperature at ${data.avgTemp.toFixed(1)}°C across monitored stations.`);
    }
    if (data.topNews) {
      parts.push(`📰 Top story: ${data.topNews}`);
    }

    return parts.join("\n\n");
  }, [data]);

  return narration;
}

/** AI Briefing Card component */
export function AIBriefingCard({ narration }: { narration: string }) {
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);

  if (!visible) return null;

  return (
    <motion.div
      className="mb-5 overflow-hidden rounded-2xl"
      style={{
        background: "rgba(10, 15, 26, 0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(110,231,183,0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3), 0 0 20px rgba(110,231,183,0.05)",
      }}
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -20, height: 0 }}
    >
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: expanded ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <div className="flex items-center gap-2">
          <span className="text-base">🧠</span>
          <span className="text-xs font-bold text-aurora">AI Daily Briefing</span>
          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: "rgba(110,231,183,0.1)", color: "#6EE7B7" }}>LIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(!expanded)} className="text-xs transition-all hover:scale-105" style={{ color: "rgba(255,255,255,0.4)" }}>
            {expanded ? "Collapse" : "Expand"}
          </button>
          <button onClick={() => setVisible(false)} className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>✕</button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="px-5 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "#cbd5e1" }}>
              {narration}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** Anomaly detection engine */
export interface Anomaly {
  id: string;
  type: "earthquake" | "market" | "weather" | "health" | "energy";
  severity: "info" | "warning" | "critical";
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
}

export function useAnomalyDetection(data: {
  earthquakes?: { magnitude: number }[];
  marketChanges?: { symbol: string; change: number }[];
  temperatures?: { city: string; temp: number }[];
}) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    const detected: Anomaly[] = [];

    data.earthquakes?.forEach((q) => {
      if (q.magnitude >= 6.0) {
        detected.push({
          id: `eq-${q.magnitude}-${Date.now()}`,
          type: "earthquake",
          severity: q.magnitude >= 7.0 ? "critical" : "warning",
          message: `Major earthquake detected: M${q.magnitude.toFixed(1)}`,
          value: q.magnitude,
          threshold: 6.0,
          timestamp: new Date(),
        });
      }
    });

    data.marketChanges?.forEach((m) => {
      if (Math.abs(m.change) > 10) {
        detected.push({
          id: `mkt-${m.symbol}-${Date.now()}`,
          type: "market",
          severity: Math.abs(m.change) > 20 ? "critical" : "warning",
          message: `${m.symbol} ${m.change > 0 ? "surged" : "dropped"} ${Math.abs(m.change).toFixed(1)}%`,
          value: m.change,
          threshold: 10,
          timestamp: new Date(),
        });
      }
    });

    data.temperatures?.forEach((t) => {
      if (t.temp > 45 || t.temp < -30) {
        detected.push({
          id: `temp-${t.city}-${Date.now()}`,
          type: "weather",
          severity: "warning",
          message: `Extreme temperature in ${t.city}: ${t.temp}°C`,
          value: t.temp,
          threshold: t.temp > 0 ? 45 : -30,
          timestamp: new Date(),
        });
      }
    });

    if (detected.length > 0) setAnomalies((prev) => [...detected, ...prev].slice(0, 10));
  }, [data.earthquakes, data.marketChanges, data.temperatures]);

  const dismiss = (id: string) => setAnomalies((prev) => prev.filter((a) => a.id !== id));

  return { anomalies, dismiss };
}

const SEVERITY_COLORS = {
  info: { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", text: "#60A5FA", icon: "ℹ️" },
  warning: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", text: "#F59E0B", icon: "⚠️" },
  critical: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", text: "#EF4444", icon: "🚨" },
};

export function AnomalyToast({ anomaly, onDismiss }: { anomaly: Anomaly; onDismiss: () => void }) {
  const colors = SEVERITY_COLORS[anomaly.severity];

  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      className="pointer-events-auto mb-2 flex items-center gap-3 rounded-xl px-4 py-3"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 15px ${colors.border}`,
      }}
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      layout
    >
      <span className="text-base">{colors.icon}</span>
      <div className="flex-1">
        <div className="text-xs font-semibold" style={{ color: colors.text }}>{anomaly.message}</div>
        <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {anomaly.timestamp.toLocaleTimeString()}
        </div>
      </div>
      {anomaly.severity === "critical" && (
        <div className="h-2 w-2 rounded-full" style={{ background: colors.text, animation: "glowPulseEffect 1s ease-in-out infinite", boxShadow: `0 0 8px ${colors.text}` }} />
      )}
      <button onClick={onDismiss} className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>✕</button>
    </motion.div>
  );
}

export function AnomalyContainer({ anomalies, onDismiss }: { anomalies: Anomaly[]; onDismiss: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed right-6 top-20 z-50 flex w-80 flex-col">
      <AnimatePresence mode="popLayout">
        {anomalies.slice(0, 3).map((a) => (
          <AnomalyToast key={a.id} anomaly={a} onDismiss={() => onDismiss(a.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Simple trend prediction using linear regression */
export function predictTrend(values: number[], futurePoints = 5): { predicted: number[]; confidence: number[] } {
  const n = values.length;
  if (n < 2) return { predicted: [], confidence: [] };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const mean = sumY / n;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < n; i++) {
    const predicted = slope * i + intercept;
    ssRes += (values[i] - predicted) ** 2;
    ssTot += (values[i] - mean) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  const predicted: number[] = [];
  const confidence: number[] = [];
  for (let i = 0; i < futurePoints; i++) {
    predicted.push(slope * (n + i) + intercept);
    confidence.push(Math.max(0, r2 - i * 0.1));
  }

  return { predicted, confidence };
}
