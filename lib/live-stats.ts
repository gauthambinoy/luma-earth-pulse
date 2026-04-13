// ══════════════════════════════════════════════════════════════════
// LIVE WORLD STATISTICS — Real-time estimated counters
// Based on UN, WHO, World Bank, and other authoritative annual rates
// All rates are per-second calculations from annual data
// ══════════════════════════════════════════════════════════════════

const BASE_YEAR = 2024;
const BASE_MS = new Date(`${BASE_YEAR}-01-01`).getTime();
const SECS_PER_YEAR = 365.25 * 24 * 3600;

function elapsed() {
  return (Date.now() - BASE_MS) / 1000;
}

interface LiveStat {
  id: string;
  label: string;
  category: string;
  icon: string;
  baseValue: number;
  perSecond: number;
  unit: string;
  source: string;
  color: string;
  direction: "up" | "down" | "neutral";
}

// Annual rates converted to per-second
export const LIVE_STATS: LiveStat[] = [
  // ── Demographics ──
  { id: "population", label: "World Population", category: "Demographics", icon: "🌍", baseValue: 8045311447, perSecond: 2.4, unit: "", source: "UN DESA", color: "#10b981", direction: "up" },
  { id: "births_today", label: "Births Today", category: "Demographics", icon: "👶", baseValue: 0, perSecond: 385000 / 86400, unit: "", source: "WHO", color: "#6ee7b7", direction: "up" },
  { id: "deaths_today", label: "Deaths Today", category: "Demographics", icon: "💀", baseValue: 0, perSecond: 163000 / 86400, unit: "", source: "WHO", color: "#f87171", direction: "up" },
  { id: "net_growth_today", label: "Net Growth Today", category: "Demographics", icon: "📈", baseValue: 0, perSecond: 222000 / 86400, unit: "", source: "UN", color: "#60a5fa", direction: "up" },

  // ── Health ──
  { id: "diseases_infectious", label: "Infectious Disease Deaths (Year)", category: "Health", icon: "🦠", baseValue: 0, perSecond: 17000000 / SECS_PER_YEAR, unit: "", source: "WHO", color: "#ef4444", direction: "up" },
  { id: "cancer_deaths", label: "Cancer Deaths (Year)", category: "Health", icon: "🎗", baseValue: 0, perSecond: 10000000 / SECS_PER_YEAR, unit: "", source: "WHO IARC", color: "#f97316", direction: "up" },
  { id: "heart_disease", label: "Heart Disease Deaths (Year)", category: "Health", icon: "❤️", baseValue: 0, perSecond: 18600000 / SECS_PER_YEAR, unit: "", source: "WHO CVD", color: "#dc2626", direction: "up" },
  { id: "hiv_infections", label: "HIV Infections (Year)", category: "Health", icon: "🩸", baseValue: 0, perSecond: 1300000 / SECS_PER_YEAR, unit: "", source: "UNAIDS", color: "#e11d48", direction: "up" },
  { id: "malaria_deaths", label: "Malaria Deaths (Year)", category: "Health", icon: "🦟", baseValue: 0, perSecond: 620000 / SECS_PER_YEAR, unit: "", source: "WHO", color: "#a855f7", direction: "up" },

  // ── Environment ──
  { id: "co2_emissions", label: "CO2 Emitted (tons, Year)", category: "Environment", icon: "🏭", baseValue: 0, perSecond: 37400000000 / SECS_PER_YEAR, unit: "t", source: "Global Carbon Project", color: "#78716c", direction: "up" },
  { id: "forest_loss", label: "Forest Lost (hectares, Year)", category: "Environment", icon: "🌳", baseValue: 0, perSecond: 10000000 / SECS_PER_YEAR, unit: "ha", source: "FAO", color: "#16a34a", direction: "up" },
  { id: "plastic_ocean", label: "Plastic Dumped in Ocean (kg, Year)", category: "Environment", icon: "🌊", baseValue: 0, perSecond: 8000000000 / SECS_PER_YEAR, unit: "kg", source: "UNEP", color: "#0ea5e9", direction: "up" },
  { id: "species_extinct", label: "Species Gone Extinct (Year)", category: "Environment", icon: "🦕", baseValue: 0, perSecond: 150 / SECS_PER_YEAR, unit: "", source: "IUCN", color: "#b91c1c", direction: "up" },
  { id: "temp_rise", label: "Global Temp Rise Since 1900", category: "Environment", icon: "🌡", baseValue: 1.2, perSecond: 0.02 / SECS_PER_YEAR, unit: "°C", source: "NOAA NCEI", color: "#f59e0b", direction: "up" },

  // ── Energy ──
  { id: "energy_consumed", label: "Energy Consumed (MWh, Year)", category: "Energy", icon: "⚡", baseValue: 0, perSecond: 176431000000 / SECS_PER_YEAR, unit: "MWh", source: "IEA", color: "#eab308", direction: "up" },
  { id: "solar_installed", label: "Solar Energy Generated (MWh, Year)", category: "Energy", icon: "☀️", baseValue: 0, perSecond: 4600000000 / SECS_PER_YEAR, unit: "MWh", source: "IRENA", color: "#f59e0b", direction: "up" },
  { id: "wind_energy", label: "Wind Energy Generated (MWh, Year)", category: "Energy", icon: "💨", baseValue: 0, perSecond: 2100000000 / SECS_PER_YEAR, unit: "MWh", source: "IRENA", color: "#38bdf8", direction: "up" },
  { id: "nuclear_energy", label: "Nuclear Energy Generated (MWh, Year)", category: "Energy", icon: "☢️", baseValue: 0, perSecond: 2800000000 / SECS_PER_YEAR, unit: "MWh", source: "IAEA", color: "#a78bfa", direction: "up" },
  { id: "coal_consumed", label: "Coal Consumed (tons, Year)", category: "Energy", icon: "🪨", baseValue: 0, perSecond: 8300000000 / SECS_PER_YEAR, unit: "t", source: "IEA", color: "#57534e", direction: "up" },
  { id: "natural_gas", label: "Natural Gas Consumed (m³, Year)", category: "Energy", icon: "🔥", baseValue: 0, perSecond: 4000000000000 / SECS_PER_YEAR, unit: "m³", source: "IEA", color: "#fb923c", direction: "up" },
  { id: "oil_consumed", label: "Oil Consumed (barrels, Today)", category: "Energy", icon: "🛢", baseValue: 0, perSecond: 100000000 / 86400, unit: "bbl", source: "EIA", color: "#44403c", direction: "up" },
  { id: "hydro_energy", label: "Hydropower Generated (MWh, Year)", category: "Energy", icon: "🌊", baseValue: 0, perSecond: 4300000000 / SECS_PER_YEAR, unit: "MWh", source: "IRENA", color: "#0ea5e9", direction: "up" },
  { id: "electricity_cost", label: "Global Electricity Spend ($, Year)", category: "Energy", icon: "💡", baseValue: 0, perSecond: 2800000000000 / SECS_PER_YEAR, unit: "$", source: "IEA", color: "#fbbf24", direction: "up" },
  { id: "ev_charge_sessions", label: "EV Charge Sessions (Today)", category: "Energy", icon: "🔌", baseValue: 0, perSecond: 15000000 / 86400, unit: "", source: "IEA GEVO", color: "#22c55e", direction: "up" },

  // ── Economy ──
  { id: "world_gdp", label: "World GDP (USD, Year)", category: "Economy", icon: "💰", baseValue: 0, perSecond: 105000000000000 / SECS_PER_YEAR, unit: "$", source: "World Bank", color: "#10b981", direction: "up" },
  { id: "money_spent_military", label: "Military Spending (USD, Year)", category: "Economy", icon: "🎖", baseValue: 0, perSecond: 2240000000000 / SECS_PER_YEAR, unit: "$", source: "SIPRI", color: "#64748b", direction: "up" },
  { id: "money_spent_education", label: "Education Spending (USD, Year)", category: "Economy", icon: "🎓", baseValue: 0, perSecond: 6500000000000 / SECS_PER_YEAR, unit: "$", source: "UNESCO", color: "#8b5cf6", direction: "up" },
  { id: "money_spent_healthcare", label: "Healthcare Spending (USD, Year)", category: "Economy", icon: "🏥", baseValue: 0, perSecond: 9800000000000 / SECS_PER_YEAR, unit: "$", source: "WHO", color: "#06b6d4", direction: "up" },

  // ── Technology ──
  { id: "emails_sent", label: "Emails Sent (Today)", category: "Technology", icon: "📧", baseValue: 0, perSecond: 347000000000 / 86400, unit: "", source: "Radicati Group", color: "#3b82f6", direction: "up" },
  { id: "google_searches", label: "Google Searches (Today)", category: "Technology", icon: "🔍", baseValue: 0, perSecond: 8500000000 / 86400, unit: "", source: "Internet Live Stats", color: "#4285f4", direction: "up" },
  { id: "tweets_sent", label: "Tweets / Posts (Today)", category: "Technology", icon: "💬", baseValue: 0, perSecond: 500000000 / 86400, unit: "", source: "X/Twitter", color: "#1d9bf0", direction: "up" },
  { id: "youtube_videos_watched", label: "YouTube Videos Watched (Today)", category: "Technology", icon: "▶️", baseValue: 0, perSecond: 5000000000 / 86400, unit: "", source: "YouTube", color: "#ff0000", direction: "up" },
  { id: "gb_internet_traffic", label: "Internet Traffic (GB, Today)", category: "Technology", icon: "🌐", baseValue: 0, perSecond: 500000000000 / 86400, unit: "GB", source: "Cisco", color: "#6366f1", direction: "up" },
  { id: "websites_hacked", label: "Websites Hacked (Today)", category: "Technology", icon: "🔓", baseValue: 0, perSecond: 30000 / 86400, unit: "", source: "WebARX", color: "#ef4444", direction: "up" },

  // ── Food & Water ──
  { id: "food_produced", label: "Food Produced (tons, Year)", category: "Food & Water", icon: "🌾", baseValue: 0, perSecond: 6000000000 / SECS_PER_YEAR, unit: "t", source: "FAO", color: "#84cc16", direction: "up" },
  { id: "food_wasted", label: "Food Wasted (tons, Year)", category: "Food & Water", icon: "🗑", baseValue: 0, perSecond: 1300000000 / SECS_PER_YEAR, unit: "t", source: "FAO", color: "#a16207", direction: "up" },
  { id: "water_consumed", label: "Water Consumed (liters, Today)", category: "Food & Water", icon: "💧", baseValue: 0, perSecond: 10000000000000 / 86400 / 365, unit: "L", source: "UN Water", color: "#0284c7", direction: "up" },
  { id: "people_hunger", label: "Undernourished People", category: "Food & Water", icon: "😞", baseValue: 735000000, perSecond: 0, unit: "", source: "FAO SOFI", color: "#d97706", direction: "neutral" },

  // ── Education ──
  { id: "books_published", label: "Books Published (Year)", category: "Education", icon: "📚", baseValue: 0, perSecond: 2200000 / SECS_PER_YEAR, unit: "", source: "UNESCO", color: "#8b5cf6", direction: "up" },
  { id: "illiterate_adults", label: "Illiterate Adults Worldwide", category: "Education", icon: "📖", baseValue: 773000000, perSecond: 0, unit: "", source: "UNESCO", color: "#9333ea", direction: "neutral" },

  // ── Transport ──
  { id: "flights_today", label: "Flights Today", category: "Transport", icon: "✈️", baseValue: 0, perSecond: 115000 / 86400, unit: "", source: "FlightAware", color: "#0ea5e9", direction: "up" },
  { id: "cars_produced", label: "Cars Produced (Year)", category: "Transport", icon: "🚗", baseValue: 0, perSecond: 85000000 / SECS_PER_YEAR, unit: "", source: "OICA", color: "#475569", direction: "up" },
  { id: "road_accidents", label: "Road Accident Deaths (Year)", category: "Transport", icon: "🚧", baseValue: 0, perSecond: 1350000 / SECS_PER_YEAR, unit: "", source: "WHO", color: "#dc2626", direction: "up" },

  // ── Society ──
  { id: "refugees", label: "Forcibly Displaced People", category: "Society", icon: "🏕", baseValue: 110000000, perSecond: 0, unit: "", source: "UNHCR", color: "#f97316", direction: "neutral" },
  { id: "extreme_poverty", label: "People in Extreme Poverty", category: "Society", icon: "🏚", baseValue: 648000000, perSecond: 0, unit: "", source: "World Bank", color: "#b45309", direction: "neutral" },
  { id: "child_labor", label: "Children in Child Labor", category: "Society", icon: "👧", baseValue: 160000000, perSecond: 0, unit: "", source: "ILO", color: "#e11d48", direction: "neutral" },
  { id: "no_electricity", label: "People Without Electricity", category: "Society", icon: "🔌", baseValue: 675000000, perSecond: 0, unit: "", source: "IEA", color: "#78716c", direction: "neutral" },
  { id: "no_clean_water", label: "People Without Clean Water", category: "Society", icon: "🚰", baseValue: 2000000000, perSecond: 0, unit: "", source: "WHO/UNICEF", color: "#0369a1", direction: "neutral" },
];

export function computeLiveValue(stat: LiveStat): number {
  const secs = elapsed();
  if (stat.perSecond === 0) return stat.baseValue;

  // For "today" stats, use seconds since midnight UTC
  if (stat.label.includes("Today")) {
    const now = new Date();
    const midnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const secsSinceMidnight = (Date.now() - midnightUTC.getTime()) / 1000;
    return Math.floor(stat.baseValue + secsSinceMidnight * stat.perSecond);
  }

  // For "Year" stats, use seconds since Jan 1 of current year
  if (stat.label.includes("Year")) {
    const now = new Date();
    const jan1 = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const secsSinceJan1 = (Date.now() - jan1.getTime()) / 1000;
    return Math.floor(stat.baseValue + secsSinceJan1 * stat.perSecond);
  }

  return Math.floor(stat.baseValue + secs * stat.perSecond);
}

export const STAT_CATEGORIES = [...new Set(LIVE_STATS.map((s) => s.category))];
