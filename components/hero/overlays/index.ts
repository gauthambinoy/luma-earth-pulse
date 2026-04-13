/* ─── Globe Data Overlay Engine ───
   Fetches real-time data (earthquakes, ISS, weather) and renders
   them as entities on a CesiumJS viewer instance. */

import type { Viewer } from "cesium";

// Re-export all overlay modules
export { addEarthquakeOverlay } from "./earthquakeOverlay";
export { addISSOverlay } from "./issOverlay";
export { addWeatherOverlay } from "./weatherOverlay";

export interface OverlayCleanup {
  remove: () => void;
}

/** Add all overlays to a viewer, returns cleanup function */
export async function addAllOverlays(viewer: Viewer): Promise<OverlayCleanup> {
  const cleanups: OverlayCleanup[] = [];

  const [eq, iss, weather] = await Promise.allSettled([
    import("./earthquakeOverlay").then((m) => m.addEarthquakeOverlay(viewer)),
    import("./issOverlay").then((m) => m.addISSOverlay(viewer)),
    import("./weatherOverlay").then((m) => m.addWeatherOverlay(viewer)),
  ]);

  if (eq.status === "fulfilled") cleanups.push(eq.value);
  if (iss.status === "fulfilled") cleanups.push(iss.value);
  if (weather.status === "fulfilled") cleanups.push(weather.value);

  return {
    remove: () => cleanups.forEach((c) => c.remove()),
  };
}
