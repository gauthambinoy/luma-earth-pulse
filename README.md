<div align="center">

# UNIFIED WORLD DATA

### Real-Time Global Data Dashboard

A production-grade, full-stack web application that aggregates **200+ public APIs** into a single live dashboard — featuring 40+ real-time counters, interactive world maps, 15 data tabs, AI-powered natural language queries, and a full system health monitoring panel.

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-unified--world--data.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://unified-world-data.vercel.app)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square)
![SWR](https://img.shields.io/badge/SWR-black?style=flat-square&logo=vercel&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![CI/CD](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10b981?style=flat-square)
![APIs](https://img.shields.io/badge/APIs-200+-8b5cf6?style=flat-square)

</div>

---

## Demo

**https://unified-world-data.vercel.app**

> 15 tabs · 200+ APIs · 40+ live counters · Dark/Light mode · AI query · System health monitoring

---

## Screenshots

> **Live Demo:** [unified-world-data.vercel.app](https://unified-world-data.vercel.app)

| Overview | Markets | Earthquakes |
|----------|---------|-------------|
| ![Overview](./docs/screenshots/overview.png) | ![Markets](./docs/screenshots/markets.png) | ![Earthquakes](./docs/screenshots/earthquakes.png) |

*Visit the [live demo](https://unified-world-data.vercel.app) to see all 15 tabs in action.*

---

## What This Does

This is a real-time global data dashboard that pulls live data from 200+ free public APIs and displays it across 15 interactive tabs. The Overview page shows 40+ live-updating world statistics (births, deaths, CO2, energy, GDP, internet traffic, etc.) that tick every second. Every chart auto-refreshes. Everything works without any API keys.

### Key Features

| Feature | Description |
|---------|------------|
| **40+ Live World Counters** | Population, births/deaths today, CO2 emissions, Google searches, emails sent, flights, GDP — all ticking every second from authoritative sources (UN, WHO, World Bank, IEA) |
| **15 Interactive Tabs** | Overview, Weather, Earthquakes, Markets, Forex, Economy, Health, Countries, Space & ISS, Air Quality, Tech Pulse, News, Data Sources, AI Query, System Health |
| **200+ API Catalog** | 103 free (no key) + 102 freemium/paid APIs across 20 categories, searchable and filterable |
| **AI Natural Language Query** | Type "Bitcoin price" or "earthquakes today" — get sourced answers with navigation suggestions |
| **System Health Dashboard** | Live pings to all 12 external APIs with response times, status indicators, and uptime metrics |
| **Dark/Light Theme** | Apple-inspired light theme (default) + dark mode with smooth animated toggle. System preference detection + localStorage persistence |
| **ISS Live Tracker** | Real-time International Space Station position on interactive world map, refreshing every 30s |
| **Earthquake World Map** | USGS seismic data plotted on SVG world map with magnitude-based color coding |
| **Crypto Sparklines** | 7-day inline price charts for each cryptocurrency |
| **Solar Weather** | Live solar wind speed and Kp aurora index from NOAA |
| **Command Palette** | `Cmd+K` to jump between tabs with fuzzy search |
| **Circuit Breaker** | Production-grade resilience pattern for API calls (CLOSED → OPEN → HALF_OPEN) |
| **Server-Sent Events** | SSE endpoint streaming live ISS position and population data |
| **Zod Validation** | Runtime schema validation on all external API responses |
| **CI/CD Pipeline** | GitHub Actions: lint → typecheck → build on every push |
| **Docker Ready** | Multi-stage Dockerfile with health checks for self-hosting |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS 3.4 |
| **Charts** | Recharts (bar, area, line, pie, sparkline) |
| **Data Fetching** | SWR (stale-while-revalidate, auto-refresh) |
| **Animations** | Framer Motion (tab transitions, command palette) |
| **Maps** | react-simple-maps (SVG world map) |
| **Validation** | Zod (runtime API response schemas) |
| **Streaming** | Server-Sent Events (Node.js ReadableStream) |
| **CI/CD** | GitHub Actions |
| **Container** | Docker (multi-stage Alpine build) |
| **Deployment** | Vercel (edge network, auto-deploy on push) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────┐  │
│  │ Sidebar │  │ Tab View │  │ Charts  │  │ Command      │  │
│  │ Nav     │  │ (15 tabs)│  │Recharts │  │ Palette ⌘K   │  │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └──────────────┘  │
│       │            │             │                           │
│       └────────────┴─────────────┘                           │
│                    │                                         │
│              SWR (auto-refresh)                               │
│              SSE (live stream)                                │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ /api/weather  /api/quakes  /api/markets  /api/forex  │   │
│  │ /api/economy  /api/health  /api/countries /api/space  │   │
│  │ /api/air      /api/github  /api/hackernews /api/news  │   │
│  │ /api/iss      /api/solar   /api/stream    /api/ai     │   │
│  │ /api/health-check                                     │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │                                    │
│    Circuit Breaker ←────┤──── Zod Validation                 │
│    Cache Headers   ←────┘                                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────────┐
          ▼               ▼                   ▼
   ┌─────────────┐ ┌──────────────┐  ┌─────────────┐
   │ Open-Meteo  │ │ USGS         │  │ CoinGecko   │
   │ NASA        │ │ disease.sh   │  │ Frankfurter │
   │ Open Notify │ │ REST Countries│ │ World Bank  │
   │ NOAA SWPC   │ │ OpenAQ       │  │ GitHub      │
   │ + 200 more  │ │ Hacker News  │  │ NewsAPI     │
   └─────────────┘ └──────────────┘  └─────────────┘
```

---

## Data Sources (Active)

### Free — No Key Required

| Source | Data | Auto-Refresh |
|--------|------|:----------:|
| [Open-Meteo](https://open-meteo.com) | Weather for 8 cities | 5 min |
| [USGS](https://earthquake.usgs.gov) | Earthquakes M2.5+ worldwide | 2 min |
| [CoinGecko](https://coingecko.com) | Top 20 crypto + 7d sparklines | 1 min |
| [ExchangeRate API](https://www.exchangerate-api.com) | Live FX rates (10 pairs) | 5 min |
| [Frankfurter](https://www.frankfurter.app) | Historical exchange rates | 1 hr |
| [World Bank](https://data.worldbank.org) | GDP, population, inflation, unemployment, CO2, life expectancy | Daily |
| [disease.sh](https://disease.sh) | Global + per-country COVID stats | 1 hr |
| [REST Countries](https://restcountries.com) | 250 nations data | Daily |
| [NASA](https://api.nasa.gov) | APOD + Near Earth Objects | 1 hr |
| [Open Notify](http://open-notify.org) | ISS position + astronauts | 30 sec |
| [NOAA SWPC](https://www.swpc.noaa.gov) | Solar wind + Kp index | 5 min |
| [OpenAQ](https://openaq.org) | Air quality by city | 10 min |
| [GitHub](https://docs.github.com) | Trending repos + languages | 10 min |
| [Hacker News](https://github.com/HackerNews/API) | Top stories | 5 min |

### Live World Statistics Sources (40+ counters)

| Source | Counters |
|--------|----------|
| UN DESA | Population, net growth |
| WHO | Births, deaths, disease deaths, cancer, heart disease, HIV, malaria |
| Global Carbon Project | CO2 emissions |
| FAO | Food production, food waste, forest loss |
| IEA | Energy consumption, solar energy, oil |
| World Bank | GDP, education spending, healthcare spending |
| SIPRI | Military spending |
| UNESCO | Books published, literacy |
| UNEP | Plastic pollution |
| UNHCR | Refugees |
| ILO | Child labor |
| Cisco | Internet traffic |
| Internet Live Stats | Google searches, emails |

---

## Getting Started

```bash
git clone https://github.com/gauthambinoy/unified-world-data.git
cd unified-world-data
npm install
npm run dev
```

Open **http://localhost:3000** — works immediately with zero configuration.

### Environment Variables (Optional)

| Variable | Default | Purpose |
|----------|---------|---------|
| `NASA_API_KEY` | `DEMO_KEY` | Higher rate limit (1000/hr vs 30/hr) |
| `NEWS_API_KEY` | — | Enables live news headlines |

### Docker

```bash
docker build -t unified-world-data .
docker run -p 3000:3000 unified-world-data
```

---

## Architecture Decisions

| Decision | Why |
|----------|-----|
| Server-side API routes | Keys stay in env vars, never in browser bundle |
| SWR over React Query | Lighter (4KB), built-in stale-while-revalidate |
| Circuit breaker pattern | Graceful degradation when external APIs fail |
| Zod runtime validation | Catch upstream API schema changes before they crash the UI |
| SSE over WebSockets | Unidirectional data, auto-reconnect, simpler infrastructure |
| Canvas background | 0KB extra bundle vs Three.js, runs on all devices |
| react-simple-maps | Pure SVG, no tile server needed, fits dark/light themes |
| Per-tab error boundaries | One failed API never crashes the entire dashboard |
| CSS variables for theming | Instant light/dark switch without re-render |
| Multi-stage Docker | Minimal 120MB production image vs 1.2GB dev |

---

## Documentation

| Document | Description |
|----------|-------------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to set up locally and contribute new data sources |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, circuit breaker, SWR, SSE, Zod strategy |
| [docs/API.md](docs/API.md) | All API endpoints — method, shape, cache interval, source |

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

**[Live Demo](https://unified-world-data.vercel.app)** · **[Report Bug](https://github.com/gauthambinoy/unified-world-data/issues)** · **[Request Feature](https://github.com/gauthambinoy/unified-world-data/issues)**

Built by [Gautham Binoy](https://github.com/gauthambinoy)

</div>
