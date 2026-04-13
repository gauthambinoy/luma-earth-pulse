import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Input validation schema
const QueryInputSchema = z.object({
  query: z.string().min(1, "Query is required").max(500, "Query too long (max 500 chars)").trim(),
});

// Smart data query without requiring an AI API key
// Parses natural language patterns and maps to data sources
const QUERY_PATTERNS: { pattern: RegExp; response: (match: RegExpMatchArray) => { answer: string; source: string; suggestion: string } }[] = [
  {
    pattern: /(?:top|largest|biggest|highest)\s+(?:countries?|nations?)\s+(?:by\s+)?(?:population|pop)/i,
    response: () => ({
      answer: "The top 5 countries by population are: China (~1.4B), India (~1.4B), United States (~334M), Indonesia (~277M), and Pakistan (~230M).",
      source: "REST Countries API + World Bank",
      suggestion: "Switch to the Countries tab and sort by population to explore all 250 nations.",
    }),
  },
  {
    pattern: /(?:bitcoin|btc)\s+(?:price|cost|value|worth)/i,
    response: () => ({
      answer: "Check the Markets tab for real-time Bitcoin price data powered by CoinGecko. It updates every 60 seconds with price, 24h change, market cap, and a 7-day sparkline trend.",
      source: "CoinGecko API",
      suggestion: "Go to Markets tab → Bitcoin is always #1 by market cap.",
    }),
  },
  {
    pattern: /(?:earthquake|quake|seismic)\s+(?:today|recent|latest|now)/i,
    response: () => ({
      answer: "The Earthquakes tab shows all M2.5+ earthquakes from the last 30 days, plotted on a world map. Use the magnitude filter buttons to focus on significant events (M5+, M6+, M7+).",
      source: "USGS Earthquake Hazards Program",
      suggestion: "Switch to Earthquakes tab → The world map shows epicenters color-coded by magnitude.",
    }),
  },
  {
    pattern: /(?:weather|temperature|forecast)\s+(?:in\s+)?(\w+)/i,
    response: (match) => ({
      answer: `Weather data is tracked for 8 major cities worldwide. Check the Weather tab for ${match[1] || "your city"}'s current temperature, wind speed, feels-like, and a 24-hour forecast chart.`,
      source: "Open-Meteo API",
      suggestion: "Switch to Weather tab to see all 8 city weather cards with hourly charts.",
    }),
  },
  {
    pattern: /(?:iss|space\s+station|astronaut)/i,
    response: () => ({
      answer: "The ISS is tracked in real-time on the Space & ISS tab. You can see its live position on the world map, the current astronaut roster, and solar weather conditions including Kp aurora index.",
      source: "Open Notify API + NOAA SWPC",
      suggestion: "Go to Space & ISS tab → The map updates every 30 seconds showing ISS position.",
    }),
  },
  {
    pattern: /(?:gdp|economy|inflation|unemployment)\s+(?:of\s+)?(\w+)?/i,
    response: (match) => ({
      answer: `The Economy tab shows 6 key indicators (GDP, Population, Inflation, Life Expectancy, Unemployment, CO2) for the world's 10 largest economies${match[1] ? ` including ${match[1]}` : ""}. Toggle between indicators and view historical trend lines.`,
      source: "World Bank Open Data API",
      suggestion: "Go to Economy tab → Use the indicator buttons to switch between GDP, inflation, etc.",
    }),
  },
  {
    pattern: /(?:covid|pandemic|cases|deaths)\s*(?:global|world)?/i,
    response: () => ({
      answer: "Global COVID-19 statistics are available on the Health tab: total cases, deaths, recovered, active cases, and a breakdown by country. Includes case fatality rate, recovery rate, and per-million statistics.",
      source: "disease.sh API",
      suggestion: "Go to Health tab → The donut chart shows recovered vs active vs deaths breakdown.",
    }),
  },
  {
    pattern: /(?:how many|total|count)\s+(?:apis?|data\s+sources?)/i,
    response: () => ({
      answer: "This dashboard catalogs 200+ APIs — 103 completely free (no key required) and 102 freemium/paid APIs across 20 categories. All are searchable and filterable in the Data Sources tab.",
      source: "Internal API Catalog",
      suggestion: "Go to Data Sources tab → Search and filter across all 200+ APIs.",
    }),
  },
  {
    pattern: /(?:trending|popular|hot)\s+(?:repos?|repositories|github|tech)/i,
    response: () => ({
      answer: "The Tech Pulse tab shows trending GitHub repositories created this week, with star counts, language breakdown pie chart, and Hacker News top stories with scores.",
      source: "GitHub API + Hacker News Firebase API",
      suggestion: "Go to Tech Pulse tab to see what's hot in the developer world.",
    }),
  },
  {
    pattern: /(?:currency|exchange|forex|usd|eur|gbp)/i,
    response: () => ({
      answer: "The Forex tab shows live exchange rates for 10 major currency pairs vs USD, with historical trend charts from the Frankfurter API (ECB data). Select any pair to see its trend line.",
      source: "ExchangeRate API + Frankfurter API",
      suggestion: "Go to Forex tab → Click any currency button to see its historical chart.",
    }),
  },
  {
    pattern: /(?:energy|electricity|power|consumption|renewable|solar|wind|nuclear|fossil|coal|oil|gas)\s*(?:consumption|usage|data|mix|global|world)?/i,
    response: () => ({
      answer: "The Energy tab shows real-time global energy consumption with live counters updating every second. It includes per-country consumption for the top 10 energy consumers (China, USA, India, etc.), energy mix by source (coal, gas, nuclear, hydro, wind, solar), renewable vs fossil breakdowns, and per-capita statistics. The global energy consumption is ~29,165 TWh annually (~924,147 MWh every second).",
      source: "IEA World Energy Outlook + EIA + IRENA + BP Statistical Review",
      suggestion: "Go to Energy tab → Watch real-time consumption counters for each country ticking every second.",
    }),
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = QueryInputSchema.safeParse(body);

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Invalid query";
      return NextResponse.json({ error: msg, status: 400 }, { status: 400 });
    }

    const query = parsed.data.query;

    // Try pattern matching first (works without any API key)
    for (const { pattern, response } of QUERY_PATTERNS) {
      const match = query.match(pattern);
      if (match) {
        return NextResponse.json({
          query,
          answer: response(match).answer,
          source: response(match).source,
          suggestion: response(match).suggestion,
          method: "pattern-match",
        });
      }
    }

    // Default response for unmatched queries
    return NextResponse.json({
      query,
      answer: `I can help you navigate the dashboard data. Try asking about:\n\n• "Bitcoin price" — Crypto market data\n• "Earthquakes today" — Seismic activity\n• "Weather in London" — City temperatures\n• "Top countries by population" — Demographics\n• "GDP of India" — Economic indicators\n• "ISS position" — Space station tracking\n• "COVID global" — Health statistics\n• "Trending repos" — Tech pulse\n• "Currency exchange rates" — Forex data\n• "How many APIs" — Data source catalog`,
      source: "Dashboard Guide",
      suggestion: "Try one of the example queries above, or explore the tabs in the sidebar.",
      method: "fallback",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Query failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
