import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Rate limiter configuration — configurable via environment variables
const MAX_CONNECTIONS_PER_IP = parseInt(process.env.SSE_MAX_CONNECTIONS_PER_IP || "3", 10);
const RATE_WINDOW_MS = parseInt(process.env.SSE_RATE_WINDOW_MS || "60000", 10);

// Simple in-memory rate limiter for SSE connections
const connections = new Map<string, { count: number; lastReset: number }>();

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = connections.get(ip);

  if (!record || now - record.lastReset > RATE_WINDOW_MS) {
    connections.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= MAX_CONNECTIONS_PER_IP) {
    return false;
  }

  record.count++;
  return true;
}

function releaseConnection(ip: string) {
  const record = connections.get(ip);
  if (record && record.count > 0) {
    record.count--;
  }
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: "Too many concurrent SSE connections. Max 3 per client." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

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
        releaseConnection(clientIp);
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
