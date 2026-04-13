"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area,
} from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { useEnergy } from "@/hooks/useEnergy";
import { COLORS } from "@/lib/constants";
import { fmt } from "@/lib/formatters";
import { TOOLTIP_STYLE, AXIS_STYLE } from "@/lib/chart-theme";

const SECS_PER_YEAR = 365.25 * 24 * 3600;

export default function EnergyTab() {
  const { energy, error, isLoading, refresh } = useEnergy();
  const [liveGlobalMWh, setLiveGlobalMWh] = useState(0);
  const [liveCountryMWh, setLiveCountryMWh] = useState<Record<string, number>>({});
  const [lastTick, setLastTick] = useState("");

  // Real-time energy ticker — updates every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const jan1 = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      const secsSinceJan1 = (Date.now() - jan1.getTime()) / 1000;

      // Global: 29,165 TWh/year = ~924,147 MWh/second
      const globalMWh = Math.floor(29165 * 1e6 * secsSinceJan1 / SECS_PER_YEAR);
      setLiveGlobalMWh(globalMWh);

      // Per-country live counters
      const countryRates: Record<string, number> = {};
      if (energy?.countries) {
        energy.countries.forEach((c) => {
          countryRates[c.code] = Math.floor(c.annualTWh * 1e6 * secsSinceJan1 / SECS_PER_YEAR);
        });
      }
      setLiveCountryMWh(countryRates);
      setLastTick(now.toLocaleTimeString());
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [energy]);

  const sourceChart = useMemo(() => {
    if (!energy?.sources) return [];
    return energy.sources.map((s) => ({
      name: s.name,
      value: Math.round(s.share * 1000) / 10,
      twh: s.annualTWh,
      color: s.color,
      icon: s.icon,
    }));
  }, [energy]);

  const countryChart = useMemo(() => {
    if (!energy?.countries) return [];
    return energy.countries.map((c) => ({
      name: c.flag + " " + (c.name.length > 10 ? c.name.slice(0, 10) : c.name),
      twh: c.annualTWh,
      renewable: c.mix.renewable,
      fossil: c.mix.fossil,
    }));
  }, [energy]);

  const perCapitaChart = useMemo(() => {
    if (!energy?.countries) return [];
    return [...energy.countries]
      .sort((a, b) => b.perCapitaMWh - a.perCapitaMWh)
      .map((c) => ({
        name: c.flag + " " + (c.name.length > 10 ? c.name.slice(0, 10) : c.name),
        value: c.perCapitaMWh,
      }));
  }, [energy]);

  if (isLoading) return <SkeletonLoader height={400} />;
  if (error || !energy) return <ErrorCard message="Energy data unavailable" onRetry={() => refresh()} />;

  return (
    <div>
      {/* Real-time header */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl border px-5 py-3"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-500" style={{ animation: "pulseSlow 1.5s infinite" }} />
          <span className="text-sm font-semibold" style={{ color: "#eab308" }}>⚡ LIVE ENERGY</span>
        </div>
        <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Real-time world energy consumption · Updated every second · Tick: {lastTick}
        </span>
      </div>

      {/* Global live counter - hero section */}
      <div className="mb-6 overflow-hidden rounded-2xl border p-6" style={{ background: "linear-gradient(135deg, var(--bg-card), rgba(234,179,8,0.05))", borderColor: "var(--border)" }}>
        <div className="mb-1 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
          🌍 Global Energy Consumed This Year
        </div>
        <div className="font-mono text-4xl font-black tabular-nums tracking-tight md:text-5xl" style={{ color: "#eab308" }}>
          {fmt(liveGlobalMWh)} <span className="text-lg font-semibold" style={{ color: "var(--text-muted)" }}>MWh</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>⚡ {fmt(energy.global.mwhPerSecond)} MWh/sec</span>
          <span>🌿 {energy.global.renewableShare}% renewable</span>
          <span>🏭 {energy.global.fossilShare}% fossil</span>
          <span>☢️ {energy.global.nuclearShare}% nuclear</span>
          <span>📊 {fmt(energy.global.totalAnnualTWh)} TWh annual capacity</span>
        </div>
      </div>

      {/* Key metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="Annual Capacity" value={`${fmt(energy.global.totalAnnualTWh)} TWh`} accent="#eab308" />
        <MetricCard label="MWh Per Second" value={fmt(energy.global.mwhPerSecond)} numeric={energy.global.mwhPerSecond} format={fmt} accent="#f59e0b" />
        <MetricCard label="Renewable Share" value={`${energy.global.renewableShare}%`} accent="#22c55e" />
        <MetricCard label="Fossil Share" value={`${energy.global.fossilShare}%`} accent="#57534e" />
        <MetricCard label="Nuclear Share" value={`${energy.global.nuclearShare}%`} accent="#a78bfa" />
        <MetricCard label="Top Consumer" value={energy.countries[0]?.flag + " " + energy.countries[0]?.name} accent="#ef4444" />
      </div>

      {/* Per-country live tickers */}
      <div className="mb-6">
        <div className="mb-3 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          🏭 Live Energy Consumption by Country
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {energy.countries.map((country) => {
            const liveMWh = liveCountryMWh[country.code] ?? 0;
            return (
              <div key={country.code} className="card-glow rounded-2xl border p-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>{country.name}</span>
                </div>
                <div className="font-mono text-xl font-bold tabular-nums" style={{ color: "#eab308" }}>
                  {fmt(liveMWh)} <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>MWh</span>
                </div>
                <div className="mt-1.5 flex gap-1">
                  <div className="h-1.5 rounded-full" style={{ width: `${country.mix.fossil}%`, background: "#57534e" }} title={`Fossil ${country.mix.fossil}%`} />
                  <div className="h-1.5 rounded-full" style={{ width: `${country.mix.nuclear}%`, background: "#a78bfa" }} title={`Nuclear ${country.mix.nuclear}%`} />
                  <div className="h-1.5 rounded-full" style={{ width: `${country.mix.renewable}%`, background: "#22c55e" }} title={`Renewable ${country.mix.renewable}%`} />
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                  <span>⚡ {fmt(country.mwhPerSecond)} MWh/s</span>
                  <span>· {country.perCapitaMWh.toFixed(1)} MWh/cap</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Source mix pie */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            Global Energy Mix by Source
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sourceChart} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value" nameKey="name">
                {sourceChart.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3">
            {sourceChart.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                <div className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.icon} {s.name} ({s.value}%)
              </div>
            ))}
          </div>
        </div>

        {/* Country consumption bar */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            Annual Consumption by Country (TWh)
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryChart} layout="vertical">
              <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ ...AXIS_STYLE, fontSize: 9 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v} TWh`, "Annual"]} />
              <Bar dataKey="twh" radius={[0, 4, 4, 0]}>
                {countryChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Per capita bar */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            Energy Per Capita (MWh/person/year)
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={perCapitaChart} layout="vertical">
              <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ ...AXIS_STYLE, fontSize: 9 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${Number(v).toFixed(1)} MWh`, "Per Capita"]} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {perCapitaChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Renewable vs Fossil stacked */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            Renewable vs Fossil Mix (%)
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryChart}>
              <XAxis dataKey="name" tick={{ ...AXIS_STYLE, fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="renewable" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} name="Renewable %" />
              <Bar dataKey="fossil" stackId="a" fill="#57534e" radius={[4, 4, 0, 0]} name="Fossil %" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              <div className="h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />Renewable
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              <div className="h-2 w-2 rounded-full" style={{ background: "#57534e" }} />Fossil
            </div>
          </div>
        </div>
      </div>

      {/* Source attribution */}
      <div className="rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        Data sources:{" "}
        <a href="https://www.iea.org/data-and-statistics" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>IEA World Energy Outlook ↗</a>
        {" · "}
        <a href="https://www.eia.gov/international/data/world" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>EIA International Energy Statistics ↗</a>
        {" · "}
        <a href="https://www.irena.org/Statistics" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>IRENA Renewable Energy Statistics ↗</a>
        {" · "}
        <a href="https://www.bp.com/en/global/corporate/energy-economics/statistical-review-of-world-energy.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>BP Statistical Review ↗</a>
      </div>
    </div>
  );
}
