import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const [globalRes, countriesRes] = await Promise.all([
      fetch("https://disease.sh/v3/covid-19/all", {
        next: { revalidate: 3600 },
      }),
      fetch(
        "https://disease.sh/v3/covid-19/countries?sort=cases&allowNull=true",
        { next: { revalidate: 3600 } }
      ),
    ]);

    if (!globalRes.ok) throw new Error("disease.sh global API error");
    if (!countriesRes.ok) throw new Error("disease.sh countries API error");

    const global = await globalRes.json();
    const allCountries = await countriesRes.json();
    const countries = Array.isArray(allCountries)
      ? allCountries.slice(0, 20)
      : [];

    return NextResponse.json({ global, countries });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Health fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
