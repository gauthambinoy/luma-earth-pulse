export const COLORS = [
  "#6EE7B7", "#FCD34D", "#F87171", "#60A5FA",
  "#C4B5FD", "#FB923C", "#34D399", "#F472B6",
  "#818CF8", "#FBBF24", "#A78BFA", "#2DD4BF",
];

export const WEATHER_ICONS: Record<number, string> = {
  0: "☀️", 1: "🌤", 2: "🌤", 3: "☁️",
  45: "🌫", 48: "🌫",
  51: "🌧", 53: "🌧", 55: "🌧",
  61: "🌧", 63: "🌧", 65: "🌧", 67: "🌧",
  71: "❄️", 73: "❄️", 75: "❄️", 77: "❄️",
  80: "🌦", 81: "🌦", 82: "🌦",
  95: "⛈", 96: "⛈", 99: "⛈",
};

export function weatherLabel(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 2) return "Partly cloudy";
  if (code <= 3) return "Overcast";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  return "Stormy";
}

export function weatherIcon(code: number): string {
  return WEATHER_ICONS[code] || "🌡";
}

export const CITIES = [
  { name: "Dublin",    lat: 53.33,  lon: -6.25,   flag: "🇮🇪" },
  { name: "New York",  lat: 40.71,  lon: -74.01,  flag: "🇺🇸" },
  { name: "London",    lat: 51.51,  lon: -0.13,   flag: "🇬🇧" },
  { name: "Tokyo",     lat: 35.68,  lon: 139.69,  flag: "🇯🇵" },
  { name: "Sydney",    lat: -33.87, lon: 151.21,  flag: "🇦🇺" },
  { name: "Dubai",     lat: 25.2,   lon: 55.27,   flag: "🇦🇪" },
  { name: "Mumbai",    lat: 19.07,  lon: 72.88,   flag: "🇮🇳" },
  { name: "São Paulo", lat: -23.55, lon: -46.63,  flag: "🇧🇷" },
];

export const TABS = [
  { id: "overview",    icon: "🌍", label: "Overview" },
  { id: "weather",     icon: "🌤", label: "Weather" },
  { id: "quakes",      icon: "🌊", label: "Earthquakes" },
  { id: "markets",     icon: "💹", label: "Markets" },
  { id: "forex",       icon: "💱", label: "Forex" },
  { id: "economy",     icon: "📊", label: "Economy" },
  { id: "energy",      icon: "🔋", label: "Energy" },
  { id: "health",      icon: "🏥", label: "Health" },
  { id: "countries",   icon: "🗺",  label: "Countries" },
  { id: "space",       icon: "🚀", label: "Space & ISS" },
  { id: "air",         icon: "💨", label: "Air Quality" },
  { id: "tech",        icon: "⚡", label: "Tech Pulse" },
  { id: "news",        icon: "📰", label: "News" },
  { id: "datasources", icon: "🔗", label: "Data Sources" },
  { id: "ai",          icon: "🤖", label: "AI Query" },
  { id: "system",      icon: "🔧", label: "System Health" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export const BASE_POPULATION = 8_045_311_447;
export const BASE_TIMESTAMP = new Date("2024-01-01").getTime();
export const GROWTH_PER_SECOND = 2.4;

export const FOREX_CURRENCIES = ["EUR", "GBP", "JPY", "CNY", "INR", "AUD", "CAD", "CHF", "KRW", "BRL"];

export const ECONOMY_COUNTRIES = [
  { code: "USA", name: "United States" },
  { code: "CHN", name: "China" },
  { code: "JPN", name: "Japan" },
  { code: "DEU", name: "Germany" },
  { code: "IND", name: "India" },
  { code: "GBR", name: "United Kingdom" },
  { code: "FRA", name: "France" },
  { code: "BRA", name: "Brazil" },
  { code: "ITA", name: "Italy" },
  { code: "CAN", name: "Canada" },
];
