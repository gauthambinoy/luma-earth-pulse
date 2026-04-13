"use client";

import { useEffect, useRef } from "react";

interface Particle {
  r: number;
  alpha: number;
  speed: number;
  angle: number;
  orbit: number;
}

interface CityLight {
  angle: number;
  lat: number;
  brightness: number;
  size: number;
}

export default function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w: number;
    let h: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Stars
    const stars: { x: number; y: number; r: number; a: number; s: number }[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.6 + 0.1,
        s: Math.random() * 0.005 + 0.002,
      });
    }

    // Floating particles around the globe
    const particles: Particle[] = [];
    for (let i = 0; i < 18; i++) {
      particles.push({
        r: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.0004 + 0.0002,
        angle: Math.random() * Math.PI * 2,
        orbit: 0.55 + Math.random() * 0.5,
      });
    }

    // City lights on the globe
    const cityPositions = [
      { angle: 0.0, lat: 0.35 },
      { angle: -0.1, lat: 0.33 },
      { angle: 0.22, lat: 0.35 },
      { angle: -1.3, lat: 0.3 },
      { angle: -1.5, lat: 0.28 },
      { angle: -2.1, lat: 0.25 },
      { angle: 2.4, lat: 0.24 },
      { angle: 2.0, lat: 0.18 },
      { angle: 1.3, lat: 0.15 },
      { angle: 0.6, lat: 0.21 },
      { angle: -0.8, lat: 0.32 },
      { angle: 2.6, lat: -0.25 },
      { angle: -0.8, lat: -0.16 },
      { angle: 0.05, lat: 0.37 },
      { angle: 1.8, lat: 0.25 },
      { angle: 0.4, lat: -0.02 },
      { angle: -1.7, lat: 0.26 },
      { angle: -0.06, lat: 0.3 },
      { angle: 0.2, lat: 0.3 },
      { angle: 1.7, lat: 0.08 },
      { angle: 1.9, lat: 0.01 },
      { angle: -0.65, lat: -0.23 },
      { angle: 0.3, lat: 0.22 },
      { angle: -1.4, lat: 0.2 },
    ];

    const cityLights: CityLight[] = [];
    for (const c of cityPositions) {
      cityLights.push({
        angle: c.angle,
        lat: c.lat,
        brightness: 0.5 + Math.random() * 0.5,
        size: 1.2 + Math.random() * 1.8,
      });
      for (let j = 0; j < 2 + Math.floor(Math.random() * 3); j++) {
        cityLights.push({
          angle: c.angle + (Math.random() - 0.5) * 0.12,
          lat: c.lat + (Math.random() - 0.5) * 0.06,
          brightness: 0.2 + Math.random() * 0.3,
          size: 0.5 + Math.random() * 0.8,
        });
      }
    }

    let rotation = 0;

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.38;
      const time = Date.now() * 0.001;

      // Stars with twinkle
      for (const star of stars) {
        const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * star.s * 100 + star.x * 100));
        ctx!.beginPath();
        ctx!.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(180, 210, 255, ${star.a * twinkle * 0.4})`;
        ctx!.fill();
      }

      // Outer glow (atmosphere)
      const outerGlow = ctx!.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.4);
      outerGlow.addColorStop(0, "rgba(50, 140, 255, 0.12)");
      outerGlow.addColorStop(0.4, "rgba(30, 100, 220, 0.06)");
      outerGlow.addColorStop(0.7, "rgba(20, 80, 200, 0.02)");
      outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = outerGlow;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx!.fill();

      // Earth body
      const earthGrad = ctx!.createRadialGradient(
        cx - radius * 0.25, cy - radius * 0.25, 0,
        cx, cy, radius
      );
      earthGrad.addColorStop(0, "#1a5fb4");
      earthGrad.addColorStop(0.3, "#0f4a8c");
      earthGrad.addColorStop(0.6, "#0a3366");
      earthGrad.addColorStop(0.85, "#062040");
      earthGrad.addColorStop(1, "#03101f");
      ctx!.fillStyle = earthGrad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.fill();

      // Atmosphere rings
      ctx!.strokeStyle = "rgba(80, 160, 255, 0.2)";
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius + 3, 0, Math.PI * 2);
      ctx!.stroke();

      ctx!.strokeStyle = "rgba(80, 160, 255, 0.06)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius + 8, 0, Math.PI * 2);
      ctx!.stroke();

      // Clip for globe content
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx!.clip();

      // Continent shapes
      const drawContinent = (
        startAngle: number,
        latCenter: number,
        cWidth: number,
        cHeight: number,
        color: string
      ) => {
        const a = startAngle + rotation;
        const cosA = Math.cos(a);
        if (cosA < -0.15) return;
        const opacity = Math.max(0, cosA) * 0.3;
        const px = cx + Math.sin(a) * radius * 0.85;
        const py = cy + latCenter * radius;
        ctx!.fillStyle = color.replace("OPACITY", String(opacity));
        ctx!.beginPath();
        ctx!.ellipse(px, py, cWidth * radius * Math.max(0.1, cosA), cHeight * radius, 0, 0, Math.PI * 2);
        ctx!.fill();
      };

      drawContinent(-0.05, -0.05, 0.14, 0.1, "rgba(34, 120, 80, OPACITY)");
      drawContinent(0.0, 0.18, 0.1, 0.22, "rgba(40, 110, 70, OPACITY)");
      drawContinent(-1.4, -0.08, 0.22, 0.15, "rgba(30, 100, 65, OPACITY)");
      drawContinent(-0.9, 0.22, 0.09, 0.2, "rgba(30, 95, 60, OPACITY)");
      drawContinent(1.5, -0.05, 0.28, 0.14, "rgba(35, 110, 70, OPACITY)");
      drawContinent(2.3, 0.28, 0.09, 0.06, "rgba(35, 105, 65, OPACITY)");
      drawContinent(-0.6, -0.35, 0.06, 0.04, "rgba(40, 115, 75, OPACITY)");

      // City lights
      for (const city of cityLights) {
        const a = city.angle + rotation;
        const cosA = Math.cos(a);
        if (cosA < 0) continue;

        const px = cx + Math.sin(a) * radius * 0.85 * Math.cos(city.lat);
        const py = cy - city.lat * radius * 0.85;
        const brightness = city.brightness * cosA;

        const glow = ctx!.createRadialGradient(px, py, 0, px, py, city.size * 4);
        glow.addColorStop(0, `rgba(255, 240, 180, ${brightness * 0.5})`);
        glow.addColorStop(0.4, `rgba(255, 210, 120, ${brightness * 0.2})`);
        glow.addColorStop(1, "rgba(255, 200, 100, 0)");
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(px, py, city.size * 4, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = `rgba(255, 250, 220, ${brightness * 0.9})`;
        ctx!.beginPath();
        ctx!.arc(px, py, city.size * 0.5, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.restore();

      // Sun highlight (top-right)
      const sunGrad = ctx!.createRadialGradient(
        cx + radius * 0.6, cy - radius * 0.5, 0,
        cx + radius * 0.6, cy - radius * 0.5, radius * 0.7
      );
      sunGrad.addColorStop(0, "rgba(200, 230, 255, 0.15)");
      sunGrad.addColorStop(0.3, "rgba(150, 200, 255, 0.06)");
      sunGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = sunGrad;
      ctx!.beginPath();
      ctx!.arc(cx + radius * 0.6, cy - radius * 0.5, radius * 0.7, 0, Math.PI * 2);
      ctx!.fill();

      // Lens flare
      const flareGrad = ctx!.createLinearGradient(cx - radius * 1.5, cy, cx + radius * 1.5, cy);
      flareGrad.addColorStop(0, "rgba(100, 180, 255, 0)");
      flareGrad.addColorStop(0.3, "rgba(100, 180, 255, 0.02)");
      flareGrad.addColorStop(0.5, "rgba(150, 210, 255, 0.06)");
      flareGrad.addColorStop(0.7, "rgba(100, 180, 255, 0.02)");
      flareGrad.addColorStop(1, "rgba(100, 180, 255, 0)");
      ctx!.fillStyle = flareGrad;
      ctx!.fillRect(cx - radius * 1.5, cy - 1, radius * 3, 2);

      // Floating particles
      for (const p of particles) {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * radius * p.orbit;
        const py = cy + Math.sin(p.angle) * radius * p.orbit * 0.6;
        const pAlpha = p.alpha * (0.5 + 0.5 * Math.sin(time * 2 + p.angle * 3));

        const pGlow = ctx!.createRadialGradient(px, py, 0, px, py, p.r * 3);
        pGlow.addColorStop(0, `rgba(150, 210, 255, ${pAlpha * 0.5})`);
        pGlow.addColorStop(1, "rgba(150, 210, 255, 0)");
        ctx!.fillStyle = pGlow;
        ctx!.beginPath();
        ctx!.arc(px, py, p.r * 3, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = `rgba(200, 230, 255, ${pAlpha})`;
        ctx!.beginPath();
        ctx!.arc(px, py, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      rotation += 0.0006;
      animId = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-label="Rotating 3D globe visualization"
      role="img"
    />
  );
}
