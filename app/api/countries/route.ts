import { NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,population,area,region,flags,capital,continents,languages,currencies",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) throw new Error("REST Countries API error");
    const data = await res.json();
    const sorted = Array.isArray(data)
      ? data.sort(
          (a: { population: number }, b: { population: number }) =>
            (b.population || 0) - (a.population || 0)
        )
      : [];
    return NextResponse.json(sorted);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Countries fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
