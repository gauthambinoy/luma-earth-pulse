"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import { ALL_APIS, FREE_APIS, PAID_APIS, API_CATEGORIES, API_COUNT, FREE_COUNT, PAID_COUNT, ENDPOINT_COUNT } from "@/lib/api-catalog";
import { COLORS } from "@/lib/constants";
import { TOOLTIP_STYLE, AXIS_STYLE } from "@/lib/chart-theme";

const TIER_COLORS: Record<string, string> = { free: "#6EE7B7", freemium: "#FCD34D", paid: "#F87171" };
const TIER_LABELS: Record<string, string> = { free: "FREE", freemium: "FREEMIUM", paid: "PAID" };

export default function DataSourcesTab() {
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<"all" | "free" | "freemium" | "paid">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => ALL_APIS.filter((a) => {
      if (filterCat && a.category !== filterCat) return false;
      if (filterTier !== "all" && a.tier !== filterTier) return false;
      if (query) {
        const q = query.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      }
      return true;
    }),
    [filterCat, filterTier, query]
  );

  const catBreakdown = useMemo(
    () => API_CATEGORIES.map((cat) => ({
      name: cat.label.split(" ")[0],
      free: FREE_APIS.filter((a) => a.category === cat.id).length,
      paid: PAID_APIS.filter((a) => a.category === cat.id).length,
    })).filter((c) => c.free + c.paid > 0),
    []
  );

  const tierBreakdown = [
    { name: "Free (No Key)", value: FREE_COUNT, color: "#6EE7B7" },
    { name: "Freemium", value: PAID_APIS.filter((a) => a.tier === "freemium").length, color: "#FCD34D" },
    { name: "Paid Only", value: PAID_APIS.filter((a) => a.tier === "paid").length, color: "#F87171" },
  ];

  return (
    <div>
      <div className="stagger-children mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Total APIs" value={String(API_COUNT)} numeric={API_COUNT} accent="#10b981" glow sub="Free + Paid" />
        <MetricCard label="Free (No Key)" value={String(FREE_COUNT)} numeric={FREE_COUNT} accent="#3b82f6" sub="Zero auth" />
        <MetricCard label="Freemium/Paid" value={String(PAID_COUNT)} numeric={PAID_COUNT} accent="#eab308" sub="Free tiers available" />
        <MetricCard label="~Endpoints" value={String(ENDPOINT_COUNT)} numeric={ENDPOINT_COUNT} accent="#8b5cf6" sub="Data points" />
        <MetricCard label="Categories" value={String(API_CATEGORIES.length)} numeric={API_CATEGORIES.length} accent="#f97316" sub="Data domains" />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>Free vs Paid</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={tierBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" nameKey="name">
                {tierBreakdown.map((t, i) => <Cell key={i} fill={t.color} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3">
            {tierBreakdown.map((t) => (
              <div key={t.name} className="flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <div className="h-2 w-2 rounded-full" style={{ background: t.color }} /> {t.name}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border p-5 md:col-span-2" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>APIs by Category</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={catBreakdown}>
              <XAxis dataKey="name" tick={{ ...AXIS_STYLE, fontSize: 9 }} axisLine={false} tickLine={false} angle={-15} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="free" stackId="a" fill="#6EE7B7" radius={[0, 0, 0, 0]} />
              <Bar dataKey="paid" stackId="a" fill="#FCD34D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 200+ APIs by name, description, or category..."
          className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: "all" as const, label: `All (${API_COUNT})`, c: "#10b981" },
            { key: "free" as const, label: `Free (${FREE_COUNT})`, c: "#10b981" },
            { key: "freemium" as const, label: `Freemium (${PAID_APIS.filter((a) => a.tier === "freemium").length})`, c: "#eab308" },
            { key: "paid" as const, label: `Paid (${PAID_APIS.filter((a) => a.tier === "paid").length})`, c: "#ef4444" },
          ].map((t) => (
            <button key={t.key} onClick={() => setFilterTier(t.key)}
              className="rounded-xl border px-3 py-1.5 text-sm font-medium transition"
              style={{
                background: filterTier === t.key ? t.c + "15" : "transparent",
                borderColor: filterTier === t.key ? t.c + "50" : "var(--border)",
                color: filterTier === t.key ? t.c : "var(--text-secondary)",
              }}>
              {t.label}
            </button>
          ))}

          <span className="mx-1 self-center text-sm" style={{ color: "var(--text-muted)" }}>|</span>

          <button onClick={() => setFilterCat(null)}
            className="rounded-xl border px-3 py-1.5 text-sm transition"
            style={{
              background: !filterCat ? "var(--accent-bg)" : "transparent",
              borderColor: !filterCat ? "var(--accent)" + "40" : "var(--border)",
              color: !filterCat ? "var(--accent)" : "var(--text-secondary)",
            }}>
            All Categories
          </button>
          {API_CATEGORIES.map((cat) => {
            const count = ALL_APIS.filter((a) => a.category === cat.id).length;
            if (count === 0) return null;
            return (
              <button key={cat.id} onClick={() => setFilterCat(filterCat === cat.id ? null : cat.id)}
                className="rounded-xl border px-2.5 py-1.5 text-xs transition"
                style={{
                  background: filterCat === cat.id ? cat.color + "15" : "transparent",
                  borderColor: filterCat === cat.id ? cat.color + "40" : "var(--border)",
                  color: filterCat === cat.id ? cat.color : "var(--text-secondary)",
                }}>
                {cat.icon} {cat.label.split(" ")[0]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* API Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3">
        {filtered.map((api) => {
          const cat = API_CATEGORIES.find((c) => c.id === api.category);
          const tc = TIER_COLORS[api.tier] || "#888";
          const tl = TIER_LABELS[api.tier] || "—";
          return (
            <div key={api.id} className="group card-glow rounded-2xl border p-5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{api.name}</div>
                <span className="shrink-0 rounded-lg border px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: tc + "15", color: tc, borderColor: tc + "40" }}>{tl}</span>
              </div>
              <div className="mb-3 text-sm leading-5" style={{ color: "var(--text-tertiary)" }}>{api.description}</div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg px-2 py-0.5 text-xs"
                  style={{ background: (cat?.color || "#888") + "12", color: cat?.color || "#888" }}>
                  {cat?.icon} {cat?.label}
                </span>
                <span className="rounded-lg px-2 py-0.5 text-xs" style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
                  {api.rateLimit}
                </span>
                <a href={api.docsUrl} target="_blank" rel="noopener noreferrer"
                  className="ml-auto text-xs opacity-0 transition group-hover:opacity-100"
                  style={{ color: "var(--accent)" }}>
                  Docs ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border px-4 py-3 text-center text-sm" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        Showing {filtered.length} of {API_COUNT} APIs · {FREE_COUNT} free · {PAID_COUNT} freemium/paid · {API_CATEGORIES.length} categories
      </div>
    </div>
  );
}
