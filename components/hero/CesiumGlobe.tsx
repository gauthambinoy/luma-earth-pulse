"use client";

import { useRef, useEffect } from "react";
import createGlobe from "cobe";

export default function CesiumGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = 0;
    const onResize = () => {
      if (canvasRef.current) width = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 24000,
      mapBrightness: 8,
      baseColor: [0.15, 0.18, 0.25],
      markerColor: [0.43, 0.91, 0.72],
      glowColor: [0.08, 0.12, 0.2],
      markers: [
        { location: [40.7128, -74.006], size: 0.06 },
        { location: [51.5074, -0.1278], size: 0.06 },
        { location: [35.6762, 139.6503], size: 0.06 },
        { location: [48.8566, 2.3522], size: 0.05 },
        { location: [-33.8688, 151.2093], size: 0.05 },
        { location: [25.2048, 55.2708], size: 0.05 },
        { location: [19.076, 72.8777], size: 0.05 },
        { location: [-23.5505, -46.6333], size: 0.05 },
        { location: [55.7558, 37.6173], size: 0.04 },
        { location: [1.3521, 103.8198], size: 0.04 },
        { location: [37.5665, 126.978], size: 0.04 },
        { location: [30.0444, 31.2357], size: 0.04 },
      ],
    });

    // Animation loop — rotate globe and update size
    let rafId: number;
    const animate = () => {
      if (!pointerInteracting.current) {
        phiRef.current += 0.003;
      }
      globe.update({
        phi: phiRef.current + pointerInteractionMovement.current,
        width: width * 2,
        height: width * 2,
      });
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="cesium-globe-wrapper">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
