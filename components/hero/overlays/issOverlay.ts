/* ─── ISS Real-Time Tracker Overlay ───
   Shows the International Space Station's live position as a glowing
   dot with an orbital trail, updated every 5 seconds. */

import * as Cesium from "cesium";
import type { Viewer } from "cesium";
import type { OverlayCleanup } from "./index";

export async function addISSOverlay(viewer: Viewer): Promise<OverlayCleanup> {
  const dataSource = new Cesium.CustomDataSource("iss");
  viewer.dataSources.add(dataSource);

  const trailPositions: Cesium.Cartesian3[] = [];
  const MAX_TRAIL = 120; // ~10 min of positions at 5s intervals

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let issEntity: Cesium.Entity | null = null;
  let trailEntity: Cesium.Entity | null = null;

  async function fetchAndUpdate() {
    try {
      const res = await fetch("/api/iss");
      if (!res.ok) return;
      const data = await res.json();

      const lat = data?.position?.latitude;
      const lon = data?.position?.longitude;
      if (lat == null || lon == null) return;

      const pos = Cesium.Cartesian3.fromDegrees(lon, lat, 408000); // ISS orbits ~408km

      // Update trail
      trailPositions.push(pos);
      if (trailPositions.length > MAX_TRAIL) trailPositions.shift();

      if (!issEntity) {
        // ISS marker — bright cyan dot
        issEntity = dataSource.entities.add({
          position: pos,
          point: {
            pixelSize: 10,
            color: Cesium.Color.CYAN,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            scaleByDistance: new Cesium.NearFarScalar(1e6, 1.5, 2e7, 0.6),
          },
          label: {
            text: "🛰 ISS",
            font: "bold 12px Inter, sans-serif",
            fillColor: Cesium.Color.CYAN,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -16),
            scaleByDistance: new Cesium.NearFarScalar(1e6, 1, 2e7, 0.4),
            translucencyByDistance: new Cesium.NearFarScalar(1e6, 1, 4e7, 0.3),
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
            backgroundPadding: new Cesium.Cartesian2(6, 3),
          },
          description: `<b>International Space Station</b><br/>Lat: ${lat.toFixed(4)}°<br/>Lon: ${lon.toFixed(4)}°<br/>Alt: ~408 km`,
        });

        // Trail polyline
        trailEntity = dataSource.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => [...trailPositions], false),
            width: 2,
            material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 0.3,
              color: Cesium.Color.CYAN.withAlpha(0.6),
            }),
          },
        });
      } else {
        // Update existing entity position
        (issEntity.position as any) = new Cesium.ConstantPositionProperty(pos);
        if (issEntity.description) {
          (issEntity.description as any) = new Cesium.ConstantProperty(
            `<b>International Space Station</b><br/>Lat: ${lat.toFixed(4)}°<br/>Lon: ${lon.toFixed(4)}°<br/>Alt: ~408 km`
          );
        }
      }
    } catch (err) {
      console.warn("ISS overlay fetch failed:", err);
    }
  }

  await fetchAndUpdate();
  intervalId = setInterval(fetchAndUpdate, 5000); // every 5 seconds

  return {
    remove: () => {
      if (intervalId) clearInterval(intervalId);
      viewer.dataSources.remove(dataSource, true);
    },
  };
}
