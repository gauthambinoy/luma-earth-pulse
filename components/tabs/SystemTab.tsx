"use client";

import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { TOOLTIP_STYLE, AXIS_STYLE } from "@/lib/chart-theme";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function statusColor(status: string): string {
  if (status === "ok") return "#10b981";
  return "#ef4444";
}

function msColor(ms: number): string {
  if (ms < 500) return "#10b981";
  if (ms < 1000) return "#eab308";
  if (ms < 2000) return "#f97316";
  return "#ef4444";
}

export default function SystemTab() {
  const { data, error, isLoading, mutate } = useSWR("/api/health-check", fetcher, { refreshInterval: 60000 });

  if (isLoading) return <SkeletonLoader height={400} variant="cards" />;
  if (error || !data) return <ErrorCard message="Health check failed" onRetry={() => mutate()} />;

  const endpoints = data.endpoints || [];
  const healthy = data.healthy || 0;
  const total = data.total || 0;
  const avgMs = data.avgResponseMs || 0;

  const chartData = endpoints.map((ep: { name: string; responseMs: number }) => ({
    name: ep.name.split("(")[0].trim(),
    ms: ep.responseMs,
  }));

  return (
    <div>
      {/* Overall status banner */}
      <div className="mb-6 rounded-2xl border p-6 text-center"
        style={{
          background: data.overall === "healthy" ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
          borderColor: data.overall === "healthy" ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
        }}>
        <div className="mb-2 text-4xl">{data.overall === "healthy" ? "✅" : data.overall === "degraded" ? "⚠️" : "❌"}</div>
        <div className="text-2xl font-bold" style={{ color: data.overall === "healthy" ? "#10b981" : "#ef4444" }}>
          System {data.overall === "healthy" ? "Healthy" : data.overall === "degraded" ? "Degraded" : "Unhealthy"}
        </div>
        <div className="mt-1 text-base" style={{ color: "var(--text-tertiary)" }}>
          {healthy}/{total} APIs responding · Avg {avgMs}ms
        </div>
      </div>

      {/* Metrics */}
      <div className="stagger-children mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard label="APIs Online" value={`${healthy}/${total}`} numeric={healthy} accent="#10b981" glow />
        <MetricCard label="Avg Response" value={`${avgMs}ms`} numeric={avgMs} format={(n) => n + "ms"} accent={msColor(avgMs)} />
        <MetricCard label="Error Rate" value={`${((1 - healthy / total) * 100).toFixed(0)}%`} accent={healthy === total ? "#10b981" : "#ef4444"} />
        <MetricCard label="Uptime" value={healthy === total ? "100%" : `${((healthy / total) * 100).toFixed(0)}%`} accent="#3b82f6" />
      </div>

      {/* Response time chart */}
      <div className="mb-6 rounded-2xl border p-6" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="mb-4 text-base font-semibold" style={{ color: "var(--text-tertiary)" }}>Response Times (ms)</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ ...AXIS_STYLE, fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v + "ms", "Response time"]} />
            <Bar dataKey="ms" radius={[0, 6, 6, 0]}>
              {chartData.map((ep: { ms: number }, i: number) => (
                <Cell key={i} fill={msColor(ep.ms)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Individual endpoint status */}
      <div className="mb-4 text-base font-semibold" style={{ color: "var(--text-tertiary)" }}>Endpoint Details</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {endpoints.map((ep: { name: string; status: string; responseMs: number; statusCode: number; critical: boolean }) => (
          <div key={ep.name} className="card-glow flex items-center justify-between rounded-2xl border p-5"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: ep.status === "ok" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" }}>
                <div className="h-3 w-3 rounded-full" style={{ background: statusColor(ep.status) }} />
              </div>
              <div>
                <div className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>{ep.name}</div>
                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {ep.critical ? "🔴 Critical" : "Standard"} · HTTP {ep.statusCode || "Timeout"}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg font-bold tabular-nums" style={{ color: msColor(ep.responseMs) }}>
                {ep.responseMs}ms
              </div>
              <div className="text-sm font-medium" style={{ color: statusColor(ep.status) }}>
                {ep.status === "ok" ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        Auto-refreshes every 60 seconds · Last checked: {new Date(data.checkedAt).toLocaleTimeString()}
      </div>
    </div>
  );
}
