"use client";

import useSWR from "swr";
import dynamic from "next/dynamic";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { fmt } from "@/lib/formatters";
import type { SpaceResponse } from "@/lib/types";

const WorldMap = dynamic(() => import("@/components/ui/WorldMap"), { ssr: false });

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function kpLabel(kp: number): string {
  if (kp <= 1) return "Quiet";
  if (kp <= 3) return "Unsettled";
  if (kp <= 4) return "Active";
  if (kp <= 5) return "Minor Storm";
  if (kp <= 7) return "Strong Storm";
  return "Severe Storm";
}

function kpColor(kp: number): string {
  if (kp <= 1) return "#6EE7B7";
  if (kp <= 3) return "#FCD34D";
  if (kp <= 5) return "#FB923C";
  return "#F87171";
}

export default function SpaceTab() {
  const { data, error, isLoading, mutate } = useSWR<SpaceResponse>(
    "/api/space",
    fetcher,
    { refreshInterval: 30_000 }
  );

  if (isLoading) return <SkeletonLoader height={300} />;
  if (error || !data || "error" in data)
    return <ErrorCard message="Space data unavailable" onRetry={() => mutate()} />;

  const { apod, neoCount, hazardousCount, closestApproachKm, iss, astronauts, solarWind, kpIndex } = data;

  return (
    <div>
      {/* ISS Live Tracker Map */}
      {iss && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
              ISS Live Position
            </span>
            <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-accent" />
            <span className="text-xs" style={{ color: "var(--accent)" }}>
              {iss.latitude.toFixed(2)}°, {iss.longitude.toFixed(2)}°
            </span>
          </div>
          <WorldMap points={[]} issPosition={iss} height={280} />
        </div>
      )}

      {/* Metrics Row */}
      <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5">
        <MetricCard label="NEO This Week" value={String(neoCount)} numeric={neoCount} accent="#FCD34D" sub="Near-Earth Objects" />
        <MetricCard label="Hazardous" value={String(hazardousCount)} numeric={hazardousCount} accent="#F87171" sub="Potentially dangerous" />
        <MetricCard label="Closest Approach" value={fmt(closestApproachKm) + " km"} accent="#60A5FA" sub="Nearest fly-by" />
        <MetricCard
          label="Astronauts in Space"
          value={String(astronauts.length)}
          numeric={astronauts.length}
          accent="#C4B5FD"
          sub="Currently aboard ISS/stations"
        />
        {solarWind && (
          <MetricCard
            label="Solar Wind"
            value={solarWind.speed.toFixed(0) + " km/s"}
            accent="#FB923C"
            sub="Current speed"
          />
        )}
        {kpIndex != null && (
          <MetricCard
            label="Kp Index (Aurora)"
            value={kpIndex.toFixed(1) + " — " + kpLabel(kpIndex)}
            accent={kpColor(kpIndex)}
            sub="Geomagnetic activity"
          />
        )}
      </div>

      {/* Astronaut List */}
      {astronauts.length > 0 && (
        <div className="mb-4 rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            People in Space Right Now
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
            {astronauts.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-2 rounded-lg border px-4 py-2"
                style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{a.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{a.craft}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* APOD */}
      {apod && (
        <div className="mb-4 overflow-hidden rounded-2xl border" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          {apod.media_type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={apod.hdurl || apod.url}
              alt={apod.title}
              className="block max-h-[400px] w-full object-cover"
              loading="lazy"
            />
          )}
          {apod.media_type === "video" && (
            <div className="p-5 text-center text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              Today&apos;s APOD is a video —{" "}
              <a href={apod.url} target="_blank" rel="noopener" className="text-accent">
                watch it here ↗
              </a>
            </div>
          )}
          <div className="p-5">
            <div className="mb-1.5 text-base font-semibold" style={{ color: "var(--text-primary)" }}>{apod.title}</div>
            <div className="mb-3 text-xs tracking-[0.5px]" style={{ color: "var(--text-muted)" }}>
              {apod.date}
              {apod.copyright && ` — © ${apod.copyright}`}
            </div>
            <div className="text-[13px] leading-7" style={{ color: "var(--text-secondary)" }}>
              {apod.explanation?.slice(0, 600)}
              {(apod.explanation?.length ?? 0) > 600 ? "..." : ""}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          NASA Open APIs ↗
        </a>{" "}·{" "}
        <a href="http://open-notify.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          Open Notify ↗
        </a>{" "}·{" "}
        <a href="https://www.swpc.noaa.gov" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          NOAA Space Weather ↗
        </a>
      </div>
    </div>
  );
}
