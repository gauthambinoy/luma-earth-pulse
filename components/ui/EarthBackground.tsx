"use client";

import { useEffect, useRef } from "react";

export default function EarthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    // Stars
    const stars: { x: number; y: number; r: number; a: number; s: number }[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random(),
        s: Math.random() * 0.005 + 0.002,
      });
    }

    // City lights (dots on the globe surface)
    const cityLights: { angle: number; lat: number; brightness: number; size: number }[] = [];
    // Major world city positions as angles
    const cityPositions = [
      { angle: 0.0, lat: 0.35 }, // London
      { angle: -0.1, lat: 0.33 }, // Paris
      { angle: 0.22, lat: 0.35 }, // Moscow
      { angle: -1.3, lat: 0.3 },  // New York
      { angle: -1.5, lat: 0.28 }, // Chicago
      { angle: -2.1, lat: 0.25 }, // LA
      { angle: 2.4, lat: 0.24 },  // Tokyo
      { angle: 2.0, lat: 0.18 },  // Shanghai
      { angle: 1.3, lat: 0.15 },  // Mumbai
      { angle: 0.6, lat: 0.21 },  // Dubai
      { angle: -0.8, lat: 0.32 }, // Toronto
      { angle: 2.6, lat: -0.25 }, // Sydney
      { angle: -0.8, lat: -0.16 },// São Paulo
      { angle: 0.05, lat: 0.37 }, // Berlin
      { angle: 1.8, lat: 0.25 },  // Seoul
      { angle: 0.4, lat: -0.02 }, // Nairobi
      { angle: -1.7, lat: 0.26 }, // Denver
      { angle: -0.06, lat: 0.3 }, // Madrid
      { angle: 0.2, lat: 0.3 },   // Istanbul
      { angle: 1.7, lat: 0.08 },  // Bangkok
      { angle: 1.9, lat: 0.01 },  // Singapore
      { angle: -0.65, lat: -0.23 },// Buenos Aires
      { angle: 0.3, lat: 0.22 },  // Cairo
      { angle: -1.4, lat: 0.2 },  // Miami
    ];

    for (const c of cityPositions) {
      cityLights.push({
        angle: c.angle,
        lat: c.lat,
        brightness: 0.4 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
      });
      // Add surrounding glow dots
      for (let j = 0; j < 3 + Math.floor(Math.random() * 4); j++) {
        cityLights.push({
          angle: c.angle + (Math.random() - 0.5) * 0.15,
          lat: c.lat + (Math.random() - 0.5) * 0.08,
          brightness: 0.15 + Math.random() * 0.3,
          size: 0.5 + Math.random() * 1,
        });
      }
    }

    let rotation = 0;

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // Space gradient background
      const spaceGrad = ctx!.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.8);
      spaceGrad.addColorStop(0, "#0a1628");
      spaceGrad.addColorStop(0.5, "#070d1a");
      spaceGrad.addColorStop(1, "#030508");
      ctx!.fillStyle = spaceGrad;
      ctx!.fillRect(0, 0, w, h);

      // Stars with twinkle
      const time = Date.now() * 0.001;
      for (const star of stars) {
        const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * star.s * 100 + star.x));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 220, 255, ${star.a * twinkle * 0.5})`;
        ctx!.fill();
      }

      // Earth globe
      const cx = w * 0.5;
      const cy = h * 0.48;
      const radius = Math.min(w, h) * 0.35;

      // Earth shadow/glow (atmosphere)
      const atmosGrad = ctx!.createRadialGradient(cx, cy, radius * 0.95, cx, cy, radius * 1.15);
      atmosGrad.addColorStop(0, "rgba(110, 231, 183, 0.08)");
      atmosGrad.addColorStop(0.5, "rgba(96, 165, 250, 0.04)");
      atmosGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = atmosGrad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
      ctx!.fill();

      // Earth body — dark sphere with subtle blue/green
      const earthGrad = ctx!.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
      earthGrad.addColorStop(0, "#0d2847");
      earthGrad.addColorStop(0.4, "#091e3a");
      earthGrad.addColorStop(0.7, "#071428");
      earthGrad.addColorStop(1, "#030a15");
      ctx!.fillStyle = earthGrad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.fill();

      // Thin atmosphere ring
      ctx!.strokeStyle = "rgba(110, 231, 183, 0.1)";
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius + 2, 0, Math.PI * 2);
      ctx!.stroke();

      // Continents/landmass hints (subtle texture lines)
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.clip();

      // Draw continent-like curved shapes that rotate
      const drawContinent = (startAngle: number, latCenter: number, width: number, height: number, color: string) => {
        const a = startAngle + rotation;
        const cosA = Math.cos(a);
        // Only draw if facing us
        if (cosA < -0.2) return;
        const opacity = Math.max(0, cosA) * 0.15;
        const px = cx + Math.sin(a) * radius * 0.85;
        const py = cy + latCenter * radius;
        ctx!.fillStyle = color.replace("OPACITY", String(opacity));
        ctx!.beginPath();
        ctx!.ellipse(px, py, width * radius * Math.max(0.1, cosA), height * radius, 0, 0, Math.PI * 2);
        ctx!.fill();
      };

      // Simplified continent shapes
      drawContinent(-0.1, -0.1, 0.15, 0.12, "rgba(30, 80, 60, OPACITY)");  // Europe/Africa
      drawContinent(0.0, 0.15, 0.1, 0.2, "rgba(30, 70, 50, OPACITY)");     // Africa
      drawContinent(-1.4, -0.1, 0.2, 0.15, "rgba(25, 75, 55, OPACITY)");   // N. America
      drawContinent(-0.9, 0.2, 0.08, 0.18, "rgba(25, 70, 50, OPACITY)");   // S. America
      drawContinent(1.5, -0.05, 0.25, 0.12, "rgba(30, 75, 55, OPACITY)");  // Asia
      drawContinent(2.3, 0.3, 0.08, 0.06, "rgba(30, 75, 55, OPACITY)");    // Australia

      // City lights
      for (const city of cityLights) {
        const a = city.angle + rotation;
        const cosA = Math.cos(a);
        if (cosA < 0) continue; // behind the globe

        const px = cx + Math.sin(a) * radius * 0.85 * Math.cos(city.lat);
        const py = cy - city.lat * radius * 0.85;
        const brightness = city.brightness * cosA;

        // Glow
        const glow = ctx!.createRadialGradient(px, py, 0, px, py, city.size * 3);
        glow.addColorStop(0, `rgba(255, 230, 150, ${brightness * 0.4})`);
        glow.addColorStop(0.5, `rgba(255, 200, 100, ${brightness * 0.15})`);
        glow.addColorStop(1, "rgba(255, 200, 100, 0)");
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(px, py, city.size * 3, 0, Math.PI * 2);
        ctx!.fill();

        // Core dot
        ctx!.fillStyle = `rgba(255, 240, 200, ${brightness * 0.8})`;
        ctx!.beginPath();
        ctx!.arc(px, py, city.size * 0.6, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.restore();

      // Sun reflection (top-left bright spot)
      const sunGrad = ctx!.createRadialGradient(cx - radius * 0.5, cy - radius * 0.4, 0, cx, cy, radius);
      sunGrad.addColorStop(0, "rgba(180, 220, 255, 0.06)");
      sunGrad.addColorStop(0.3, "rgba(120, 180, 255, 0.02)");
      sunGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = sunGrad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.fill();

      // Slow rotation
      rotation += 0.0008;

      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      // Reposition stars
      stars.forEach((s) => {
        s.x = Math.random() * w;
        s.y = Math.random() * h;
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
