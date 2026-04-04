# API Reference — Unified World Data

All routes are Next.js App Router handlers under `/app/api/`. They are internal to the application — the client calls them via SWR hooks; they are not a public API.

---

## `GET /api/weather`

Fetches current weather and 24-hour hourly forecast for 8 major cities.

**Cache:** `revalidate = 300` (5 minutes)  
**External API:** [Open-Meteo](https://open-meteo.com) — free, no key required

**Response shape:**
```json
{
  "cities": [
    {
      "name": "Dublin",
      "lat": 53.33,
      "lon": -6.25,
      "flag": "🇮🇪",
      "temp": 12,
      "feels": 9,
      "wind": 25,
      "code": 3,
      "hourly": [{ "h": 0, "t": 11 }, ...]
    }
  ]
}
```

---

## `GET /api/quakes`

Returns all earthquakes M2.5+ from the past 30 days, sorted by recency, capped at 500 events.

**Cache:** `revalidate = 300` (5 minutes)  
**External API:** [USGS Earthquake Hazards Program](https://earthquake.usgs.gov) — free, no key required

**Response shape:**
```json
{
  "quakes": [
    {
      "mag": 4.5,
      "place": "10km NW of Test City",
      "time": 1700000000000,
      "depth": 10.0,
      "lat": 34.2,
      "lon": -118.5
    }
  ]
}
```

---

## `GET /api/markets`

Returns top 20 cryptocurrencies by market cap with 7-day sparkline data, plus trending coins.

**Cache:** `revalidate = 60` (1 minute)  
**External API:** [CoinGecko](https://api.coingecko.com) — free, no key required (rate-limited)

**Response shape:**
```json
{
  "coins": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "https://...",
      "current_price": 65000,
      "market_cap": 1200000000000,
      "market_cap_rank": 1,
      "total_volume": 25000000000,
      "price_change_percentage_24h": 2.5,
      "sparkline_in_7d": { "price": [60000, 61000, ...] }
    }
  ],
  "trending": [...]
}
```

---

## `GET /api/forex`

Returns live USD exchange rates for 10 major currency pairs plus 90-day historical data.

**Cache:** `revalidate = 300` (5 minutes) for live rates; `revalidate = 3600` for historical  
**External APIs:**
- [ExchangeRate API](https://open.er-api.com) — free, no key required
- [Frankfurter](https://www.frankfurter.app) — free, no key required (ECB data)

**Response shape:**
```json
{
  "latest": {
    "base": "USD",
    "rates": { "EUR": 0.92, "GBP": 0.79, ... },
    "timestamp": "Mon, 01 Jan 2024 00:00:00 +0000"
  },
  "historical": [
    { "date": "2024-01-01", "EUR": 0.91, "GBP": 0.79, ... }
  ]
}
```

---

## `GET /api/economy`

Returns 6 World Bank indicators for the world's 10 largest economies, last 10 years of data.

**Cache:** `revalidate = 86400` (24 hours)  
**External API:** [World Bank Open Data](https://data.worldbank.org) — free, no key required

**Indicators fetched:**
- `NY.GDP.MKTP.CD` — GDP (current USD)
- `SP.POP.TOTL` — Total population
- `FP.CPI.TOTL.ZG` — Inflation (CPI % annual)
- `SP.DYN.LE00.IN` — Life expectancy at birth
- `SL.UEM.TOTL.ZS` — Unemployment (% of labour force)
- `EN.ATM.CO2E.PC` — CO2 emissions per capita (metric tons)

**Response shape:**
```json
{
  "gdp": [{ "country": "United States", "countryCode": "USA", "year": "2022", "value": 25464478000000 }],
  "population": [...],
  "inflation": [...],
  "lifeExpectancy": [...],
  "unemployment": [...],
  "co2": [...]
}
```

---

## `GET /api/health`

Returns global COVID-19 aggregates and per-country breakdown for top 20 countries by cases.

**Cache:** `revalidate = 3600` (1 hour)  
**External API:** [disease.sh](https://disease.sh) — free, no key required

**Response shape:**
```json
{
  "global": {
    "cases": 700000000,
    "deaths": 7000000,
    "recovered": 600000000,
    "active": 93000000,
    "critical": 50000,
    "tests": 10000000000,
    "testsPerOneMillion": 1250000,
    "casesPerOneMillion": 88000,
    "deathsPerOneMillion": 880
  },
  "countries": [...]
}
```

---

## `GET /api/countries`

Returns all ~250 countries sorted by population descending.

**Cache:** `revalidate = 86400` (24 hours)  
**External API:** [REST Countries](https://restcountries.com) — free, no key required

**Response shape:**
```json
[
  {
    "name": { "common": "China", "official": "People's Republic of China" },
    "population": 1400000000,
    "area": 9706961,
    "region": "Asia",
    "flags": { "png": "https://...", "svg": "https://..." },
    "capital": ["Beijing"],
    "continents": ["Asia"],
    "languages": { "zho": "Chinese" },
    "currencies": { "CNY": { "name": "Chinese yuan" } }
  }
]
```

---

## `GET /api/space`

Returns NASA APOD, Near-Earth Object counts, live ISS position, astronaut list, and solar weather.

**Cache:** `revalidate = 300` (5 minutes); APOD/NEO sub-requests use `revalidate = 3600`  
**External APIs:**
- [NASA APIs](https://api.nasa.gov) — free, `DEMO_KEY` works (30 req/hr); set `NASA_API_KEY` for 1000 req/hr
- [Open Notify](http://api.open-notify.org) — free, no key
- [NOAA SWPC](https://www.swpc.noaa.gov) — free, no key

**Response shape:**
```json
{
  "apod": { "title": "...", "date": "2024-01-15", "explanation": "...", "url": "...", "media_type": "image" },
  "neoCount": 12,
  "hazardousCount": 2,
  "closestApproachKm": 384400,
  "iss": { "latitude": 51.5, "longitude": -0.1, "timestamp": 1700000000 },
  "astronauts": [{ "name": "Name Surname", "craft": "ISS" }],
  "solarWind": { "speed": 450.2, "timestamp": "2024-01-15 12:00:00" },
  "kpIndex": 2.3
}
```

---

## `GET /api/air`

Returns current air quality measurement for 6 cities.

**Cache:** `revalidate = 600` (10 minutes)  
**External API:** [OpenAQ](https://openaq.org) — free, no key required

**Response shape:**
```json
{
  "stations": [
    {
      "city": "Dublin",
      "location": "St. Anne's Park",
      "value": 8.5,
      "parameter": "pm25",
      "unit": "µg/m³",
      "lastUpdated": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## `GET /api/github`

Returns trending GitHub repositories created in the past 7 days (top 20 by stars) and a language breakdown.

**Cache:** `revalidate = 600` (10 minutes)  
**External API:** [GitHub REST API](https://docs.github.com/en/rest) — free, no key required (60 req/hr unauthenticated)

**Response shape:**
```json
{
  "trending": [
    {
      "id": 123456,
      "name": "awesome-project",
      "full_name": "user/awesome-project",
      "description": "An awesome project",
      "html_url": "https://github.com/user/awesome-project",
      "stargazers_count": 1500,
      "forks_count": 200,
      "language": "TypeScript",
      "owner": { "avatar_url": "https://...", "login": "user" },
      "created_at": "2024-01-08T00:00:00Z"
    }
  ],
  "languageBreakdown": [
    { "name": "TypeScript", "count": 7 },
    { "name": "Python", "count": 5 }
  ]
}
```

---

## `GET /api/hackernews`

Returns the top 20 Hacker News stories by score.

**Cache:** `revalidate = 300` (5 minutes)  
**External API:** [Hacker News Firebase API](https://github.com/HackerNews/API) — free, no key required

**Response shape:**
```json
{
  "stories": [
    {
      "id": 38000000,
      "title": "Show HN: ...",
      "url": "https://example.com",
      "score": 342,
      "by": "username",
      "time": 1700000000,
      "descendants": 87
    }
  ]
}
```

---

## `GET /api/news`

Returns top US news headlines. Returns a setup-guide placeholder if `NEWS_API_KEY` is not configured.

**Cache:** `revalidate = 600` (10 minutes)  
**External API:** [NewsAPI](https://newsapi.org) — free tier: 100 req/day; requires `NEWS_API_KEY` env var

**Response shape (with API key):**
```json
{
  "articles": [
    {
      "title": "Headline text",
      "source": { "name": "Reuters" },
      "description": "Article summary...",
      "url": "https://...",
      "publishedAt": "2024-01-15T10:00:00Z",
      "urlToImage": "https://..."
    }
  ]
}
```

**Response shape (no API key):**
```json
{
  "articles": [{ "title": "Configure your NEWS_API_KEY...", ... }],
  "noApiKey": true
}
```

---

## `GET /api/iss`

Returns the current ISS position and list of astronauts in space. Always fetches live (no cache).

**Cache:** `revalidate = 0` (no cache / force-dynamic)  
**External API:** [Open Notify](http://api.open-notify.org) — free, no key required

**Response shape:**
```json
{
  "position": {
    "latitude": 51.5,
    "longitude": -0.1,
    "timestamp": 1700000000
  },
  "astronauts": [
    { "name": "Name Surname", "craft": "ISS" }
  ]
}
```

---

## `GET /api/solar`

Returns current solar wind speed and Kp geomagnetic index.

**Cache:** `revalidate = 300` (5 minutes)  
**External API:** [NOAA SWPC](https://www.swpc.noaa.gov) — free, no key required

**Response shape:**
```json
{
  "solarWind": {
    "speed": 450.2,
    "timestamp": "2024-01-15 12:00:00"
  },
  "kpIndex": 2.3
}
```

---

## `GET /api/stream`

Server-Sent Events endpoint streaming live ISS position and world population counter.

**Cache:** `force-dynamic` (never cached)  
**Runtime:** Node.js (streaming)  
**External API:** [Open Notify](http://api.open-notify.org) for ISS position

**Event types:**

| Event | Frequency | Payload |
|-------|-----------|---------|
| `connected` | On connect | `{ message: string, timestamp: number }` |
| `iss` | Every 5 seconds | `{ latitude: number, longitude: number, timestamp: number }` |
| `population` | Every 1 second | `{ count: number, timestamp: number }` |

The stream closes itself after 290 seconds. The client (`hooks/useLiveStream.ts`) reconnects automatically with exponential backoff.

---

## `GET /api/health-check`

Pings all 12 external API endpoints and returns latency and status for each.

**Cache:** `force-dynamic` (never cached)  
**Timeout per endpoint:** 8 seconds

**Response shape:**
```json
{
  "overall": "healthy",
  "healthy": 12,
  "total": 12,
  "avgResponseMs": 243,
  "checkedAt": 1700000000000,
  "endpoints": [
    {
      "name": "Weather (Open-Meteo)",
      "status": "ok",
      "responseMs": 182,
      "statusCode": 200,
      "critical": true,
      "lastChecked": 1700000000000
    }
  ]
}
```

`overall` is:
- `"healthy"` — all endpoints up
- `"degraded"` — 70–99% up
- `"unhealthy"` — fewer than 70% up

---

## `POST /api/ai-query`

Pattern-matches natural language queries against the dashboard data catalog and returns a sourced answer and navigation suggestion. No AI API key required.

**Cache:** `force-dynamic`

**Request body:**
```json
{ "query": "Bitcoin price" }
```

**Response shape:**
```json
{
  "query": "Bitcoin price",
  "answer": "Check the Markets tab for real-time Bitcoin price...",
  "source": "CoinGecko API",
  "suggestion": "Go to Markets tab → Bitcoin is always #1 by market cap.",
  "method": "pattern-match"
}
```

`method` is `"pattern-match"` when a known pattern is matched, or `"fallback"` for unrecognised queries.
