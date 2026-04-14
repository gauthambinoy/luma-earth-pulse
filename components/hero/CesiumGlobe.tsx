"use client";

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const TEXTURES = {
  day: "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  night: "https://unpkg.com/three-globe/example/img/earth-night.jpg",
  bump: "https://unpkg.com/three-globe/example/img/earth-topology.png",
  clouds: "https://unpkg.com/three-globe@2.41.12/example/img/earth-water.png",
};

export default function CesiumGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let disposed = false;

    const w = container.offsetWidth || 400;
    const h = container.offsetHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const loader = new THREE.TextureLoader();

    // Earth sphere with Blue Marble texture
    const earthGeo = new THREE.SphereGeometry(1, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      shininess: 25,
      specular: new THREE.Color(0x333333),
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Load textures
    let texturesLoaded = 0;
    const checkLoaded = () => {
      texturesLoaded++;
      if (texturesLoaded >= 2) setLoading(false);
    };

    loader.load(TEXTURES.day, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      earthMat.map = tex;
      earthMat.needsUpdate = true;
      checkLoaded();
    });

    loader.load(TEXTURES.bump, (tex) => {
      earthMat.bumpMap = tex;
      earthMat.bumpScale = 0.04;
      earthMat.needsUpdate = true;
      checkLoaded();
    });

    // Night lights (emissive layer)
    loader.load(TEXTURES.night, (tex) => {
      earthMat.emissiveMap = tex;
      earthMat.emissive = new THREE.Color(0xffdd88);
      earthMat.emissiveIntensity = 0.15;
      earthMat.needsUpdate = true;
    });

    // Cloud layer
    const cloudGeo = new THREE.SphereGeometry(1.008, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      alphaMap: null as any,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      color: 0xffffff,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);

    loader.load(TEXTURES.clouds, (tex) => {
      cloudMat.alphaMap = tex;
      cloudMat.needsUpdate = true;
    });

    // Atmosphere glow
    const atmosGeo = new THREE.SphereGeometry(1.15, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    scene.add(new THREE.Mesh(atmosGeo, atmosMat));

    // Lighting — sunlight from one side
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(5, 3, 5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x335577, 0.6));

    // Drag interaction
    let isDragging = false;
    let prevX = 0;
    let rotSpeed = 0.002;
    let dragOffset = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      container.style.cursor = "grabbing";
    };
    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        dragOffset += (e.clientX - prevX) * 0.005;
        prevX = e.clientX;
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    // Resize
    const onResize = () => {
      if (disposed) return;
      const nw = container.offsetWidth;
      const nh = container.offsetHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // Animate
    let rafId: number;
    const animate = () => {
      if (disposed) return;
      earth.rotation.y += rotSpeed;
      earth.rotation.y += dragOffset * 0.1;
      dragOffset *= 0.95;
      clouds.rotation.y += rotSpeed * 0.4;
      // Slight axial tilt
      earth.rotation.x = 0.41;
      clouds.rotation.x = 0.41;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.clear();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="cesium-globe-wrapper" style={{ position: "relative" }}>
      {loading && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "50%", background: "rgba(3,8,16,0.8)", zIndex: 10,
        }}>
          <div style={{ width: 30, height: 30, border: "2px solid rgba(110,231,183,0.3)", borderTopColor: "#6ee7b7", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      )}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", cursor: "grab", borderRadius: "50%", overflow: "hidden" }}
      />
    </div>
  );
}
