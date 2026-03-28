"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import dynamic from "next/dynamic";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import DataTable from "@/components/ui/DataTable";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import { fmt, fmtDate, magColor } from "@/lib/formatters";
import { TOOLTIP_STYLE, AXIS_STYLE } from "@/lib/chart-theme";
import type { Earthquake } from "@/lib/types";

const WorldMap = dynamic(() => import("@/components/ui/WorldMap"), { ssr: false });
const MAG_COLORS = ["#6EE7B7", "#FCD34D", "#FB923C", "#F87171", "#EF4444", "#DC2626", "#B91C1C"];

export default function EarthquakeTab() {
  const { quakes, isLoading, error, refresh } = useEarthquakes();
  const [minMag, setMinMag] = useState(4);

  const filtered = useMemo(() => quakes?.filter((q) => q.mag >= minMag) ?? [], [quakes, minMag]);
  const magBuckets = useMemo(() => {
    if (!quakes) return [];
    return Array.from({ length: 7 }, (_, i) => ({ m: `M${i + 3}+`, n: quakes.filter((q) => Math.floor(q.mag) === i + 3).length })).filter((b) => b.n > 0);
  }, [quakes]);

  const mapPoints = useMemo(
    () => filtered.slice(0, 150).map((q) => ({ lat: q.lat, lon: q.lon, size: Math.max(2, (q.mag - 2) * 1.8), color: magColor(q.mag), pulse: q.mag >= 5 })),
    [filtered]
  );

  const columns = [
    {
      key: "mag", label: "Magnitude",
      render: (q: Earthquake) => {
        const c = magColor(q.mag);
        return <span className="inline-block rounded-lg border px-3 py-1 font-mono text-sm font-bold" style={{ background: c + "18", color: c, borderColor: c + "40" }}>M{q.mag?.toFixed(1)}</span>;
      },
      sortValue: (q: Earthquake) => q.mag,
    },
    { key: "place", label: "Location", render: (q: Earthquake) => <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{q.place}</span> },
    { key: "depth", label: "Depth (km)", render: (q: Earthquake) => <span className="font-mono text-sm tabular-nums" style={{ color: "var(--text-tertiary)" }}>{q.depth?.toFixed(0)}</span>, sortValue: (q: Earthquake) => q.depth },
    { key: "time", label: "Time", render: (q: Earthquake) => <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{fmtDate(q.time)}</span>, sortValue: (q: Earthquake) => q.time },
  ];

  if (isLoading) return <SkeletonLoader height={300} variant="cards" />;
  if (error || !quakes) return <ErrorCard message="Earthquake data unavailable" onRetry={() => refresh()} />;

  return (
    <div>
      <div className="stagger-children mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="Total (30d ≥2.5)" value={fmt(quakes.length)} numeric={quakes.length} format={fmt} accent="#eab308" />
        <MetricCard label="Significant (M≥5)" value={String(quakes.filter((q) => q.mag >= 5).length)} numeric={quakes.filter((q) => q.mag >= 5).length} accent="#f97316" />
        <MetricCard label="Major (M≥6)" value={String(quakes.filter((q) => q.mag >= 6).length)} numeric={quakes.filter((q) => q.mag >= 6).length} accent="#ef4444" />
        <MetricCard label="Strongest" value={"M" + Math.max(...quakes.map((q) => q.mag)).toFixed(1)} accent="#dc2626" />
      </div>

      <div className="mb-5">
        <div className="mb-2 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>Earthquake Epicenters · Past 30 Days</div>
        <WorldMap points={mapPoints} height={340} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Filter:</span>
        {[2.5, 4, 5, 6, 7].map((v) => (
          <button key={v} onClick={() => setMinMag(v)}
            className="rounded-xl border px-4 py-1.5 font-mono text-sm font-medium transition"
            style={{
              background: minMag === v ? "var(--accent-bg)" : "transparent",
              borderColor: minMag === v ? "var(--accent)" : "var(--border)",
              color: minMag === v ? "var(--accent)" : "var(--text-secondary)",
            }}>
            M≥{v}
          </button>
        ))}
        <span className="ml-2 text-sm" style={{ color: "var(--text-muted)" }}>{filtered.length} events</span>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="chart-panel rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>Magnitude Distribution</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={magBuckets}>
              <XAxis dataKey="m" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="n" radius={[6, 6, 0, 0]}>{magBuckets.map((_, i) => <Cell key={i} fill={MAG_COLORS[i] || "#EF4444"} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-panel rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>Depth Distribution (km)</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={[
              { d: "0-10", n: filtered.filter(q => q.depth < 10).length },
              { d: "10-30", n: filtered.filter(q => q.depth >= 10 && q.depth < 30).length },
              { d: "30-70", n: filtered.filter(q => q.depth >= 30 && q.depth < 70).length },
              { d: "70-150", n: filtered.filter(q => q.depth >= 70 && q.depth < 150).length },
              { d: "150+", n: filtered.filter(q => q.depth >= 150).length },
            ]}>
              <XAxis dataKey="d" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="n" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable data={filtered} columns={columns} maxRows={80} />

      <div className="mt-4 rounded-xl border px-4 py-3 text-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://earthquake.usgs.gov" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>USGS Earthquake Hazards Program ↗</a> — real-time GeoJSON · M2.5+ worldwide
      </div>
    </div>
  );
}
