"use client";

import { useState, useMemo } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import DataTable from "@/components/ui/DataTable";
import { COLORS } from "@/lib/constants";
import { fmt } from "@/lib/formatters";
import { TOOLTIP_STYLE, AXIS_STYLE } from "@/lib/chart-theme";
import type { Country } from "@/lib/types";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const REGION_COLORS: Record<string, string> = {
  Africa: "#6EE7B7",
  Americas: "#FCD34D",
  Asia: "#F87171",
  Europe: "#60A5FA",
  Oceania: "#C4B5FD",
};

export default function CountriesTab() {
  const { data, error, isLoading, mutate } = useSWR<Country[]>(
    "/api/countries",
    fetcher,
    { refreshInterval: 86_400_000 }
  );
  const [query, setQuery] = useState("");

  const countries = data && !("error" in data) ? data : null;

  const filtered = useMemo(
    () =>
      countries?.filter(
        (c) =>
          !query ||
          c.name?.common?.toLowerCase().includes(query.toLowerCase()) ||
          c.region?.toLowerCase().includes(query.toLowerCase())
      ) ?? [],
    [countries, query]
  );

  const regions = useMemo(() => {
    if (!countries) return [];
    const map: Record<string, number> = {};
    countries.forEach((c) => {
      map[c.region || "Other"] = (map[c.region || "Other"] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [countries]);

  const popChart = useMemo(
    () =>
      countries?.slice(0, 8).map((c) => ({
        n: c.name?.common?.split(" ")[0] ?? "",
        v: +(c.population / 1e6).toFixed(0),
      })) ?? [],
    [countries]
  );

  const columns = [
    {
      key: "flag",
      label: "",
      render: (c: Country) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.flags?.svg || c.flags?.png}
          alt=""
          className="h-[13px] w-5 rounded-[1px] object-cover"
        />
      ),
    },
    {
      key: "name",
      label: "Country",
      render: (c: Country) => (
        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{c.name?.common}</span>
      ),
    },
    {
      key: "region",
      label: "Region",
      render: (c: Country) => {
        const rc = REGION_COLORS[c.region] || "#888";
        return (
          <span
            className="rounded border px-1.5 py-px text-xs"
            style={{ background: rc + "22", color: rc, borderColor: rc + "33" }}
          >
            {c.region}
          </span>
        );
      },
    },
    {
      key: "pop",
      label: "Population",
      render: (c: Country) => <span className="tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmt(c.population)}</span>,
      sortValue: (c: Country) => c.population,
    },
    {
      key: "area",
      label: "Area km²",
      render: (c: Country) => <span className="tabular-nums" style={{ color: "var(--text-tertiary)" }}>{c.area ? fmt(Math.round(c.area)) : "—"}</span>,
      sortValue: (c: Country) => c.area || 0,
    },
    {
      key: "capital",
      label: "Capital",
      render: (c: Country) => <span style={{ color: "var(--text-tertiary)" }}>{c.capital?.[0] || "—"}</span>,
    },
    {
      key: "languages",
      label: "Languages",
      render: (c: Country) => (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {c.languages ? Object.values(c.languages).slice(0, 2).join(", ") : "—"}
        </span>
      ),
    },
    {
      key: "currencies",
      label: "Currencies",
      render: (c: Country) => (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {c.currencies ? Object.values(c.currencies).map((cu) => cu.symbol || cu.name).slice(0, 2).join(", ") : "—"}
        </span>
      ),
    },
  ];

  if (isLoading) return <SkeletonLoader height={300} />;
  if (error || !countries)
    return <ErrorCard message="Countries data unavailable" onRetry={() => mutate()} />;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search countries or regions..."
        className="mb-4 w-full rounded-lg border px-4 py-2.5 font-mono text-xs focus:outline-none"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>Countries by region</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={regions} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" nameKey="name">
                {regions.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>Most populous · millions</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={popChart}>
              <XAxis dataKey="n" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v + "M", "Population"]} />
              <Bar dataKey="v" radius={[3, 3, 0, 0]}>
                {popChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable data={filtered} columns={columns} maxRows={250} />

      <div className="mt-2.5 rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          REST Countries API ↗
        </a>{" "}— free, no key · {filtered.length} countries matched
      </div>
    </div>
  );
}
