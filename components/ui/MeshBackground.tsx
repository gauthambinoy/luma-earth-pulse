"use client";

export default function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ opacity: "var(--mesh-opacity)" }}>
      {/* Orb 1 — mint/green */}
      <div
        className="absolute -left-[15%] -top-[10%] h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
          animation: "meshFloat1 20s ease-in-out infinite",
        }}
      />
      {/* Orb 2 — blue */}
      <div
        className="absolute -right-[10%] top-[15%] h-[450px] w-[450px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
          animation: "meshFloat2 25s ease-in-out infinite",
        }}
      />
      {/* Orb 3 — purple */}
      <div
        className="absolute bottom-[5%] left-[25%] h-[400px] w-[400px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
          animation: "meshFloat3 22s ease-in-out infinite",
        }}
      />
      {/* Orb 4 — pink (subtle) */}
      <div
        className="absolute -bottom-[10%] right-[15%] h-[300px] w-[300px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(244,114,182,0.25) 0%, transparent 70%)",
          animation: "meshFloat1 28s ease-in-out infinite reverse",
        }}
      />

      <style jsx>{`
        @keyframes meshFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes meshFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 20px) scale(1.08); }
          66% { transform: translate(15px, -25px) scale(0.92); }
        }
        @keyframes meshFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, 25px) scale(1.03); }
          66% { transform: translate(-30px, -10px) scale(0.97); }
        }
      `}</style>
    </div>
  );
}
