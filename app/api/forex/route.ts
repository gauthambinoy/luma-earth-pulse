import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const [latestRes, histRes] = await Promise.allSettled([
      fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 300 } }),
      fetch("https://api.frankfurter.app/2024-01-01..?from=USD&to=EUR,GBP,JPY,CNY,INR,AUD,CAD,CHF", {
        next: { revalidate: 3600 },
      }),
    ]);

    let latest = null;
    if (latestRes.status === "fulfilled" && latestRes.value.ok) {
      const d = await latestRes.value.json();
      latest = {
        base: "USD",
        rates: d.rates ?? {},
        timestamp: d.time_last_update_utc ?? new Date().toISOString(),
      };
    }

    let historical: Record<string, unknown>[] = [];
    if (histRes.status === "fulfilled" && histRes.value.ok) {
      const d = await histRes.value.json();
      if (d.rates) {
        historical = Object.entries(d.rates)
          .map(([date, rates]) => ({ date, ...(rates as Record<string, number>) }))
          .slice(-90);
      }
    }

    return NextResponse.json({ latest, historical });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Forex fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
