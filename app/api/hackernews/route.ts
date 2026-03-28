import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const idsRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { next: { revalidate: 300 } }
    );
    if (!idsRes.ok) throw new Error("HN API error");
    const ids: number[] = await idsRes.json();

    const top20 = ids.slice(0, 20);
    const stories = await Promise.all(
      top20.map(async (id) => {
        try {
          const r = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
            { next: { revalidate: 300 } }
          );
          if (!r.ok) return null;
          const s = await r.json();
          return {
            id: s.id,
            title: s.title ?? "",
            url: s.url ?? null,
            score: s.score ?? 0,
            by: s.by ?? "",
            time: s.time ?? 0,
            descendants: s.descendants ?? 0,
          };
        } catch {
          return null;
        }
      })
    );

    return NextResponse.json({
      stories: stories.filter(Boolean),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "HackerNews fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
