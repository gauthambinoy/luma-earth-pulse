import useSWR from "swr";
import type { HealthResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useHealth() {
  const { data, error, isLoading, mutate } = useSWR<HealthResponse>(
    "/api/health",
    fetcher,
    { refreshInterval: 3_600_000 }
  );
  return {
    global: data?.global ?? null,
    countries: data?.countries ?? null,
    error: error || (data && "error" in data) ? "Failed to load health data" : null,
    isLoading,
    refresh: mutate,
  };
}
