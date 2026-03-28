"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid,
} from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { COLORS, ECONOMY_COUNTRIES } from "@/lib/constants";
import { fmtUsd, fmt } from "@/lib/formatters";
import { TOOLTIP_STYLE, AXIS_STYLE, GRID_STYLE } from "@/lib/chart-theme";
import type { EconomyResponse, EconomyIndicator } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const INDICATORS = [
  { id: "gdp", label: "GDP (USD)", color: "#6EE7B7" },
  { id: "population", label: "Population", color: "#60A5FA" },
  { id: "inflation", label: "Inflation %", color: "#F87171" },
  { id: "lifeExpectancy", label: "Life Expectancy", color: "#C4B5FD" },
  { id: "unemployment", label: "Unemployment %", color: "#FCD34D" },
  { id: "co2", label: "CO2 per Capita", color: "#FB923C" },
] as const;

type IndicatorKey = (typeof INDICATORS)[number]["id"];

export default function EconomyTab() {
  const { data, error, isLoading, mutate } = useSWR<EconomyResponse>(
    "/api/economy",
    fetcher,
    { refreshInterval: 86_400_000 }
  );
  const [indicator, setIndicator] = useState<IndicatorKey>("gdp");

  const currentData = useMemo(() => {
    if (!data || "error" in data) return [];
    const entries = data[indicator] ?? [];
    const latestByCountry = new Map<string, EconomyIndicator>();
    entries.forEach((e) => {
      if (e.value != null && (!latestByCountry.has(e.country) || e.year > latestByCountry.get(e.country)!.year)) {
        latestByCountry.set(e.country, e);
      }
    });
    return Array.from(latestByCountry.values()).sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  }, [data, indicator]);

  const trendData = useMemo(() => {
    if (!data || "error" in data) return [];
    const entries = data[indicator] ?? [];
    const countryName = ECONOMY_COUNTRIES[0]?.name ?? "United States";
    return entries
      .filter((e) => e.country === countryName && e.value != null)
      .sort((a, b) => a.year.localeCompare(b.year))
      .map((e) => ({ year: e.year, value: e.value! }));
  }, [data, indicator]);

  const barData = useMemo(
    () =>
      currentData.slice(0, 10).map((e) => ({
        name: e.country.length > 12 ? e.country.slice(0, 12) + "\u2026" : e.country,
        value: indicator === "gdp" ? (e.value ?? 0) / 1e12 : (e.value ?? 0),
      })),
    [currentData, indicator]
  );

  const meta = INDICATORS.find((i) => i.id === indicator)!;

  if (isLoading) return <SkeletonLoader height={300} />;
  if (error || !data || "error" in data)
    return <ErrorCard message="Economy data unavailable" onRetry={() => mutate()} />;

  return (
    <div>
      {/* Indicator selector */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {INDICATORS.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setIndicator(ind.id)}
            className="rounded border px-4 py-1.5 font-mono text-sm transition"
            style={{
              background: indicator === ind.id ? ind.color + "1A" : "transparent",
              borderColor: indicator === ind.id ? ind.color + "66" : "var(--border)",
              color: indicator === ind.id ? ind.color : "var(--text-tertiary)",
            }}
          >
            {ind.label}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Bar comparison */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            {meta.label} · top 10 economies
          </div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ ...AXIS_STYLE, fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [indicator === "gdp" ? "$" + Number(v).toFixed(2) + "T" : String(v), meta.label]} />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>No data</div>
          )}
        </div>

        {/* Trend line */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            {ECONOMY_COUNTRIES[0]?.name} · {meta.label} trend
          </div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData}>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis dataKey="year" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="value" stroke={meta.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-60 items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>No trend data</div>
          )}
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
          {meta.label} · all countries
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
          {currentData.slice(0, 20).map((e, i) => (
            <div key={e.country} className="flex items-center justify-between rounded-lg border px-4 py-2" style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{e.country}</span>
              </div>
              <span className="font-mono text-xs font-semibold tabular-nums" style={{ color: meta.color }}>
                {indicator === "gdp" ? fmtUsd(e.value ?? 0) : fmt(e.value ?? 0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2.5 rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://data.worldbank.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          World Bank Open Data ↗
        </a>{" "}— 6 economic indicators · 10 major economies · free, no key
      </div>
    </div>
  );
}
