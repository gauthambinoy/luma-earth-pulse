import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ENDPOINTS = [
  { name: "Weather (Open-Meteo)", url: "https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current=temperature_2m", critical: true },
  { name: "Earthquakes (USGS)", url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_hour.geojson", critical: true },
  { name: "Crypto (CoinGecko)", url: "https://api.coingecko.com/api/v3/ping", critical: false },
  { name: "Forex (Frankfurter)", url: "https://api.frankfurter.app/latest?from=USD&to=EUR", critical: false },
  { name: "Health (disease.sh)", url: "https://disease.sh/v3/covid-19/all", critical: false },
  { name: "Countries (REST)", url: "https://restcountries.com/v3.1/alpha/US", critical: false },
  { name: "Space (NASA)", url: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", critical: false },
  { name: "ISS (Open Notify)", url: "http://api.open-notify.org/iss-now.json", critical: false },
  { name: "Solar (NOAA)", url: "https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json", critical: false },
  { name: "Air Quality (OpenAQ)", url: "https://api.openaq.org/v2/latest?limit=1", critical: false },
  { name: "Energy (IEA/EIA)", url: "https://api.eia.gov/v2/", critical: false },
  { name: "GitHub API", url: "https://api.github.com/zen", critical: false },
  { name: "Hacker News", url: "https://hacker-news.firebaseio.com/v0/topstories.json?limitToFirst=1&orderBy=%22$key%22", critical: false },
];

export async function GET() {
  const results = await Promise.all(
    ENDPOINTS.map(async (ep) => {
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(ep.url, { signal: controller.signal, cache: "no-store" });
        clearTimeout(timeout);
        const elapsed = Date.now() - start;
        return {
          name: ep.name,
          status: res.ok ? ("ok" as const) : ("error" as const),
          responseMs: elapsed,
          statusCode: res.status,
          critical: ep.critical,
          lastChecked: Date.now(),
        };
      } catch (err) {
        // Sanitize error message to avoid exposing internal details
        const rawMsg = err instanceof Error ? err.message : "Unknown error";
        const safeMsg = rawMsg.replace(/\/[^\s]+/g, "[path]").slice(0, 100);
        return {
          name: ep.name,
          status: "error" as const,
          responseMs: Date.now() - start,
          statusCode: 0,
          critical: ep.critical,
          lastChecked: Date.now(),
          error: `${ep.name} failed: ${safeMsg}`,
        };
      }
    })
  );

  const healthy = results.filter((r) => r.status === "ok").length;
  const total = results.length;
  const avgMs = Math.round(results.reduce((s, r) => s + r.responseMs, 0) / total);

  return NextResponse.json({
    overall: healthy === total ? "healthy" : healthy >= total * 0.7 ? "degraded" : "unhealthy",
    healthy,
    total,
    avgResponseMs: avgMs,
    endpoints: results,
    checkedAt: Date.now(),
  });
}
