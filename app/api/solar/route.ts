import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const [windRes, kpRes] = await Promise.allSettled([
      fetch("https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json", {
        next: { revalidate: 300 },
      }),
      fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json", {
        next: { revalidate: 300 },
      }),
    ]);

    let solarWind = null;
    if (windRes.status === "fulfilled" && windRes.value.ok) {
      const d = await windRes.value.json();
      solarWind = {
        speed: parseFloat(d.WindSpeed ?? "0"),
        timestamp: d.TimeStamp ?? "",
      };
    }

    let kpIndex = null;
    if (kpRes.status === "fulfilled" && kpRes.value.ok) {
      const d = await kpRes.value.json();
      if (Array.isArray(d) && d.length > 1) {
        const latest = d[d.length - 1];
        kpIndex = parseFloat(latest[1] ?? "0");
      }
    }

    return NextResponse.json({ solarWind, kpIndex });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Solar fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
