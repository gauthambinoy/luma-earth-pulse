"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

// ════════════════════════════════════════════
// CONSTANTS — Country / City / Marker data
// ════════════════════════════════════════════

interface GlobeMarker {
  name: string;
  lat: number;
  lon: number;
  population?: number;
  type: "capital" | "city" | "landmark";
  country?: string;
  emoji?: string;
}

const GLOBE_MARKERS: GlobeMarker[] = [
  { name: "London", lat: 51.51, lon: -0.13, population: 9_000_000, type: "capital", country: "UK", emoji: "🇬🇧" },
  { name: "New York", lat: 40.71, lon: -74.01, population: 8_300_000, type: "city", country: "USA", emoji: "🇺🇸" },
  { name: "Tokyo", lat: 35.68, lon: 139.69, population: 14_000_000, type: "capital", country: "Japan", emoji: "🇯🇵" },
  { name: "Paris", lat: 48.86, lon: 2.35, population: 2_200_000, type: "capital", country: "France", emoji: "🇫🇷" },
  { name: "Beijing", lat: 39.9, lon: 116.4, population: 21_500_000, type: "capital", country: "China", emoji: "🇨🇳" },
  { name: "Sydney", lat: -33.87, lon: 151.21, population: 5_300_000, type: "city", country: "Australia", emoji: "🇦🇺" },
  { name: "Mumbai", lat: 19.07, lon: 72.88, population: 20_000_000, type: "city", country: "India", emoji: "🇮🇳" },
  { name: "São Paulo", lat: -23.55, lon: -46.63, population: 12_300_000, type: "city", country: "Brazil", emoji: "🇧🇷" },
  { name: "Dubai", lat: 25.2, lon: 55.27, population: 3_400_000, type: "city", country: "UAE", emoji: "🇦🇪" },
  { name: "Moscow", lat: 55.75, lon: 37.62, population: 12_600_000, type: "capital", country: "Russia", emoji: "🇷🇺" },
  { name: "Cairo", lat: 30.04, lon: 31.24, population: 10_000_000, type: "capital", country: "Egypt", emoji: "🇪🇬" },
  { name: "Seoul", lat: 37.57, lon: 127.0, population: 9_700_000, type: "capital", country: "South Korea", emoji: "🇰🇷" },
  { name: "Singapore", lat: 1.35, lon: 103.82, population: 5_900_000, type: "capital", country: "Singapore", emoji: "🇸🇬" },
  { name: "Berlin", lat: 52.52, lon: 13.41, population: 3_700_000, type: "capital", country: "Germany", emoji: "🇩🇪" },
  { name: "Lagos", lat: 6.52, lon: 3.38, population: 15_400_000, type: "city", country: "Nigeria", emoji: "🇳🇬" },
  { name: "Mexico City", lat: 19.43, lon: -99.13, population: 9_200_000, type: "capital", country: "Mexico", emoji: "🇲🇽" },
  { name: "Buenos Aires", lat: -34.6, lon: -58.38, population: 3_000_000, type: "capital", country: "Argentina", emoji: "🇦🇷" },
  { name: "Istanbul", lat: 41.01, lon: 28.98, population: 15_500_000, type: "city", country: "Turkey", emoji: "🇹🇷" },
  { name: "Bangkok", lat: 13.76, lon: 100.5, population: 10_700_000, type: "capital", country: "Thailand", emoji: "🇹🇭" },
  { name: "Toronto", lat: 43.65, lon: -79.38, population: 2_800_000, type: "city", country: "Canada", emoji: "🇨🇦" },
  { name: "Los Angeles", lat: 34.05, lon: -118.24, population: 3_900_000, type: "city", country: "USA", emoji: "🇺🇸" },
  { name: "Jakarta", lat: -6.21, lon: 106.85, population: 10_600_000, type: "capital", country: "Indonesia", emoji: "🇮🇩" },
  { name: "Delhi", lat: 28.61, lon: 77.23, population: 32_000_000, type: "capital", country: "India", emoji: "🇮🇳" },
  { name: "Nairobi", lat: -1.29, lon: 36.82, population: 4_400_000, type: "capital", country: "Kenya", emoji: "🇰🇪" },
  { name: "Cape Town", lat: -33.92, lon: 18.42, population: 4_600_000, type: "city", country: "South Africa", emoji: "🇿🇦" },
  { name: "Washington D.C.", lat: 38.9, lon: -77.04, population: 700_000, type: "capital", country: "USA", emoji: "🇺🇸" },
  { name: "Brasília", lat: -15.79, lon: -47.88, population: 3_000_000, type: "capital", country: "Brazil", emoji: "🇧🇷" },
  { name: "Ottawa", lat: 45.42, lon: -75.7, population: 1_000_000, type: "capital", country: "Canada", emoji: "🇨🇦" },
  { name: "Canberra", lat: -35.28, lon: 149.13, population: 460_000, type: "capital", country: "Australia", emoji: "🇦🇺" },
  { name: "Rome", lat: 41.9, lon: 12.5, population: 2_870_000, type: "capital", country: "Italy", emoji: "🇮🇹" },
  { name: "Madrid", lat: 40.42, lon: -3.7, population: 3_200_000, type: "capital", country: "Spain", emoji: "🇪🇸" },
  { name: "Riyadh", lat: 24.71, lon: 46.68, population: 7_600_000, type: "capital", country: "Saudi Arabia", emoji: "🇸🇦" },
  { name: "Lima", lat: -12.05, lon: -77.04, population: 10_000_000, type: "capital", country: "Peru", emoji: "🇵🇪" },
  { name: "Bogotá", lat: 4.71, lon: -74.07, population: 7_400_000, type: "capital", country: "Colombia", emoji: "🇨🇴" },
  { name: "Hanoi", lat: 21.03, lon: 105.85, population: 8_000_000, type: "capital", country: "Vietnam", emoji: "🇻🇳" },
  { name: "Kuala Lumpur", lat: 3.14, lon: 101.69, population: 1_800_000, type: "capital", country: "Malaysia", emoji: "🇲🇾" },
];

// ════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════

const EARTH_RADIUS = 2;

function latLonToVec3(lat: number, lon: number, radius: number = EARTH_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Deterministic seeded PRNG (park-miller LCG)
function createSeededRandom(initialSeed: number) {
  let seed = initialSeed;
  return () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

// ════════════════════════════════════════════
// PROCEDURAL TEXTURES (no external images)
// ════════════════════════════════════════════

function generateEarthTexture(size: number = 2048): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;

  // Ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, "#1a3a5c");
  oceanGrad.addColorStop(0.3, "#1e4d6e");
  oceanGrad.addColorStop(0.5, "#1a4870");
  oceanGrad.addColorStop(0.7, "#1e4d6e");
  oceanGrad.addColorStop(1, "#1a3a5c");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Procedural continents
  const continents = [
    { cx: 0.22, cy: 0.3, rx: 0.1, ry: 0.12, color: "#2d5a1e", rotation: -0.2 },
    { cx: 0.2, cy: 0.35, rx: 0.06, ry: 0.08, color: "#3a6b2a", rotation: 0.1 },
    { cx: 0.16, cy: 0.4, rx: 0.03, ry: 0.06, color: "#2d5a1e", rotation: 0.3 },
    { cx: 0.28, cy: 0.58, rx: 0.04, ry: 0.12, color: "#1e6b1e", rotation: -0.1 },
    { cx: 0.3, cy: 0.55, rx: 0.05, ry: 0.08, color: "#2d7a1e", rotation: 0.2 },
    { cx: 0.49, cy: 0.28, rx: 0.04, ry: 0.05, color: "#3a6b2a", rotation: -0.15 },
    { cx: 0.47, cy: 0.3, rx: 0.03, ry: 0.04, color: "#4a7b3a", rotation: 0.1 },
    { cx: 0.5, cy: 0.45, rx: 0.06, ry: 0.12, color: "#6b5a1e", rotation: 0 },
    { cx: 0.52, cy: 0.42, rx: 0.05, ry: 0.1, color: "#7b6a2e", rotation: 0.05 },
    { cx: 0.65, cy: 0.3, rx: 0.12, ry: 0.1, color: "#3a6b2a", rotation: -0.1 },
    { cx: 0.7, cy: 0.28, rx: 0.08, ry: 0.06, color: "#4a7b3a", rotation: 0.15 },
    { cx: 0.6, cy: 0.25, rx: 0.08, ry: 0.06, color: "#2d5a1e", rotation: -0.2 },
    { cx: 0.62, cy: 0.42, rx: 0.03, ry: 0.05, color: "#4a7b3a", rotation: 0 },
    { cx: 0.72, cy: 0.45, rx: 0.04, ry: 0.03, color: "#2d7a1e", rotation: 0.2 },
    { cx: 0.78, cy: 0.62, rx: 0.05, ry: 0.04, color: "#8b6a1e", rotation: 0.1 },
    { cx: 0.57, cy: 0.37, rx: 0.03, ry: 0.04, color: "#8b7a2e", rotation: -0.1 },
    { cx: 0.35, cy: 0.18, rx: 0.04, ry: 0.03, color: "#e8e8e0", rotation: 0.2 },
    { cx: 0.5, cy: 0.92, rx: 0.25, ry: 0.06, color: "#e8e8e8", rotation: 0 },
    { cx: 0.5, cy: 0.06, rx: 0.2, ry: 0.04, color: "#d8e8e8", rotation: 0 },
  ];

  const seededRandom = createSeededRandom(42);

  for (const c of continents) {
    ctx.save();
    ctx.translate(c.cx * canvas.width, c.cy * canvas.height);
    ctx.rotate(c.rotation);
    for (let i = 0; i < 5; i++) {
      const offsetX = (seededRandom() - 0.5) * c.rx * canvas.width * 0.3;
      const offsetY = (seededRandom() - 0.5) * c.ry * canvas.height * 0.3;
      const scaleX = 0.7 + seededRandom() * 0.6;
      const scaleY = 0.7 + seededRandom() * 0.6;
      ctx.beginPath();
      ctx.ellipse(offsetX, offsetY, c.rx * canvas.width * scaleX, c.ry * canvas.height * scaleY, seededRandom() * 0.5 - 0.25, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = 0.4 + seededRandom() * 0.3;
      ctx.fill();
    }
    ctx.restore();
  }

  // Terrain noise
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 3000; i++) {
    const x = seededRandom() * canvas.width;
    const y = seededRandom() * canvas.height;
    const s = seededRandom() * 4 + 1;
    ctx.fillStyle = seededRandom() > 0.5 ? "#1a3a1a" : "#4a3a1a";
    ctx.fillRect(x, y, s, s);
  }

  // Ocean depth variation
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 2000; i++) {
    const x = seededRandom() * canvas.width;
    const y = seededRandom() * canvas.height;
    const s = seededRandom() * 8 + 2;
    ctx.fillStyle = seededRandom() > 0.5 ? "#0a1a2a" : "#1a2a4a";
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function generateCloudTexture(size: number = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const seededRandom = createSeededRandom(99);

  for (let i = 0; i < 800; i++) {
    const x = seededRandom() * canvas.width;
    const y = seededRandom() * canvas.height;
    const latFactor = Math.abs(y / canvas.height - 0.5) * 2;
    const cloudChance = 0.3 + 0.4 * Math.sin(latFactor * Math.PI * 3);
    if (seededRandom() < cloudChance) {
      const s = seededRandom() * 60 + 10;
      const alpha = seededRandom() * 0.35 + 0.05;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, s);
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.4})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(x - s, y - s, s * 2, s * 2);
    }
  }

  for (let band = 0; band < 4; band++) {
    const bandY = (0.3 + band * 0.15) * canvas.height;
    for (let i = 0; i < 100; i++) {
      const x = seededRandom() * canvas.width;
      const y = bandY + (seededRandom() - 0.5) * canvas.height * 0.1;
      const s = seededRandom() * 40 + 20;
      const alpha = seededRandom() * 0.2 + 0.05;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, s);
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(x - s, y - s, s * 2, s * 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function generateBumpTexture(size: number = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const seededRandom = createSeededRandom(7);

  for (let i = 0; i < 5000; i++) {
    const x = seededRandom() * canvas.width;
    const y = seededRandom() * canvas.height;
    const brightness = Math.floor(seededRandom() * 40);
    const s = seededRandom() * 3 + 1;
    ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
    ctx.fillRect(x, y, s, s);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function generateNightLightsTexture(size: number = 2048): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const seededRandom = createSeededRandom(55);

  const lightClusters = [
    { cx: 0.2, cy: 0.32, spread: 0.06, density: 80 },
    { cx: 0.17, cy: 0.35, spread: 0.04, density: 50 },
    { cx: 0.48, cy: 0.27, spread: 0.05, density: 100 },
    { cx: 0.5, cy: 0.3, spread: 0.04, density: 70 },
    { cx: 0.72, cy: 0.32, spread: 0.04, density: 90 },
    { cx: 0.76, cy: 0.35, spread: 0.03, density: 60 },
    { cx: 0.62, cy: 0.4, spread: 0.04, density: 70 },
    { cx: 0.8, cy: 0.32, spread: 0.02, density: 50 },
    { cx: 0.28, cy: 0.56, spread: 0.03, density: 40 },
    { cx: 0.56, cy: 0.36, spread: 0.02, density: 30 },
    { cx: 0.72, cy: 0.45, spread: 0.03, density: 40 },
    { cx: 0.8, cy: 0.62, spread: 0.02, density: 20 },
    { cx: 0.51, cy: 0.43, spread: 0.02, density: 20 },
  ];

  for (const cluster of lightClusters) {
    for (let i = 0; i < cluster.density; i++) {
      const angle = seededRandom() * Math.PI * 2;
      const dist = seededRandom() * cluster.spread;
      const x = (cluster.cx + Math.cos(angle) * dist) * canvas.width;
      const y = (cluster.cy + Math.sin(angle) * dist * 2) * canvas.height;
      const s = seededRandom() * 3 + 1;
      const alpha = seededRandom() * 0.8 + 0.2;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, s * 2);
      grad.addColorStop(0, `rgba(255, 230, 150, ${alpha})`);
      grad.addColorStop(0.5, `rgba(255, 200, 100, ${alpha * 0.3})`);
      grad.addColorStop(1, "rgba(255, 200, 100, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(x - s * 2, y - s * 2, s * 4, s * 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// ════════════════════════════════════════════
// EARTH SPHERE
// ════════════════════════════════════════════

function Earth({ onMarkerClick }: { onMarkerClick?: (marker: GlobeMarker) => void }) {
  const cloudsRef = useRef<THREE.Mesh>(null);

  const textures = useMemo(() => ({
    earth: generateEarthTexture(),
    clouds: generateCloudTexture(),
    bump: generateBumpTexture(),
    nightLights: generateNightLightsTexture(),
  }), []);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.01;
    }
  });

  const markers = useMemo(() =>
    GLOBE_MARKERS.map((m) => ({
      ...m,
      position: latLonToVec3(m.lat, m.lon, EARTH_RADIUS + 0.01),
    })), []);

  return (
    <group>
      {/* Earth sphere */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 128, 64]} />
        <meshPhongMaterial
          map={textures.earth}
          bumpMap={textures.bump}
          bumpScale={0.02}
          specular={new THREE.Color("#1a3a5c")}
          shininess={15}
        />
      </mesh>

      {/* Night lights */}
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS + 0.002, 128, 64]} />
        <meshBasicMaterial
          map={textures.nightLights}
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[EARTH_RADIUS + 0.02, 64, 32]} />
        <meshPhongMaterial
          map={textures.clouds}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          uniforms={{
            glowColor: { value: new THREE.Color("#4a9eff") },
          }}
          vertexShader={`
            varying float intensity;
            void main() {
              vec3 vNormal = normalize(normalMatrix * normal);
              vec3 vNormel = normalize(normalMatrix * vec3(0.0, 0.0, 1.0));
              intensity = pow(0.65 - dot(vNormal, vNormel), 3.0);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
              vec3 glow = glowColor * intensity;
              gl_FragColor = vec4(glow, intensity * 0.6);
            }
          `}
        />
      </mesh>

      {/* City markers */}
      {markers.map((marker) => (
        <group key={marker.name} position={marker.position}>
          <mesh onClick={(e) => { e.stopPropagation(); onMarkerClick?.(marker); }}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color={marker.type === "capital" ? "#fbbf24" : "#6ee7b7"} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.02, 0.025, 16]} />
            <meshBasicMaterial
              color={marker.type === "capital" ? "#fbbf24" : "#6ee7b7"}
              transparent opacity={0.5} side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ════════════════════════════════════════════
// CAMERA CONTROLLER
// ════════════════════════════════════════════

function CameraController({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree();
  const animRef = useRef<{ start: THREE.Vector3; end: THREE.Vector3; progress: number } | null>(null);

  useEffect(() => {
    if (target) {
      const dir = target.clone().normalize();
      const endPos = dir.multiplyScalar(4.2);
      animRef.current = { start: camera.position.clone(), end: endPos, progress: 0 };
    }
  }, [target, camera]);

  useFrame((_, delta) => {
    if (animRef.current) {
      animRef.current.progress += delta * 1.5;
      const t = Math.min(animRef.current.progress, 1);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      camera.position.lerpVectors(animRef.current.start, animRef.current.end, ease);
      camera.lookAt(0, 0, 0);
      if (t >= 1) animRef.current = null;
    }
  });

  return null;
}

// ════════════════════════════════════════════
// ZOOM INDICATOR HUD
// ════════════════════════════════════════════

function ZoomIndicator() {
  const { camera } = useThree();
  const [zoom, setZoom] = useState("1.0x");

  useFrame(() => {
    const dist = camera.position.length();
    const zoomLevel = Math.max(1, (10 / dist)).toFixed(1);
    setZoom(zoomLevel + "x");
  });

  return (
    <Html position={[0, -3.2, 0]} center style={{ pointerEvents: "none" }}>
      <div className="rounded-lg border px-3 py-1 font-mono text-xs backdrop-blur-sm"
        style={{ background: "rgba(10,15,26,0.7)", borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8" }}>
        Zoom: {zoom}
      </div>
    </Html>
  );
}

// ════════════════════════════════════════════
// MARKER TOOLTIP
// ════════════════════════════════════════════

function MarkerTooltip({ marker, onClose }: { marker: GlobeMarker; onClose: () => void }) {
  const position = latLonToVec3(marker.lat, marker.lon, EARTH_RADIUS + 0.1);
  return (
    <Html position={position} center>
      <div
        className="animate-fadeIn pointer-events-auto min-w-[200px] rounded-2xl border p-4"
        style={{
          background: "rgba(10, 15, 26, 0.95)",
          borderColor: "rgba(110, 231, 183, 0.3)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-white">{marker.emoji} {marker.name}</span>
          <button onClick={onClose} className="ml-3 text-gray-400 hover:text-white">✕</button>
        </div>
        <div className="space-y-1 text-xs text-gray-300">
          {marker.country && <div>Country: <span className="text-gray-100">{marker.country}</span></div>}
          {marker.population && <div>Population: <span className="font-mono text-emerald-400">{marker.population.toLocaleString()}</span></div>}
          <div>Lat: <span className="font-mono text-blue-300">{marker.lat.toFixed(2)}°</span>, Lon: <span className="font-mono text-blue-300">{marker.lon.toFixed(2)}°</span></div>
          <div className="mt-1 text-[10px] text-gray-500">{marker.type === "capital" ? "🏛 Capital City" : "🏙 Major City"}</div>
        </div>
      </div>
    </Html>
  );
}

// ════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════

interface InteractiveGlobeProps {
  className?: string;
  showControls?: boolean;
  onEnterDashboard?: () => void;
}

export default function InteractiveGlobe({ className = "", showControls = true, onEnterDashboard }: InteractiveGlobeProps) {
  const [selectedMarker, setSelectedMarker] = useState<GlobeMarker | null>(null);
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
  const controlsRef = useRef(null);

  const handleMarkerClick = useCallback((marker: GlobeMarker) => {
    setSelectedMarker(marker);
    setCameraTarget(latLonToVec3(marker.lat, marker.lon, EARTH_RADIUS));
  }, []);

  const handleCloseTooltip = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4a6fa5" />

        <Stars radius={50} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />

        <Earth onMarkerClick={handleMarkerClick} />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2.5}
          maxDistance={15}
          rotateSpeed={0.5}
          zoomSpeed={1.2}
          enableDamping={true}
          dampingFactor={0.08}
          autoRotate={!selectedMarker}
          autoRotateSpeed={0.3}
          makeDefault
        />

        <CameraController target={cameraTarget} />
        <ZoomIndicator />

        {selectedMarker && <MarkerTooltip marker={selectedMarker} onClose={handleCloseTooltip} />}
      </Canvas>

      {/* HUD Overlay */}
      {showControls && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Controls help */}
          <div className="pointer-events-auto absolute right-6 top-6 flex flex-col gap-2">
            <div className="rounded-xl border p-2 text-[10px] leading-relaxed"
              style={{ background: "rgba(10,15,26,0.8)", borderColor: "rgba(255,255,255,0.1)", color: "#94a3b8", backdropFilter: "blur(8px)" }}>
              <div className="mb-1 font-semibold text-white/80">Controls</div>
              <div>🖱 Drag to rotate</div>
              <div>🔍 Scroll to zoom</div>
              <div>📍 Click cities</div>
            </div>
          </div>

          {/* Enter Dashboard button */}
          {onEnterDashboard && (
            <div className="pointer-events-auto absolute bottom-10 left-1/2 -translate-x-1/2">
              <button
                onClick={onEnterDashboard}
                className="group flex items-center gap-3 rounded-2xl border px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 100%)",
                  borderColor: "rgba(110,231,183,0.4)",
                  color: "#6ee7b7",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 24px rgba(110,231,183,0.15), 0 0 60px rgba(110,231,183,0.05)",
                }}
              >
                <span className="text-2xl">🌍</span>
                Enter Earth Pulse Dashboard
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
