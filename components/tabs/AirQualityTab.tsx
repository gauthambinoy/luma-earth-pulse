"use client";

import useSWR from "swr";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { aqiColor } from "@/lib/formatters";
import { fmtDate } from "@/lib/formatters";
import type { AirQualityResponse, AirQualityStation } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AirQualityTab() {
  const { data, error, isLoading, mutate } = useSWR<AirQualityResponse>(
    "/api/air",
    fetcher,
    { refreshInterval: 600_000 }
  );

  if (isLoading) return <SkeletonLoader height={300} />;
  if (error || !data || "error" in data)
    return <ErrorCard message="Air quality data unavailable" onRetry={() => mutate()} />;

  const stations = data.stations ?? [];

  if (stations.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm" style={{ color: "var(--text-tertiary)" }}>
        No recent air quality data available from OpenAQ.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {stations.map((s: AirQualityStation) => {
          const { color, label } = aqiColor(s.value);
          return (
            <div
              key={s.city + s.location}
              className="rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-accent/30"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="mb-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.city}</div>
              <div className="mb-1 text-xs" style={{ color: "var(--text-muted)" }}>{s.location}</div>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums" style={{ color }}>
                  {s.value.toFixed(1)}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.unit}</span>
              </div>
              <div className="mb-1 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ background: color }} />
                <span className="text-sm" style={{ color }}>{label}</span>
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {s.parameter.toUpperCase()} · {s.lastUpdated ? fmtDate(s.lastUpdated) : "—"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://openaq.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          OpenAQ ↗
        </a>{" "}— open air quality data · free, no key required
      </div>
    </div>
  );
}
