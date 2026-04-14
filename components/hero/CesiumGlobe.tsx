"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const TEXTURES = {
  day: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  night: "https://threejs.org/examples/textures/planets/earth_lights_2048.png",
  specular: "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
  clouds: "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
};

export default function CesiumGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(2.65);
  const targetZoomRef = useRef(2.65);
  const rotationVelocityRef = useRef(0.0022);
  const targetRotationYRef = useRef(0);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const movedRef = useRef(false);
  const draggingRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [zoomDisplay, setZoomDisplay] = useState(1.6);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 1000);
    camera.position.z = zoomRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const resize = () => {
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resize();
    window.addEventListener("resize", resize);

    const ambient = new THREE.AmbientLight(0x45607d, 0.85);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.6);
    sun.position.set(5, 2.5, 4);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x38bdf8, 0.65);
    rim.position.set(-4, -1, -3);
    scene.add(rim);

    const earthGeometry = new THREE.SphereGeometry(1, 96, 96);
    const earthMaterial = new THREE.MeshPhongMaterial({
      shininess: 18,
      specular: new THREE.Color(0x3b82f6),
      emissive: new THREE.Color(0x14233a),
      emissiveIntensity: 0.35,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.z = -0.41;
    scene.add(earth);

    const cloudGeometry = new THREE.SphereGeometry(1.012, 96, 96);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    clouds.rotation.z = -0.41;
    scene.add(clouds);

    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {},
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
          float intensity = pow(0.82 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(0.23, 0.62, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.11, 96, 96), atmosphereMaterial);
    atmosphere.rotation.z = -0.41;
    scene.add(atmosphere);

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1800);
    for (let i = 0; i < starPositions.length; i += 3) {
      const radius = 8 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: 0xe0f2fe, size: 0.028, transparent: true, opacity: 0.85 })
    );
    scene.add(stars);

    let loaded = 0;
    const onLoaded = () => {
      loaded += 1;
      if (loaded >= 3) setReady(true);
    };

    loader.load(TEXTURES.day, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      earthMaterial.map = texture;
      earthMaterial.needsUpdate = true;
      onLoaded();
    });

    loader.load(TEXTURES.night, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      earthMaterial.emissiveMap = texture;
      earthMaterial.needsUpdate = true;
      onLoaded();
    });

    loader.load(TEXTURES.specular, (texture) => {
      earthMaterial.specularMap = texture;
      earthMaterial.needsUpdate = true;
      onLoaded();
    });

    loader.load(TEXTURES.clouds, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      cloudMaterial.map = texture;
      cloudMaterial.alphaMap = texture;
      cloudMaterial.needsUpdate = true;
    });

    const syncZoomDisplay = () => {
      setZoomDisplay(Number((4.6 - zoomRef.current).toFixed(2)));
    };

    const onPointerDown = (event: PointerEvent) => {
      draggingRef.current = true;
      movedRef.current = false;
      dragStartXRef.current = event.clientX;
      dragStartYRef.current = event.clientY;
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      const deltaX = event.clientX - dragStartXRef.current;
      const deltaY = event.clientY - dragStartYRef.current;
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) movedRef.current = true;
      targetRotationYRef.current += deltaX * 0.0042;
      earth.rotation.x = THREE.MathUtils.clamp(earth.rotation.x + deltaY * 0.0015, -0.65, 0.15);
      clouds.rotation.x = earth.rotation.x;
      atmosphere.rotation.x = earth.rotation.x;
      dragStartXRef.current = event.clientX;
      dragStartYRef.current = event.clientY;
    };

    const onPointerUp = () => {
      if (!draggingRef.current) return;
      container.style.cursor = "grab";
      draggingRef.current = false;
      if (!movedRef.current) {
        targetZoomRef.current = targetZoomRef.current > 2.1 ? 1.85 : 2.75;
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      targetZoomRef.current = THREE.MathUtils.clamp(targetZoomRef.current + event.deltaY * 0.0015, 1.55, 3.55);
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.style.cursor = "grab";

    let frameId = 0;
    const animate = () => {
      earth.rotation.y += rotationVelocityRef.current;
      clouds.rotation.y += rotationVelocityRef.current * 1.12;
      targetRotationYRef.current *= 0.94;
      earth.rotation.y += targetRotationYRef.current;
      clouds.rotation.y += targetRotationYRef.current * 0.92;
      atmosphere.rotation.y = earth.rotation.y;
      stars.rotation.y += 0.0002;
      zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.08;
      camera.position.z = zoomRef.current;
      syncZoomDisplay();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("wheel", onWheel);
      starsGeometry.dispose();
      earthGeometry.dispose();
      cloudGeometry.dispose();
      atmosphere.geometry.dispose();
      earthMaterial.dispose();
      cloudMaterial.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {!ready && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center rounded-full"
          style={{ background: "rgba(2,6,23,0.72)", backdropFilter: "blur(12px)" }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "9999px",
              border: "2px solid rgba(125,211,252,0.25)",
              borderTopColor: "#7dd3fc",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}

      <div className="absolute inset-[8%] rounded-full blur-[90px]" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.34) 0%, transparent 72%)" }} />
      <div ref={mountRef} className="relative h-full w-full overflow-hidden rounded-full" />

      <div
        className="absolute left-4 top-4 z-20 rounded-2xl px-3 py-2 text-[10px] font-bold tracking-[0.2em] text-cyan-100/90"
        style={{ background: "rgba(2,6,23,0.62)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(14px)" }}
      >
        DRAG ROTATE · SCROLL ZOOM · TAP FOCUS
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex gap-2">
        {[
          { label: "+", action: () => { targetZoomRef.current = Math.max(1.55, targetZoomRef.current - 0.24); } },
          { label: "-", action: () => { targetZoomRef.current = Math.min(3.55, targetZoomRef.current + 0.24); } },
        ].map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white transition hover:scale-105"
            style={{ background: "rgba(2,6,23,0.68)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(14px)" }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        className="absolute bottom-5 right-5 z-20 rounded-2xl px-3 py-2 text-[10px] font-bold tracking-[0.2em]"
        style={{ background: "rgba(2,6,23,0.68)", color: "rgba(191,219,254,0.92)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(14px)" }}
      >
        ZOOM {zoomDisplay}x
      </div>
    </div>
  );
}
