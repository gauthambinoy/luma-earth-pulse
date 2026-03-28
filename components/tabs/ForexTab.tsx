"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { COLORS, FOREX_CURRENCIES } from "@/lib/constants";
import { TOOLTIP_STYLE, AXIS_STYLE, GRID_STYLE } from "@/lib/chart-theme";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CURRENCY_FLAGS: Record<string, string> = {
  EUR: "\u{1F1EA}\u{1F1FA}", GBP: "\u{1F1EC}\u{1F1E7}", JPY: "\u{1F1EF}\u{1F1F5}", CNY: "\u{1F1E8}\u{1F1F3}", INR: "\u{1F1EE}\u{1F1F3}",
  AUD: "\u{1F1E6}\u{1F1FA}", CAD: "\u{1F1E8}\u{1F1E6}", CHF: "\u{1F1E8}\u{1F1ED}", KRW: "\u{1F1F0}\u{1F1F7}", BRL: "\u{1F1E7}\u{1F1F7}",
};

export default function ForexTab() {
  const { data, error, isLoading, mutate } = useSWR("/api/forex", fetcher, {
    refreshInterval: 300_000,
  });
  const [selectedPair, setSelectedPair] = useState("EUR");

  if (isLoading) return <SkeletonLoader height={300} />;
  if (error || !data || "error" in data)
    return <ErrorCard message="Forex data unavailable" onRetry={() => mutate()} />;

  const { latest, historical } = data;
  const rates = latest?.rates ?? {};

  const histChart = (historical ?? [])
    .filter((h: { date: string; [k: string]: unknown }) => h[selectedPair] != null)
    .map((h: { date: string; [k: string]: unknown }) => ({
      date: h.date.slice(5),
      rate: Number(h[selectedPair]),
    }))
    .slice(-60);

  return (
    <div>
      <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
        {FOREX_CURRENCIES.slice(0, 6).map((cur) => (
          <MetricCard
            key={cur}
            label={`${CURRENCY_FLAGS[cur] || ""} USD/${cur}`}
            value={rates[cur] ? rates[cur].toFixed(cur === "JPY" || cur === "KRW" ? 2 : 4) : "—"}
            accent={COLORS[FOREX_CURRENCIES.indexOf(cur) % COLORS.length]}
          />
        ))}
      </div>

      {/* Currency pair selector */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="text-sm font-semibold uppercase tracking-[1px]" style={{ color: "var(--text-tertiary)" }}>Historical:</span>
        {["EUR", "GBP", "JPY", "CNY", "INR", "AUD", "CAD", "CHF"].map((cur) => (
          <button
            key={cur}
            onClick={() => setSelectedPair(cur)}
            className="rounded border px-2.5 py-1 font-mono text-xs transition"
            style={{
              background: selectedPair === cur ? "rgba(110,231,183,0.12)" : "transparent",
              borderColor: selectedPair === cur ? "rgba(110,231,183,0.4)" : "var(--border)",
              color: selectedPair === cur ? "#6EE7B7" : "var(--text-tertiary)",
            }}
          >
            {CURRENCY_FLAGS[cur]} {cur}
          </button>
        ))}
      </div>

      {/* Historical chart */}
      <div className="mb-4 rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
          USD/{selectedPair} · historical trend
        </div>
        {histChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={histChart}>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis dataKey="date" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="rate" stroke="#6EE7B7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-40 items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>
            No historical data available for {selectedPair}
          </div>
        )}
      </div>

      {/* Full rate table */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
          All rates vs USD
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
          {FOREX_CURRENCIES.map((cur) => (
            <div
              key={cur}
              className="flex items-center justify-between rounded-lg border px-4 py-2"
              style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
            >
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {CURRENCY_FLAGS[cur]} {cur}
              </span>
              <span className="font-mono text-xs tabular-nums" style={{ color: "var(--text-primary)" }}>
                {rates[cur]?.toFixed(cur === "JPY" || cur === "KRW" ? 2 : 4) ?? "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2.5 rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          ExchangeRate API ↗
        </a>{" "}·{" "}
        <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          Frankfurter ↗
        </a>{" "}— free, no key required
      </div>
    </div>
  );
}
