"use client";

import { useRef, useMemo, Suspense, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

/* ─── Atmosphere shader ─── */
const AtmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AtmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 glowColor;
  uniform float intensity;
  uniform float power;
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
    float glow = pow(rim, power) * intensity;
    gl_FragColor = vec4(glowColor, glow);
  }
`;

/* ─── Earth sphere ─── */
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const nightRef = useRef<THREE.Mesh>(null);

  /* Textures sourced from public-domain NASA imagery via the three-globe
     project (https://github.com/vasturiano/three-globe).
     Located in /public/textures/ — equirectangular projection, any resolution. */
  const [dayMap, bumpMap, specMap, nightMap, cloudMap] = useLoader(
    THREE.TextureLoader,
    [
      "/textures/earth-blue-marble.jpg",
      "/textures/earth-topology.png",
      "/textures/earth-water.png",
      "/textures/earth-night.jpg",
      "/textures/earth-clouds.png",
    ]
  );

  // Improve texture quality
  useMemo(() => {
    [dayMap, bumpMap, specMap, nightMap, cloudMap].forEach((t) => {
      if (t) {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 16;
        t.minFilter = THREE.LinearMipMapLinearFilter;
        t.magFilter = THREE.LinearFilter;
      }
    });
  }, [dayMap, bumpMap, specMap, nightMap, cloudMap]);

  // Night-side material: additive blend shows city lights only on dark side
  const nightMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: nightMap,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    [nightMap]
  );

  // Smooth auto-rotate
  useFrame((_state, delta) => {
    const speed = 0.02;
    if (meshRef.current) meshRef.current.rotation.y += speed * delta;
    if (nightRef.current) nightRef.current.rotation.y += speed * delta;
    if (cloudsRef.current) cloudsRef.current.rotation.y += speed * delta * 1.08;
  });

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: AtmosphereVertexShader,
        fragmentShader: AtmosphereFragmentShader,
        uniforms: {
          glowColor: { value: new THREE.Color(0.3, 0.6, 1.0) },
          intensity: { value: 0.7 },
          power: { value: 3.5 },
        },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  return (
    <group>
      {/* Directional light simulating the sun */}
      <directionalLight position={[5, 3, 5]} intensity={2.5} color={0xffffff} />
      <ambientLight intensity={0.08} />

      {/* Earth day surface */}
      <mesh ref={meshRef} rotation={[0.41, 0, 0]}>
        <sphereGeometry args={[2, 128, 128]} />
        <meshPhongMaterial
          map={dayMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          specularMap={specMap}
          specular={new THREE.Color(0x333333)}
          shininess={15}
        />
      </mesh>

      {/* Night lights layer */}
      <mesh ref={nightRef} rotation={[0.41, 0, 0]}>
        <sphereGeometry args={[2.001, 128, 128]} />
        <primitive object={nightMaterial} attach="material" />
      </mesh>

      {/* Clouds layer */}
      <mesh ref={cloudsRef} rotation={[0.41, 0, 0]}>
        <sphereGeometry args={[2.02, 96, 96]} />
        <meshPhongMaterial map={cloudMap} transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.25, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/* ─── Controls with smooth damping ─── */
function GlobeControls() {
  return (
    <OrbitControls
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      autoRotate={false}
      minDistance={2.8}
      maxDistance={8}
      zoomSpeed={0.6}
      rotateSpeed={0.4}
      enableDamping={true}
      dampingFactor={0.08}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI - 0.2}
    />
  );
}

/* ─── Loading fallback ─── */
function GlobeLoader() {
  return (
    <div className="globe-loader">
      <div className="globe-loader-ring" />
    </div>
  );
}

/* ─── Touch hint overlay ─── */
function TouchHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="globe-touch-hint">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Drag to explore · Scroll to zoom</span>
    </div>
  );
}

/* ─── Main export ─── */
export default function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCreated = useCallback((state: { gl: THREE.WebGLRenderer }) => {
    state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    state.gl.toneMapping = THREE.ACESFilmicToneMapping;
    state.gl.toneMappingExposure = 1.2;
  }, []);

  return (
    <div ref={containerRef} className="hero-globe-inner" role="img" aria-label="Interactive 3D Earth globe – drag to rotate, scroll to zoom">
      <Suspense fallback={<GlobeLoader />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 2]}
          onCreated={handleCreated}
          style={{ background: "transparent" }}
        >
          <Stars radius={100} depth={60} count={3000} factor={4} saturation={0} fade speed={0.5} />
          <Earth />
          <GlobeControls />
        </Canvas>
      </Suspense>
      <TouchHint />
    </div>
  );
}
