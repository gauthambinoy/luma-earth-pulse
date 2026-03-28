import { NextResponse } from "next/server";

export const revalidate = 600;

export async function GET() {
  try {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    const dateStr = today.toISOString().split("T")[0];

    const res = await fetch(
      `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=20`,
      {
        next: { revalidate: 600 },
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );

    if (!res.ok) throw new Error("GitHub API error");
    const data = await res.json();

    const trending = (data.items ?? []).map(
      (r: {
        id: number;
        name: string;
        full_name: string;
        description: string | null;
        html_url: string;
        stargazers_count: number;
        forks_count: number;
        language: string | null;
        owner: { avatar_url: string; login: string };
        created_at: string;
      }) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
        owner: { avatar_url: r.owner?.avatar_url, login: r.owner?.login },
        created_at: r.created_at,
      })
    );

    const langMap: Record<string, number> = {};
    trending.forEach((r: { language: string | null }) => {
      const lang = r.language || "Unknown";
      langMap[lang] = (langMap[lang] || 0) + 1;
    });
    const languageBreakdown = Object.entries(langMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ trending, languageBreakdown });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "GitHub fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
