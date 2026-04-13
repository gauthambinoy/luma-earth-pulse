import { z } from "zod";

// ── Weather ──
export const WeatherCitySchema = z.object({
  current: z.object({
    temperature_2m: z.number().optional().default(0),
    apparent_temperature: z.number().optional().default(0),
    windspeed_10m: z.number().optional().default(0),
    weathercode: z.number().optional().default(0),
  }).optional(),
  hourly: z.object({
    temperature_2m: z.array(z.number()).optional().default([]),
  }).optional(),
});

// ── Earthquake ──
export const EarthquakeFeatureSchema = z.object({
  properties: z.object({
    mag: z.number(),
    place: z.string().nullable().default("Unknown"),
    time: z.number(),
  }),
  geometry: z.object({
    coordinates: z.tuple([z.number(), z.number(), z.number()]),
  }),
});

export const EarthquakeResponseSchema = z.object({
  features: z.array(EarthquakeFeatureSchema).default([]),
});

// ── Crypto Market ──
export const CryptoMarketSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string().optional().default(""),
  current_price: z.number().nullable().default(0),
  market_cap: z.number().nullable().default(0),
  market_cap_rank: z.number().nullable().default(0),
  total_volume: z.number().nullable().default(0),
  price_change_percentage_24h: z.number().nullable().default(0),
  sparkline_in_7d: z.object({
    price: z.array(z.number()).default([]),
  }).optional(),
});

// ── Health ──
export const HealthGlobalSchema = z.object({
  cases: z.number().default(0),
  deaths: z.number().default(0),
  recovered: z.number().default(0),
  active: z.number().default(0),
  critical: z.number().default(0),
  tests: z.number().default(0),
  testsPerOneMillion: z.number().default(0),
  casesPerOneMillion: z.number().default(0),
  deathsPerOneMillion: z.number().default(0),
});

// ── NASA APOD ──
export const NasaApodSchema = z.object({
  title: z.string(),
  date: z.string(),
  explanation: z.string(),
  url: z.string(),
  hdurl: z.string().optional(),
  media_type: z.string(),
  copyright: z.string().optional(),
});

// ── Forex ──
export const ForexRatesSchema = z.object({
  rates: z.record(z.string(), z.number()).default({}),
});

// ── GitHub Repo ──
export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
  stargazers_count: z.number().default(0),
  forks_count: z.number().default(0),
  language: z.string().nullable(),
  owner: z.object({
    avatar_url: z.string().default(""),
    login: z.string().default(""),
  }),
  created_at: z.string(),
});

// ── HN Story ──
export const HNStorySchema = z.object({
  id: z.number(),
  title: z.string().default(""),
  url: z.string().nullable().optional(),
  score: z.number().default(0),
  by: z.string().default(""),
  time: z.number().default(0),
  descendants: z.number().default(0),
});

// ── Energy ──
export const EnergyCountrySchema = z.object({
  code: z.string(),
  name: z.string(),
  flag: z.string(),
  annualTWh: z.number(),
  consumedTWh: z.number().default(0),
  perCapitaMWh: z.number().default(0),
  mwhPerSecond: z.number().default(0),
  mix: z.object({
    fossil: z.number().default(0),
    nuclear: z.number().default(0),
    renewable: z.number().default(0),
  }),
  population: z.number().default(0),
});

export const EnergySourceSchema = z.object({
  name: z.string(),
  share: z.number(),
  annualTWh: z.number(),
  color: z.string(),
  icon: z.string(),
});

export const EnergyResponseSchema = z.object({
  global: z.object({
    totalAnnualTWh: z.number(),
    consumedTWh: z.number().default(0),
    mwhPerSecond: z.number().default(0),
    renewableShare: z.number().default(0),
    fossilShare: z.number().default(0),
    nuclearShare: z.number().default(0),
  }),
  countries: z.array(EnergyCountrySchema).default([]),
  sources: z.array(EnergySourceSchema).default([]),
  timestamp: z.number(),
});
