import { NextResponse } from "next/server";
import type { Earthquake } from "@/lib/types";

export const revalidate = 300;

export async function GET() {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error("USGS API error");
    const data = await res.json();

    const quakes: Earthquake[] = (data.features ?? [])
      .map(
        (f: {
          properties: { mag: number; place: string; time: number };
          geometry: { coordinates: number[] };
        }) => ({
          mag: f.properties.mag,
          place: f.properties.place,
          time: f.properties.time,
          depth: f.geometry.coordinates[2],
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
        })
      )
      .filter((q: Earthquake) => q.mag >= 2.5)
      .sort((a: Earthquake, b: Earthquake) => b.time - a.time)
      .slice(0, 500);

    return NextResponse.json({ quakes });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Earthquake fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
