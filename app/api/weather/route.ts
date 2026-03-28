import { NextResponse } from "next/server";
import { CITIES } from "@/lib/constants";
import type { WeatherCity } from "@/lib/types";

export const revalidate = 300;

export async function GET() {
  try {
    const results = await Promise.allSettled(
      CITIES.map(async (city) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,windspeed_10m,weathercode,apparent_temperature&hourly=temperature_2m&forecast_days=1`;
        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) throw new Error(`Weather API error for ${city.name}`);
        const data = await res.json();
        const c: WeatherCity = {
          name: city.name,
          lat: city.lat,
          lon: city.lon,
          flag: city.flag,
          temp: Math.round(data.current?.temperature_2m ?? 0),
          feels: Math.round(data.current?.apparent_temperature ?? 0),
          wind: Math.round(data.current?.windspeed_10m ?? 0),
          code: data.current?.weathercode ?? 0,
          hourly: (data.hourly?.temperature_2m ?? []).map(
            (t: number, i: number) => ({ h: i, t: Math.round(t) })
          ),
        };
        return c;
      })
    );

    const cities = results
      .filter(
        (r): r is PromiseFulfilledResult<WeatherCity> =>
          r.status === "fulfilled"
      )
      .map((r) => r.value);

    return NextResponse.json({ cities });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Weather fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
