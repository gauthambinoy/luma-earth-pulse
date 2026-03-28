import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const [marketsRes, trendingRes] = await Promise.allSettled([
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=true",
        { next: { revalidate: 60 } }
      ),
      fetch("https://api.coingecko.com/api/v3/search/trending", {
        next: { revalidate: 300 },
      }),
    ]);

    let coins = [];
    if (marketsRes.status === "fulfilled" && marketsRes.value.ok) {
      coins = await marketsRes.value.json();
    }

    let trending = [];
    if (trendingRes.status === "fulfilled" && trendingRes.value.ok) {
      const d = await trendingRes.value.json();
      trending = d.coins ?? [];
    }

    return NextResponse.json({ coins, trending });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Markets fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
