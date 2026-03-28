import { NextResponse } from "next/server";

export const revalidate = 86400;

interface WBEntry {
  country: { value: string; id: string };
  date: string;
  value: number | null;
}

async function fetchIndicator(indicator: string) {
  const url = `https://api.worldbank.org/v2/country/USA;CHN;JPN;DEU;IND;GBR;FRA;BRA;ITA;CAN/indicator/${indicator}?format=json&per_page=100&mrv=10`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) return [];
  return (data[1] ?? []).map((e: WBEntry) => ({
    country: e.country?.value ?? "",
    countryCode: e.country?.id ?? "",
    year: e.date ?? "",
    value: e.value,
  }));
}

export async function GET() {
  try {
    const [gdp, population, inflation, lifeExpectancy, unemployment, co2] =
      await Promise.all([
        fetchIndicator("NY.GDP.MKTP.CD"),
        fetchIndicator("SP.POP.TOTL"),
        fetchIndicator("FP.CPI.TOTL.ZG"),
        fetchIndicator("SP.DYN.LE00.IN"),
        fetchIndicator("SL.UEM.TOTL.ZS"),
        fetchIndicator("EN.ATM.CO2E.PC"),
      ]);

    return NextResponse.json({ gdp, population, inflation, lifeExpectancy, unemployment, co2 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Economy fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
