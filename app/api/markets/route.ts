import { NextResponse } from "next/server";
import { CryptoMarketSchema } from "@/lib/schemas";
import { getCircuitBreaker } from "@/lib/circuit-breaker";

export const revalidate = 60;

const marketsBreaker = getCircuitBreaker("markets");

export async function GET() {
  try {
    const [marketsRes, trendingRes] = await Promise.allSettled([
      marketsBreaker.execute(
        () => fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&sparkline=true",
          { next: { revalidate: 60 } }
        ).then(async (r) => {
          if (!r.ok) throw new Error(`CoinGecko markets HTTP ${r.status}`);
          return r.json();
        }),
        () => []
      ),
      fetch("https://api.coingecko.com/api/v3/search/trending", {
        next: { revalidate: 300 },
      }),
    ]);

    let coins: unknown[] = [];
    if (marketsRes.status === "fulfilled") {
      const raw = marketsRes.value;
      const parsed = CryptoMarketSchema.array().safeParse(raw);
      coins = parsed.success ? parsed.data : [];
    }

    let trending: unknown[] = [];
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
