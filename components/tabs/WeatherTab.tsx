"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { useWeather } from "@/hooks/useWeather";
import { COLORS } from "@/lib/constants";
import { weatherIcon, weatherLabel } from "@/lib/constants";
import { TOOLTIP_STYLE } from "@/lib/chart-theme";

export default function WeatherTab() {
  const { weather, isLoading, error, refresh } = useWeather();

  if (isLoading) return <SkeletonLoader height={300} variant="cards" />;
  if (error || !weather) return <ErrorCard message="Weather data unavailable" onRetry={() => refresh()} />;

  return (
    <div>
      <div className="mb-5 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {weather.map((c, i) => (
          <div
            key={c.name}
            className="card-glow rounded-2xl border p-5 transition hover:-translate-y-1"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  {c.flag} {c.name}
                </div>
                <div className="mt-0.5 text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {weatherLabel(c.code)}
                </div>
              </div>
              <span className="text-3xl">{weatherIcon(c.code)}</span>
            </div>
            <div
              className="mb-3 text-4xl font-bold"
              style={{ color: COLORS[i % COLORS.length], fontVariantNumeric: "tabular-nums" }}
            >
              {c.temp}°C
            </div>
            <div className="mb-3 flex gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span>Feels {c.feels}°C</span>
              <span>💨 {c.wind} km/h</span>
            </div>
            {c.hourly.length > 0 && (
              <ResponsiveContainer width="100%" height={60}>
                <AreaChart data={c.hourly.filter((_, j) => j % 2 === 0)}>
                  <Area type="monotone" dataKey="t" stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length] + "22"} strokeWidth={1.5} dot={false} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}°C`, ""]} labelFormatter={(v) => `${Number(v) * 2}h`} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-xl border px-4 py-3 text-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          Open-Meteo ↗
        </a>{" "}— free, no API key, updated hourly
      </div>
    </div>
  );
}
