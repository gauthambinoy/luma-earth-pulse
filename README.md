<div align="center">

# 🌍 Sapien Signal

### _The Pulse of Human Civilization — In Real Time_

**200+ free APIs · 15 interactive tabs · 3D WebGL Earth · Live data streams**

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-Sapien_Signal-00d4ff?style=for-the-badge&logo=vercel&logoColor=white)](https://unified-world-data.vercel.app)
[![CI](https://github.com/gauthambinoy/luma-earth-pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/gauthambinoy/luma-earth-pulse/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## ✨ Features

### 🔴 40+ Real-Time Counters (Updated Every Second)
- World population, births, deaths, CO₂ emissions, forest loss, energy consumption
- Oil barrels consumed, solar energy generated, internet traffic, Google searches
- Military/education/healthcare spending ticking in real-time

### ⚡ Real-Time World Energy Consumption
- Live energy consumption by source: fossil fuels, nuclear, renewables
- Per-country energy data for top 10 consuming nations
- Real-time kilowatt-hours ticking every second with animated numbers
- Regional energy mix breakdowns with interactive charts

### 📊 16 Interactive Data Tabs
| Tab | Data Source | Refresh |
|-----|-----------|---------|
| 🌍 Overview | 40+ live counters | 1s |
| 🌤 Weather | Open-Meteo (8 cities) | 5m |
| 🌊 Earthquakes | USGS (M2.5+ world map) | 2m |
| 💹 Markets | CoinGecko (top 20 crypto) | 1m |
| 💱 Forex | Frankfurter/ECB (10 pairs) | 5m |
| 📊 Economy | World Bank (6 indicators) | 24h |
| 🏥 Health | disease.sh (COVID-19) | 1h |
| 🗺 Countries | REST Countries (250 nations) | 24h |
| 🚀 Space & ISS | NASA + Open Notify + NOAA | 5m |
| 💨 Air Quality | OpenAQ (6 cities) | 10m |
| ⚡ Tech Pulse | GitHub + Hacker News | 5m |
| 🔋 Energy | IEA + EIA + IRENA (live) | 5m |
| 📰 News | NewsAPI headlines | 15m |
| 🔗 Data Sources | 200+ API catalog | static |
| 🤖 AI Query | Pattern-match NLP | instant |
| 🔧 System Health | 12 endpoint pings | live |

### 🛡 Production-Grade Architecture
- **Circuit Breaker** pattern prevents cascading failures
- **Zod validation** on every external API response
- **SWR** with stale-while-revalidate and configurable polling
- **Server-Sent Events** for real-time ISS tracking + population
- **ISR caching** tuned per endpoint (60s → 24h)
- **Error boundaries** per tab for fault isolation
- **Content Security Policy** headers for XSS protection

### 🎨 Beautiful UI
- Dark/light mode with CSS variable theming
- Framer Motion animations and transitions
- Animated mesh gradient background
- Command palette (⌘K) with fuzzy search
- Keyboard navigation (arrow keys, number keys 1-9)
- Responsive design with collapsible sidebar

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/gauthambinoy/luma-earth-pulse.git
cd luma-earth-pulse

# Install dependencies
npm install

# (Optional) Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (app works without them)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the dashboard loads instantly with live data.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.9 (strict mode) |
| **Styling** | Tailwind CSS 3.4 + CSS variables |
| **Charts** | Recharts 3.8 |
| **Animations** | Framer Motion 12 |
| **Data Fetching** | SWR 2.4 + Server-Sent Events |
| **Validation** | Zod 4.3 (runtime schemas) |
| **Maps** | react-simple-maps 3.0 |
| **Testing** | Vitest 1.6 + React Testing Library |
| **CI/CD** | GitHub Actions |
| **Container** | Docker (multi-stage Alpine) |

---

## 📂 Project Structure

```
sapien-signal/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home (Dashboard)
│   ├── globals.css         # Theme + animations
│   └── api/                # 18 API routes
├── components/
│   ├── Dashboard.tsx       # Main container + tab routing
│   ├── Header.tsx          # Live population counter
│   ├── Sidebar.tsx         # Navigation + API status
│   ├── tabs/               # 16 tab components
│   └── ui/                 # 12 reusable UI components
├── hooks/                  # 7 custom React hooks
├── lib/                    # Utilities, types, schemas
├── tests/                  # Vitest unit tests
├── docs/                   # Architecture + API docs
└── Dockerfile              # Production container
```

---

## 🌐 Data Sources

This dashboard integrates **200+ public APIs** across 20 categories. Key sources include:

| API | Data | Free Tier |
|-----|------|-----------|
| [Open-Meteo](https://open-meteo.com) | Weather forecasts | ✅ Unlimited |
| [USGS](https://earthquake.usgs.gov) | Earthquake data | ✅ Unlimited |
| [CoinGecko](https://coingecko.com) | Crypto markets | ✅ 30/min |
| [Frankfurter](https://frankfurter.app) | Forex rates (ECB) | ✅ Unlimited |
| [World Bank](https://data.worldbank.org) | Economic indicators | ✅ Unlimited |
| [disease.sh](https://disease.sh) | COVID-19 stats | ✅ Unlimited |
| [REST Countries](https://restcountries.com) | 250 nations | ✅ Unlimited |
| [NASA](https://api.nasa.gov) | APOD, NEO, solar | ✅ 1000/hr |
| [Open Notify](http://open-notify.org) | ISS position | ✅ Unlimited |
| [OpenAQ](https://openaq.org) | Air quality | ✅ Unlimited |
| [IEA](https://www.iea.org) | Energy statistics | ✅ Reference |
| [EIA](https://www.eia.gov) | US energy data | ✅ Unlimited |
| [IRENA](https://www.irena.org) | Renewable energy | ✅ Reference |

See the **Data Sources** tab in the app for the full catalog of 200+ APIs.

---

## 🧪 Testing

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

---

## 🐳 Docker

```bash
docker build -t sapien-signal .
docker run -p 3000:3000 sapien-signal
```

---

## 📖 Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) — System design, patterns, caching strategy
- [API Reference](docs/API.md) — All 18 endpoints with request/response shapes
- [Contributing Guide](CONTRIBUTING.md) — Development setup, code standards, PR process

---

## 📄 License

MIT © 2026 [Gautham Binoy](https://github.com/gauthambinoy)

---

<div align="center">

_"Every signal tells a story. This dashboard tells them all."_

**Built with obsession by [Gautham Binoy](https://github.com/gauthambinoy)**

</div>
