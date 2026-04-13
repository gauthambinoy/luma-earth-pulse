"use client";

import { useRef, useEffect, useCallback } from "react";

/* ─── AuroraParticleBackground ───
   Canvas-based particle system with aurora mesh orbs.
   Renders floating particles + colored gradient orbs for a premium feel. */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  twinkleSpeed: number;
  twinklePhase: number;
}

const PARTICLE_COUNT = 80;
const COLORS = [
  "rgba(110, 231, 183, ",  // green
  "rgba(34, 211, 238, ",   // cyan
  "rgba(96, 165, 250, ",   // blue
  "rgba(196, 181, 253, ",  // purple
  "rgba(244, 114, 182, ",  // pink
];

function createParticle(w: number, h: number): Particle {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.2 - 0.1,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    color,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    twinklePhase: Math.random() * Math.PI * 2,
  };
}

export default function AuroraParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height)
    );
  }, []);

  useEffect(() => {
    init();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    function animate() {
      if (!ctx || !canvas) return;
      const { width: w, height: h } = canvas;
      timeRef.current += 0.016;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Draw particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Twinkle
        const twinkle = Math.sin(t * p.twinkleSpeed * 60 + p.twinklePhase) * 0.5 + 0.5;
        const alpha = p.opacity * (0.4 + twinkle * 0.6);

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ")";
        ctx.fill();

        // Glow for larger particles
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (alpha * 0.15) + ")";
          ctx.fill();
        }
      }

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(110, 231, 183, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    }

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [init]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ opacity: "var(--mesh-opacity, 0.7)" }}>
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.8 }} />

      {/* Aurora orbs (enhanced from MeshBackground) */}
      <div
        className="absolute -left-[12%] -top-[8%] h-[550px] w-[550px] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)",
          animation: "meshFloat1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-[8%] top-[12%] h-[500px] w-[500px] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.3) 0%, transparent 70%)",
          animation: "meshFloat2 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[5%] left-[20%] h-[450px] w-[450px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
          animation: "meshFloat3 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-[8%] right-[10%] h-[350px] w-[350px] rounded-full blur-[110px]"
        style={{
          background: "radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 70%)",
          animation: "meshFloat1 28s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute left-[45%] top-[40%] h-[300px] w-[300px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)",
          animation: "meshFloat3 30s ease-in-out infinite reverse",
        }}
      />

      <style jsx>{`
        @keyframes meshFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.06); }
          66% { transform: translate(-25px, 20px) scale(0.94); }
        }
        @keyframes meshFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-35px, 25px) scale(1.08); }
          66% { transform: translate(20px, -30px) scale(0.92); }
        }
        @keyframes meshFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(25px, 30px) scale(1.04); }
          66% { transform: translate(-35px, -15px) scale(0.96); }
        }
      `}</style>
    </div>
  );
}
