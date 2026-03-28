"use client";

import useSWR from "swr";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import ErrorCard from "@/components/ui/ErrorCard";
import { fmtDate } from "@/lib/formatters";
import type { NewsResponse, NewsArticle } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function NewsTab() {
  const { data, error, isLoading, mutate } = useSWR<NewsResponse>(
    "/api/news",
    fetcher,
    { refreshInterval: 600_000 }
  );

  if (isLoading) return <SkeletonLoader height={300} />;
  if (error || !data || "error" in data)
    return <ErrorCard message="News data unavailable" onRetry={() => mutate()} />;

  if (data.noApiKey) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border p-8 text-center" style={{ background: "var(--bg-card)", borderColor: "var(--accent)" }}>
        <div className="text-2xl">📰</div>
        <div className="text-sm" style={{ color: "var(--text-primary)" }}>NEWS_API_KEY not configured</div>
        <div className="max-w-md text-xs leading-5" style={{ color: "var(--text-tertiary)" }}>
          To see live news headlines, get a free API key from{" "}
          <a
            href="https://newsapi.org/register"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "var(--accent)" }}
          >
            newsapi.org
          </a>{" "}
          (100 requests/day) and add it to your <code style={{ color: "var(--accent)" }}>.env.local</code> file:
        </div>
        <code className="rounded border px-4 py-1.5 text-sm" style={{ borderColor: "var(--border)", background: "var(--bg-primary)", color: "var(--accent)" }}>
          NEWS_API_KEY=your_key_here
        </code>
      </div>
    );
  }

  const articles = data.articles ?? [];

  return (
    <div>
      <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {articles.map((a: NewsArticle, i: number) => (
          <a
            key={i}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:border-accent/30"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>{a.source?.name}</span>
              <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>{fmtDate(a.publishedAt)}</span>
            </div>
            <div className="mb-2 text-sm font-semibold leading-5" style={{ color: "var(--text-primary)" }}>
              {a.title}
            </div>
            {a.description && (
              <div className="text-sm leading-4" style={{ color: "var(--text-tertiary)" }}>
                {a.description.slice(0, 150)}
                {a.description.length > 150 ? "..." : ""}
              </div>
            )}
          </a>
        ))}
      </div>

      <div className="rounded-lg border px-4 py-2 text-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
        <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
          NewsAPI ↗
        </a>{" "}— 100 requests/day free tier
      </div>
    </div>
  );
}
