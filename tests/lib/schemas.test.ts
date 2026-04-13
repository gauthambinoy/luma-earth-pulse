import { describe, it, expect } from 'vitest'
import {
  WeatherCitySchema,
  EarthquakeFeatureSchema,
  EarthquakeResponseSchema,
  CryptoMarketSchema,
  HealthGlobalSchema,
  NasaApodSchema,
  ForexRatesSchema,
  GitHubRepoSchema,
  HNStorySchema,
} from '@/lib/schemas'

describe('WeatherCitySchema', () => {
  it('accepts valid weather data', () => {
    const data = {
      current: {
        temperature_2m: 15.3,
        apparent_temperature: 13.1,
        windspeed_10m: 20.5,
        weathercode: 3,
      },
      hourly: {
        temperature_2m: [14, 15, 16, 17],
      },
    }
    const result = WeatherCitySchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('applies defaults for missing optional fields', () => {
    const result = WeatherCitySchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('applies default values for missing current fields', () => {
    const result = WeatherCitySchema.safeParse({ current: {} })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.current?.temperature_2m).toBe(0)
      expect(result.data.current?.windspeed_10m).toBe(0)
    }
  })
})

describe('EarthquakeFeatureSchema', () => {
  const validFeature = {
    properties: {
      mag: 4.5,
      place: '10km NW of Test City',
      time: 1700000000000,
    },
    geometry: {
      coordinates: [-118.5, 34.2, 10.0],
    },
  }

  it('accepts valid earthquake feature', () => {
    const result = EarthquakeFeatureSchema.safeParse(validFeature)
    expect(result.success).toBe(true)
  })

  it('accepts null place (nullable field stays null)', () => {
    const data = {
      ...validFeature,
      properties: { ...validFeature.properties, place: null },
    }
    const result = EarthquakeFeatureSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      // .nullable().default("Unknown") — default only applies for undefined, not null
      expect(result.data.properties.place).toBeNull()
    }
  })

  it('rejects missing coordinates', () => {
    const data = { properties: validFeature.properties, geometry: { coordinates: [1, 2] } }
    const result = EarthquakeFeatureSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('rejects non-number magnitude', () => {
    const data = {
      ...validFeature,
      properties: { ...validFeature.properties, mag: 'big' },
    }
    const result = EarthquakeFeatureSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe('EarthquakeResponseSchema', () => {
  it('accepts response with features array', () => {
    const result = EarthquakeResponseSchema.safeParse({
      features: [
        {
          properties: { mag: 3.2, place: 'Test', time: 1700000000000 },
          geometry: { coordinates: [10.0, 20.0, 5.0] },
        },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('defaults to empty array when features is missing', () => {
    const result = EarthquakeResponseSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.features).toEqual([])
    }
  })
})

describe('CryptoMarketSchema', () => {
  const validCoin = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    current_price: 65000,
    market_cap: 1_200_000_000_000,
    market_cap_rank: 1,
    total_volume: 25_000_000_000,
    price_change_percentage_24h: 2.5,
    sparkline_in_7d: { price: [60000, 61000, 63000, 65000] },
  }

  it('accepts valid coin data', () => {
    const result = CryptoMarketSchema.safeParse(validCoin)
    expect(result.success).toBe(true)
  })

  it('accepts null prices (nullable fields stay null)', () => {
    const data = { ...validCoin, current_price: null, market_cap: null }
    const result = CryptoMarketSchema.safeParse(data)
    expect(result.success).toBe(true)
    if (result.success) {
      // .nullable().default(0) — default only applies for undefined, not null
      expect(result.data.current_price).toBeNull()
      expect(result.data.market_cap).toBeNull()
    }
  })

  it('rejects missing required id field', () => {
    const { id: _id, ...withoutId } = validCoin
    const result = CryptoMarketSchema.safeParse(withoutId)
    expect(result.success).toBe(false)
  })

  it('sparkline is optional', () => {
    const { sparkline_in_7d: _sparkline, ...withoutSparkline } = validCoin
    const result = CryptoMarketSchema.safeParse(withoutSparkline)
    expect(result.success).toBe(true)
  })
})

describe('HealthGlobalSchema', () => {
  it('accepts full valid health data', () => {
    const data = {
      cases: 700_000_000,
      deaths: 7_000_000,
      recovered: 600_000_000,
      active: 93_000_000,
      critical: 50_000,
      tests: 10_000_000_000,
      testsPerOneMillion: 1_250_000,
      casesPerOneMillion: 88_000,
      deathsPerOneMillion: 880,
    }
    const result = HealthGlobalSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('applies default 0 for all missing fields', () => {
    const result = HealthGlobalSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cases).toBe(0)
      expect(result.data.deaths).toBe(0)
    }
  })
})

describe('NasaApodSchema', () => {
  const validApod = {
    title: 'A Beautiful Nebula',
    date: '2024-01-15',
    explanation: 'This stunning image shows...',
    url: 'https://apod.nasa.gov/apod/image/example.jpg',
    media_type: 'image',
  }

  it('accepts valid APOD data', () => {
    const result = NasaApodSchema.safeParse(validApod)
    expect(result.success).toBe(true)
  })

  it('accepts optional hdurl and copyright fields', () => {
    const data = {
      ...validApod,
      hdurl: 'https://apod.nasa.gov/apod/image/example_hd.jpg',
      copyright: 'John Smith',
    }
    const result = NasaApodSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('rejects missing required title', () => {
    const { title: _title, ...withoutTitle } = validApod
    const result = NasaApodSchema.safeParse(withoutTitle)
    expect(result.success).toBe(false)
  })
})

describe('ForexRatesSchema', () => {
  it('accepts valid rates record', () => {
    const data = { rates: { EUR: 0.92, GBP: 0.79, JPY: 149.5 } }
    const result = ForexRatesSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('defaults to empty rates object', () => {
    const result = ForexRatesSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.rates).toEqual({})
    }
  })

  it('rejects non-number values in rates', () => {
    const data = { rates: { EUR: 'not-a-number' } }
    const result = ForexRatesSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe('GitHubRepoSchema', () => {
  const validRepo = {
    id: 123456,
    name: 'awesome-project',
    full_name: 'user/awesome-project',
    description: 'An awesome project',
    html_url: 'https://github.com/user/awesome-project',
    stargazers_count: 1500,
    forks_count: 200,
    language: 'TypeScript',
    owner: {
      avatar_url: 'https://avatars.githubusercontent.com/u/123',
      login: 'user',
    },
    created_at: '2024-01-01T00:00:00Z',
  }

  it('accepts valid repo data', () => {
    const result = GitHubRepoSchema.safeParse(validRepo)
    expect(result.success).toBe(true)
  })

  it('accepts null description', () => {
    const data = { ...validRepo, description: null }
    const result = GitHubRepoSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('accepts null language', () => {
    const data = { ...validRepo, language: null }
    const result = GitHubRepoSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('rejects missing required id', () => {
    const { id: _id, ...withoutId } = validRepo
    const result = GitHubRepoSchema.safeParse(withoutId)
    expect(result.success).toBe(false)
  })
})

describe('HNStorySchema', () => {
  const validStory = {
    id: 38000000,
    title: 'Show HN: Sapien Signal Dashboard',
    url: 'https://example.com',
    score: 342,
    by: 'gauthambinoy',
    time: 1700000000,
    descendants: 87,
  }

  it('accepts valid story data', () => {
    const result = HNStorySchema.safeParse(validStory)
    expect(result.success).toBe(true)
  })

  it('url is optional and can be null', () => {
    const data = { ...validStory, url: null }
    const result = HNStorySchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('url can be omitted entirely', () => {
    const { url: _url, ...withoutUrl } = validStory
    const result = HNStorySchema.safeParse(withoutUrl)
    expect(result.success).toBe(true)
  })

  it('applies defaults for missing numeric fields', () => {
    const result = HNStorySchema.safeParse({ id: 1 })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.score).toBe(0)
      expect(result.data.descendants).toBe(0)
    }
  })

  it('rejects missing required id', () => {
    const { id: _id, ...withoutId } = validStory
    const result = HNStorySchema.safeParse(withoutId)
    expect(result.success).toBe(false)
  })
})
