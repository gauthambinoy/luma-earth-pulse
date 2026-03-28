import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
  try {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";

    const [apodRes, neoRes, issRes, astroRes, windRes, kpRes] = await Promise.allSettled([
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}`, { next: { revalidate: 3600 } }),
      fetch("http://api.open-notify.org/iss-now.json", { cache: "no-store" }),
      fetch("http://api.open-notify.org/astros.json", { next: { revalidate: 300 } }),
      fetch("https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json", { next: { revalidate: 300 } }),
      fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json", { next: { revalidate: 300 } }),
    ]);

    let apod = null;
    if (apodRes.status === "fulfilled" && apodRes.value.ok) {
      apod = await apodRes.value.json();
    }

    let neoCount = 0, hazardousCount = 0, closestApproachKm = 0;
    if (neoRes.status === "fulfilled" && neoRes.value.ok) {
      const neoData = await neoRes.value.json();
      neoCount = neoData.element_count || 0;
      const allNeos = Object.values(neoData.near_earth_objects || {}).flat() as {
        is_potentially_hazardous_asteroid: boolean;
        close_approach_data: { miss_distance: { kilometers: string } }[];
      }[];
      hazardousCount = allNeos.filter((n) => n.is_potentially_hazardous_asteroid).length;
      let closest = Infinity;
      for (const neo of allNeos) {
        for (const approach of neo.close_approach_data || []) {
          const km = parseFloat(approach.miss_distance.kilometers);
          if (km < closest) closest = km;
        }
      }
      closestApproachKm = closest === Infinity ? 0 : Math.round(closest);
    }

    let iss = null;
    if (issRes.status === "fulfilled" && issRes.value.ok) {
      const d = await issRes.value.json();
      iss = {
        latitude: parseFloat(d.iss_position?.latitude ?? "0"),
        longitude: parseFloat(d.iss_position?.longitude ?? "0"),
        timestamp: d.timestamp ?? Math.floor(Date.now() / 1000),
      };
    }

    let astronauts: { name: string; craft: string }[] = [];
    if (astroRes.status === "fulfilled" && astroRes.value.ok) {
      const d = await astroRes.value.json();
      astronauts = (d.people ?? []).map((p: { name: string; craft: string }) => ({
        name: p.name,
        craft: p.craft,
      }));
    }

    let solarWind = null;
    if (windRes.status === "fulfilled" && windRes.value.ok) {
      const d = await windRes.value.json();
      solarWind = { speed: parseFloat(d.WindSpeed ?? "0"), timestamp: d.TimeStamp ?? "" };
    }

    let kpIndex = null;
    if (kpRes.status === "fulfilled" && kpRes.value.ok) {
      const d = await kpRes.value.json();
      if (Array.isArray(d) && d.length > 1) {
        kpIndex = parseFloat(d[d.length - 1]?.[1] ?? "0");
      }
    }

    return NextResponse.json({ apod, neoCount, hazardousCount, closestApproachKm, iss, astronauts, solarWind, kpIndex });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Space fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
