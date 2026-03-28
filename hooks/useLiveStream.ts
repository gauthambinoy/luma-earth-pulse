"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface StreamData {
  iss: { latitude: number; longitude: number; timestamp: number } | null;
  population: number;
  connected: boolean;
}

export function useLiveStream() {
  const [data, setData] = useState<StreamData>({ iss: null, population: 0, connected: false });
  const retryRef = useRef(0);
  const esRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (esRef.current) esRef.current.close();

    const es = new EventSource("/api/stream");
    esRef.current = es;

    es.addEventListener("connected", () => {
      setData((d) => ({ ...d, connected: true }));
      retryRef.current = 0;
    });

    es.addEventListener("iss", (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setData((d) => ({ ...d, iss: parsed }));
      } catch { /* skip */ }
    });

    es.addEventListener("population", (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setData((d) => ({ ...d, population: parsed.count }));
      } catch { /* skip */ }
    });

    es.onerror = () => {
      es.close();
      setData((d) => ({ ...d, connected: false }));
      const delay = Math.min(1000 * Math.pow(2, retryRef.current), 30000);
      retryRef.current++;
      setTimeout(connect, delay);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => { esRef.current?.close(); };
  }, [connect]);

  return data;
}
