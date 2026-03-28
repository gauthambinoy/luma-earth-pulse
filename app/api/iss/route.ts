import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  try {
    const [posRes, astroRes] = await Promise.allSettled([
      fetch("http://api.open-notify.org/iss-now.json", { cache: "no-store" }),
      fetch("http://api.open-notify.org/astros.json", { cache: "no-store" }),
    ]);

    let position = null;
    if (posRes.status === "fulfilled" && posRes.value.ok) {
      const d = await posRes.value.json();
      position = {
        latitude: parseFloat(d.iss_position?.latitude ?? "0"),
        longitude: parseFloat(d.iss_position?.longitude ?? "0"),
        timestamp: d.timestamp ?? Math.floor(Date.now() / 1000),
      };
    }

    let astronauts: { name: string; craft: string }[] = [];
    if (astroRes.status === "fulfilled" && astroRes.value.ok) {
      const d = await astroRes.value.json();
      astronauts = (d.people ?? []).map((p: { name: string; craft: string }) => ({
        name: p.name,
        craft: p.craft,
      }));
    }

    return NextResponse.json({ position, astronauts });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "ISS fetch failed";
    return NextResponse.json({ error: msg, status: 500 }, { status: 500 });
  }
}
