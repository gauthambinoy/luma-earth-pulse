"use client";

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import DataTable from "@/components/ui/DataTable";
import { useHealth } from "@/hooks/useHealth";
import { fmt } from "@/lib/formatters";
import { TOOLTIP_STYLE } from "@/lib/chart-theme";
import type { HealthCountry } from "@/lib/types";

export default function HealthTab() {
  const { global: health, countries, isLoading, error, refresh } = useHealth();

  if (isLoading) return <SkeletonLoader height={300} />;
  if (error || !health)
    return <ErrorCard message="Health data unavailable" onRetry={() => refresh()} />;

  const pieData = [
    { n: "Recovered", v: health.recovered },
    { n: "Active", v: health.active },
    { n: "Deaths", v: health.deaths },
  ];
  const pieColors = ["#6EE7B7", "#FCD34D", "#F87171"];

  const rates = [
    { l: "Case Fatality Rate", v: ((health.deaths / health.cases) * 100).toFixed(2) + "%", c: "#F87171" },
    { l: "Recovery Rate", v: ((health.recovered / health.cases) * 100).toFixed(1) + "%", c: "#6EE7B7" },
    { l: "Tests per Million", v: fmt(Math.round(health.testsPerOneMillion)), c: "#C4B5FD" },
    { l: "Cases per Million", v: fmt(Math.round(health.casesPerOneMillion)), c: "#60A5FA" },
    { l: "Deaths per Million", v: fmt(Math.round(health.deathsPerOneMillion)), c: "#F87171" },
    { l: "Population Affected", v: ((health.cases / 7.9e9) * 100).toFixed(2) + "%", c: "#FCD34D" },
  ];

  const countryColumns = [
    {
      key: "country",
      label: "Country",
      render: (c: HealthCountry) => (
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.countryInfo?.flag} alt="" className="h-3 w-5 rounded-sm object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{c.country}</span>
        </div>
      ),
    },
    { key: "cases", label: "Cases", render: (c: HealthCountry) => <span className="tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmt(c.cases)}</span>, sortValue: (c: HealthCountry) => c.cases },
    { key: "deaths", label: "Deaths", render: (c: HealthCountry) => <span className="tabular-nums text-red-400">{fmt(c.deaths)}</span>, sortValue: (c: HealthCountry) => c.deaths },
    { key: "recovered", label: "Recovered", render: (c: HealthCountry) => <span className="tabular-nums text-green-400">{fmt(c.recovered)}</span>, sortValue: (c: HealthCountry) => c.recovered },
    { key: "active", label: "Active", render: (c: HealthCountry) => <span className="tabular-nums text-yellow-400">{fmt(c.active)}</span>, sortValue: (c: HealthCountry) => c.active },
  ];

  return (
    <div>
      <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-2.5">
        <MetricCard label="Total Cases" value={fmt(health.cases)} sub="All-time global" accent="#60A5FA" />
        <MetricCard label="Deaths" value={fmt(health.deaths)} sub="All-time global" accent="#F87171" />
        <MetricCard label="Recovered" value={fmt(health.recovered)} sub="Total recovered" accent="#6EE7B7" />
        <MetricCard label="Active" value={fmt(health.active)} sub="Currently active" accent="#FCD34D" />
        <MetricCard label="Critical" value={fmt(health.critical)} sub="ICU / critical" accent="#FB923C" />
        <MetricCard label="Tests" value={fmt(health.tests)} sub="Total conducted" accent="#C4B5FD" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>Case breakdown</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="v" nameKey="n">
                {pieColors.map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [fmt(v as number), ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3.5">
            {[["Recovered", "#6EE7B7"], ["Active", "#FCD34D"], ["Deaths", "#F87171"]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <div className="h-[7px] w-[7px] rounded-full" style={{ background: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3.5 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>Global rates</div>
          {rates.map((r, i) => (
            <div key={i} className="flex items-center justify-between border-b py-2" style={{ borderColor: "var(--border)" }}>
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>{r.l}</span>
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: r.c }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      {countries && countries.length > 0 && (
        <>
          <div className="mb-2 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>Top 20 countries by cases</div>
          <DataTable data={countries} columns={countryColumns} maxRows={20} />
        </>
      )}

      <div className="mt-2.5 rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://disease.sh" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          disease.sh ↗
        </a>{" "}— open disease data · no key required
      </div>
    </div>
  );
}
