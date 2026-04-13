"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
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

export default function OverviewTab() {
  const { weather, isLoading: wl } = useWeather();
  const { quakes, isLoading: ql } = useEarthquakes();
  const { markets, isLoading: ml } = useMarkets();
  const { global: health, isLoading: hl } = useHealth();

  const [liveValues, setLiveValues] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // Tick every second for live counters
  useEffect(() => {
    const update = () => {
      const vals: Record<string, number> = {};
      LIVE_STATS.forEach((s) => { vals[s.id] = computeLiveValue(s); });
      setLiveValues(vals);
      setLastUpdate(new Date().toLocaleTimeString());
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
    <div>
      {/* Real-time indicator bar */}
      <div
        className="mb-5 flex items-center gap-3 rounded-2xl border px-5 py-3"
        style={{
          background: "rgba(10,15,26,0.6)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(110,231,183,0.1)",
          boxShadow: "0 0 20px rgba(110,231,183,0.05), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="relative inline-block h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full bg-green-500" />
            <span className="absolute inset-0 rounded-full bg-green-500" style={{ animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
          </span>
          <span className="text-sm font-semibold text-aurora">REAL-TIME</span>
        </div>
        <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          40+ live counters updating every second · Last tick: {lastUpdate}
        </span>
        <span className="ml-auto text-sm" style={{ color: "var(--text-muted)" }}>
          APIs refresh: Weather 5m · Quakes 2m · Crypto 1m · Health 1h
        </span>
      </div>

      {/* ══════ LIVE WORLD STATISTICS BY CATEGORY ══════ */}
      {STAT_CATEGORIES.map((cat) => {
        const stats = LIVE_STATS.filter((s) => s.category === cat);
        return (
          <div key={cat} className="mb-6">
            <div className="mb-3 text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {stats[0]?.icon} {cat}
            </div>
            <div className="stagger-children grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {stats.map((stat) => {
                const val = liveValues[stat.id] ?? stat.baseValue;
                return (
                  <div
                    key={stat.id}
                    className="card-glow spotlight-card rounded-2xl border p-4"
                    style={{ background: "var(--bg-card)", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-lg">{stat.icon}</span>
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                        {stat.label}
                      </span>
                    </div>
                    <div className="font-mono text-2xl font-bold tabular-nums" style={{ color: stat.color }}>
                      {stat.unit === "$" ? "$" : ""}{fmt(val)}{stat.unit && stat.unit !== "$" && stat.unit !== "" ? ` ${stat.unit}` : ""}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                      {stat.direction === "up" && <span style={{ color: "#10b981" }}>▲ live</span>}
                      {stat.direction === "neutral" && <span>━ est.</span>}
                      <span>· {stat.source}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ══════ API-POWERED LIVE DATA ══════ */}
      <div className="mb-6">
        <div className="mb-3 text-lg font-bold" style={{ color: "var(--text-primary)" }}>📊 Live API Data <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>(auto-refreshing)</span></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Earthquakes (30d)" value={ql ? "..." : fmt(quakes?.length ?? 0)} numeric={quakes?.length} format={fmt} accent="#eab308" />
          <MetricCard label="Crypto Market Cap" value={ml ? "..." : fmtUsd(totalCap)} numeric={totalCap} format={fmtUsd} accent="#8b5cf6" />
          <MetricCard label="COVID Cases" value={hl ? "..." : fmt(health?.cases)} accent="#3b82f6" />
          <MetricCard label="Countries" value="195" accent="#f97316" />
          <MetricCard label="APIs Cataloged" value={String(API_COUNT)} numeric={API_COUNT} accent="#ec4899" sub={`${FREE_COUNT} free`} />
          <MetricCard label="COVID Deaths" value={hl ? "..." : fmt(health?.deaths)} accent="#ef4444" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="chart-panel rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>Top Crypto · Market Cap ($B)</div>
          {ml || !cryptoChart ? <SkeletonLoader height={180} variant="chart" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={cryptoChart}><XAxis dataKey="n" tick={AXIS_STYLE} axisLine={false} tickLine={false} /><YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} /><Tooltip {...TOOLTIP_STYLE} /><Bar dataKey="v" radius={[6, 6, 0, 0]}>{cryptoChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar></BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="chart-panel rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>City Temperatures (°C)</div>
          {wl || !tempChart ? <SkeletonLoader height={180} variant="chart" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={tempChart}><XAxis dataKey="n" tick={AXIS_STYLE} axisLine={false} tickLine={false} /><YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} /><Tooltip {...TOOLTIP_STYLE} /><defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="t" stroke="#10b981" fill="url(#tg)" strokeWidth={2} /></AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="chart-panel rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>COVID-19 Breakdown</div>
          {hl || healthPie.length === 0 ? <SkeletonLoader height={180} variant="chart" /> : (
            <><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={healthPie} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={3} dataKey="v" nameKey="n"><Cell fill="#10b981" /><Cell fill="#eab308" /><Cell fill="#ef4444" /></Pie><Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v as number), ""]} /></PieChart></ResponsiveContainer>
            <div className="flex justify-center gap-4">{[["Recovered","#10b981"],["Active","#eab308"],["Deaths","#ef4444"]].map(([l,c])=>(<div key={l} className="flex items-center gap-1.5 text-xs" style={{color:"var(--text-tertiary)"}}><div className="h-2 w-2 rounded-full" style={{background:c}}/>{l}</div>))}</div></>
          )}
        </div>
        <div className="chart-panel rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>Live City Weather</div>
          <div className="grid grid-cols-4 gap-2">
            {(weather || Array(8).fill(null)).map((c, i) => (
              <div key={i} className="rounded-xl p-2 text-center" style={{ background: "var(--bg-secondary)" }}>
                {c ? (<><div className="text-xl">{weatherIcon(c.code)}</div><div className="text-xs font-semibold" style={{color:"var(--text-primary)"}}>{c.flag}{c.name.split(" ")[0]}</div><div className="font-mono text-lg font-bold tabular-nums" style={{color:COLORS[i%COLORS.length]}}>{c.temp}°</div></>) : (<div className="py-2"><div className="skeleton-shimmer mx-auto mb-1 h-5 w-5 rounded-full"/><div className="skeleton-shimmer mx-auto h-3 w-10 rounded"/></div>)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
