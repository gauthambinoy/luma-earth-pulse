"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import dynamic from "next/dynamic";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useWeather } from "@/hooks/useWeather";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import { useMarkets } from "@/hooks/useMarkets";
import { useHealth } from "@/hooks/useHealth";
import { COLORS } from "@/lib/constants";
import { fmt, fmtUsd } from "@/lib/formatters";
import { weatherIcon } from "@/lib/constants";
import { API_COUNT, FREE_COUNT } from "@/lib/api-catalog";
import { LIVE_STATS, computeLiveValue, STAT_CATEGORIES } from "@/lib/live-stats";
import { TOOLTIP_STYLE, AXIS_STYLE } from "@/lib/chart-theme";

const InteractiveMap = dynamic(() => import("@/components/ui/InteractiveMap"), { ssr: false });

/* ── Glass panel wrapper ─── */
function GlassPanel({ children, className = "", glow }: { children: React.ReactNode; className?: string; glow?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${className}`}
      style={{
        background: "rgba(10,15,30,0.55)",
        backdropFilter: "blur(20px) saturate(1.4)",
        borderColor: "rgba(255,255,255,0.06)",
        boxShadow: glow
          ? `0 0 30px ${glow}, inset 0 1px 0 rgba(255,255,255,0.04)`
          : "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent)" }} />
      {children}
    </div>
  );
}

/* ── Section heading ─── */
function SectionHead({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.12)" }}>
        <span className="text-base">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">{title}</h3>
        {sub && <p className="text-[11px] text-white/30">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Animated number ─── */
function AnimNum({ value, color, prefix = "", suffix = "" }: { value: string; color: string; prefix?: string; suffix?: string }) {
  return (
    <span className="font-mono text-2xl font-bold tabular-nums" style={{ color, textShadow: `0 0 20px ${color}33` }}>
      {prefix}{value}{suffix}
    </span>
  );
}

/* ── Energy mini bar ─── */
function EnergyMiniBar({ fossil, renewable, nuclear }: { fossil: number; renewable: number; nuclear: number }) {
  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
      <div style={{ width: `${fossil}%`, background: "#ef4444", opacity: 0.7 }} />
      <div style={{ width: `${renewable}%`, background: "#22c55e", opacity: 0.8 }} />
      <div style={{ width: `${nuclear}%`, background: "#3b82f6", opacity: 0.7 }} />
    </div>
  );
}

const ENERGY_REGIONS = [
  { name: "North America", twh: 5125, pop: 580, renewable: 22, fossil: 62, nuclear: 16, color: "#eab308", flag: "\u{1F30E}" },
  { name: "Europe", twh: 3890, pop: 748, renewable: 38, fossil: 42, nuclear: 20, color: "#3b82f6", flag: "\u{1F30D}" },
  { name: "Asia Pacific", twh: 14200, pop: 4300, renewable: 15, fossil: 72, nuclear: 13, color: "#ef4444", flag: "\u{1F30F}" },
  { name: "Middle East", twh: 1150, pop: 410, renewable: 3, fossil: 95, nuclear: 2, color: "#f97316", flag: "\u{1F3DC}\u{FE0F}" },
  { name: "S. America", twh: 1200, pop: 430, renewable: 62, fossil: 30, nuclear: 8, color: "#22c55e", flag: "\u{1F30E}" },
  { name: "Africa", twh: 830, pop: 1400, renewable: 20, fossil: 74, nuclear: 6, color: "#a78bfa", flag: "\u{1F30D}" },
];

export default function OverviewTab() {
  const { weather, isLoading: wl } = useWeather();
  const { quakes, isLoading: ql } = useEarthquakes();
  const { markets, isLoading: ml } = useMarkets();
  const { global: health, isLoading: hl } = useHealth();

  const [liveValues, setLiveValues] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [globalMwh, setGlobalMwh] = useState(0);

  useEffect(() => {
    const update = () => {
      const vals: Record<string, number> = {};
      LIVE_STATS.forEach((s) => { vals[s.id] = computeLiveValue(s); });
      setLiveValues(vals);
      setLastUpdate(new Date().toLocaleTimeString());
      const now = new Date();
      const jan1 = new Date(now.getFullYear(), 0, 1);
      setGlobalMwh(Math.floor(((now.getTime() - jan1.getTime()) / 1000) * 924147));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  const totalCap = markets?.reduce((s, c) => s + (c.market_cap || 0), 0) ?? 0;
  const cryptoChart = markets?.slice(0, 8).map((c) => ({ n: c.symbol?.toUpperCase(), v: +(c.market_cap / 1e9).toFixed(0) }));
  const tempChart = weather?.map((c) => ({ n: c.name.length > 6 ? c.name.slice(0, 6) : c.name, t: c.temp }));
  const healthPie = health ? [{ n: "Recovered", v: health.recovered }, { n: "Active", v: health.active }, { n: "Deaths", v: health.deaths }] : [];

  return (
    <div className="space-y-6">
      {/* REAL-TIME STATUS BAR */}
      <GlassPanel glow="rgba(110,231,183,0.04)">
        <div className="flex flex-wrap items-center gap-4 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px rgba(52,211,153,0.6)" }} />
            </span>
            <span className="text-xs font-bold tracking-widest" style={{ color: "#6EE7B7" }}>REAL-TIME</span>
          </div>
          <div className="h-4 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs text-white/40">
            80+ live counters across universe, atmosphere, geology, biology &middot; <span className="text-white/60">{lastUpdate}</span>
          </span>
          <span className="ml-auto hidden text-[11px] text-white/25 lg:block">
            Weather 5m &middot; Quakes 2m &middot; Crypto 1m &middot; Cosmic 1s
          </span>
        </div>
      </GlassPanel>

      {/* AI BRIEFING + ENERGY COUNTER */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassPanel className="lg:col-span-2" glow="rgba(96,165,250,0.04)">
          <div className="relative p-5">
            <div className="absolute right-5 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider" style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.15)" }}>
              AI INSIGHT
            </div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-base">{"\u{1F916}"}</span>
              <span className="text-sm font-bold text-white/90">Universal Intelligence Briefing</span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-white/50">
              {!ql && quakes && quakes.length > 0
                ? `${quakes.length} seismic events in the last 30 days. `
                : "Loading seismic data... "}
              {!ml && markets && markets.length > 0
                ? `Crypto market cap: ${fmtUsd(totalCap)}. `
                : ""}
              {!wl && weather
                ? `${weather.length} weather stations streaming. `
                : ""}
              Earth has rotated <span className="font-mono font-bold" style={{ color: "#22d3ee" }}>{fmt(liveValues["earth_rotation_km"] || 0)} km</span> today.
              {" "}Global energy at <span className="font-mono font-bold" style={{ color: "#eab308" }}>{fmt(globalMwh)} MWh</span> YTD.
              {" "}<span className="font-mono font-bold" style={{ color: "#fbbf24" }}>{fmt(liveValues["lightning_strikes"] || 0)}</span> lightning strikes today.
              {" "}All systems nominal.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel glow="rgba(234,179,8,0.06)">
          <div className="flex h-full flex-col justify-center p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">{"\u26A1"}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Global Energy YTD</span>
            </div>
            <div className="font-mono text-3xl font-black tabular-nums" style={{ color: "#eab308", textShadow: "0 0 25px rgba(234,179,8,0.25)" }}>
              {fmt(globalMwh)}
            </div>
            <div className="mt-1 text-[11px] text-white/30">MWh consumed &middot; 924K MW/sec</div>
            <div className="mt-3">
              <EnergyMiniBar fossil={62} renewable={28} nuclear={10} />
              <div className="mt-1.5 flex justify-between text-[9px] text-white/25">
                <span>{"\u{1F534}"} Fossil 62%</span>
                <span>{"\u{1F7E2}"} Renew 28%</span>
                <span>{"\u{1F535}"} Nuclear 10%</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* INTERACTIVE GLOBAL MAP */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <SectionHead icon={"\u{1F5FA}\u{FE0F}"} title="Global Intelligence Map" sub="Zoom in/out like Google Maps \u00B7 Switch data layers \u00B7 Click markers for details" />
        <InteractiveMap />
      </motion.div>

      {/* ENERGY CONSUMPTION BY REGION */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <SectionHead icon={"\u26A1"} title="Energy Consumption by Region" sub="Real-time estimates from IEA / EIA / IRENA" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ENERGY_REGIONS.map((r) => {
            const perCapita = ((r.twh * 1e3) / r.pop).toFixed(1);
            const mwPerSec = ((r.twh * 1e6) / (365.25 * 24 * 3600)).toFixed(0);
            return (
              <GlassPanel key={r.name} glow={`${r.color}08`}>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">{r.flag}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{r.name}</span>
                  </div>
                  <div className="font-mono text-xl font-bold tabular-nums" style={{ color: r.color, textShadow: `0 0 15px ${r.color}33` }}>
                    {fmt(r.twh)} <span className="text-xs font-normal text-white/30">TWh/yr</span>
                  </div>
                  <div className="mt-2 text-[10px] text-white/25">
                    {perCapita} MWh/capita &middot; {mwPerSec} MW/s
                  </div>
                  <div className="mt-2">
                    <EnergyMiniBar fossil={r.fossil} renewable={r.renewable} nuclear={r.nuclear} />
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </motion.div>

      {/* LIVE WORLD STATISTICS BY CATEGORY */}
      {STAT_CATEGORIES.map((cat, catIdx) => {
        const stats = LIVE_STATS.filter((s) => s.category === cat);
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + catIdx * 0.05, duration: 0.5 }}
          >
            <SectionHead icon={stats[0]?.icon || "\u{1F4CA}"} title={cat} sub={`${stats.length} live metrics`} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {stats.map((stat) => {
                const val = liveValues[stat.id] ?? stat.baseValue;
                return (
                  <GlassPanel key={stat.id}>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-base">{stat.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">{stat.label}</span>
                      </div>
                      <AnimNum
                        value={fmt(val)}
                        color={stat.color}
                        prefix={stat.unit === "$" ? "$" : ""}
                        suffix={stat.unit && stat.unit !== "$" && stat.unit !== "" ? ` ${stat.unit}` : ""}
                      />
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/25">
                        {stat.direction === "up" && <span className="font-bold" style={{ color: "#34d399" }}>{"\u25B2"} live</span>}
                        {stat.direction === "down" && <span className="font-bold" style={{ color: "#f87171" }}>{"\u25BC"} live</span>}
                        {stat.direction === "neutral" && <span>{"\u2501"} est.</span>}
                        <span>&middot; {stat.source}</span>
                      </div>
                    </div>
                  </GlassPanel>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* API-POWERED METRICS */}
      <div>
        <SectionHead icon={"\u{1F4CA}"} title="Live API Data" sub="Auto-refreshing from external sources" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Earthquakes (30d)" value={ql ? "..." : fmt(quakes?.length ?? 0)} numeric={quakes?.length} format={fmt} accent="#eab308" />
          <MetricCard label="Crypto Market Cap" value={ml ? "..." : fmtUsd(totalCap)} numeric={totalCap} format={fmtUsd} accent="#8b5cf6" />
          <MetricCard label="COVID Cases" value={hl ? "..." : fmt(health?.cases)} accent="#3b82f6" />
          <MetricCard label="Countries" value="195" accent="#f97316" />
          <MetricCard label="APIs Cataloged" value={String(API_COUNT)} numeric={API_COUNT} accent="#ec4899" sub={`${FREE_COUNT} free`} />
          <MetricCard label="COVID Deaths" value={hl ? "..." : fmt(health?.deaths)} accent="#ef4444" />
        </div>
      </div>

      {/* CHARTS */}
      <div>
        <SectionHead icon={"\u{1F4C8}"} title="Analytics" sub="Visual intelligence from live data streams" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Crypto chart */}
          <GlassPanel glow="rgba(139,92,246,0.04)">
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Top Crypto &middot; Market Cap ($B)</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(139,92,246,0.1)", color: "#A78BFA" }}>LIVE</span>
              </div>
              {ml || !cryptoChart ? <SkeletonLoader height={180} variant="chart" /> : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={cryptoChart}>
                    <defs>
                      {cryptoChart.map((_, i) => (
                        <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3} />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis dataKey="n" tick={{ ...AXIS_STYLE, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ ...AXIS_STYLE, fill: "rgba(255,255,255,0.2)" }} axisLine={false} tickLine={false} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Bar dataKey="v" radius={[8, 8, 0, 0]}>{cryptoChart.map((_, i) => <Cell key={i} fill={`url(#barGrad${i})`} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassPanel>

          {/* Temperature chart */}
          <GlassPanel glow="rgba(16,185,129,0.04)">
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">City Temperatures (&deg;C)</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(16,185,129,0.1)", color: "#34D399" }}>LIVE</span>
              </div>
              {wl || !tempChart ? <SkeletonLoader height={180} variant="chart" /> : (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={tempChart}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="50%" stopColor="#10b981" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="n" tick={{ ...AXIS_STYLE, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ ...AXIS_STYLE, fill: "rgba(255,255,255,0.2)" }} axisLine={false} tickLine={false} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="t" stroke="#10b981" strokeWidth={2.5} fill="url(#tempGrad)" dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#10b981", stroke: "#030810", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassPanel>

          {/* Health pie */}
          <GlassPanel glow="rgba(59,130,246,0.04)">
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">COVID-19 Breakdown</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(59,130,246,0.1)", color: "#60A5FA" }}>GLOBAL</span>
              </div>
              {hl || healthPie.length === 0 ? <SkeletonLoader height={180} variant="chart" /> : (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <defs>
                        <filter id="pieGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                      </defs>
                      <Pie data={healthPie} cx="50%" cy="50%" innerRadius={38} outerRadius={65} paddingAngle={4} dataKey="v" nameKey="n" stroke="none" style={{ filter: "url(#pieGlow)" }}>
                        <Cell fill="#10b981" />
                        <Cell fill="#eab308" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v as number), ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-5">
                    {([["Recovered","#10b981"],["Active","#eab308"],["Deaths","#ef4444"]] as const).map(([l,c]) => (
                      <div key={l} className="flex items-center gap-2 text-xs text-white/40">
                        <div className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}66` }} />
                        {l}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </GlassPanel>

          {/* Weather grid */}
          <GlassPanel glow="rgba(251,191,36,0.04)">
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Live City Weather</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(251,191,36,0.1)", color: "#FBBF24" }}>8 CITIES</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(weather || Array(8).fill(null)).map((c: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl p-2.5 text-center transition-all duration-300 hover:scale-105"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    {c ? (
                      <>
                        <div className="text-xl">{weatherIcon(c.code)}</div>
                        <div className="mt-1 text-[10px] font-semibold text-white/50">{c.flag}{c.name.split(" ")[0]}</div>
                        <div className="font-mono text-base font-bold tabular-nums" style={{ color: COLORS[i % COLORS.length], textShadow: `0 0 10px ${COLORS[i % COLORS.length]}33` }}>{c.temp}&deg;</div>
                      </>
                    ) : (
                      <div className="py-2">
                        <div className="skeleton-shimmer mx-auto mb-1 h-5 w-5 rounded-full" />
                        <div className="skeleton-shimmer mx-auto h-3 w-10 rounded" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
