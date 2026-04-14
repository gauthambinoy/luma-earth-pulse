"use client";

import { useState } from "react";

const EARTH_PHOTO =
  "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg";

export default function CesiumGlobe() {
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-[6%] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(96,165,250,0.42) 0%, rgba(14,165,233,0.18) 38%, transparent 72%)" }}
      />
      <div
        className="absolute inset-[14%] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.28) 0%, transparent 58%)" }}
      />

      <div
        className="relative h-full w-full overflow-hidden rounded-full border"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          setDrift({ x, y });
        }}
        onPointerLeave={() => setDrift({ x: 0, y: 0 })}
        style={{
          borderColor: "rgba(255,255,255,0.14)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05), 0 40px 100px rgba(8,47,73,0.5), inset -50px -60px 120px rgba(0,0,0,0.5)",
          background: "#030712",
        }}
      >
        <div
          className="absolute inset-[-8%] rounded-full"
          style={{
            backgroundImage: `url(${EARTH_PHOTO})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: `${50 + drift.x * 8}% ${50 + drift.y * 8}%`,
            filter: "saturate(1.15) contrast(1.08) brightness(1.02)",
            transform: `scale(${1.08 + Math.abs(drift.x) * 0.015})`,
            transition: "background-position 180ms ease, transform 180ms ease",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 16%, transparent 30%), radial-gradient(circle at 68% 74%, rgba(0,0,0,0.72) 0%, transparent 52%), linear-gradient(122deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 34%, rgba(0,0,0,0.38) 74%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "inset 0 0 40px rgba(255,255,255,0.14), inset -60px -80px 140px rgba(0,0,0,0.55), 0 0 40px rgba(56,189,248,0.2)",
          }}
        />
        <div
          className="absolute -inset-[2.5%] rounded-full border"
          style={{
            borderColor: "rgba(125,211,252,0.28)",
            boxShadow: "0 0 40px rgba(56,189,248,0.18), 0 0 85px rgba(59,130,246,0.12)",
          }}
        />

        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.28em]"
          style={{
            background: "rgba(3,7,18,0.72)",
            color: "rgba(191,219,254,0.92)",
            border: "1px solid rgba(148,163,184,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          NASA ARCHIVE / APOLLO 17
        </div>
      </div>
    </div>
  );
}
