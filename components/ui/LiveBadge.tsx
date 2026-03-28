"use client";

export default function LiveBadge() {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5"
      style={{ background: "var(--accent-bg)", borderColor: "var(--accent)" + "30" }}
    >
      <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full" style={{ background: "var(--accent)" }} />
      <span className="text-[10px] font-semibold tracking-[1px]" style={{ color: "var(--accent)" }}>LIVE</span>
    </div>
  );
}
