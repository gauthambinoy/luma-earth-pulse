export function fmt(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString();
}

export function fmtUsd(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(1) + "K";
  return "$" + n.toLocaleString();
}

export function fmtDate(ts: number | string): string {
  const now = Date.now();
  const then = typeof ts === "string" ? new Date(ts).getTime() : ts;
  const diff = now - then;
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function fmtTemp(c: number): string {
  return `${Math.round(c)}°C`;
}

export function magColor(m: number): string {
  if (m >= 7) return "#B91C1C";
  if (m >= 6) return "#EF4444";
  if (m >= 5) return "#F87171";
  if (m >= 4) return "#FB923C";
  if (m >= 3) return "#FCD34D";
  return "#6EE7B7";
}

export function aqiColor(value: number): { color: string; label: string } {
  if (value <= 50) return { color: "#6EE7B7", label: "Good" };
  if (value <= 100) return { color: "#FCD34D", label: "Moderate" };
  if (value <= 150) return { color: "#FB923C", label: "Unhealthy (Sensitive)" };
  if (value <= 200) return { color: "#F87171", label: "Unhealthy" };
  if (value <= 300) return { color: "#C4B5FD", label: "Very Unhealthy" };
  return { color: "#B91C1C", label: "Hazardous" };
}
