"use client";

import useSWR from "swr";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis,
} from "recharts";
import MetricCard from "@/components/ui/MetricCard";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { fmtDate, fmt } from "@/lib/formatters";
import { COLORS } from "@/lib/constants";
import { TOOLTIP_STYLE, AXIS_STYLE } from "@/lib/chart-theme";
import type { GitHubRepo, HackerNewsStory } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5", JavaScript: "#f1e05a", TypeScript: "#3178c6",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", C: "#555555",
  "C++": "#f34b7d", Ruby: "#701516", Swift: "#F05138", Kotlin: "#A97BFF",
};

export default function TechPulseTab() {
  const { data: ghData, error: ghErr, isLoading: ghLoading, mutate: ghMutate } = useSWR(
    "/api/github",
    fetcher,
    { refreshInterval: 600_000 }
  );
  const { data: hnData, error: hnErr, isLoading: hnLoading, mutate: hnMutate } = useSWR(
    "/api/hackernews",
    fetcher,
    { refreshInterval: 300_000 }
  );

  const ghError = ghErr || (ghData && "error" in ghData);
  const hnError = hnErr || (hnData && "error" in hnData);
  const trending: GitHubRepo[] = ghData?.trending ?? [];
  const langBreakdown: { name: string; count: number }[] = ghData?.languageBreakdown ?? [];
  const hnStories: HackerNewsStory[] = hnData?.stories ?? [];

  const totalStars = trending.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = trending.reduce((s, r) => s + r.forks_count, 0);

  return (
    <div>
      <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-2.5">
        <MetricCard label="Trending Repos" value={String(trending.length)} numeric={trending.length} accent="#818CF8" sub="Created this week" />
        <MetricCard label="Total Stars" value={fmt(totalStars)} numeric={totalStars} format={fmt} accent="#FCD34D" sub="Combined stars" />
        <MetricCard label="Total Forks" value={fmt(totalForks)} numeric={totalForks} format={fmt} accent="#6EE7B7" sub="Combined forks" />
        <MetricCard label="HN Top Stories" value={String(hnStories.length)} numeric={hnStories.length} accent="#FB923C" sub="Hacker News" />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Language breakdown */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            Language breakdown · trending repos
          </div>
          {ghLoading ? (
            <SkeletonLoader height={180} />
          ) : ghError ? (
            <ErrorCard message="GitHub unavailable" onRetry={() => ghMutate()} />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={langBreakdown.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="name"
                  >
                    {langBreakdown.slice(0, 8).map((l, i) => (
                      <Cell key={i} fill={LANG_COLORS[l.name] || COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {langBreakdown.slice(0, 6).map((l, i) => (
                  <div key={l.name} className="flex items-center gap-1 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <div className="h-[6px] w-[6px] rounded-full" style={{ background: LANG_COLORS[l.name] || COLORS[i % COLORS.length] }} />
                    {l.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top HN by score */}
        <div className="rounded-2xl border p-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            HN top stories · by points
          </div>
          {hnLoading ? (
            <SkeletonLoader height={180} />
          ) : hnError ? (
            <ErrorCard message="HN unavailable" onRetry={() => hnMutate()} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={hnStories.slice(0, 10).map((s) => ({ t: s.title.slice(0, 20) + "\u2026", s: s.score }))}>
                <XAxis dataKey="t" tick={{ ...AXIS_STYLE, fontSize: 7 }} axisLine={false} tickLine={false} angle={-20} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="s" fill="#FB923C" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Trending repos grid */}
      {!ghLoading && !ghError && trending.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            Trending repositories · this week
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5">
            {trending.slice(0, 12).map((r) => (
              <a
                key={r.id}
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-accent/30"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.owner?.avatar_url} alt="" className="h-5 w-5 rounded-full" />
                  <span className="truncate text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{r.full_name}</span>
                </div>
                {r.description && (
                  <div className="mb-2 text-sm leading-4" style={{ color: "var(--text-tertiary)" }}>
                    {r.description.slice(0, 100)}{r.description.length > 100 ? "\u2026" : ""}
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                  {r.language && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: LANG_COLORS[r.language] || "#888" }} />
                      {r.language}
                    </span>
                  )}
                  <span>⭐ {fmt(r.stargazers_count)}</span>
                  <span>🍴 {fmt(r.forks_count)}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* HN stories list */}
      {!hnLoading && !hnError && hnStories.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[1.5px]" style={{ color: "var(--text-tertiary)" }}>
            Hacker News · top stories
          </div>
          <div className="space-y-1">
            {hnStories.slice(0, 15).map((s, i) => (
              <a
                key={s.id}
                href={s.url || `https://news.ycombinator.com/item?id=${s.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-lg border px-4 py-2.5 transition hover:border-accent/20"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <span className="mt-0.5 font-mono text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium" style={{ color: "var(--text-primary)" }}>{s.title}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span className="font-semibold" style={{ color: "var(--accent)" }}>{s.score} pts</span>
                    <span>{s.by}</span>
                    <span>{fmtDate(s.time * 1000)}</span>
                    <span>{s.descendants} comments</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          GitHub API ↗
        </a>{" "}·{" "}
        <a href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          Hacker News ↗
        </a>
      </div>
    </div>
  );
}
