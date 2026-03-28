import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let running = true;

      const sendEvent = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          running = false;
        }
      };

      // Send ISS position every 5 seconds
      const issInterval = setInterval(async () => {
        if (!running) { clearInterval(issInterval); return; }
        try {
          const res = await fetch("http://api.open-notify.org/iss-now.json", { cache: "no-store" });
          if (res.ok) {
            const d = await res.json();
            sendEvent("iss", {
              latitude: parseFloat(d.iss_position?.latitude ?? "0"),
              longitude: parseFloat(d.iss_position?.longitude ?? "0"),
              timestamp: d.timestamp,
            });
          }
        } catch { /* skip */ }
      }, 5000);

      // Send population tick every second
      const BASE_POP = 8045311447;
      const BASE_TS = new Date("2024-01-01").getTime();
      const popInterval = setInterval(() => {
        if (!running) { clearInterval(popInterval); return; }
        const pop = Math.floor(BASE_POP + ((Date.now() - BASE_TS) / 1000) * 2.4);
        sendEvent("population", { count: pop, timestamp: Date.now() });
      }, 1000);

      // Send initial data
      sendEvent("connected", { message: "Stream connected", timestamp: Date.now() });

      // Cleanup after 5 minutes (Vercel serverless timeout)
      setTimeout(() => {
        running = false;
        clearInterval(issInterval);
        clearInterval(popInterval);
        try { controller.close(); } catch { /* already closed */ }
      }, 290000);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
