// ── Weather ──
export interface WeatherCity {
  name: string;
  lat: number;
  lon: number;
  flag: string;
  temp: number;
  feels: number;
  wind: number;
  code: number;
  hourly: { h: number; t: number }[];
}

export interface WeatherResponse {
  cities: WeatherCity[];
}

// ── Earthquakes ──
export interface Earthquake {
  mag: number;
  place: string;
  time: number;
  depth: number;
  lat: number;
  lon: number;
}

export interface EarthquakeResponse {
  quakes: Earthquake[];
}

// ── Markets ──
export interface CryptoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
}

export interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number;
    score: number;
  };
}

export interface MarketsResponse {
  coins: CryptoMarket[];
  trending?: TrendingCoin[];
}

// ── Health ──
export interface HealthGlobal {
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  critical: number;
  tests: number;
  testsPerOneMillion: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
}

export interface HealthCountry {
  country: string;
  countryInfo: { flag: string };
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
}

export interface HealthResponse {
  global: HealthGlobal;
  countries: HealthCountry[];
}

// ── Countries ──
export interface Country {
  name: { common: string; official: string };
  population: number;
  area: number;
  region: string;
  flags: { svg: string; png: string };
  capital: string[];
  continents: string[];
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
}

// ── Space ──
export interface NasaApod {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  copyright?: string;
}

export interface NeoResponse {
  element_count: number;
  near_earth_objects: Record<
    string,
    {
      name: string;
      is_potentially_hazardous_asteroid: boolean;
      close_approach_data: {
        miss_distance: { kilometers: string };
      }[];
    }[]
  >;
}

export interface SpaceResponse {
  apod: NasaApod | null;
  neoCount: number;
  hazardousCount: number;
  closestApproachKm: number;
  iss: ISSPosition | null;
  astronauts: Astronaut[];
  solarWind: SolarWind | null;
  kpIndex: number | null;
}

export interface ISSPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Astronaut {
  name: string;
  craft: string;
}

export interface SolarWind {
  speed: number;
  timestamp: string;
}

// ── Air Quality ──
export interface AirQualityStation {
  city: string;
  location: string;
  value: number;
  parameter: string;
  unit: string;
  lastUpdated: string;
}

export interface AirQualityResponse {
  stations: AirQualityStation[];
}

// ── News ──
export interface NewsArticle {
  title: string;
  source: { name: string };
  description: string | null;
  url: string;
  publishedAt: string;
  urlToImage: string | null;
}

export interface NewsResponse {
  articles: NewsArticle[];
  noApiKey?: boolean;
}

// ── Forex ──
export interface ForexRates {
  base: string;
  rates: Record<string, number>;
  timestamp: string;
}

export interface ForexHistorical {
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

export interface ForexResponse {
  latest: ForexRates;
  historical: { date: string; rate: number }[];
  currencies: string[];
}

// ── Economy ──
export interface EconomyIndicator {
  country: string;
  countryCode: string;
  year: string;
  value: number | null;
}

export interface EconomyResponse {
  gdp: EconomyIndicator[];
  population: EconomyIndicator[];
  inflation: EconomyIndicator[];
  lifeExpectancy: EconomyIndicator[];
  unemployment: EconomyIndicator[];
  co2: EconomyIndicator[];
}

// ── Tech / GitHub ──
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: { avatar_url: string; login: string };
  created_at: string;
}

export interface HackerNewsStory {
  id: number;
  title: string;
  url: string | null;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

export interface TechPulseResponse {
  trending: GitHubRepo[];
  hnStories: HackerNewsStory[];
  languageBreakdown: { name: string; count: number }[];
}

// ── Generic API Error ──
export interface ApiError {
  error: string;
  status: number;
}

// ── Energy ──
export interface EnergyCountry {
  code: string;
  name: string;
  flag: string;
  annualTWh: number;
  consumedTWh: number;
  perCapitaMWh: number;
  mwhPerSecond: number;
  mix: {
    fossil: number;
    nuclear: number;
    renewable: number;
  };
  population: number;
}

export interface EnergySource {
  name: string;
  share: number;
  annualTWh: number;
  color: string;
  icon: string;
}

export interface EnergyGlobal {
  totalAnnualTWh: number;
  consumedTWh: number;
  mwhPerSecond: number;
  renewableShare: number;
  fossilShare: number;
  nuclearShare: number;
}

export interface EnergyResponse {
  global: EnergyGlobal;
  countries: EnergyCountry[];
  sources: EnergySource[];
  timestamp: number;
}
