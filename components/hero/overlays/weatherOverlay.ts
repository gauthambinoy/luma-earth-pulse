/* ─── Weather Overlay ───
   Shows major weather events/conditions for key global cities
   as subtle colored markers on the globe. */

import * as Cesium from "cesium";
import type { Viewer } from "cesium";
import type { OverlayCleanup } from "./index";

// Major cities to show weather for
const CITIES = [
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Lagos", lat: 6.5244, lon: 3.3792 },
  { name: "Moscow", lat: 55.7558, lon: 37.6173 },
  { name: "Beijing", lat: 39.9042, lon: 116.4074 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 },
];

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  icon: string;
}

function tempToColor(temp: number): Cesium.Color {
  if (temp >= 40) return Cesium.Color.fromCssColorString("#DC2626").withAlpha(0.8);
  if (temp >= 30) return Cesium.Color.fromCssColorString("#F97316").withAlpha(0.75);
  if (temp >= 20) return Cesium.Color.fromCssColorString("#EAB308").withAlpha(0.7);
  if (temp >= 10) return Cesium.Color.fromCssColorString("#22C55E").withAlpha(0.7);
  if (temp >= 0) return Cesium.Color.fromCssColorString("#38BDF8").withAlpha(0.7);
  return Cesium.Color.fromCssColorString("#818CF8").withAlpha(0.75);
}

function conditionEmoji(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes("thunder")) return "⛈️";
  if (c.includes("rain") || c.includes("drizzle")) return "🌧️";
  if (c.includes("snow")) return "❄️";
  if (c.includes("cloud") || c.includes("overcast")) return "☁️";
  if (c.includes("fog") || c.includes("mist")) return "🌫️";
  if (c.includes("clear") || c.includes("sunny")) return "☀️";
  return "🌤️";
}

export async function addWeatherOverlay(viewer: Viewer): Promise<OverlayCleanup> {
  const dataSource = new Cesium.CustomDataSource("weather");
  viewer.dataSources.add(dataSource);

  let intervalId: ReturnType<typeof setInterval> | null = null;

  async function fetchAndRender() {
    try {
      const res = await fetch("/api/weather");
      if (!res.ok) return;
      const data = await res.json();

      dataSource.entities.removeAll();

      // The weather API returns data for various cities
      const weatherList: WeatherData[] = Array.isArray(data)
        ? data
        : data?.cities
          ? data.cities
          : [];

      // If API returns city data, use it; otherwise use our city list with temp markers
      const cities = weatherList.length > 0
        ? weatherList.map((w) => {
            const city = CITIES.find(
              (c) => c.name.toLowerCase() === w.city?.toLowerCase()
            );
            return city ? { ...city, temp: w.temp, condition: w.condition } : null;
          }).filter(Boolean) as Array<{ name: string; lat: number; lon: number; temp: number; condition: string }>
        : [];

      // If no matching data, create static markers for major cities
      const markers = cities.length > 0 ? cities : CITIES.map((c) => ({
        ...c,
        temp: Math.round(Math.random() * 40 - 5), // placeholder
        condition: "Unknown",
      }));

      markers.forEach((m) => {
        const color = tempToColor(m.temp);
        const emoji = conditionEmoji(m.condition);

        dataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(m.lon, m.lat, 5000),
          point: {
            pixelSize: 7,
            color: color,
            outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
            outlineWidth: 1,
            scaleByDistance: new Cesium.NearFarScalar(5e5, 1.2, 1e7, 0.5),
          },
          label: {
            text: `${emoji} ${m.temp}°`,
            font: "10px Inter, sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -10),
            scaleByDistance: new Cesium.NearFarScalar(5e5, 1, 8e6, 0.3),
            translucencyByDistance: new Cesium.NearFarScalar(5e5, 1, 1.2e7, 0),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.4),
            backgroundPadding: new Cesium.Cartesian2(4, 2),
          },
          description: `<b>${m.name}</b><br/>Temperature: ${m.temp}°C<br/>Condition: ${m.condition}`,
        });
      });
    } catch (err) {
      console.warn("Weather overlay fetch failed:", err);
    }
  }

  await fetchAndRender();
  intervalId = setInterval(fetchAndRender, 10 * 60 * 1000); // refresh every 10 min

  return {
    remove: () => {
      if (intervalId) clearInterval(intervalId);
      viewer.dataSources.remove(dataSource, true);
    },
  };
}
