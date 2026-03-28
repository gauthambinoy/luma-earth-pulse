import { NextResponse } from "next/server";
import type { AirQualityStation } from "@/lib/types";

export const revalidate = 600;

const CITIES = ["Dublin", "London", "New York", "Tokyo", "Sydney", "Mumbai"];

export async function GET() {
  try {
    const results = await Promise.allSettled(
      CITIES.map(async (city) => {
        const res = await fetch(
          `https://api.openaq.org/v2/latest?limit=1&city=${encodeURIComponent(city)}`,
          { next: { revalidate: 600 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const result = data.results?.[0];
        if (!result) return null;
        const measurement = result.measurements?.[0];
        if (!measurement) return null;
        const station: AirQualityStation = {
          city,
          location: result.location || city,
          value: measurement.value ?? 0,
          parameter: measurement.parameter || "pm25",
          unit: measurement.unit || "µg/m³",
          lastUpdated: measurement.lastUpdated || "",
        };
        return station;
      })
    );

    const stations = results
      .filter(
        (r): r is PromiseFulfilledResult<AirQualityStation | null> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value)
      .filter((s): s is AirQualityStation => s !== null);

    return NextResponse.json({ stations });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Air quality fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
