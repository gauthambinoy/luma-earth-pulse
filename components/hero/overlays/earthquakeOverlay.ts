/* ─── Earthquake Overlay ───
   Fetches USGS earthquake data and renders pulsing pins on the globe.
   Color-coded by magnitude: green → yellow → orange → red */

import * as Cesium from "cesium";
import type { Viewer } from "cesium";
import type { OverlayCleanup } from "./index";

interface QuakeFeature {
  properties: { mag: number; place: string; time: number };
  geometry: { coordinates: [number, number, number] };
}

function magToColor(mag: number): Cesium.Color {
  if (mag >= 7) return Cesium.Color.fromCssColorString("#DC2626").withAlpha(0.9);
  if (mag >= 6) return Cesium.Color.fromCssColorString("#EF4444").withAlpha(0.85);
  if (mag >= 5) return Cesium.Color.fromCssColorString("#FB923C").withAlpha(0.8);
  if (mag >= 4) return Cesium.Color.fromCssColorString("#FCD34D").withAlpha(0.75);
  return Cesium.Color.fromCssColorString("#6EE7B7").withAlpha(0.7);
}

function magToSize(mag: number): number {
  return Math.max(4, Math.pow(mag, 1.8) * 800);
}

export async function addEarthquakeOverlay(viewer: Viewer): Promise<OverlayCleanup> {
  const dataSource = new Cesium.CustomDataSource("earthquakes");
  viewer.dataSources.add(dataSource);

  let intervalId: ReturnType<typeof setInterval> | null = null;

  async function fetchAndRender() {
    try {
      const res = await fetch("/api/quakes");
      if (!res.ok) return;
      const quakes = await res.json();

      dataSource.entities.removeAll();

      const features: Array<{ lat: number; lon: number; mag: number; place: string; time: number }> =
        Array.isArray(quakes) ? quakes : [];

      features.slice(0, 200).forEach((q) => {
        const color = magToColor(q.mag);
        const size = magToSize(q.mag);

        // Pulsing circle on surface
        dataSource.entities.add({
          position: Cesium.Cartesian3.fromDegrees(q.lon, q.lat),
          ellipse: {
            semiMinorAxis: size,
            semiMajorAxis: size,
            material: new Cesium.ColorMaterialProperty(color),
            height: 0,
            outline: true,
            outlineColor: color.withAlpha(0.4),
            outlineWidth: 1,
          },
          label: {
            text: `M${q.mag.toFixed(1)}`,
            font: "11px Inter, sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -12),
            scaleByDistance: new Cesium.NearFarScalar(1e5, 1, 5e6, 0.4),
            translucencyByDistance: new Cesium.NearFarScalar(1e5, 1, 1.5e7, 0),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
            backgroundPadding: new Cesium.Cartesian2(4, 2),
          },
          description: `<b>${q.place}</b><br/>Magnitude: ${q.mag.toFixed(1)}<br/>Time: ${new Date(q.time).toLocaleString()}`,
        });
      });
    } catch (err) {
      console.warn("Earthquake overlay fetch failed:", err);
    }
  }

  await fetchAndRender();
  intervalId = setInterval(fetchAndRender, 5 * 60 * 1000); // refresh every 5 min

  return {
    remove: () => {
      if (intervalId) clearInterval(intervalId);
      viewer.dataSources.remove(dataSource, true);
    },
  };
}
