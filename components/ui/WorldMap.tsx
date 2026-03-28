"use client";

import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapPoint {
  lat: number;
  lon: number;
  size: number;
  color: string;
  label?: string;
  pulse?: boolean;
}

interface WorldMapProps {
  points: MapPoint[];
  height?: number;
  issPosition?: { latitude: number; longitude: number } | null;
}

function WorldMapInner({ points, height = 320, issPosition }: WorldMapProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-surface">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 120, center: [0, 20] }}
        style={{ width: "100%", height }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#334155", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {points.map((pt, i) => (
          <Marker key={i} coordinates={[pt.lon, pt.lat]}>
            {pt.pulse && (
              <circle
                r={pt.size * 2}
                fill={pt.color}
                opacity={0.2}
                className="animate-ping"
              />
            )}
            <circle
              r={pt.size}
              fill={pt.color}
              opacity={0.8}
              stroke={pt.color}
              strokeWidth={0.5}
            />
            {pt.label && (
              <text
                textAnchor="middle"
                y={-pt.size - 4}
                fill="rgba(255,255,255,0.5)"
                fontSize={8}
                fontFamily="inherit"
              >
                {pt.label}
              </text>
            )}
          </Marker>
        ))}

        {issPosition && (
          <Marker coordinates={[issPosition.longitude, issPosition.latitude]}>
            <circle r={6} fill="#6EE7B7" opacity={0.3} className="animate-ping" />
            <circle r={3} fill="#6EE7B7" stroke="#fff" strokeWidth={1} />
            <text
              textAnchor="middle"
              y={-12}
              fill="#6EE7B7"
              fontSize={9}
              fontWeight="bold"
              fontFamily="inherit"
            >
              ISS
            </text>
          </Marker>
        )}
      </ComposableMap>
    </div>
  );
}

const WorldMap = memo(WorldMapInner);
export default WorldMap;
