# Architecture — Unified World Data

## Overview

Unified World Data is a Next.js 14 (App Router) full-stack application. The browser never touches an external API directly — all third-party calls are made from Next.js API routes on the server, keeping API keys out of the client bundle and enabling server-side caching via `next: { revalidate }`.

```
Browser
  │
  ├── SWR hooks (/api/*)     ← polling every N seconds per tab
  └── SSE (EventSource)     ← /api/stream, persistent connection

Next.js API Routes (server)
  │
  ├── Circuit Breaker        ← resilience wrapper around every external call
  ├── Zod validation         ← schema parsing of every external response
  └── next: { revalidate }   ← ISR-style server-side caching

External APIs (12+ services)
  Open-Meteo · USGS · CoinGecko · Frankfurter · disease.sh
  REST Countries · NASA · Open Notify · NOAA SWPC · OpenAQ
  GitHub · Hacker News · NewsAPI (optional) · World Bank
```

---

## Circuit Breaker Pattern

**File:** `lib/circuit-breaker.ts`

The circuit breaker protects the application from cascading failures when external APIs become unavailable or slow. It has three states:

| State | Behaviour |
|-------|-----------|
| `closed` | Normal operation — all requests pass through |
| `open` | Requests are short-circuited immediately; fallback value returned if supplied, otherwise throws |
| `half_open` | A limited number of test requests are sent; if they succeed the circuit closes again |

**Configuration defaults:**
- `failureThreshold: 5` — open after 5 consecutive failures
- `resetTimeout: 30 000 ms` — try again after 30 seconds
- `halfOpenRequests: 2` — require 2 successes to fully close

Each external service gets its own named circuit breaker instance registered in a global `Map`. The `getCircuitBreaker(name)` factory is idempotent — the same instance is returned on repeated calls. `getAllMetrics()` exposes the full set of breaker states for the System Health tab.

---

## Zod Validation Strategy

**File:** `lib/schemas.ts`

Every external API response is parsed with a Zod schema before the data is forwarded to the client. The key benefits:

1. **Type safety at runtime** — a schema change on an upstream API fails fast with a clear validation error rather than silently propagating malformed data into the UI.
2. **Safe defaults** — schemas use `.default(0)` / `.default([])` / `.default({})` so the UI always receives well-typed data even when optional fields are absent.
3. **Nullable fields** — fields documented as nullable (e.g. `place`, `description`) use `.nullable()` so TypeScript knows they can be `null`.

Schemas are inferred into TypeScript types in `lib/types.ts` via `z.infer<typeof Schema>`.

---

## SWR Data Fetching

**Files:** `hooks/use*.ts`

Each data tab has a dedicated SWR hook:

```ts
// hooks/useMarkets.ts (example)
export function useMarkets() {
  const { data, error, isLoading, mutate } = useSWR<MarketsResponse>(
    "/api/markets",
    fetcher,
    { refreshInterval: 60_000 }  // auto-revalidate every 60s
  )
  ...
}
```

SWR was chosen over React Query for its smaller bundle footprint (~4 KB gzipped) and built-in stale-while-revalidate semantics. Each hook:
- Polls the Next.js API route on `refreshInterval`
- Returns a consistent `{ data, error, isLoading, refresh }` interface
- Uses the cached/stale data immediately while fetching fresh data in the background

---

## Server-Side API Key Management

API routes that require secrets (NASA, NewsAPI) read from `process.env` on the server:

```ts
const apiKey = process.env.NASA_API_KEY || "DEMO_KEY"
```

The client never sees the key. Secrets are configured as Vercel environment variables in production and in `.env.local` for local development. The app is fully functional without any keys (using public rate limits and fallbacks).

---

## Server-Sent Events (SSE) for Real-Time Streams

**File:** `app/api/stream/route.ts`

The `/api/stream` endpoint is a persistent SSE connection that pushes two event types to the browser:

| Event | Frequency | Data |
|-------|-----------|------|
| `iss` | Every 5 seconds | `{ latitude, longitude, timestamp }` |
| `population` | Every 1 second | `{ count, timestamp }` (calculated locally) |

The `useLiveStream` hook (`hooks/useLiveStream.ts`) manages the `EventSource` connection with exponential-backoff reconnect logic. If the connection drops, it retries after `min(2^n * 1000ms, 30 000ms)`.

SSE was chosen over WebSockets because:
- The data flow is unidirectional (server → client only)
- Native browser `EventSource` auto-reconnects
- No special server infrastructure required — works on Vercel serverless
- The stream closes itself after 290 seconds (just under Vercel's 300s timeout) so the client reconnects cleanly

---

## Tab and Component Architecture

```
app/
  page.tsx                ← Root page, renders Dashboard
components/
  Dashboard.tsx           ← Tab switcher, theme state, command palette
  Sidebar.tsx             ← Navigation, tab groups, API status dots
  Header.tsx              ← Live population counter, UTC clock
  tabs/
    OverviewTab.tsx       ← 40+ live world counters
    WeatherTab.tsx
    EarthquakeTab.tsx
    MarketsTab.tsx
    ForexTab.tsx
    EconomyTab.tsx
    HealthTab.tsx
    CountriesTab.tsx
    SpaceTab.tsx
    AirQualityTab.tsx
    TechPulseTab.tsx
    NewsTab.tsx
    DataSourcesTab.tsx
    AIQueryTab.tsx
    SystemHealthTab.tsx
  ui/
    MetricCard.tsx        ← Reusable KPI card with animated number
    AnimatedNumber.tsx    ← Spring-interpolated number transitions
    LiveBadge.tsx         ← Blinking "LIVE" indicator
    WorldMap.tsx          ← react-simple-maps SVG map
    CommandPalette.tsx    ← Cmd+K fuzzy tab search
    ...
```

Each tab is a lazy-loaded client component that calls its SWR hook and renders accordingly. Per-tab error boundaries ensure one failing API never crashes the entire dashboard.

The `Dashboard.tsx` component owns:
- `activeTab` state
- `theme` state (light/dark) with `localStorage` persistence and system-preference detection
- The command palette (`Cmd+K`)

---

## Caching Strategy

| Route | `revalidate` | Rationale |
|-------|-------------|-----------|
| `/api/weather` | 300s | Weather changes slowly |
| `/api/quakes` | 300s | USGS updates every few minutes |
| `/api/markets` | 60s | Crypto is volatile |
| `/api/forex` | 300s | FX rates change intraday |
| `/api/economy` | 86400s | World Bank data is daily |
| `/api/health` | 3600s | COVID data updated hourly |
| `/api/countries` | 86400s | Country data is static |
| `/api/space` | 300s | ISS position via SSE instead |
| `/api/air` | 600s | Air quality sensors update slowly |
| `/api/github` | 600s | GitHub trending changes slowly |
| `/api/hackernews` | 300s | HN top stories refresh ~5 min |
| `/api/news` | 600s | News articles updated ~10 min |
| `/api/solar` | 300s | NOAA publishes every few minutes |
| `/api/iss` | 0 (no-store) | ISS position always fresh |
| `/api/stream` | force-dynamic | SSE — never cached |
| `/api/health-check` | force-dynamic | Real-time ping — never cached |
| `/api/ai-query` | force-dynamic | User queries — never cached |
