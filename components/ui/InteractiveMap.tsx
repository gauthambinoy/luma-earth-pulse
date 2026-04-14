"use client";

import { useEffect, useRef, useState } from "react";

const DATA_LAYERS = {
  energy: {
    label: "Energy Consumption",
    icon: "⚡",
    color: "#eab308",
    points: [
      { lat: 39.9, lng: -98.5, label: "USA", value: "4,009 TWh/yr", size: 38, detail: "25% of global", perCapita: "12.1 MWh" },
      { lat: 35.0, lng: 105.0, label: "China", value: "8,342 TWh/yr", size: 44, detail: "31% of global", perCapita: "5.9 MWh" },
      { lat: 20.0, lng: 77.0, label: "India", value: "1,604 TWh/yr", size: 28, detail: "6% of global", perCapita: "1.2 MWh" },
      { lat: 51.0, lng: 10.0, label: "Germany", value: "548 TWh/yr", size: 20, detail: "2% of global", perCapita: "6.5 MWh" },
      { lat: 55.7, lng: 37.6, label: "Russia", value: "1,106 TWh/yr", size: 25, detail: "4% of global", perCapita: "7.6 MWh" },
      { lat: 36.2, lng: 138.2, label: "Japan", value: "933 TWh/yr", size: 23, detail: "3.5% of global", perCapita: "7.4 MWh" },
      { lat: 56.1, lng: -106.3, label: "Canada", value: "601 TWh/yr", size: 21, detail: "2.2% of global", perCapita: "15.5 MWh" },
      { lat: -14.2, lng: -51.9, label: "Brazil", value: "626 TWh/yr", size: 22, detail: "2.3% of global", perCapita: "2.9 MWh" },
      { lat: 36.7, lng: 3.2, label: "N. Africa", value: "280 TWh/yr", size: 16, detail: "1% of global", perCapita: "1.4 MWh" },
      { lat: -25.3, lng: 134.7, label: "Australia", value: "261 TWh/yr", size: 16, detail: "1% of global", perCapita: "10.1 MWh" },
      { lat: 46.2, lng: 2.2, label: "France", value: "474 TWh/yr", size: 19, detail: "1.8% of global", perCapita: "7.0 MWh" },
      { lat: 23.4, lng: 53.8, label: "UAE", value: "145 TWh/yr", size: 14, detail: "0.5% of global", perCapita: "14.5 MWh" },
    ],
  },
  quakes: {
    label: "Seismic Activity",
    icon: "🌍",
    color: "#ef4444",
    points: [
      { lat: -8.5, lng: 115.0, label: "Indonesia", value: "M5.2", size: 22, detail: "Ring of Fire" },
      { lat: 35.7, lng: 139.7, label: "Japan", value: "M4.8", size: 20, detail: "Pacific Plate" },
      { lat: 19.4, lng: -99.1, label: "Mexico", value: "M4.5", size: 18, detail: "Cocos Plate" },
      { lat: -33.4, lng: -70.7, label: "Chile", value: "M5.6", size: 24, detail: "Nazca Plate" },
      { lat: 37.8, lng: 20.9, label: "Greece", value: "M3.9", size: 15, detail: "Aegean Arc" },
      { lat: 28.4, lng: 84.1, label: "Nepal", value: "M4.1", size: 16, detail: "Himalayan Belt" },
      { lat: 37.8, lng: -122.4, label: "California", value: "M3.2", size: 14, detail: "San Andreas" },
      { lat: -41.3, lng: 174.8, label: "New Zealand", value: "M4.7", size: 19, detail: "Alpine Fault" },
      { lat: 38.7, lng: 43.3, label: "Turkey", value: "M4.3", size: 17, detail: "Anatolian Plate" },
    ],
  },
  weather: {
    label: "Weather Stations",
    icon: "🌤️",
    color: "#22d3ee",
    points: [
      { lat: 40.7, lng: -74.0, label: "New York", value: "22°C", size: 16, detail: "Partly cloudy" },
      { lat: 51.5, lng: -0.1, label: "London", value: "15°C", size: 16, detail: "Overcast" },
      { lat: 35.7, lng: 139.7, label: "Tokyo", value: "26°C", size: 16, detail: "Clear" },
      { lat: 48.9, lng: 2.35, label: "Paris", value: "18°C", size: 16, detail: "Light rain" },
      { lat: -33.9, lng: 151.2, label: "Sydney", value: "14°C", size: 16, detail: "Sunny" },
      { lat: 25.2, lng: 55.3, label: "Dubai", value: "38°C", size: 16, detail: "Hot & clear" },
      { lat: 19.1, lng: 72.9, label: "Mumbai", value: "32°C", size: 16, detail: "Humid" },
      { lat: 55.8, lng: 37.6, label: "Moscow", value: "8°C", size: 16, detail: "Cold & clear" },
      { lat: -23.5, lng: -46.6, label: "São Paulo", value: "20°C", size: 16, detail: "Partly cloudy" },
      { lat: 1.35, lng: 103.8, label: "Singapore", value: "31°C", size: 16, detail: "Thunderstorms" },
    ],
  },
  population: {
    label: "Population Density",
    icon: "👥",
    color: "#a78bfa",
    points: [
      { lat: 31.2, lng: 121.5, label: "Shanghai", value: "28.5M", size: 36, detail: "Mega-city" },
      { lat: 28.6, lng: 77.2, label: "Delhi", value: "32.9M", size: 40, detail: "Most populous" },
      { lat: 23.1, lng: 113.3, label: "Guangzhou", value: "18.7M", size: 30, detail: "Pearl River Delta" },
      { lat: 40.7, lng: -74.0, label: "New York", value: "20.1M", size: 32, detail: "US largest metro" },
      { lat: 35.7, lng: 139.7, label: "Tokyo", value: "37.4M", size: 44, detail: "Largest metro" },
      { lat: -23.5, lng: -46.6, label: "São Paulo", value: "22.4M", size: 34, detail: "South America largest" },
      { lat: 6.5, lng: 3.4, label: "Lagos", value: "15.9M", size: 28, detail: "Fastest growing" },
      { lat: 30.0, lng: 31.2, label: "Cairo", value: "21.3M", size: 33, detail: "Africa largest" },
      { lat: 19.4, lng: -99.1, label: "Mexico City", value: "21.8M", size: 33, detail: "Latin America" },
      { lat: 13.8, lng: 100.5, label: "Bangkok", value: "10.7M", size: 24, detail: "SE Asia hub" },
    ],
  },
};

type LayerKey = keyof typeof DATA_LAYERS;

const FLY_TO_PRESETS: Array<{ label: string; center: [number, number]; zoom: number }> = [
  { label: "World", center: [20, 10], zoom: 2.25 },
  { label: "US East", center: [40.7, -74.0], zoom: 7 },
  { label: "Europe", center: [48.85, 2.35], zoom: 6.25 },
  { label: "Middle East", center: [25.2, 55.3], zoom: 7.5 },
  { label: "Tokyo", center: [35.68, 139.69], zoom: 9 },
];

export default function InteractiveMap() {
  const shellRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [activeLayer, setActiveLayer] = useState<LayerKey>("energy");
  const [zoom, setZoom] = useState(2.25);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cleanupMap: (() => void) | undefined;

    const init = async () => {
      const L = (await import("leaflet")).default;
      const map = L.map(mapRef.current!, {
        center: [20, 10],
        zoom: 2.25,
        minZoom: 2,
        maxZoom: 20,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        zoomControl: false,
        attributionControl: false,
        worldCopyJump: true,
        preferCanvas: true,
      });

      map.createPane("labels");
      const labelsPane = map.getPane("labels");
      if (labelsPane) {
        labelsPane.style.zIndex = "650";
        labelsPane.style.pointerEvents = "none";
      }

      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 20,
        maxNativeZoom: 19,
        detectRetina: true,
        attribution: "ESRI World Imagery",
      }).addTo(map);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        maxNativeZoom: 19,
        detectRetina: true,
        pane: "labels",
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const updateZoom = () => setZoom(Number(map.getZoom().toFixed(2)));
      map.on("zoomend", updateZoom);
      map.on("moveend", updateZoom);
      updateZoom();

      const handleFullscreen = () => {
        const active = document.fullscreenElement === shellRef.current;
        setIsFullscreen(active);
        window.setTimeout(() => map.invalidateSize(), 180);
      };

      document.addEventListener("fullscreenchange", handleFullscreen);

      mapInstanceRef.current = map;
      setMounted(true);

      cleanupMap = () => {
        document.removeEventListener("fullscreenchange", handleFullscreen);
        map.remove();
        mapInstanceRef.current = null;
      };
    };

    init();

    return () => {
      cleanupMap?.();
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !mounted) return;

    const loadMarkers = async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const layer = DATA_LAYERS[activeLayer];
      layer.points.forEach((point) => {
        const pulseSize = point.size;
        const icon = L.divIcon({
          className: "custom-map-marker",
          html: `
            <div style="position:relative;width:${pulseSize}px;height:${pulseSize}px;">
              <div style="position:absolute;inset:0;border-radius:50%;background:${layer.color};opacity:0.14;animation:mapPulse 2s ease-in-out infinite;"></div>
              <div style="position:absolute;inset:${pulseSize * 0.22}px;border-radius:50%;background:${layer.color};opacity:0.38;box-shadow:0 0 ${pulseSize}px ${layer.color}88;"></div>
              <div style="position:absolute;inset:${pulseSize * 0.34}px;border-radius:50%;background:${layer.color};box-shadow:0 0 10px ${layer.color};"></div>
            </div>
          `,
          iconSize: [pulseSize, pulseSize],
          iconAnchor: [pulseSize / 2, pulseSize / 2],
        });

        const marker = L.marker([point.lat, point.lng], { icon }).addTo(map);
        marker.bindPopup(
          `<div style="background:#0f1629;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 16px;min-width:180px;font-family:Inter,sans-serif;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="font-size:14px;">${layer.icon}</span>
              <span style="font-size:13px;font-weight:700;color:#f1f5f9;">${point.label}</span>
            </div>
            <div style="font-size:20px;font-weight:800;color:${layer.color};text-shadow:0 0 15px ${layer.color}44;margin-bottom:4px;">${point.value}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.4);">${point.detail}</div>
            ${"perCapita" in point ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:rgba(255,255,255,0.35);">Per capita: <span style="color:${layer.color};font-weight:600;">${point.perCapita}</span></div>` : ""}
          </div>`,
          { className: "glass-popup", closeButton: false }
        );
        markersRef.current.push(marker);
      });
    };

    loadMarkers();
  }, [activeLayer, mounted]);

  const toggleFullscreen = async () => {
    if (!shellRef.current) return;
    if (document.fullscreenElement === shellRef.current) {
      await document.exitFullscreen();
      return;
    }
    await shellRef.current.requestFullscreen();
  };

  const jumpTo = (center: [number, number], targetZoom: number) => {
    mapInstanceRef.current?.flyTo(center, targetZoom, {
      animate: true,
      duration: 1.8,
      easeLinearity: 0.25,
    });
  };

  const layers = Object.entries(DATA_LAYERS) as [LayerKey, (typeof DATA_LAYERS)[LayerKey]][];

  return (
    <div
      ref={shellRef}
      className="relative overflow-hidden rounded-[26px] border"
      style={{
        background: "rgba(10,15,30,0.62)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.34)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(110,231,183,0.1)", border: "1px solid rgba(110,231,183,0.15)" }}>
            <span className="text-sm">🛰️</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white/90">Satellite Drone View</div>
            <div className="text-[10px] text-white/35">ESRI imagery · deeper zoom · fullscreen mode · live overlays</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/80"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            Zoom +
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/80"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            Zoom -
          </button>
          <button
            onClick={toggleFullscreen}
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold"
            style={{ background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.24)", color: "#93c5fd" }}
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen 4K View"}
          </button>
          <span className="rounded-full px-3 py-1.5 text-[11px] font-bold" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#cbd5e1" }}>
            Zoom {zoom}x
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex flex-wrap gap-1.5">
          {layers.map(([key, layer]) => (
            <button
              key={key}
              onClick={() => setActiveLayer(key)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200"
              style={{
                background: activeLayer === key ? `${layer.color}20` : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeLayer === key ? `${layer.color}45` : "rgba(255,255,255,0.06)"}`,
                color: activeLayer === key ? layer.color : "rgba(255,255,255,0.45)",
              }}
            >
              <span>{layer.icon}</span>
              <span className="hidden sm:inline">{layer.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FLY_TO_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => jumpTo(preset.center, preset.zoom)}
              className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/72"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={mapRef} style={{ height: isFullscreen ? "calc(100vh - 146px)" : 640, width: "100%" }} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex flex-wrap items-center gap-4">
          {DATA_LAYERS[activeLayer].points.slice(0, 4).map((point) => (
            <div key={point.label} className="flex items-center gap-2 text-[11px]">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: DATA_LAYERS[activeLayer].color, boxShadow: `0 0 6px ${DATA_LAYERS[activeLayer].color}` }} />
              <span className="text-white/45">{point.label}</span>
              <span className="font-mono font-bold" style={{ color: DATA_LAYERS[activeLayer].color }}>{point.value}</span>
            </div>
          ))}
        </div>
        <span className="text-[10px] text-white/25">Scroll to zoom · Drag to pan · Click markers · Use fullscreen for drone-style view</span>
      </div>
    </div>
  );
}
