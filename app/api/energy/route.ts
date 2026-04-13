import { NextResponse } from "next/server";
import { getCircuitBreaker } from "@/lib/circuit-breaker";

export const revalidate = 300;

// Top 10 energy-consuming countries with estimated real-time consumption data
// Sources: IEA World Energy Outlook 2024, BP Statistical Review, EIA International Energy Statistics
const ENERGY_COUNTRIES = [
  { code: "CHN", name: "China", annualTWh: 8637, fossil: 0.61, nuclear: 0.05, renewable: 0.34, population: 1412000000, flag: "🇨🇳" },
  { code: "USA", name: "United States", annualTWh: 4050, fossil: 0.60, nuclear: 0.18, renewable: 0.22, population: 334000000, flag: "🇺🇸" },
  { code: "IND", name: "India", annualTWh: 1863, fossil: 0.74, nuclear: 0.03, renewable: 0.23, population: 1408000000, flag: "🇮🇳" },
  { code: "RUS", name: "Russia", annualTWh: 1166, fossil: 0.62, nuclear: 0.20, renewable: 0.18, population: 144000000, flag: "🇷🇺" },
  { code: "JPN", name: "Japan", annualTWh: 937, fossil: 0.71, nuclear: 0.07, renewable: 0.22, population: 125000000, flag: "🇯🇵" },
  { code: "BRA", name: "Brazil", annualTWh: 672, fossil: 0.17, nuclear: 0.02, renewable: 0.81, population: 214000000, flag: "🇧🇷" },
  { code: "CAN", name: "Canada", annualTWh: 644, fossil: 0.18, nuclear: 0.15, renewable: 0.67, population: 39000000, flag: "🇨🇦" },
  { code: "DEU", name: "Germany", annualTWh: 550, fossil: 0.44, nuclear: 0.00, renewable: 0.56, population: 84000000, flag: "🇩🇪" },
  { code: "KOR", name: "South Korea", annualTWh: 593, fossil: 0.63, nuclear: 0.28, renewable: 0.09, population: 52000000, flag: "🇰🇷" },
  { code: "FRA", name: "France", annualTWh: 472, fossil: 0.09, nuclear: 0.65, renewable: 0.26, population: 68000000, flag: "🇫🇷" },
];

// Global energy mix (IEA 2024 data)
const GLOBAL_MIX = {
  totalAnnualTWh: 29165,
  coal: 0.355,
  gas: 0.223,
  oil: 0.029,
  nuclear: 0.093,
  hydro: 0.148,
  wind: 0.076,
  solar: 0.056,
  other_renewable: 0.020,
};

const SECS_PER_YEAR = 365.25 * 24 * 3600;

export async function GET() {
  const breaker = getCircuitBreaker("energy");

  const data = await breaker.execute(
    async () => {
      // Calculate real-time energy values
      const now = new Date();
      const jan1 = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      const secsSinceJan1 = (Date.now() - jan1.getTime()) / 1000;
      const yearFraction = secsSinceJan1 / SECS_PER_YEAR;

      // Per-country data with real-time consumption
      const countries = ENERGY_COUNTRIES.map((c) => {
        const consumedTWh = c.annualTWh * yearFraction;
        const perCapitaMWh = (c.annualTWh * 1000) / c.population;
        return {
          code: c.code,
          name: c.name,
          flag: c.flag,
          annualTWh: c.annualTWh,
          consumedTWh: Math.round(consumedTWh * 100) / 100,
          perCapitaMWh: Math.round(perCapitaMWh * 100) / 100,
          mwhPerSecond: Math.round((c.annualTWh * 1e6 / SECS_PER_YEAR) * 100) / 100,
          mix: {
            fossil: Math.round(c.fossil * 100),
            nuclear: Math.round(c.nuclear * 100),
            renewable: Math.round(c.renewable * 100),
          },
          population: c.population,
        };
      });

      // Global aggregates (real-time)
      const globalConsumedTWh = GLOBAL_MIX.totalAnnualTWh * yearFraction;
      const globalMWhPerSecond = GLOBAL_MIX.totalAnnualTWh * 1e6 / SECS_PER_YEAR;

      // Source breakdown
      const sources = [
        { name: "Coal", share: GLOBAL_MIX.coal, annualTWh: Math.round(GLOBAL_MIX.totalAnnualTWh * GLOBAL_MIX.coal), color: "#57534e", icon: "🪨" },
        { name: "Natural Gas", share: GLOBAL_MIX.gas, annualTWh: Math.round(GLOBAL_MIX.totalAnnualTWh * GLOBAL_MIX.gas), color: "#fb923c", icon: "🔥" },
        { name: "Nuclear", share: GLOBAL_MIX.nuclear, annualTWh: Math.round(GLOBAL_MIX.totalAnnualTWh * GLOBAL_MIX.nuclear), color: "#a78bfa", icon: "☢️" },
        { name: "Hydropower", share: GLOBAL_MIX.hydro, annualTWh: Math.round(GLOBAL_MIX.totalAnnualTWh * GLOBAL_MIX.hydro), color: "#0ea5e9", icon: "🌊" },
        { name: "Wind", share: GLOBAL_MIX.wind, annualTWh: Math.round(GLOBAL_MIX.totalAnnualTWh * GLOBAL_MIX.wind), color: "#38bdf8", icon: "💨" },
        { name: "Solar", share: GLOBAL_MIX.solar, annualTWh: Math.round(GLOBAL_MIX.totalAnnualTWh * GLOBAL_MIX.solar), color: "#fbbf24", icon: "☀️" },
        { name: "Oil", share: GLOBAL_MIX.oil, annualTWh: Math.round(GLOBAL_MIX.totalAnnualTWh * GLOBAL_MIX.oil), color: "#44403c", icon: "🛢" },
        { name: "Other Renewables", share: GLOBAL_MIX.other_renewable, annualTWh: Math.round(GLOBAL_MIX.totalAnnualTWh * GLOBAL_MIX.other_renewable), color: "#22c55e", icon: "🌿" },
      ];

      return {
        global: {
          totalAnnualTWh: GLOBAL_MIX.totalAnnualTWh,
          consumedTWh: Math.round(globalConsumedTWh * 100) / 100,
          mwhPerSecond: Math.round(globalMWhPerSecond * 100) / 100,
          renewableShare: Math.round((GLOBAL_MIX.hydro + GLOBAL_MIX.wind + GLOBAL_MIX.solar + GLOBAL_MIX.other_renewable) * 1000) / 10,
          fossilShare: Math.round((GLOBAL_MIX.coal + GLOBAL_MIX.gas + GLOBAL_MIX.oil) * 1000) / 10,
          nuclearShare: Math.round(GLOBAL_MIX.nuclear * 1000) / 10,
        },
        countries,
        sources,
        timestamp: Date.now(),
      };
    },
    () => ({
      global: {
        totalAnnualTWh: GLOBAL_MIX.totalAnnualTWh,
        consumedTWh: 0,
        mwhPerSecond: 0,
        renewableShare: 30,
        fossilShare: 60.7,
        nuclearShare: 9.3,
      },
      countries: [],
      sources: [],
      timestamp: Date.now(),
    })
  );

  return NextResponse.json(data);
}
