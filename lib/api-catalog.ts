// ══════════════════════════════════════════════════════════════════
// UNIFIED WORLD DATA — 200+ Public API Catalog
// 100+ Free (no key) + 100+ Paid/Freemium APIs
// ══════════════════════════════════════════════════════════════════

export interface ApiSource {
  id: string;
  name: string;
  description: string;
  url: string;
  docsUrl: string;
  keyRequired: boolean;
  rateLimit: string;
  category: string;
  tier: "free" | "freemium" | "paid";
}

export const API_CATEGORIES = [
  { id: "weather", label: "Weather & Climate", icon: "🌤", color: "#6EE7B7" },
  { id: "geology", label: "Geology & Disasters", icon: "🌊", color: "#FCD34D" },
  { id: "finance", label: "Finance & Crypto", icon: "💹", color: "#C4B5FD" },
  { id: "forex", label: "Forex & Currency", icon: "💱", color: "#818CF8" },
  { id: "health", label: "Health & Medicine", icon: "🏥", color: "#F87171" },
  { id: "demographics", label: "Countries & People", icon: "🗺", color: "#60A5FA" },
  { id: "space", label: "Space & Astronomy", icon: "🚀", color: "#FB923C" },
  { id: "environment", label: "Environment", icon: "🌿", color: "#34D399" },
  { id: "news", label: "News & Media", icon: "📰", color: "#F472B6" },
  { id: "tech", label: "Technology & Dev", icon: "⚡", color: "#818CF8" },
  { id: "economy", label: "Economy & Trade", icon: "📊", color: "#FBBF24" },
  { id: "transport", label: "Transport & Maps", icon: "✈️", color: "#38BDF8" },
  { id: "sports", label: "Sports & Fitness", icon: "⚽", color: "#4ADE80" },
  { id: "education", label: "Education & Books", icon: "📚", color: "#A78BFA" },
  { id: "food", label: "Food & Nutrition", icon: "🍽", color: "#FB923C" },
  { id: "entertainment", label: "Entertainment", icon: "🎬", color: "#F472B6" },
  { id: "communication", label: "Communication", icon: "💬", color: "#22D3EE" },
  { id: "ai", label: "AI & Machine Learning", icon: "🤖", color: "#C084FC" },
  { id: "security", label: "Security & Identity", icon: "🔒", color: "#EF4444" },
  { id: "ecommerce", label: "E-Commerce", icon: "🛒", color: "#F59E0B" },
] as const;

// ═══════════════════════════════════════════════════
// 100+ FREE APIs (no key required or free tier)
// ═══════════════════════════════════════════════════
export const FREE_APIS: ApiSource[] = [
  // ── Weather & Climate ──
  { id:"f1", name:"Open-Meteo Weather", description:"Current/forecast weather for any location globally", url:"https://api.open-meteo.com/v1/forecast", docsUrl:"https://open-meteo.com/en/docs", keyRequired:false, rateLimit:"10,000/day", category:"weather", tier:"free" },
  { id:"f2", name:"Open-Meteo Marine", description:"Ocean wave heights, swell data for coastal areas", url:"https://marine-api.open-meteo.com/v1/marine", docsUrl:"https://open-meteo.com/en/docs/marine-weather-api", keyRequired:false, rateLimit:"10,000/day", category:"weather", tier:"free" },
  { id:"f3", name:"Open-Meteo Air Quality", description:"PM2.5, PM10, ozone, NO2 forecasts globally", url:"https://air-quality-api.open-meteo.com/v1/air-quality", docsUrl:"https://open-meteo.com/en/docs/air-quality-api", keyRequired:false, rateLimit:"10,000/day", category:"weather", tier:"free" },
  { id:"f4", name:"Open-Meteo Geocoding", description:"City name to coordinates lookup", url:"https://geocoding-api.open-meteo.com/v1/search", docsUrl:"https://open-meteo.com/en/docs/geocoding-api", keyRequired:false, rateLimit:"10,000/day", category:"weather", tier:"free" },
  { id:"f5", name:"Open-Meteo Historical", description:"Historical weather data back to 1940", url:"https://archive-api.open-meteo.com/v1/archive", docsUrl:"https://open-meteo.com/en/docs/historical-weather-api", keyRequired:false, rateLimit:"10,000/day", category:"weather", tier:"free" },
  { id:"f6", name:"Sunrise-Sunset API", description:"Sunrise, sunset, solar noon, day length", url:"https://api.sunrise-sunset.org/json", docsUrl:"https://sunrise-sunset.org/api", keyRequired:false, rateLimit:"Unlimited", category:"weather", tier:"free" },
  { id:"f7", name:"7Timer! Weather", description:"Civil, meteorological, astronomical forecasts", url:"http://www.7timer.info/bin/api.pl", docsUrl:"http://www.7timer.info/doc.php", keyRequired:false, rateLimit:"Unlimited", category:"weather", tier:"free" },

  // ── Geology & Disasters ──
  { id:"f8", name:"USGS Earthquakes", description:"Real-time earthquake data worldwide M2.5+", url:"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson", docsUrl:"https://earthquake.usgs.gov/fdsnws/event/1/", keyRequired:false, rateLimit:"Unlimited", category:"geology", tier:"free" },
  { id:"f9", name:"USGS Significant Quakes", description:"Only significant seismic events", url:"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", docsUrl:"https://earthquake.usgs.gov/fdsnws/event/1/", keyRequired:false, rateLimit:"Unlimited", category:"geology", tier:"free" },
  { id:"f10", name:"USGS All Past Hour", description:"Every earthquake in the last 60 minutes", url:"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson", docsUrl:"https://earthquake.usgs.gov/fdsnws/event/1/", keyRequired:false, rateLimit:"Unlimited", category:"geology", tier:"free" },
  { id:"f11", name:"EONET Natural Events", description:"NASA Earth Observatory natural event tracker", url:"https://eonet.gsfc.nasa.gov/api/v3/events", docsUrl:"https://eonet.gsfc.nasa.gov/docs/v3", keyRequired:false, rateLimit:"Unlimited", category:"geology", tier:"free" },
  { id:"f12", name:"ReliefWeb Disasters", description:"UN OCHA humanitarian disaster reports", url:"https://api.reliefweb.int/v1/disasters", docsUrl:"https://apidoc.rwlabs.org", keyRequired:false, rateLimit:"Unlimited", category:"geology", tier:"free" },

  // ── Finance & Crypto ──
  { id:"f13", name:"CoinGecko Markets", description:"Top cryptocurrencies by market cap", url:"https://api.coingecko.com/api/v3/coins/markets", docsUrl:"https://www.coingecko.com/en/api/documentation", keyRequired:false, rateLimit:"30/min", category:"finance", tier:"free" },
  { id:"f14", name:"CoinGecko Trending", description:"Trending coins in the last 24 hours", url:"https://api.coingecko.com/api/v3/search/trending", docsUrl:"https://www.coingecko.com/en/api/documentation", keyRequired:false, rateLimit:"30/min", category:"finance", tier:"free" },
  { id:"f15", name:"CoinGecko Global", description:"Global crypto market statistics", url:"https://api.coingecko.com/api/v3/global", docsUrl:"https://www.coingecko.com/en/api/documentation", keyRequired:false, rateLimit:"30/min", category:"finance", tier:"free" },
  { id:"f16", name:"CoinGecko History", description:"Coin price history by date", url:"https://api.coingecko.com/api/v3/coins/{id}/market_chart", docsUrl:"https://www.coingecko.com/en/api/documentation", keyRequired:false, rateLimit:"30/min", category:"finance", tier:"free" },
  { id:"f17", name:"Binance Ticker", description:"Real-time crypto ticker prices", url:"https://api.binance.com/api/v3/ticker/24hr", docsUrl:"https://binance-docs.github.io/apidocs", keyRequired:false, rateLimit:"1200/min", category:"finance", tier:"free" },
  { id:"f18", name:"CoinCap Assets", description:"Real-time crypto asset data", url:"https://api.coincap.io/v2/assets", docsUrl:"https://docs.coincap.io", keyRequired:false, rateLimit:"200/min", category:"finance", tier:"free" },

  // ── Forex & Currency ──
  { id:"f19", name:"ExchangeRate API", description:"Live foreign exchange rates vs USD", url:"https://open.er-api.com/v6/latest/USD", docsUrl:"https://www.exchangerate-api.com/docs/free", keyRequired:false, rateLimit:"1,500/month", category:"forex", tier:"free" },
  { id:"f20", name:"Frankfurter", description:"Historical exchange rates from ECB", url:"https://api.frankfurter.app/latest", docsUrl:"https://www.frankfurter.app/docs", keyRequired:false, rateLimit:"Unlimited", category:"forex", tier:"free" },
  { id:"f21", name:"Frankfurter History", description:"FX time series for date ranges", url:"https://api.frankfurter.app/2024-01-01..", docsUrl:"https://www.frankfurter.app/docs", keyRequired:false, rateLimit:"Unlimited", category:"forex", tier:"free" },

  // ── Health ──
  { id:"f22", name:"disease.sh Global COVID", description:"Global COVID-19 statistics", url:"https://disease.sh/v3/covid-19/all", docsUrl:"https://disease.sh/docs/", keyRequired:false, rateLimit:"Unlimited", category:"health", tier:"free" },
  { id:"f23", name:"disease.sh Countries", description:"Per-country COVID-19 breakdown", url:"https://disease.sh/v3/covid-19/countries", docsUrl:"https://disease.sh/docs/", keyRequired:false, rateLimit:"Unlimited", category:"health", tier:"free" },
  { id:"f24", name:"disease.sh Historical", description:"Historical COVID-19 time series", url:"https://disease.sh/v3/covid-19/historical/all", docsUrl:"https://disease.sh/docs/", keyRequired:false, rateLimit:"Unlimited", category:"health", tier:"free" },
  { id:"f25", name:"disease.sh Continents", description:"COVID-19 data by continent", url:"https://disease.sh/v3/covid-19/continents", docsUrl:"https://disease.sh/docs/", keyRequired:false, rateLimit:"Unlimited", category:"health", tier:"free" },
  { id:"f26", name:"WHO GHO Data", description:"World Health Organization global health indicators", url:"https://ghoapi.azureedge.net/api/", docsUrl:"https://www.who.int/data/gho/info/gho-odata-api", keyRequired:false, rateLimit:"Unlimited", category:"health", tier:"free" },
  { id:"f27", name:"OpenFDA Drug Events", description:"FDA adverse drug event reports", url:"https://api.fda.gov/drug/event.json", docsUrl:"https://open.fda.gov/apis/", keyRequired:false, rateLimit:"240/min", category:"health", tier:"free" },

  // ── Countries & Demographics ──
  { id:"f28", name:"REST Countries", description:"Data on 250 world nations", url:"https://restcountries.com/v3.1/all", docsUrl:"https://restcountries.com", keyRequired:false, rateLimit:"Unlimited", category:"demographics", tier:"free" },
  { id:"f29", name:"Nager.Date Holidays", description:"Public holidays for 100+ countries", url:"https://date.nager.at/api/v3/PublicHolidays", docsUrl:"https://date.nager.at/Api", keyRequired:false, rateLimit:"Unlimited", category:"demographics", tier:"free" },
  { id:"f30", name:"IP-API Geolocation", description:"IP-based city/country detection", url:"http://ip-api.com/json", docsUrl:"http://ip-api.com/docs", keyRequired:false, rateLimit:"45/min", category:"demographics", tier:"free" },
  { id:"f31", name:"CountryFlags API", description:"Country flag images in SVG/PNG", url:"https://flagcdn.com", docsUrl:"https://flagpedia.net/download/api", keyRequired:false, rateLimit:"Unlimited", category:"demographics", tier:"free" },
  { id:"f32", name:"WorldTimeAPI", description:"Current time for any timezone", url:"https://worldtimeapi.org/api/timezone", docsUrl:"http://worldtimeapi.org", keyRequired:false, rateLimit:"Unlimited", category:"demographics", tier:"free" },

  // ── Space & Astronomy ──
  { id:"f33", name:"NASA APOD", description:"Astronomy Picture of the Day", url:"https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", docsUrl:"https://api.nasa.gov", keyRequired:false, rateLimit:"30/hr (DEMO)", category:"space", tier:"free" },
  { id:"f34", name:"NASA NEO Feed", description:"Near-Earth Objects this week", url:"https://api.nasa.gov/neo/rest/v1/feed?api_key=DEMO_KEY", docsUrl:"https://api.nasa.gov", keyRequired:false, rateLimit:"30/hr (DEMO)", category:"space", tier:"free" },
  { id:"f35", name:"NASA Mars Rover", description:"Mars Rover photos (Curiosity, Perseverance)", url:"https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos", docsUrl:"https://api.nasa.gov", keyRequired:false, rateLimit:"30/hr (DEMO)", category:"space", tier:"free" },
  { id:"f36", name:"NASA EPIC", description:"Earth Polychromatic Imaging Camera", url:"https://api.nasa.gov/EPIC/api/natural", docsUrl:"https://api.nasa.gov", keyRequired:false, rateLimit:"30/hr (DEMO)", category:"space", tier:"free" },
  { id:"f37", name:"Open Notify ISS", description:"Real-time ISS latitude/longitude", url:"http://api.open-notify.org/iss-now.json", docsUrl:"http://open-notify.org/Open-Notify-API/", keyRequired:false, rateLimit:"Unlimited", category:"space", tier:"free" },
  { id:"f38", name:"Open Notify Astronauts", description:"People currently in space", url:"http://api.open-notify.org/astros.json", docsUrl:"http://open-notify.org/Open-Notify-API/", keyRequired:false, rateLimit:"Unlimited", category:"space", tier:"free" },
  { id:"f39", name:"NOAA Solar Wind", description:"Real-time solar wind speed from SWPC", url:"https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json", docsUrl:"https://www.swpc.noaa.gov/products", keyRequired:false, rateLimit:"Unlimited", category:"space", tier:"free" },
  { id:"f40", name:"NOAA Kp Index", description:"Geomagnetic storm / aurora indicator", url:"https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json", docsUrl:"https://www.swpc.noaa.gov/products/planetary-k-index", keyRequired:false, rateLimit:"Unlimited", category:"space", tier:"free" },
  { id:"f41", name:"NOAA Solar Flare Alerts", description:"Solar flare & radio blackout warnings", url:"https://services.swpc.noaa.gov/products/alerts.json", docsUrl:"https://www.swpc.noaa.gov/products", keyRequired:false, rateLimit:"Unlimited", category:"space", tier:"free" },
  { id:"f42", name:"Sunrise-Sunset Astro", description:"Astronomical twilight and noon times", url:"https://api.sunrise-sunset.org/json", docsUrl:"https://sunrise-sunset.org/api", keyRequired:false, rateLimit:"Unlimited", category:"space", tier:"free" },

  // ── Environment ──
  { id:"f43", name:"OpenAQ", description:"Global air quality readings from stations", url:"https://api.openaq.org/v2/latest", docsUrl:"https://docs.openaq.org", keyRequired:false, rateLimit:"Unlimited", category:"environment", tier:"free" },
  { id:"f44", name:"USGS Water Services", description:"Real-time river & stream flow data", url:"https://waterservices.usgs.gov/nwis/iv/", docsUrl:"https://waterservices.usgs.gov", keyRequired:false, rateLimit:"Unlimited", category:"environment", tier:"free" },
  { id:"f45", name:"Open-Meteo Flood", description:"River flood forecasting", url:"https://flood-api.open-meteo.com/v1/flood", docsUrl:"https://open-meteo.com/en/docs/flood-api", keyRequired:false, rateLimit:"10,000/day", category:"environment", tier:"free" },

  // ── News & Media ──
  { id:"f46", name:"Hacker News Top", description:"Top stories from Y Combinator", url:"https://hacker-news.firebaseio.com/v0/topstories.json", docsUrl:"https://github.com/HackerNews/API", keyRequired:false, rateLimit:"Unlimited", category:"news", tier:"free" },
  { id:"f47", name:"Hacker News Best", description:"Highest-voted stories of all time", url:"https://hacker-news.firebaseio.com/v0/beststories.json", docsUrl:"https://github.com/HackerNews/API", keyRequired:false, rateLimit:"Unlimited", category:"news", tier:"free" },
  { id:"f48", name:"Hacker News New", description:"Newest stories", url:"https://hacker-news.firebaseio.com/v0/newstories.json", docsUrl:"https://github.com/HackerNews/API", keyRequired:false, rateLimit:"Unlimited", category:"news", tier:"free" },
  { id:"f49", name:"Wikipedia Pageviews", description:"Most viewed Wikipedia articles daily", url:"https://wikimedia.org/api/rest_v1/metrics/pageviews", docsUrl:"https://wikitech.wikimedia.org/wiki/Analytics/AQS/Pageviews", keyRequired:false, rateLimit:"200/s", category:"news", tier:"free" },
  { id:"f50", name:"Reddit Front Page", description:"Reddit front page posts as JSON", url:"https://www.reddit.com/.json", docsUrl:"https://www.reddit.com/dev/api/", keyRequired:false, rateLimit:"60/min", category:"news", tier:"free" },

  // ── Technology & Dev ──
  { id:"f51", name:"GitHub Events", description:"Real-time public GitHub activity", url:"https://api.github.com/events", docsUrl:"https://docs.github.com/en/rest/activity/events", keyRequired:false, rateLimit:"60/hr", category:"tech", tier:"free" },
  { id:"f52", name:"GitHub Search Repos", description:"Search & find trending repositories", url:"https://api.github.com/search/repositories", docsUrl:"https://docs.github.com/en/rest/search", keyRequired:false, rateLimit:"10/min", category:"tech", tier:"free" },
  { id:"f53", name:"GitHub Topics", description:"Popular programming topics", url:"https://api.github.com/search/topics", docsUrl:"https://docs.github.com/en/rest/search", keyRequired:false, rateLimit:"10/min", category:"tech", tier:"free" },
  { id:"f54", name:"GitLab Public", description:"Public GitLab projects and activity", url:"https://gitlab.com/api/v4/projects", docsUrl:"https://docs.gitlab.com/ee/api/", keyRequired:false, rateLimit:"300/min", category:"tech", tier:"free" },
  { id:"f55", name:"npm Registry", description:"Node.js package metadata", url:"https://registry.npmjs.org/", docsUrl:"https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md", keyRequired:false, rateLimit:"Unlimited", category:"tech", tier:"free" },
  { id:"f56", name:"crates.io", description:"Rust package registry", url:"https://crates.io/api/v1/crates", docsUrl:"https://crates.io/policies", keyRequired:false, rateLimit:"1/s", category:"tech", tier:"free" },
  { id:"f57", name:"PyPI Stats", description:"Python package download stats", url:"https://pypistats.org/api", docsUrl:"https://pypistats.org/about", keyRequired:false, rateLimit:"Unlimited", category:"tech", tier:"free" },
  { id:"f58", name:"Public APIs List", description:"Curated list of free APIs", url:"https://api.publicapis.org/entries", docsUrl:"https://github.com/davemachado/public-api", keyRequired:false, rateLimit:"10/min", category:"tech", tier:"free" },

  // ── Economy & Trade ──
  { id:"f59", name:"World Bank GDP", description:"GDP by country (current USD)", url:"https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json", docsUrl:"https://datahelpdesk.worldbank.org", keyRequired:false, rateLimit:"Unlimited", category:"economy", tier:"free" },
  { id:"f60", name:"World Bank Population", description:"Population statistics by country", url:"https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json", docsUrl:"https://datahelpdesk.worldbank.org", keyRequired:false, rateLimit:"Unlimited", category:"economy", tier:"free" },
  { id:"f61", name:"World Bank Inflation", description:"Consumer price inflation rates", url:"https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL.ZG?format=json", docsUrl:"https://datahelpdesk.worldbank.org", keyRequired:false, rateLimit:"Unlimited", category:"economy", tier:"free" },
  { id:"f62", name:"World Bank Life Expectancy", description:"Life expectancy at birth", url:"https://api.worldbank.org/v2/country/all/indicator/SP.DYN.LE00.IN?format=json", docsUrl:"https://datahelpdesk.worldbank.org", keyRequired:false, rateLimit:"Unlimited", category:"economy", tier:"free" },
  { id:"f63", name:"World Bank Unemployment", description:"Unemployment rates globally", url:"https://api.worldbank.org/v2/country/all/indicator/SL.UEM.TOTL.ZS?format=json", docsUrl:"https://datahelpdesk.worldbank.org", keyRequired:false, rateLimit:"Unlimited", category:"economy", tier:"free" },
  { id:"f64", name:"World Bank CO2 Emissions", description:"CO2 metric tons per capita", url:"https://api.worldbank.org/v2/country/all/indicator/EN.ATM.CO2E.PC?format=json", docsUrl:"https://datahelpdesk.worldbank.org", keyRequired:false, rateLimit:"Unlimited", category:"economy", tier:"free" },
  { id:"f65", name:"World Bank Internet Users", description:"Internet penetration %", url:"https://api.worldbank.org/v2/country/all/indicator/IT.NET.USER.ZS?format=json", docsUrl:"https://datahelpdesk.worldbank.org", keyRequired:false, rateLimit:"Unlimited", category:"economy", tier:"free" },
  { id:"f66", name:"World Bank Education", description:"Education spending % GDP", url:"https://api.worldbank.org/v2/country/all/indicator/SE.XPD.TOTL.GD.ZS?format=json", docsUrl:"https://datahelpdesk.worldbank.org", keyRequired:false, rateLimit:"Unlimited", category:"economy", tier:"free" },
  { id:"f67", name:"FRED Economic Data", description:"Federal Reserve economic data", url:"https://api.stlouisfed.org/fred", docsUrl:"https://fred.stlouisfed.org/docs/api/fred/", keyRequired:false, rateLimit:"120/min", category:"economy", tier:"free" },

  // ── Transport & Maps ──
  { id:"f68", name:"OpenSky Network", description:"Live flight tracking worldwide", url:"https://opensky-network.org/api/states/all", docsUrl:"https://openskynetwork.github.io/opensky-api/", keyRequired:false, rateLimit:"10/10s", category:"transport", tier:"free" },
  { id:"f69", name:"OpenStreetMap Nominatim", description:"Geocoding & reverse geocoding", url:"https://nominatim.openstreetmap.org/search", docsUrl:"https://nominatim.org/release-docs/develop/api/Search/", keyRequired:false, rateLimit:"1/s", category:"transport", tier:"free" },
  { id:"f70", name:"Country.is", description:"IP to country detection", url:"https://api.country.is", docsUrl:"https://country.is", keyRequired:false, rateLimit:"Unlimited", category:"transport", tier:"free" },

  // ── Sports ──
  { id:"f71", name:"NBA Scores (balldontlie)", description:"NBA stats, players, games", url:"https://www.balldontlie.io/api/v1/games", docsUrl:"https://www.balldontlie.io", keyRequired:false, rateLimit:"60/min", category:"sports", tier:"free" },
  { id:"f72", name:"FIFA World Rankings", description:"National team FIFA rankings", url:"https://www.football-data.org/v4/competitions", docsUrl:"https://www.football-data.org/documentation", keyRequired:false, rateLimit:"10/min", category:"sports", tier:"free" },

  // ── Education & Books ──
  { id:"f73", name:"Open Library", description:"Books database by Internet Archive", url:"https://openlibrary.org/api/books", docsUrl:"https://openlibrary.org/developers/api", keyRequired:false, rateLimit:"100/5min", category:"education", tier:"free" },
  { id:"f74", name:"Open Library Search", description:"Full-text book search", url:"https://openlibrary.org/search.json", docsUrl:"https://openlibrary.org/dev/docs/api/search", keyRequired:false, rateLimit:"100/5min", category:"education", tier:"free" },
  { id:"f75", name:"arXiv API", description:"Scientific paper search (physics, CS, math)", url:"http://export.arxiv.org/api/query", docsUrl:"https://info.arxiv.org/help/api/index.html", keyRequired:false, rateLimit:"3/s", category:"education", tier:"free" },
  { id:"f76", name:"Wikipedia API", description:"Wikipedia article content and search", url:"https://en.wikipedia.org/w/api.php", docsUrl:"https://www.mediawiki.org/wiki/API:Main_page", keyRequired:false, rateLimit:"200/s", category:"education", tier:"free" },
  { id:"f77", name:"Wiktionary", description:"Dictionary definitions from Wiktionary", url:"https://en.wiktionary.org/w/api.php", docsUrl:"https://www.mediawiki.org/wiki/API:Main_page", keyRequired:false, rateLimit:"200/s", category:"education", tier:"free" },
  { id:"f78", name:"Free Dictionary API", description:"English definitions, phonetics, examples", url:"https://api.dictionaryapi.dev/api/v2/entries/en/", docsUrl:"https://dictionaryapi.dev", keyRequired:false, rateLimit:"Unlimited", category:"education", tier:"free" },

  // ── Food & Nutrition ──
  { id:"f79", name:"Open Food Facts", description:"World food products database", url:"https://world.openfoodfacts.org/api/v0/product/", docsUrl:"https://world.openfoodfacts.org/data", keyRequired:false, rateLimit:"100/min", category:"food", tier:"free" },
  { id:"f80", name:"TheMealDB", description:"Meal recipes database", url:"https://www.themealdb.com/api/json/v1/1/search.php", docsUrl:"https://www.themealdb.com/api.php", keyRequired:false, rateLimit:"Unlimited", category:"food", tier:"free" },
  { id:"f81", name:"TheCocktailDB", description:"Cocktail recipes database", url:"https://www.thecocktaildb.com/api/json/v1/1/search.php", docsUrl:"https://www.thecocktaildb.com/api.php", keyRequired:false, rateLimit:"Unlimited", category:"food", tier:"free" },

  // ── Entertainment ──
  { id:"f82", name:"Jikan (MyAnimeList)", description:"Anime & manga database", url:"https://api.jikan.moe/v4/anime", docsUrl:"https://docs.api.jikan.moe", keyRequired:false, rateLimit:"60/min", category:"entertainment", tier:"free" },
  { id:"f83", name:"PokeAPI", description:"Pokemon data and sprites", url:"https://pokeapi.co/api/v2/pokemon", docsUrl:"https://pokeapi.co/docs/v2", keyRequired:false, rateLimit:"100/min", category:"entertainment", tier:"free" },
  { id:"f84", name:"SWAPI", description:"Star Wars universe data", url:"https://swapi.dev/api/", docsUrl:"https://swapi.dev/documentation", keyRequired:false, rateLimit:"10,000/day", category:"entertainment", tier:"free" },
  { id:"f85", name:"Rick and Morty API", description:"Characters, locations, episodes", url:"https://rickandmortyapi.com/api/character", docsUrl:"https://rickandmortyapi.com/documentation", keyRequired:false, rateLimit:"Unlimited", category:"entertainment", tier:"free" },
  { id:"f86", name:"Open Trivia DB", description:"Trivia questions by category", url:"https://opentdb.com/api.php", docsUrl:"https://opentdb.com/api_config.php", keyRequired:false, rateLimit:"Unlimited", category:"entertainment", tier:"free" },

  // ── Communication ──
  { id:"f87", name:"JSONPlaceholder", description:"Fake REST API for testing (posts, users)", url:"https://jsonplaceholder.typicode.com/posts", docsUrl:"https://jsonplaceholder.typicode.com", keyRequired:false, rateLimit:"Unlimited", category:"communication", tier:"free" },
  { id:"f88", name:"httpbin", description:"HTTP request & response testing", url:"https://httpbin.org", docsUrl:"https://httpbin.org", keyRequired:false, rateLimit:"Unlimited", category:"communication", tier:"free" },
  { id:"f89", name:"Random User", description:"Generate random user profiles", url:"https://randomuser.me/api/", docsUrl:"https://randomuser.me/documentation", keyRequired:false, rateLimit:"Unlimited", category:"communication", tier:"free" },

  // ── Misc Free ──
  { id:"f90", name:"Numbers API", description:"Fun facts about numbers & dates", url:"http://numbersapi.com", docsUrl:"http://numbersapi.com", keyRequired:false, rateLimit:"Unlimited", category:"education", tier:"free" },
  { id:"f91", name:"Cat Facts", description:"Random cat facts", url:"https://catfact.ninja/fact", docsUrl:"https://catfact.ninja", keyRequired:false, rateLimit:"Unlimited", category:"entertainment", tier:"free" },
  { id:"f92", name:"Dog CEO", description:"Random dog images by breed", url:"https://dog.ceo/api/breeds/image/random", docsUrl:"https://dog.ceo/dog-api/", keyRequired:false, rateLimit:"Unlimited", category:"entertainment", tier:"free" },
  { id:"f93", name:"Colr.org", description:"Color scheme generation", url:"https://www.colr.org/json/color/random", docsUrl:"https://www.colr.org", keyRequired:false, rateLimit:"Unlimited", category:"tech", tier:"free" },
  { id:"f94", name:"Internet Archive", description:"Wayback Machine & media search", url:"https://archive.org/advancedsearch.php", docsUrl:"https://archive.org/developers/", keyRequired:false, rateLimit:"15/min", category:"education", tier:"free" },
  { id:"f95", name:"MusicBrainz", description:"Music metadata (artists, albums, tracks)", url:"https://musicbrainz.org/ws/2/artist/", docsUrl:"https://musicbrainz.org/doc/MusicBrainz_API", keyRequired:false, rateLimit:"1/s", category:"entertainment", tier:"free" },
  { id:"f96", name:"Lorem Picsum", description:"Random high-quality placeholder photos", url:"https://picsum.photos/v2/list", docsUrl:"https://picsum.photos", keyRequired:false, rateLimit:"Unlimited", category:"entertainment", tier:"free" },
  { id:"f97", name:"Quotable", description:"Inspirational quotes database", url:"https://api.quotable.io/quotes/random", docsUrl:"https://github.com/lukePeavey/quotable", keyRequired:false, rateLimit:"180/min", category:"education", tier:"free" },
  { id:"f98", name:"Bored API", description:"Random activity suggestions", url:"https://www.boredapi.com/api/activity", docsUrl:"https://www.boredapi.com/documentation", keyRequired:false, rateLimit:"Unlimited", category:"entertainment", tier:"free" },
  { id:"f99", name:"Exchange Rates (ECB)", description:"European Central Bank rates", url:"https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", docsUrl:"https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html", keyRequired:false, rateLimit:"Unlimited", category:"forex", tier:"free" },
  { id:"f100", name:"GeoJS", description:"IP geolocation in JSON", url:"https://get.geojs.io/v1/ip/geo.json", docsUrl:"https://www.geojs.io/docs/v1/endpoints/geo/", keyRequired:false, rateLimit:"Unlimited", category:"demographics", tier:"free" },
  { id:"f101", name:"Universities List", description:"Universities search by country/name", url:"http://universities.hipolabs.com/search", docsUrl:"https://github.com/Hipo/university-domains-list-api", keyRequired:false, rateLimit:"Unlimited", category:"education", tier:"free" },
  { id:"f102", name:"Carbon Intensity UK", description:"UK grid carbon intensity forecast", url:"https://api.carbonintensity.org.uk/intensity", docsUrl:"https://carbon-intensity.github.io/api-definitions/", keyRequired:false, rateLimit:"Unlimited", category:"environment", tier:"free" },
  { id:"f103", name:"SpaceX API", description:"SpaceX launches, rockets, capsules", url:"https://api.spacexdata.com/v4/launches", docsUrl:"https://github.com/r-spacex/SpaceX-API", keyRequired:false, rateLimit:"Unlimited", category:"space", tier:"free" },
];

// ═══════════════════════════════════════════════════
// 100+ PAID / FREEMIUM APIs (key required, free tiers available)
// ═══════════════════════════════════════════════════
export const PAID_APIS: ApiSource[] = [
  // ── Weather ──
  { id:"p1", name:"OpenWeatherMap", description:"Weather data, forecasts, maps, UV index", url:"https://api.openweathermap.org/data/2.5/weather", docsUrl:"https://openweathermap.org/api", keyRequired:true, rateLimit:"60/min free", category:"weather", tier:"freemium" },
  { id:"p2", name:"WeatherAPI", description:"Real-time weather, forecast, astronomy", url:"https://api.weatherapi.com/v1/current.json", docsUrl:"https://www.weatherapi.com/docs/", keyRequired:true, rateLimit:"1M/month free", category:"weather", tier:"freemium" },
  { id:"p3", name:"Visual Crossing", description:"Historical & forecast weather data", url:"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/", docsUrl:"https://www.visualcrossing.com/resources/documentation/", keyRequired:true, rateLimit:"1000/day free", category:"weather", tier:"freemium" },
  { id:"p4", name:"Tomorrow.io", description:"Hyper-local weather intelligence", url:"https://api.tomorrow.io/v4/weather/realtime", docsUrl:"https://docs.tomorrow.io", keyRequired:true, rateLimit:"500/day free", category:"weather", tier:"freemium" },
  { id:"p5", name:"Weatherbit", description:"16-day forecasts, air quality, historical", url:"https://api.weatherbit.io/v2.0/current", docsUrl:"https://www.weatherbit.io/api", keyRequired:true, rateLimit:"50/day free", category:"weather", tier:"freemium" },

  // ── Finance ──
  { id:"p6", name:"Alpha Vantage", description:"Stock market, forex, crypto data", url:"https://www.alphavantage.co/query", docsUrl:"https://www.alphavantage.co/documentation/", keyRequired:true, rateLimit:"25/day free", category:"finance", tier:"freemium" },
  { id:"p7", name:"Twelve Data", description:"Stock, forex, crypto real-time & historical", url:"https://api.twelvedata.com/time_series", docsUrl:"https://twelvedata.com/docs", keyRequired:true, rateLimit:"800/day free", category:"finance", tier:"freemium" },
  { id:"p8", name:"Polygon.io", description:"Stock, options, forex, crypto data", url:"https://api.polygon.io/v2/aggs/ticker/", docsUrl:"https://polygon.io/docs", keyRequired:true, rateLimit:"5/min free", category:"finance", tier:"freemium" },
  { id:"p9", name:"Finnhub", description:"Real-time stock prices, company fundamentals", url:"https://finnhub.io/api/v1/quote", docsUrl:"https://finnhub.io/docs/api", keyRequired:true, rateLimit:"60/min free", category:"finance", tier:"freemium" },
  { id:"p10", name:"IEX Cloud", description:"Financial data, stock quotes, earnings", url:"https://cloud.iexapis.com/stable/stock/", docsUrl:"https://iexcloud.io/docs/api/", keyRequired:true, rateLimit:"Pay-as-you-go", category:"finance", tier:"paid" },
  { id:"p11", name:"CoinMarketCap", description:"Crypto prices, market cap, rankings", url:"https://pro-api.coinmarketcap.com/v1/cryptocurrency/", docsUrl:"https://coinmarketcap.com/api/documentation/", keyRequired:true, rateLimit:"10K/month free", category:"finance", tier:"freemium" },
  { id:"p12", name:"Morningstar", description:"Fund data, ratings, portfolio analysis", url:"https://api.morningstar.com", docsUrl:"https://developer.morningstar.com", keyRequired:true, rateLimit:"Enterprise", category:"finance", tier:"paid" },

  // ── News ──
  { id:"p13", name:"NewsAPI", description:"Breaking news from 80,000+ sources", url:"https://newsapi.org/v2/top-headlines", docsUrl:"https://newsapi.org/docs", keyRequired:true, rateLimit:"100/day free", category:"news", tier:"freemium" },
  { id:"p14", name:"Guardian Open Platform", description:"Guardian newspaper articles & content", url:"https://content.guardianapis.com/search", docsUrl:"https://open-platform.theguardian.com", keyRequired:true, rateLimit:"5000/day free", category:"news", tier:"freemium" },
  { id:"p15", name:"New York Times", description:"NYT article search, books, movies", url:"https://api.nytimes.com/svc/search/v2/articlesearch.json", docsUrl:"https://developer.nytimes.com", keyRequired:true, rateLimit:"500/day free", category:"news", tier:"freemium" },
  { id:"p16", name:"GNews", description:"News articles from 60,000+ sources", url:"https://gnews.io/api/v4/top-headlines", docsUrl:"https://gnews.io/docs/v4", keyRequired:true, rateLimit:"100/day free", category:"news", tier:"freemium" },
  { id:"p17", name:"Currents API", description:"Latest global news aggregation", url:"https://api.currentsapi.services/v1/latest-news", docsUrl:"https://currentsapi.services/en/docs/", keyRequired:true, rateLimit:"600/day free", category:"news", tier:"freemium" },
  { id:"p18", name:"MediaStack", description:"Live news data from 7,500+ sources", url:"http://api.mediastack.com/v1/news", docsUrl:"https://mediastack.com/documentation", keyRequired:true, rateLimit:"500/month free", category:"news", tier:"freemium" },

  // ── Maps & Transport ──
  { id:"p19", name:"Google Maps Platform", description:"Maps, places, directions, geocoding", url:"https://maps.googleapis.com/maps/api/", docsUrl:"https://developers.google.com/maps", keyRequired:true, rateLimit:"$200/month free credit", category:"transport", tier:"freemium" },
  { id:"p20", name:"Mapbox", description:"Custom maps, navigation, geocoding", url:"https://api.mapbox.com", docsUrl:"https://docs.mapbox.com", keyRequired:true, rateLimit:"100K loads/month free", category:"transport", tier:"freemium" },
  { id:"p21", name:"HERE Maps", description:"Maps, routing, fleet management", url:"https://geocode.search.hereapi.com/v1/geocode", docsUrl:"https://developer.here.com/documentation", keyRequired:true, rateLimit:"250K txn/month free", category:"transport", tier:"freemium" },
  { id:"p22", name:"AviationStack", description:"Real-time flight tracking data", url:"http://api.aviationstack.com/v1/flights", docsUrl:"https://aviationstack.com/documentation", keyRequired:true, rateLimit:"500/month free", category:"transport", tier:"freemium" },
  { id:"p23", name:"OpenRouteService", description:"Directions, isochrones, geocoding", url:"https://api.openrouteservice.org/v2/directions/", docsUrl:"https://openrouteservice.org/dev/#/api-docs", keyRequired:true, rateLimit:"2000/day free", category:"transport", tier:"freemium" },

  // ── AI & ML ──
  { id:"p24", name:"OpenAI API", description:"GPT-4, DALL-E, Whisper, embeddings", url:"https://api.openai.com/v1/chat/completions", docsUrl:"https://platform.openai.com/docs", keyRequired:true, rateLimit:"Pay-per-use", category:"ai", tier:"paid" },
  { id:"p25", name:"Anthropic Claude API", description:"Claude AI models, tool use, vision", url:"https://api.anthropic.com/v1/messages", docsUrl:"https://docs.anthropic.com", keyRequired:true, rateLimit:"Pay-per-use", category:"ai", tier:"paid" },
  { id:"p26", name:"Google Gemini", description:"Multimodal AI, code generation", url:"https://generativelanguage.googleapis.com/v1beta/models/", docsUrl:"https://ai.google.dev/gemini-api/docs", keyRequired:true, rateLimit:"Free tier available", category:"ai", tier:"freemium" },
  { id:"p27", name:"Hugging Face", description:"ML model inference, NLP, vision", url:"https://api-inference.huggingface.co/models/", docsUrl:"https://huggingface.co/docs/api-inference", keyRequired:true, rateLimit:"Free tier", category:"ai", tier:"freemium" },
  { id:"p28", name:"Replicate", description:"Run ML models via API", url:"https://api.replicate.com/v1/predictions", docsUrl:"https://replicate.com/docs", keyRequired:true, rateLimit:"Pay-per-use", category:"ai", tier:"paid" },
  { id:"p29", name:"Deepgram", description:"Speech-to-text transcription", url:"https://api.deepgram.com/v1/listen", docsUrl:"https://developers.deepgram.com", keyRequired:true, rateLimit:"$200 free credit", category:"ai", tier:"freemium" },
  { id:"p30", name:"Cohere", description:"NLP: classify, embed, generate text", url:"https://api.cohere.ai/v1/generate", docsUrl:"https://docs.cohere.com", keyRequired:true, rateLimit:"Free trial", category:"ai", tier:"freemium" },

  // ── Communication ──
  { id:"p31", name:"Twilio", description:"SMS, voice calls, WhatsApp messaging", url:"https://api.twilio.com/2010-04-01/Accounts/", docsUrl:"https://www.twilio.com/docs", keyRequired:true, rateLimit:"Free trial credit", category:"communication", tier:"freemium" },
  { id:"p32", name:"SendGrid", description:"Transactional email API", url:"https://api.sendgrid.com/v3/mail/send", docsUrl:"https://docs.sendgrid.com", keyRequired:true, rateLimit:"100/day free", category:"communication", tier:"freemium" },
  { id:"p33", name:"Mailgun", description:"Email delivery, validation, routing", url:"https://api.mailgun.net/v3/", docsUrl:"https://documentation.mailgun.com", keyRequired:true, rateLimit:"100/day free trial", category:"communication", tier:"freemium" },
  { id:"p34", name:"Vonage (Nexmo)", description:"SMS, voice, video, messaging APIs", url:"https://rest.nexmo.com/sms/json", docsUrl:"https://developer.vonage.com", keyRequired:true, rateLimit:"Free trial credit", category:"communication", tier:"freemium" },
  { id:"p35", name:"Slack API", description:"Messaging, bots, webhooks", url:"https://slack.com/api/chat.postMessage", docsUrl:"https://api.slack.com", keyRequired:true, rateLimit:"Tier-based", category:"communication", tier:"freemium" },
  { id:"p36", name:"Discord API", description:"Bots, webhooks, server management", url:"https://discord.com/api/v10/", docsUrl:"https://discord.com/developers/docs", keyRequired:true, rateLimit:"50/s", category:"communication", tier:"freemium" },

  // ── Security & Identity ──
  { id:"p37", name:"Auth0", description:"Authentication, identity management", url:"https://YOUR_DOMAIN.auth0.com/api/v2/", docsUrl:"https://auth0.com/docs/api", keyRequired:true, rateLimit:"7500 MAU free", category:"security", tier:"freemium" },
  { id:"p38", name:"Clerk", description:"User auth, session management", url:"https://api.clerk.com/v1/users", docsUrl:"https://clerk.com/docs", keyRequired:true, rateLimit:"10K MAU free", category:"security", tier:"freemium" },
  { id:"p39", name:"Have I Been Pwned", description:"Data breach search by email/password", url:"https://haveibeenpwned.com/api/v3/breachedaccount/", docsUrl:"https://haveibeenpwned.com/API/v3", keyRequired:true, rateLimit:"$3.50/month", category:"security", tier:"paid" },
  { id:"p40", name:"VirusTotal", description:"File/URL malware scanning", url:"https://www.virustotal.com/api/v3/files", docsUrl:"https://developers.virustotal.com", keyRequired:true, rateLimit:"500/day free", category:"security", tier:"freemium" },
  { id:"p41", name:"Shodan", description:"Internet-connected device search", url:"https://api.shodan.io/shodan/host/", docsUrl:"https://developer.shodan.io", keyRequired:true, rateLimit:"Free academic tier", category:"security", tier:"freemium" },

  // ── E-Commerce ──
  { id:"p42", name:"Stripe API", description:"Payment processing, subscriptions", url:"https://api.stripe.com/v1/charges", docsUrl:"https://stripe.com/docs/api", keyRequired:true, rateLimit:"100/s", category:"ecommerce", tier:"freemium" },
  { id:"p43", name:"Shopify Storefront", description:"E-commerce storefronts, products", url:"https://YOUR_STORE.myshopify.com/api/2024-01/graphql.json", docsUrl:"https://shopify.dev/docs/api/storefront", keyRequired:true, rateLimit:"Based on plan", category:"ecommerce", tier:"freemium" },
  { id:"p44", name:"PayPal", description:"Payments, checkout, invoicing", url:"https://api-m.paypal.com/v2/checkout/orders", docsUrl:"https://developer.paypal.com/docs/api/overview/", keyRequired:true, rateLimit:"Based on plan", category:"ecommerce", tier:"freemium" },

  // ── Entertainment (keyed) ──
  { id:"p45", name:"TMDB", description:"Movies, TV shows, actors database", url:"https://api.themoviedb.org/3/movie/popular", docsUrl:"https://developer.themoviedb.org/docs", keyRequired:true, rateLimit:"50/s free", category:"entertainment", tier:"freemium" },
  { id:"p46", name:"OMDB", description:"Movie info by title (IMDB data)", url:"https://www.omdbapi.com/", docsUrl:"https://www.omdbapi.com", keyRequired:true, rateLimit:"1000/day free", category:"entertainment", tier:"freemium" },
  { id:"p47", name:"Spotify Web API", description:"Music catalog, playlists, playback", url:"https://api.spotify.com/v1/", docsUrl:"https://developer.spotify.com/documentation/web-api", keyRequired:true, rateLimit:"Based on app", category:"entertainment", tier:"freemium" },
  { id:"p48", name:"YouTube Data API", description:"Video search, channels, playlists", url:"https://www.googleapis.com/youtube/v3/search", docsUrl:"https://developers.google.com/youtube/v3", keyRequired:true, rateLimit:"10K units/day free", category:"entertainment", tier:"freemium" },
  { id:"p49", name:"RAWG", description:"Video games database (500K+ games)", url:"https://api.rawg.io/api/games", docsUrl:"https://rawg.io/apidocs", keyRequired:true, rateLimit:"20K/month free", category:"entertainment", tier:"freemium" },
  { id:"p50", name:"IGDB", description:"Video game metadata (Twitch-owned)", url:"https://api.igdb.com/v4/games", docsUrl:"https://api-docs.igdb.com", keyRequired:true, rateLimit:"4/s free", category:"entertainment", tier:"freemium" },

  // ── Health (keyed) ──
  { id:"p51", name:"Nutritionix", description:"Nutrition data, food logging", url:"https://trackapi.nutritionix.com/v2/natural/nutrients", docsUrl:"https://developer.nutritionix.com", keyRequired:true, rateLimit:"Free tier", category:"health", tier:"freemium" },
  { id:"p52", name:"BetterDoctor", description:"Doctor & practice search", url:"https://api.betterdoctor.com/2016-03-01/doctors", docsUrl:"https://developer.betterdoctor.com", keyRequired:true, rateLimit:"Free tier", category:"health", tier:"freemium" },

  // ── Cloud & Infrastructure ──
  { id:"p53", name:"AWS SDK", description:"Amazon Web Services (200+ services)", url:"https://aws.amazon.com/sdk-for-javascript/", docsUrl:"https://docs.aws.amazon.com", keyRequired:true, rateLimit:"Pay-per-use", category:"tech", tier:"paid" },
  { id:"p54", name:"Google Cloud", description:"GCP compute, AI, storage, databases", url:"https://cloud.google.com/apis", docsUrl:"https://cloud.google.com/docs", keyRequired:true, rateLimit:"$300 free credit", category:"tech", tier:"freemium" },
  { id:"p55", name:"Azure Cognitive Services", description:"AI vision, speech, language, decision", url:"https://YOUR_REGION.api.cognitive.microsoft.com", docsUrl:"https://learn.microsoft.com/en-us/azure/cognitive-services/", keyRequired:true, rateLimit:"Free tier available", category:"ai", tier:"freemium" },
  { id:"p56", name:"Cloudflare Workers", description:"Serverless edge compute", url:"https://api.cloudflare.com/client/v4/", docsUrl:"https://developers.cloudflare.com", keyRequired:true, rateLimit:"100K/day free", category:"tech", tier:"freemium" },
  { id:"p57", name:"Vercel API", description:"Deployments, domains, project management", url:"https://api.vercel.com/v13/deployments", docsUrl:"https://vercel.com/docs/rest-api", keyRequired:true, rateLimit:"Free hobby tier", category:"tech", tier:"freemium" },
  { id:"p58", name:"Supabase", description:"Postgres, auth, storage, realtime", url:"https://YOUR_PROJECT.supabase.co/rest/v1/", docsUrl:"https://supabase.com/docs", keyRequired:true, rateLimit:"Free tier (500MB)", category:"tech", tier:"freemium" },
  { id:"p59", name:"PlanetScale", description:"Serverless MySQL database", url:"https://api.planetscale.com/v1/", docsUrl:"https://docs.planetscale.com", keyRequired:true, rateLimit:"Free tier (5GB)", category:"tech", tier:"freemium" },
  { id:"p60", name:"Upstash Redis", description:"Serverless Redis/Kafka", url:"https://YOUR_ID.upstash.io", docsUrl:"https://upstash.com/docs", keyRequired:true, rateLimit:"10K/day free", category:"tech", tier:"freemium" },

  // ── Analytics & Monitoring ──
  { id:"p61", name:"Plausible Analytics", description:"Privacy-friendly web analytics", url:"https://plausible.io/api/v1/stats/", docsUrl:"https://plausible.io/docs/stats-api", keyRequired:true, rateLimit:"600/hr", category:"tech", tier:"paid" },
  { id:"p62", name:"Sentry", description:"Error tracking and performance monitoring", url:"https://sentry.io/api/0/", docsUrl:"https://docs.sentry.io/api/", keyRequired:true, rateLimit:"Free tier (5K errors/mo)", category:"tech", tier:"freemium" },
  { id:"p63", name:"Datadog", description:"Infrastructure monitoring, APM, logs", url:"https://api.datadoghq.com/api/v1/", docsUrl:"https://docs.datadoghq.com/api/", keyRequired:true, rateLimit:"Free tier (5 hosts)", category:"tech", tier:"freemium" },

  // ── Search ──
  { id:"p64", name:"Algolia", description:"Hosted search-as-a-service", url:"https://YOUR_APP.algolia.net/1/indexes/", docsUrl:"https://www.algolia.com/doc/", keyRequired:true, rateLimit:"10K searches/mo free", category:"tech", tier:"freemium" },
  { id:"p65", name:"Meilisearch Cloud", description:"Open-source search engine", url:"https://YOUR_HOST.meilisearch.io/indexes/", docsUrl:"https://www.meilisearch.com/docs", keyRequired:true, rateLimit:"Free self-hosted", category:"tech", tier:"freemium" },

  // ── More keyed APIs ──
  { id:"p66", name:"Mapbox Directions", description:"Turn-by-turn routing", url:"https://api.mapbox.com/directions/v5/", docsUrl:"https://docs.mapbox.com/api/navigation/directions/", keyRequired:true, rateLimit:"100K/month free", category:"transport", tier:"freemium" },
  { id:"p67", name:"Foursquare Places", description:"Venue & POI search", url:"https://api.foursquare.com/v3/places/search", docsUrl:"https://developer.foursquare.com", keyRequired:true, rateLimit:"Free tier", category:"transport", tier:"freemium" },
  { id:"p68", name:"Yelp Fusion", description:"Business search, reviews, ratings", url:"https://api.yelp.com/v3/businesses/search", docsUrl:"https://docs.developer.yelp.com", keyRequired:true, rateLimit:"5000/day free", category:"ecommerce", tier:"freemium" },
  { id:"p69", name:"Unsplash", description:"High-quality free photos", url:"https://api.unsplash.com/photos", docsUrl:"https://unsplash.com/documentation", keyRequired:true, rateLimit:"50/hr free", category:"entertainment", tier:"freemium" },
  { id:"p70", name:"Pexels", description:"Free stock photos & videos", url:"https://api.pexels.com/v1/search", docsUrl:"https://www.pexels.com/api/documentation/", keyRequired:true, rateLimit:"200/hr free", category:"entertainment", tier:"freemium" },
  { id:"p71", name:"Abstract Email Validation", description:"Email address verification", url:"https://emailvalidation.abstractapi.com/v1/", docsUrl:"https://www.abstractapi.com/email-verification-validation-api", keyRequired:true, rateLimit:"100/month free", category:"communication", tier:"freemium" },
  { id:"p72", name:"IPinfo", description:"IP geolocation & ASN data", url:"https://ipinfo.io/", docsUrl:"https://ipinfo.io/developers", keyRequired:true, rateLimit:"50K/month free", category:"demographics", tier:"freemium" },
  { id:"p73", name:"ipstack", description:"IP geolocation with map", url:"http://api.ipstack.com/", docsUrl:"https://ipstack.com/documentation", keyRequired:true, rateLimit:"100/month free", category:"demographics", tier:"freemium" },
  { id:"p74", name:"OpenCage Geocoder", description:"Forward & reverse geocoding", url:"https://api.opencagedata.com/geocode/v1/json", docsUrl:"https://opencagedata.com/api", keyRequired:true, rateLimit:"2500/day free", category:"transport", tier:"freemium" },
  { id:"p75", name:"TomTom Maps", description:"Maps, routing, traffic", url:"https://api.tomtom.com/search/2/geocode/", docsUrl:"https://developer.tomtom.com", keyRequired:true, rateLimit:"2500/day free", category:"transport", tier:"freemium" },
  { id:"p76", name:"Clearbit", description:"Company & person enrichment", url:"https://company.clearbit.com/v2/companies/find", docsUrl:"https://clearbit.com/docs", keyRequired:true, rateLimit:"Free tier", category:"ecommerce", tier:"freemium" },
  { id:"p77", name:"Hunter.io", description:"Email finder & verifier", url:"https://api.hunter.io/v2/domain-search", docsUrl:"https://hunter.io/api-documentation", keyRequired:true, rateLimit:"25/month free", category:"communication", tier:"freemium" },
  { id:"p78", name:"Notion API", description:"Database, pages, blocks management", url:"https://api.notion.com/v1/pages", docsUrl:"https://developers.notion.com", keyRequired:true, rateLimit:"3/s", category:"tech", tier:"freemium" },
  { id:"p79", name:"Airtable API", description:"Spreadsheet-database hybrid", url:"https://api.airtable.com/v0/", docsUrl:"https://airtable.com/developers/web/api/introduction", keyRequired:true, rateLimit:"5/s", category:"tech", tier:"freemium" },
  { id:"p80", name:"Contentful", description:"Headless CMS content delivery", url:"https://cdn.contentful.com/spaces/", docsUrl:"https://www.contentful.com/developers/docs/", keyRequired:true, rateLimit:"Free community tier", category:"tech", tier:"freemium" },
  { id:"p81", name:"Sanity", description:"Structured content platform", url:"https://YOUR_ID.api.sanity.io/v2021-06-07/data/query/production", docsUrl:"https://www.sanity.io/docs", keyRequired:true, rateLimit:"Free tier", category:"tech", tier:"freemium" },
  { id:"p82", name:"Firebase", description:"Realtime DB, auth, hosting, functions", url:"https://YOUR_PROJECT.firebaseio.com/", docsUrl:"https://firebase.google.com/docs", keyRequired:true, rateLimit:"Free Spark plan", category:"tech", tier:"freemium" },
  { id:"p83", name:"MongoDB Atlas", description:"Cloud-hosted MongoDB database", url:"https://cloud.mongodb.com/api/atlas/v1.0/", docsUrl:"https://www.mongodb.com/docs/atlas/", keyRequired:true, rateLimit:"Free shared cluster", category:"tech", tier:"freemium" },
  { id:"p84", name:"Resend", description:"Modern email API for developers", url:"https://api.resend.com/emails", docsUrl:"https://resend.com/docs", keyRequired:true, rateLimit:"100/day free", category:"communication", tier:"freemium" },
  { id:"p85", name:"Lemon Squeezy", description:"Digital product payments", url:"https://api.lemonsqueezy.com/v1/", docsUrl:"https://docs.lemonsqueezy.com/api", keyRequired:true, rateLimit:"Based on plan", category:"ecommerce", tier:"freemium" },
  { id:"p86", name:"Giphy", description:"GIF search and trending", url:"https://api.giphy.com/v1/gifs/trending", docsUrl:"https://developers.giphy.com/docs/api/", keyRequired:true, rateLimit:"42/hr free", category:"entertainment", tier:"freemium" },
  { id:"p87", name:"Tenor", description:"GIF search and sharing (Google)", url:"https://tenor.googleapis.com/v2/search", docsUrl:"https://developers.google.com/tenor", keyRequired:true, rateLimit:"Free tier", category:"entertainment", tier:"freemium" },
  { id:"p88", name:"Spoonacular", description:"Recipes, meal planning, nutrition", url:"https://api.spoonacular.com/recipes/", docsUrl:"https://spoonacular.com/food-api/docs", keyRequired:true, rateLimit:"150/day free", category:"food", tier:"freemium" },
  { id:"p89", name:"Edamam Nutrition", description:"Food nutrition analysis", url:"https://api.edamam.com/api/nutrition-data", docsUrl:"https://developer.edamam.com", keyRequired:true, rateLimit:"Free tier", category:"food", tier:"freemium" },
  { id:"p90", name:"News Catcher", description:"News articles search from 50K+ sources", url:"https://api.newscatcherapi.com/v2/search", docsUrl:"https://newscatcherapi.com/docs", keyRequired:true, rateLimit:"21/hr free trial", category:"news", tier:"freemium" },
  { id:"p91", name:"Clearbit Logo", description:"Company logo API by domain", url:"https://logo.clearbit.com/", docsUrl:"https://clearbit.com/docs#logo-api", keyRequired:false, rateLimit:"Unlimited", category:"ecommerce", tier:"free" },
  { id:"p92", name:"Abstract Holidays", description:"Global holidays by country & date", url:"https://holidays.abstractapi.com/v1/", docsUrl:"https://www.abstractapi.com/holidays-api", keyRequired:true, rateLimit:"1000/month free", category:"demographics", tier:"freemium" },
  { id:"p93", name:"ScraperAPI", description:"Web scraping with proxy rotation", url:"http://api.scraperapi.com/", docsUrl:"https://www.scraperapi.com/documentation/", keyRequired:true, rateLimit:"5000/month free", category:"tech", tier:"freemium" },
  { id:"p94", name:"Apify", description:"Web scraping, automation, datasets", url:"https://api.apify.com/v2/", docsUrl:"https://docs.apify.com/api/v2", keyRequired:true, rateLimit:"Free tier", category:"tech", tier:"freemium" },
  { id:"p95", name:"Courier", description:"Multi-channel notifications", url:"https://api.courier.com/send", docsUrl:"https://www.courier.com/docs/", keyRequired:true, rateLimit:"10K notifs/month free", category:"communication", tier:"freemium" },
  { id:"p96", name:"Pusher", description:"Realtime websocket channels", url:"https://api-YOUR_CLUSTER.pusher.com/apps/", docsUrl:"https://pusher.com/docs", keyRequired:true, rateLimit:"200K messages/day free", category:"communication", tier:"freemium" },
  { id:"p97", name:"Ably", description:"Realtime messaging infrastructure", url:"https://rest.ably.io/channels/", docsUrl:"https://ably.com/docs", keyRequired:true, rateLimit:"6M messages/month free", category:"communication", tier:"freemium" },
  { id:"p98", name:"Mapquest", description:"Maps, geocoding, routing", url:"https://www.mapquestapi.com/geocoding/v1/address", docsUrl:"https://developer.mapquest.com", keyRequired:true, rateLimit:"15K txn/month free", category:"transport", tier:"freemium" },
  { id:"p99", name:"API-Football", description:"Football/soccer data worldwide", url:"https://v3.football.api-sports.io/", docsUrl:"https://www.api-football.com/documentation-v3", keyRequired:true, rateLimit:"100/day free", category:"sports", tier:"freemium" },
  { id:"p100", name:"SportsDB", description:"Sports events, teams, players", url:"https://www.thesportsdb.com/api/v1/json/3/", docsUrl:"https://www.thesportsdb.com/api.php", keyRequired:true, rateLimit:"Free tier", category:"sports", tier:"freemium" },
  { id:"p101", name:"Strava API", description:"Athlete activity & fitness data", url:"https://www.strava.com/api/v3/", docsUrl:"https://developers.strava.com/docs/", keyRequired:true, rateLimit:"100/15min", category:"sports", tier:"freemium" },
  { id:"p102", name:"Fitbit API", description:"Health & fitness tracking data", url:"https://api.fitbit.com/1/user/-/", docsUrl:"https://dev.fitbit.com/build/reference/", keyRequired:true, rateLimit:"150/hr", category:"health", tier:"freemium" },
];

export const ALL_APIS = [...FREE_APIS, ...PAID_APIS];
export const API_COUNT = ALL_APIS.length;
export const FREE_COUNT = FREE_APIS.length;
export const PAID_COUNT = PAID_APIS.length;
export const ENDPOINT_COUNT = ALL_APIS.length * 3; // Approx 3 endpoints avg per API
